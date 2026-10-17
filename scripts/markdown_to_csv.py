#!/usr/bin/env python3
"""Convert a structured Markdown learning plan to stable, validated CSV imports.

Supports the Product Engineer 33-week tracker and plans authored using
skill/learning-plan-author/SKILL.md. Python standard library only.

Usage:
    python scripts/markdown_to_csv.py data/source_33_week_roadmap.md -o data/import --zip
    python scripts/markdown_to_csv.py your-plan.md -o output --validate-only
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import re
import sys
import unicodedata
import zipfile
from dataclasses import dataclass, field
from pathlib import Path

WEEK_HEADING = re.compile(r'^#{2,4}\s+Week\s+0*(\d{1,3})\s*[—–:\-]\s*(.+?)\s*$', re.I)
CHECKBOX = re.compile(r'^\s*-\s*\[([ xX])\]\s*(.*?)\s*$')
BOLD_FIELD = re.compile(r'^\*\*(.+?)(?::)?\*\*:?\s*(.*)$')
EXPLICIT_ID = re.compile(r'<!--\s*task-id\s*:\s*([a-zA-Z0-9_.-]+)\s*-->', re.I)
URL_LINE = re.compile(r'^\s*-\s*\[([^]]+)\]\((https?://[^)]+)\)\s*$')
MD_TABLE_SEP = re.compile(r'^\s*\|?\s*:?-{2,}')
RANGE = re.compile(r'^\s*(\d{1,3})\s*[–—-]\s*(\d{1,3})\s*$')
ALLOWED_CATEGORY = {'course', 'implementation', 'dsa', 'design', 'quality', 'checkpoint', 'other'}

WEEKS_FIELDS = ['plan_slug', 'week_id', 'week_number', 'week_title', 'phase', 'phase_title', 'primary_courses', 'concepts', 'exit_criteria', 'target_hours', 'source_anchor']
TASKS_FIELDS = ['plan_slug', 'task_id', 'week_id', 'week_number', 'category', 'task_title', 'description', 'required', 'sort_order', 'dsa_target_count', 'initial_checked']
FLAT_FIELDS = WEEKS_FIELDS + [f for f in TASKS_FIELDS if f not in {'plan_slug', 'week_id', 'week_number'}]
COURSE_FIELDS = ['plan_slug', 'course_id', 'course_title', 'planned_weeks', 'coverage_kind', 'target_min', 'target_max', 'target_unit', 'coverage_note', 'reference_url']


class PlanFormatError(ValueError):
    pass


def slugify(value: str) -> str:
    normalized = unicodedata.normalize('NFKD', value).encode('ascii', 'ignore').decode('ascii')
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', normalized.lower())).strip('-') or 'plan'


def normalize_text(value: str) -> str:
    value = re.sub(r'\s+', ' ', value).strip()
    return value


def strip_md(value: str) -> str:
    return normalize_text(re.sub(r'\*\*|__|`', '', value))


def md_cells(line: str) -> list[str]:
    return [x.strip() for x in line.strip().strip('|').split('|')]


def get_md_table(markdown: str, heading: str) -> list[dict[str, str]]:
    """Read the first Markdown table following exact heading until next heading."""
    lines = markdown.splitlines()
    anchor = next((i for i, l in enumerate(lines) if l.strip().lower() == heading.lower()), None)
    if anchor is None:
        return []
    headers: list[str] | None = None
    rows: list[dict[str, str]] = []
    for line in lines[anchor + 1:]:
        if line.startswith('#') and headers is not None:
            break
        if not line.strip().startswith('|'):
            if headers is not None and rows:
                break
            continue
        if headers is None:
            headers = md_cells(line)
            continue
        if MD_TABLE_SEP.match(line):
            continue
        cells = md_cells(line)
        if len(cells) != len(headers):
            raise PlanFormatError(f'Malformed table row under {heading}: {line}')
        rows.append(dict(zip(headers, cells)))
    return rows


def parse_phase_map(markdown: str) -> dict[int, tuple[str, str]]:
    phase_map: dict[int, tuple[str, str]] = {}
    for row in get_md_table(markdown, '## Phase map'):
        weeks = row.get('Weeks', '')
        match = RANGE.match(weeks)
        if not match:
            continue
        start, end = int(match.group(1)), int(match.group(2))
        if start > end:
            raise PlanFormatError('Invalid phase range: ' + weeks)
        for n in range(start, end + 1):
            if n in phase_map:
                raise PlanFormatError(f'Week {n} belongs to multiple phases')
            phase_map[n] = (row.get('Phase', ''), row.get('Outcome', ''))
    return phase_map


def parse_coverage(raw: str) -> tuple[str, str, str, str, str]:
    """Return kind,min,max,unit,note. Never fabricate a percentage."""
    text = strip_md(raw)
    pct = re.fullmatch(r'(\d{1,3})\s*[–—-]\s*(\d{1,3})\s*%', text)
    if pct:
        a, b = int(pct.group(1)), int(pct.group(2))
        if not 0 <= a <= b <= 100:
            raise PlanFormatError('Invalid percentage target: ' + text)
        return 'percentage', str(a), str(b), '%', ''
    number = re.search(r'~?(\d+)\s*[–—-]\s*(\d+)\s+distinct problems', text, re.I)
    if number:
        return 'count', number.group(1), number.group(2), 'problems', ''
    return 'text', '', '', '', text


def parse_courses(markdown: str, plan_slug: str) -> list[dict[str, str]]:
    links: dict[str, str] = {}
    for line in markdown.splitlines():
        m = URL_LINE.match(line)
        if m:
            links[slugify(m.group(1))] = m.group(2)
    rows = []
    used = set()
    for entry in get_md_table(markdown, '## Core course completion targets'):
        title = strip_md(entry.get('Course', ''))
        if not title:
            raise PlanFormatError('Course entry missing title')
        cid = f'{plan_slug}-course-{slugify(title)}'
        if cid in used:
            raise PlanFormatError(f'Duplicate course: {title}')
        used.add(cid)
        kind, low, high, unit, note = parse_coverage(entry.get('Expected coverage', ''))
        url = links.get(slugify(title), '')
        # Exact-title mapping only: approximate title guesses must not masquerade as verified URLs.
        rows.append(dict(plan_slug=plan_slug, course_id=cid, course_title=title,
                         planned_weeks=strip_md(entry.get('Planned weeks', '')),
                         coverage_kind=kind, target_min=low, target_max=high,
                         target_unit=unit, coverage_note=note, reference_url=url))
    return rows


def categorize(label: str) -> str:
    x = label.casefold().strip()
    if 'dsa' in x or 'algorithm' in x or 'problem-solving' in x:
        return 'dsa'
    if 'design' in x or 'pattern' in x or 'architecture' in x:
        return 'design'
    if 'independent' in x or 'portfolio' in x or 'hands-on' in x or 'build' in x:
        return 'implementation'
    if 'quality' in x or 'evidence' in x or 'review' in x:
        return 'quality'
    if 'course' in x or 'concept' in x or 'lesson' in x or 'resource' in x:
        return 'course'
    return 'other'


def dsa_count(category: str, text: str) -> str:
    if category != 'dsa':
        return ''
    # Only parse explicitly stated numbers; a prompt like 'mixed practice' remains blank.
    m = re.search(r'\bsolve\s+(\d+)\s+(?:new\s+)?(?:easy|medium|hard|timed|mixed)?\s*problems?\b', text, re.I)
    if not m:
        m = re.search(r'\bsolve\s+(\d+)\s+(?:easy|medium|hard)\s+\w*\s*problems?\b', text, re.I)
    return m.group(1) if m else ''


@dataclass
class Week:
    number: int
    title: str
    raw: list[str] = field(default_factory=list)


def parse_weeks(markdown: str, plan_slug: str, expected_count: int | None = None) -> tuple[list[dict[str, str]], list[dict[str, str]]]:
    entries: list[Week] = []
    current: Week | None = None
    seen_week_section = False
    for line in markdown.splitlines():
        m = WEEK_HEADING.match(line.strip())
        if m:
            seen_week_section = True
            if current:
                entries.append(current)
            current = Week(int(m.group(1)), strip_md(m.group(2)))
            continue
        if current:
            # End week at the next second-level heading, but not a subheading.
            if line.startswith('## ') and not WEEK_HEADING.match(line.strip()):
                entries.append(current)
                current = None
            else:
                current.raw.append(line)
    if current:
        entries.append(current)
    if not entries or not seen_week_section:
        raise PlanFormatError('No Week NN — Title headings found')
    numbers = [x.number for x in entries]
    if numbers != list(range(1, len(entries) + 1)):
        raise PlanFormatError(f'Weeks must be sequential and unique from 1: {numbers}')
    if expected_count is not None and len(entries) != expected_count:
        raise PlanFormatError(f'Expected {expected_count} weeks, parsed {len(entries)}')

    phase_map = parse_phase_map(markdown)
    week_rows: list[dict[str, str]] = []
    task_rows: list[dict[str, str]] = []
    known_task_ids: set[str] = set()
    for e in entries:
        lines = e.raw
        fields: dict[str, str] = {}
        for line in lines:
            m = BOLD_FIELD.match(line.strip())
            if m:
                fields.setdefault(m.group(1).casefold(), strip_md(m.group(2)))
        wid = f'{plan_slug}-w{e.number:02d}'
        phase, phase_title = phase_map.get(e.number, ('', ''))
        # Optional target override if source uses a non-16h schedule.
        target_match = re.search(r'^-\s*\*\*Time spent:\*\*\s*[_\s]*\/\s*(\d+)\s*h', '\n'.join(lines), re.M)
        target_hours = target_match.group(1) if target_match else '16'
        week_rows.append(dict(plan_slug=plan_slug, week_id=wid, week_number=str(e.number), week_title=e.title,
                              phase=phase, phase_title=phase_title,
                              primary_courses=fields.get('primary course(s)', fields.get('primary course', '')),
                              concepts=fields.get('concepts to learn', ''),
                              exit_criteria=fields.get('exit test', fields.get('exit criteria', '')),
                              target_hours=target_hours, source_anchor=f'week-{e.number:02d}'))
        in_checklist = False
        order = 0
        for line in lines:
            if line.strip().lower() in {'**weekly checklist**', '#### weekly checklist', '### weekly checklist'}:
                in_checklist = True
                continue
            if in_checklist and (line.startswith('**Exit test:**') or line.startswith('**Exit test**:') or line.startswith('#### ') or line.strip() == '---'):
                in_checklist = False
            if not in_checklist:
                continue
            match = CHECKBOX.match(line)
            if not match:
                continue
            order += 1
            checked = match.group(1).lower() == 'x'
            body = match.group(2)
            explicit = EXPLICIT_ID.search(body)
            body = EXPLICIT_ID.sub('', body).strip()
            label = BOLD_FIELD.match(body)
            if label:
                task_title, desc = strip_md(label.group(1)), strip_md(label.group(2))
            else:
                task_title, desc = 'Task', strip_md(body)
            category = categorize(task_title)
            normalized = normalize_text(f'{category}|{task_title}|{desc}').casefold()
            taskid = explicit.group(1) if explicit else f'{wid}-t-{hashlib.sha256(normalized.encode()).hexdigest()[:12]}'
            if taskid in known_task_ids:
                raise PlanFormatError(f'Duplicate task id {taskid}; use explicit task-id comments to disambiguate')
            known_task_ids.add(taskid)
            task_rows.append(dict(plan_slug=plan_slug, task_id=taskid, week_id=wid,
                                  week_number=str(e.number), category=category, task_title=task_title,
                                  description=desc, required='true', sort_order=str(order),
                                  dsa_target_count=dsa_count(category, desc), initial_checked=str(checked).lower()))
        if order == 0:
            raise PlanFormatError(f'Week {e.number:02d} has no checklist tasks')
        exit_test = fields.get('exit test', fields.get('exit criteria', ''))
        if not exit_test:
            raise PlanFormatError(f'Week {e.number:02d} missing Exit test')
        marker = f'{wid}-exit'  # stable even if the text changes
        task_rows.append(dict(plan_slug=plan_slug, task_id=marker, week_id=wid, week_number=str(e.number),
                              category='checkpoint', task_title='Exit test', description=exit_test,
                              required='true', sort_order=str(order + 1), dsa_target_count='', initial_checked='false'))

    # All weeks must have DSA and design explicit tasks.
    for w in week_rows:
        categories = {t['category'] for t in task_rows if t['week_id'] == w['week_id']}
        for required in ('dsa', 'design', 'implementation', 'course', 'quality', 'checkpoint'):
            if required not in categories:
                raise PlanFormatError(f"{w['week_id']} missing required task category: {required}")
    return week_rows, task_rows


def to_csv(rows: list[dict[str, str]], fields: list[str]) -> str:
    output = io.StringIO(newline='')
    writer = csv.DictWriter(output, fieldnames=fields, extrasaction='ignore', lineterminator='\n')
    writer.writeheader()
    for row in rows:
        safe = {}
        for k in fields:
            v = str(row.get(k, ''))
            # Spreadsheet formula injection defense; prefixed apostrophe is data, not code.
            if v.lstrip().startswith(('=', '+', '@')) or (v.lstrip().startswith('-') and not v.lstrip().startswith('--')):
                v = "'" + v
            safe[k] = v
        writer.writerow(safe)
    return output.getvalue()


def convert(source: Path, out: Path, *, slug: str, expected_weeks: int | None, zipped: bool, validate_only: bool) -> dict:
    markdown = source.read_text(encoding='utf-8-sig')
    weeks, tasks = parse_weeks(markdown, slug, expected_weeks)
    courses = parse_courses(markdown, slug)
    if not courses:
        raise PlanFormatError('Could not locate Core course completion targets table')
    weeks_by_id = {w['week_id']: w for w in weeks}
    flat = [{**weeks_by_id[t['week_id']], **t} for t in tasks]
    if len({t['task_id'] for t in tasks}) != len(tasks):
        raise PlanFormatError('Non-unique task IDs')
    if len({w['week_id'] for w in weeks}) != len(weeks):
        raise PlanFormatError('Non-unique week IDs')
    if len({c['course_id'] for c in courses}) != len(courses):
        raise PlanFormatError('Non-unique course IDs')
    sha = hashlib.sha256(markdown.encode('utf-8')).hexdigest()
    manifest = dict(schema_version='1.0', plan_slug=slug, plan_title=markdown.splitlines()[0].lstrip('# ').strip(),
                    markdown_sha256=sha, weeks=len(weeks), tasks=len(tasks), courses=len(courses),
                    files={'plan_import.csv':'Single-file task import with week metadata',
                           'weeks.csv':'Normalized week records', 'tasks.csv':'Normalized task records',
                           'course_targets.csv':'Course coverage goals (not actual progress)'},
                    id_contract='Week ids stable by week number; task ids explicit or content hash; text edits without explicit task ids create new ids.')
    if not validate_only:
        out.mkdir(parents=True, exist_ok=True)
        files = {
            'plan_import.csv': to_csv(flat, FLAT_FIELDS),
            'weeks.csv': to_csv(weeks, WEEKS_FIELDS),
            'tasks.csv': to_csv(tasks, TASKS_FIELDS),
            'course_targets.csv': to_csv(courses, COURSE_FIELDS),
            'manifest.json': json.dumps(manifest, indent=2, ensure_ascii=False) + '\n',
        }
        for name, data in files.items():
            (out / name).write_text(data, encoding='utf-8', newline='')
        if zipped:
            path = out / f'{slug}-import.zip'
            with zipfile.ZipFile(path, 'w', compression=zipfile.ZIP_DEFLATED) as bundle:
                for name, payload in files.items():
                    bundle.writestr(name, payload)
    return manifest


def main(argv: list[str] | None = None) -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('source', type=Path, help='Markdown plan to convert')
    p.add_argument('-o', '--output', type=Path, default=Path('out/import'), help='Output directory')
    p.add_argument('--plan-slug', default='product-engineer-33-week', help='Stable plan slug used in IDs')
    p.add_argument('--expected-weeks', type=int, default=None, help='Fail if count differs')
    p.add_argument('--zip', action='store_true', help='Also package CSVs and manifest into import zip')
    p.add_argument('--validate-only', action='store_true', help='Check input without writing files')
    a = p.parse_args(argv)
    try:
        summary = convert(a.source, a.output, slug=slugify(a.plan_slug), expected_weeks=a.expected_weeks,
                          zipped=a.zip, validate_only=a.validate_only)
    except (OSError, PlanFormatError) as exc:
        print(f'ERROR: {exc}', file=sys.stderr)
        return 2
    print(json.dumps(summary, indent=2, ensure_ascii=False))
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
