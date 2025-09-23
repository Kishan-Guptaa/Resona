import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // 🎵 Main song file
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No song uploaded" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, file.name);
    await fs.promises.writeFile(filePath, buffer);

    const songUrl = `/uploads/${file.name}`;

    // 🎨 Optional cover image
    let coverUrl: string | null = null;
    const coverFile = formData.get("coverFile") as File | null;
    if (coverFile) {
      const coverBytes = await coverFile.arrayBuffer();
      const coverBuffer = Buffer.from(coverBytes);
      const coverPath = path.join(uploadDir, coverFile.name);
      await fs.promises.writeFile(coverPath, coverBuffer);
      coverUrl = `/uploads/${coverFile.name}`;
    }

    // 📝 Other fields
    const title = (formData.get("title") as string) ?? "";
    const artistId = parseInt((formData.get("artistId") as string) ?? "0");
    const album = (formData.get("album") as string) || null;
    const duration = (formData.get("duration") as string) || null;

    // 💾 Save in DB
    const song = await prisma.song.create({
      data: {
        title,
        url: songUrl,
        artistId,
        cover: coverUrl,
        album,
        duration,
      },
    });

    return NextResponse.json({ song });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
