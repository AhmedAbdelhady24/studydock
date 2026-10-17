import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { checkpointAttestations, plans } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { z } from "zod";

const UpdateCheckpointSchema = z.object({
  passed: z.boolean(),
  evidenceNotes: z.string().nullable().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { weekId: string } }
) {
  try {
    const weekId = params.weekId;
    const body = await request.json();
    const parsed = UpdateCheckpointSchema.parse(body);

    const plan = await db.query.plans.findFirst({
      where: isNull(plans.archivedAt),
    });

    if (!plan) {
      return NextResponse.json({ error: "No active plan found." }, { status: 404 });
    }

    const existing = await db.query.checkpointAttestations.findFirst({
      where: and(
        eq(checkpointAttestations.planId, plan.id),
        eq(checkpointAttestations.weekId, weekId)
      ),
    });

    const passedAt = parsed.passed ? new Date() : null;

    if (!existing) {
      const [created] = await db
        .insert(checkpointAttestations)
        .values({
          planId: plan.id,
          weekId,
          passed: parsed.passed,
          passedAt,
          evidenceNotes: parsed.evidenceNotes || null,
        })
        .returning();
      return NextResponse.json({ success: true, checkpoint: created });
    }

    const [updated] = await db
      .update(checkpointAttestations)
      .set({
        passed: parsed.passed,
        passedAt,
        evidenceNotes:
          parsed.evidenceNotes !== undefined
            ? parsed.evidenceNotes
            : existing.evidenceNotes,
      })
      .where(eq(checkpointAttestations.id, existing.id))
      .returning();

    return NextResponse.json({ success: true, checkpoint: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
