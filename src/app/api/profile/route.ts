import { NextResponse } from "next/server";
import { db } from "@/db";
import { userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const profiles = await db.select().from(userProfiles).limit(1);
    if (profiles.length > 0) {
      return NextResponse.json(profiles[0]);
    }
    // Default profile
    const defaultProfile = {
      name: "Engineer",
      title: "Product Engineer",
      avatarInitials: "PE",
      weeklyTargetHours: 16,
      bio: "33-Week Product Engineer Journey",
      theme: "dark",
    };
    const [inserted] = await db
      .insert(userProfiles)
      .values(defaultProfile)
      .returning();
    return NextResponse.json(inserted);
  } catch (err: any) {
    console.error("GET /api/profile error:", err);
    return NextResponse.json(
      {
        name: "Engineer",
        title: "Product Engineer",
        avatarInitials: "PE",
        weeklyTargetHours: 16,
        bio: "33-Week Product Engineer Journey",
        theme: "dark",
      },
      { status: 200 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, title, avatarInitials, weeklyTargetHours, bio, theme } = body;

    const existing = await db.select().from(userProfiles).limit(1);

    if (existing.length === 0) {
      const [newProfile] = await db
        .insert(userProfiles)
        .values({
          name: name || "Engineer",
          title: title || "Product Engineer",
          avatarInitials: avatarInitials || "PE",
          weeklyTargetHours: Number(weeklyTargetHours) || 16,
          bio: bio || "",
          theme: theme || "dark",
          updatedAt: new Date(),
        })
        .returning();
      return NextResponse.json(newProfile);
    }

    const [updated] = await db
      .update(userProfiles)
      .set({
        name: name !== undefined ? name : existing[0].name,
        title: title !== undefined ? title : existing[0].title,
        avatarInitials:
          avatarInitials !== undefined ? avatarInitials : existing[0].avatarInitials,
        weeklyTargetHours:
          weeklyTargetHours !== undefined
            ? Number(weeklyTargetHours)
            : existing[0].weeklyTargetHours,
        bio: bio !== undefined ? bio : existing[0].bio,
        theme: theme !== undefined ? theme : existing[0].theme,
        updatedAt: new Date(),
      })
      .where(eq(userProfiles.id, existing[0].id))
      .returning();

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("POST /api/profile error:", err);
    return NextResponse.json(
      { error: "Failed to update profile", details: err.message },
      { status: 500 }
    );
  }
}
