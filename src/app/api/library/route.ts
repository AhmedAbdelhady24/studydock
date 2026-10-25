import { NextResponse } from "next/server";
import { getLearningMetadata } from "@/lib/learning-metadata";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(getLearningMetadata());
  } catch (error) {
    console.error("Unable to load verified learning data", error);
    return NextResponse.json({ error: "Unable to load verified learning data." }, { status: 500 });
  }
}
