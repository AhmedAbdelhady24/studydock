import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { taskProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const UpdateTaskSchema = z.object({
  status: z.enum(["not_started", "in_progress", "done", "blocked"]).optional(),
  notes: z.string().nullable().optional(),
  confidence: z.number().int().min(1).max(5).nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { taskId: string } }
) {
  try {
    const taskId = params.taskId;
    const body = await request.json();
    const parsed = UpdateTaskSchema.parse(body);

    const existing = await db.query.taskProgress.findFirst({
      where: eq(taskProgress.taskId, taskId),
    });

    const isCompleting = parsed.status === "done";
    const completedAt =
      parsed.status !== undefined
        ? isCompleting
          ? new Date()
          : null
        : undefined;

    if (!existing) {
      const [created] = await db
        .insert(taskProgress)
        .values({
          taskId,
          status: parsed.status || "not_started",
          notes: parsed.notes,
          confidence: parsed.confidence,
          completedAt: completedAt ?? null,
        })
        .returning();
      return NextResponse.json({ success: true, progress: created });
    }

    const [updated] = await db
      .update(taskProgress)
      .set({
        ...(parsed.status ? { status: parsed.status } : {}),
        ...(parsed.notes !== undefined ? { notes: parsed.notes } : {}),
        ...(parsed.confidence !== undefined ? { confidence: parsed.confidence } : {}),
        ...(completedAt !== undefined ? { completedAt } : {}),
        lastUpdatedAt: new Date(),
      })
      .where(eq(taskProgress.taskId, taskId))
      .returning();

    return NextResponse.json({ success: true, progress: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
