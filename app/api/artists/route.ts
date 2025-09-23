import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // your Prisma client

export async function GET() {
  try {
    const artists = await prisma.artist.findMany({
      select: { id: true, name: true, image: true },
    });
    return NextResponse.json(artists);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch artists" }, { status: 500 });
  }
}
