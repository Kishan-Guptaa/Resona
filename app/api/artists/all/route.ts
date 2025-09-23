import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client"; // or your DB client

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all artists with their songs
    const artists = await prisma.artist.findMany({
      include: { songs: true },
    });

    return NextResponse.json(artists);
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}
