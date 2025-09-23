// app/api/song/upload/route.ts
import { NextResponse } from "next/server";
import formidable, { Fields, Files, File } from "formidable";
import fs from "fs";
import path from "path";
import os from "os";
import { Readable } from "stream";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const config = { api: { bodyParser: false } };

async function streamToNodeReadable(stream: ReadableStream<Uint8Array>, req: Request) {
  const reader = stream.getReader();
  const nodeStream = new Readable({
    read() {},
  });

  // pump data from the web stream into the Node Readable
  (async () => {
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        nodeStream.push(Buffer.from(value));
      }
    } catch (e) {
      nodeStream.destroy(e as any);
    } finally {
      nodeStream.push(null);
    }
  })();

  // Attach headers and method so libraries like formidable can read them
  // Convert Fetch Headers -> plain object
  const headersObj: Record<string, string> = {};
  (req.headers || new Headers()).forEach((value, key) => {
    headersObj[key.toLowerCase()] = value;
  });

  (nodeStream as any).headers = headersObj;
  (nodeStream as any).method = req.method;
  (nodeStream as any).url = req.url;

  return nodeStream;
}

async function parseForm(req: Request) {
  const form = formidable({
    multiples: false,
    uploadDir: os.tmpdir(),
    keepExtensions: true,
  });

  // Convert Request.body (a ReadableStream) -> Node Readable + attach headers
  const nodeReq = await streamToNodeReadable(req.body!, req);

  return await new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
    form.parse(nodeReq as any, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export async function POST(req: Request) {
  try {
    const { fields, files } = await parseForm(req);

    // safe unwrap (formidable can return string | string[])
    const title = fields?.title
      ? Array.isArray(fields.title)
        ? fields.title[0]
        : fields.title
      : null;
    const playlistIdRaw = fields?.playlistId
      ? Array.isArray(fields.playlistId)
        ? fields.playlistId[0]
        : fields.playlistId
      : null;
    const artistsRaw = fields?.artists
      ? Array.isArray(fields.artists)
        ? fields.artists[0]
        : fields.artists
      : null;

    const songFile = (files?.file as File | File[] | undefined) as File | undefined;
    const coverFile = (files?.cover as File | File[] | undefined) as File | undefined;

    if (!title || !playlistIdRaw || !artistsRaw || !songFile) {
      return NextResponse.json({ error: "Missing required fields: title, playlistId, artists or file" }, { status: 400 });
    }

    const playlistId = Number(playlistIdRaw);
    if (Number.isNaN(playlistId)) {
      return NextResponse.json({ error: "Invalid playlistId" }, { status: 400 });
    }

    // ensure playlist exists
    const playlist = await prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist) {
      return NextResponse.json({ error: `Playlist with id ${playlistId} not found` }, { status: 404 });
    }

    // --- Save song file ---
    const songsDir = path.join(process.cwd(), "public", "songs");
    if (!fs.existsSync(songsDir)) fs.mkdirSync(songsDir, { recursive: true });

    const songOrig = (songFile.originalFilename || (songFile as any).newFilename || "upload.mp3").replace(/\s+/g, "_");
    const songFileName = `${Date.now()}-${songOrig}`;
    const songPath = path.join(songsDir, songFileName);

    // formidable writes uploads to a temp filepath
    const songFilepath = (songFile.filepath as string) || (songFile as any).filepath || (songFile as any).file?.filepath;
    if (!songFilepath || !fs.existsSync(songFilepath)) {
      return NextResponse.json({ error: "Uploaded song file not found on server" }, { status: 500 });
    }
    fs.copyFileSync(songFilepath, songPath);

    // --- Save cover file (optional) ---
    let coverUrl: string | null = null;
    if (coverFile) {
      const coversDir = path.join(process.cwd(), "public", "covers");
      if (!fs.existsSync(coversDir)) fs.mkdirSync(coversDir, { recursive: true });

      const coverOrig = (coverFile.originalFilename || (coverFile as any).newFilename || "cover.jpg").replace(/\s+/g, "_");
      const coverFileName = `${Date.now()}-${coverOrig}`;
      const coverPath = path.join(coversDir, coverFileName);

      const coverFilepath = (coverFile.filepath as string) || (coverFile as any).filepath || (coverFile as any).file?.filepath;
      if (coverFilepath && fs.existsSync(coverFilepath)) {
        fs.copyFileSync(coverFilepath, coverPath);
        coverUrl = `/covers/${coverFileName}`;
      }
    }

    // --- Handle artists (use first as main) ---
    const artistNames = (artistsRaw as string).split(",").map((a) => a.trim()).filter(Boolean);
    if (artistNames.length === 0) {
      return NextResponse.json({ error: "At least one artist is required" }, { status: 400 });
    }

    let mainArtist = await prisma.artist.findFirst({ where: { name: artistNames[0] } });
    if (!mainArtist) {
      mainArtist = await prisma.artist.create({ data: { name: artistNames[0] } });
    }

    // --- Create song record ---
    const song = await prisma.song.create({
      data: {
        title,
        cover: coverUrl,
        url: `/songs/${songFileName}`,
        artistId: mainArtist.id,
      },
    });

    // --- Add to playlist ---
    await prisma.playlistSong.create({
      data: {
        playlistId,
        songId: song.id,
      },
    });

    return NextResponse.json({ success: true, song });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err?.message || "Failed to upload song" }, { status: 500 });
  }
}
