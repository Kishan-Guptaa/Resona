import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      email,
      name,
      profileImage,
      plan,
      location,
      favoriteGenre,
      playlistsCount,
      recentlyPlayed,
      membershipExpiry
    } = body;

    if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const updated = await prisma.user.update({
  where: { email },
  data: {
    name: name ?? undefined,
    profileImage: profileImage ?? undefined,
    plan: plan ?? undefined,
    location: location ?? undefined,
    favoriteGenre: favoriteGenre ?? undefined,
    playlistsCount: playlistsCount ?? undefined,
    recentlyPlayed: recentlyPlayed ? { set: recentlyPlayed } : undefined,
    membershipExpiry: membershipExpiry ? new Date(membershipExpiry) : undefined,
  },
});



    return NextResponse.json({ success: true, user: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
