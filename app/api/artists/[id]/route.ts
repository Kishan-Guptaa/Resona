// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   const artistId = parseInt(params.id);
//   const artist = await prisma.artist.findUnique({
//     where: { id: artistId },
//     include: { songs: true },
//   });

//   if (!artist) return NextResponse.json({ error: "Artist not found" }, { status: 404 });

//   return NextResponse.json(artist);
// }
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  context: { params: { id: string } }  // <-- changed
) {
  const artistId = parseInt(context.params.id); // <-- access via context.params
  const artist = await prisma.artist.findUnique({
    where: { id: artistId },
    include: { songs: true },
  });

  if (!artist) {
    return NextResponse.json({ error: "Artist not found" }, { status: 404 });
  }

  return NextResponse.json(artist);
}
