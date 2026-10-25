// @vitest-environment node
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import { parse } from "csv-parse/sync";
import { getLearningMetadata, getTaskVideo } from "../src/lib/learning-metadata";

describe("verified learning bundle integration", () => {
  it("reconciles every scheduled duration and weekly viewing sum against the catalog", () => {
    const data = getLearningMetadata();
    const videos = new Map(data.videos.map((row) => [row.relative_path, row]));
    expect(videos.size).toBe(2176);
    expect(data.assignments).toHaveLength(312);
    for (const row of data.assignments) {
      expect(videos.get(row.relative_path)?.duration_seconds).toBe(row.duration_seconds);
      expect(videos.get(row.relative_path)?.probe_status).toBe("success");
    }
    for (const week of data.weeks) {
      const assignments = data.assignments.filter((row) => row.week_id === week.week_id);
      const hours = (required: string) => assignments.filter((row) => row.required === required).reduce((sum, row) => sum + row.duration_seconds, 0) / 3600;
      expect(hours("true")).toBeCloseTo(week.required_viewing_hours, 7);
      expect(hours("false")).toBeCloseTo(week.optional_viewing_hours, 7);
      expect(week.status).toBe("UNVERIFIED");
    }
    expect(data.dsaSlots).toHaveLength(75);
  });

  it("does not attach snapshot video metadata to another plan or an edited resource", () => {
    const data = getLearningMetadata();
    const row = data.assignments[0];
    const task = { taskId: row.task_id, required: true, description: `Local inventory-listed file: ${row.source_video_reference} | Study` };
    expect(getTaskVideo(data.planSlug, task)?.durationSeconds).toBe(row.duration_seconds);
    expect(getTaskVideo("another-plan", task)).toBeNull();
    expect(getTaskVideo(data.planSlug, { ...task, description: "Different lesson" })).toBeNull();
    expect(getTaskVideo(data.planSlug, { ...task, required: false })).toBeNull();
  });

  it("keeps the damaged unscheduled video unknown rather than reporting zero minutes", () => {
    const data = getLearningMetadata();
    const failed = data.videos.filter((row) => row.probe_status === "invalid_media");
    expect(failed).toHaveLength(1);
    expect(failed[0].duration_seconds).toBeNull();
    expect(data.assignments.some((row) => row.relative_path === failed[0].relative_path)).toBe(false);
    const corrections = parse(fs.readFileSync("public/learning-data/dsa_count_metadata_patch_PROPOSAL_ONLY.csv", "utf8"), { columns: true });
    expect(corrections.map((row: { week_number: string }) => Number(row.week_number))).toEqual([10, 15, 31, 32, 33]);
  });
});
