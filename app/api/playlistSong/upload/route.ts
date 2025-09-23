import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const title = formData.get("title") as string;
    const file = formData.get("file") as File;
    const coverFile = formData.get("coverFile") as File | null;
    const playlistId = parseInt(formData.get("playlistId") as string);
    const artistId = parseInt(formData.get("artistId") as string);

    if (!title || !file || !playlistId || !artistId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

    // Save song file
    const fileBytes = await file.arrayBuffer();
    const filePath = path.join(uploadDir, file.name);
    await fs.promises.writeFile(filePath, Buffer.from(fileBytes));
    const songUrl = `/uploads/${file.name}`;

    // Save cover if exists
    let coverUrl: string | null = null;
    if (coverFile && coverFile.size > 0) {
      const coverBytes = await coverFile.arrayBuffer();
      const coverPath = path.join(uploadDir, coverFile.name);
      await fs.promises.writeFile(coverPath, Buffer.from(coverBytes));
      coverUrl = `/uploads/${coverFile.name}`;
    }

    // Create song in DB
    const song = await prisma.song.create({
      data: { title, url: songUrl, cover: coverUrl, artistId },
    });

    // Add song to playlist
    await prisma.playlistSong.create({
      data: { playlistId, songId: song.id },
    });

    return NextResponse.json({ success: true, song });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
