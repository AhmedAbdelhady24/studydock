import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { courses, courseProgress, plans } from "@/db/schema";
import { eq, isNull } from "drizzle-orm";
import { z } from "zod";

const UpdateCourseProgressSchema = z.object({
  courseId: z.string(),
  actualPercent: z.number().min(0).max(100).nullable().optional(),
  lessonsCompleted: z.number().int().nonnegative().nullable().optional(),
  minutesStudied: z.number().int().nonnegative().optional(),
  exercisesDone: z.number().int().nonnegative().nullable().optional(),
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const plan = await db.query.plans.findFirst({
      where: isNull(plans.archivedAt),
    });

    if (!plan) {
      return NextResponse.json({ courses: [] });
    }

    const dbCourses = await db.query.courses.findMany({
      where: eq(courses.planId, plan.id),
    });

    const dbProgress = await db.query.courseProgress.findMany();
    const progressMap = new Map(dbProgress.map((p) => [p.courseId, p]));

    const result = dbCourses.map((c) => {
      const p = progressMap.get(c.courseId);
      return {
        id: c.id,
        courseId: c.courseId,
        title: c.title,
        plannedWeeks: c.plannedWeeks,
        coverageKind: c.coverageKind,
        targetMin: c.targetMin ? Number(c.targetMin) : null,
        targetMax: c.targetMax ? Number(c.targetMax) : null,
        targetUnit: c.targetUnit,
        coverageNote: c.coverageNote,
        referenceUrl: c.referenceUrl,
        actualPercent: p?.actualPercent ? Number(p.actualPercent) : null,
        lessonsCompleted: p?.lessonsCompleted ?? null,
        minutesStudied: p?.minutesStudied ?? 0,
        exercisesDone: p?.exercisesDone ?? null,
      };
    });

    return NextResponse.json({ courses: result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = UpdateCourseProgressSchema.parse(body);

    const existing = await db.query.courseProgress.findFirst({
      where: eq(courseProgress.courseId, parsed.courseId),
    });

    if (!existing) {
      const [created] = await db
        .insert(courseProgress)
        .values({
          courseId: parsed.courseId,
          actualPercent: parsed.actualPercent !== undefined ? String(parsed.actualPercent) : null,
          lessonsCompleted: parsed.lessonsCompleted,
          minutesStudied: parsed.minutesStudied ?? 0,
          exercisesDone: parsed.exercisesDone,
        })
        .returning();
      return NextResponse.json({ success: true, progress: created });
    }

    const [updated] = await db
      .update(courseProgress)
      .set({
        ...(parsed.actualPercent !== undefined
          ? { actualPercent: parsed.actualPercent !== null ? String(parsed.actualPercent) : null }
          : {}),
        ...(parsed.lessonsCompleted !== undefined ? { lessonsCompleted: parsed.lessonsCompleted } : {}),
        ...(parsed.minutesStudied !== undefined ? { minutesStudied: parsed.minutesStudied } : {}),
        ...(parsed.exercisesDone !== undefined ? { exercisesDone: parsed.exercisesDone } : {}),
        lastUpdatedAt: new Date(),
      })
      .where(eq(courseProgress.courseId, parsed.courseId))
      .returning();

    return NextResponse.json({ success: true, progress: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
