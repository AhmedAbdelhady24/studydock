import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dsaAttempts, plans } from "@/db/schema";
import { eq, isNull, desc } from "drizzle-orm";
import { z } from "zod";

const CreateDsaAttemptSchema = z.object({
  weekId: z.string().optional(),
  taskId: z.string().optional(),
  problemTitle: z.string().min(1, "Problem title is required"),
  pattern: z.string().min(1, "Algorithm/pattern is required"),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  url: z.string().url().optional().or(z.literal("")),
  solved: z.boolean().default(false),
  solvedIndependently: z.boolean().default(false),
  minutesSpent: z.number().int().nonnegative().default(0),
  notes: z.string().optional(),
});

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const plan = await db.query.plans.findFirst({
      where: isNull(plans.archivedAt),
    });

    if (!plan) {
      return NextResponse.json({ attempts: [], distinctSolvedCount: 0 });
    }

    const attempts = await db.query.dsaAttempts.findMany({
      where: eq(dsaAttempts.planId, plan.id),
      orderBy: [desc(dsaAttempts.attemptedAt)],
    });

    const distinctSolved = new Set(
      attempts.filter((a) => a.solved).map((a) => a.problemTitle.trim().toLowerCase())
    ).size;

    return NextResponse.json({
      attempts,
      distinctSolvedCount: distinctSolved,
      totalAttemptsCount: attempts.length,
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
    const parsed = CreateDsaAttemptSchema.parse(body);

    const [created] = await db
      .insert(dsaAttempts)
      .values({
        planId: plan.id,
        weekId: parsed.weekId || null,
        taskId: parsed.taskId || null,
        problemTitle: parsed.problemTitle,
        pattern: parsed.pattern,
        difficulty: parsed.difficulty,
        url: parsed.url || null,
        solved: parsed.solved,
        solvedIndependently: parsed.solvedIndependently,
        minutesSpent: parsed.minutesSpent,
        notes: parsed.notes || null,
        reviewedAt: parsed.solved ? new Date() : null,
      })
      .returning();

    return NextResponse.json({ success: true, attempt: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
