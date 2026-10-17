import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { studySessions, plans } from "@/db/schema";
import { eq, isNull, desc } from "drizzle-orm";
import { z } from "zod";

const CreateSessionSchema = z.object({
  weekId: z.string().optional(),
  taskId: z.string().optional(),
  courseId: z.string().optional(),
  date: z.string().default(() => new Date().toISOString().split("T")[0]),
  durationMinutes: z.number().int().positive("Duration must be strictly positive"),
  notes: z.string().optional(),
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const plan = await db.query.plans.findFirst({
      where: isNull(plans.archivedAt),
    });

    if (!plan) {
      return NextResponse.json({ sessions: [], totalMinutes: 0 });
    }

    const sessions = await db.query.studySessions.findMany({
      where: eq(studySessions.planId, plan.id),
      orderBy: [desc(studySessions.createdAt)],
    });

    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

    return NextResponse.json({
      sessions,
      totalMinutes,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const plan = await db.query.plans.findFirst({
      where: isNull(plans.archivedAt),
    });

    if (!plan) {
      return NextResponse.json({ error: "No active plan found." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = CreateSessionSchema.parse(body);

    const [created] = await db
      .insert(studySessions)
      .values({
        planId: plan.id,
        weekId: parsed.weekId || null,
        taskId: parsed.taskId || null,
        courseId: parsed.courseId || null,
        date: parsed.date,
        durationMinutes: parsed.durationMinutes,
        notes: parsed.notes || null,
      })
      .returning();

    return NextResponse.json({ success: true, session: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
