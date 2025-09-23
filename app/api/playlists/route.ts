import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const playlists = await prisma.playlist.findMany({
      include: {
        songs: {
          include: {
            song: true, // fetch full song info
          },
        },
      },
    });

    return NextResponse.json(playlists);
  } catch (err) {
    console.error("Error fetching playlists:", err);
    return NextResponse.json({ error: "Failed to fetch playlists" }, { status: 500 });
  }
}
