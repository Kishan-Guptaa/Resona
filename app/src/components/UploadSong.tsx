"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
// If you use shadcn/ui or lucide-react in your project you can replace the placeholders below
// import { Button } from "@/components/ui/button";
// import { CloudUpload, Image, Music } from "lucide-react";

export default function UploadSongFormPremium() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [songName, setSongName] = useState("");
  const [songFileName, setSongFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const coverRef = useRef<HTMLInputElement | null>(null);

  const maxFileMB = 20;
  const maxCoverMB = 5;

  const handleCoverChange = (f?: FileList | null) => {
    const file = f?.[0] ?? coverRef.current?.files?.[0];
    if (!file) return;
    if (file.size / 1024 / 1024 > maxCoverMB) {
      alert(`Cover image must be < ${maxCoverMB} MB`);
      coverRef.current!.value = "";
      return;
    }
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
  };

  const handleSongChange = (f?: FileList | null) => {
    const file = f?.[0] ?? fileRef.current?.files?.[0];
    if (!file) return;
    if (file.size / 1024 / 1024 > maxFileMB) {
      alert(`Song file must be < ${maxFileMB} MB`);
      fileRef.current!.value = "";
      return;
    }
    setSongFileName(file.name);
    if (!songName) setSongName(file.name.replace(/\.[^.]+$/, ""));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    setLoading(true);
    setProgress(0);

    // Use XMLHttpRequest to get progress updates (fetch doesn't support progress easily)
    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/songs/upload");

      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          const p = Math.round((ev.loaded / ev.total) * 100);
          setProgress(p);
        }
      };

      xhr.onload = () => {
        setLoading(false);
        setProgress(null);
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            alert("Song uploaded successfully!");
            console.log(data);
            // reset form (optional)
            form.reset();
            setCoverPreview(null);
            setSongFileName(null);
            setSongName("");
          } catch (err) {
            alert("Upload succeeded but response was unexpected.");
          }
          resolve();
        } else {
          try {
            const data = JSON.parse(xhr.responseText);
            alert("Upload failed: " + (data?.error ?? xhr.statusText));
          } catch (err) {
            alert("Upload failed: " + xhr.statusText);
          }
          reject();
        }
      };

      xhr.onerror = () => {
        setLoading(false);
        setProgress(null);
        alert("Network error during upload.");
        reject();
      };

      xhr.send(fd);
    }).catch(() => {
      // swallow, alerts already shown
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-900 via-slate-900 to-gray-900 p-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-2xl bg-white/5 backdrop-blur-md border border-white/6 rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Upload a Track
n            </h1>
            <p className="text-sm text-white/60">High-quality audio uploads. Supports MP3, WAV, and FLAC.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400/10 text-yellow-300 text-sm font-medium border border-yellow-400/20">
              {/* <Star /> */} Premium
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <label className="block">
              <span className="text-sm text-white/80">Song Title</span>
              <input
                name="title"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
                placeholder="Song Title"
                required
                className="mt-2 block w-full rounded-lg bg-white/6 border border-white/8 p-3 placeholder:text-white/40 text-white outline-none focus:ring-2 focus:ring-sky-400"
              />
            </label>

            <div className="flex gap-4">
              <label className="flex-1">
                <span className="text-sm text-white/80">Artist ID</span>
                <input name="artistId" type="number" required placeholder="123" className="mt-2 block w-full rounded-lg bg-white/6 border border-white/8 p-3 text-white outline-none" />
              </label>

              <label className="flex-1">
                <span className="text-sm text-white/80">Album</span>
                <input name="album" placeholder="Album (optional)" className="mt-2 block w-full rounded-lg bg-white/6 border border-white/8 p-3 text-white outline-none" />
              </label>
            </div>

            <label>
              <span className="text-sm text-white/80">Duration</span>
              <input name="duration" placeholder="e.g. 3:45" className="mt-2 block w-48 rounded-lg bg-white/6 border border-white/8 p-3 text-white outline-none" />
            </label>

            <label className="mt-2 block">
              <span className="text-sm text-white/80">Song File (MP3 / WAV / FLAC) — max {maxFileMB}MB</span>

              <div className="mt-3">
                <div className="relative rounded-lg border-2 border-dashed border-white/8 p-6 text-center bg-white/3">
                  <input
                    ref={fileRef}
                    onChange={() => handleSongChange()}
                    type="file"
                    name="file"
                    accept="audio/*"
                    required
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="pointer-events-none">
                    <div className="flex items-center justify-center gap-3">
                      {/* <CloudUpload /> */}
                      <div className="text-white/90 font-semibold">{songFileName ?? "Click or drop file to upload"}</div>
                    </div>
                    <div className="mt-2 text-xs text-white/60">Progressive upload with live progress. We keep your audio private.</div>
                  </div>
                </div>

                {progress !== null && (
                  <div className="mt-3">
                    <div className="w-full bg-white/6 rounded-full h-2 overflow-hidden">
                      <div className="h-2 rounded-full bg-sky-500 transition-[width] ease-in-out" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="text-xs text-white/60 mt-1">{progress}% uploaded</div>
                  </div>
                )}
              </div>
            </label>

            <div className="mt-4 flex items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 text-white font-semibold shadow-lg hover:scale-[1.01] disabled:opacity-60"
              >
                {loading ? "Uploading..." : "Upload Song"}
              </button>

              <button
                type="button"
                onClick={() => {
                  document.querySelector('form')?.reset();
                  setCoverPreview(null);
                  setSongFileName(null);
                  setSongName("");
                }}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-white/8 text-white/90 bg-white/3"
              >
                Reset
              </button>

              <div className="ml-auto text-xs text-white/60">Tip: Use WAV/FLAC for best quality.</div>
            </div>
          </div>

          <aside className="col-span-1">
            <div className="rounded-xl overflow-hidden border border-white/6 bg-gradient-to-b from-white/3 to-white/5 p-4">
              <div className="flex flex-col items-center gap-4">
                <div className="w-36 h-36 rounded-lg bg-white/6 flex items-center justify-center overflow-hidden border border-white/8">
                  {coverPreview ? (
                    <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-white/60 text-center">
                      <div className="font-medium">No Cover</div>
                      <div className="text-xs">Add an image to make your track pop</div>
                    </div>
                  )}
                </div>

                <label className="w-full block text-center">
                  <span className="text-sm text-white/80">Cover Image — max {maxCoverMB}MB</span>
                  <input
                    ref={coverRef}
                    onChange={() => handleCoverChange()}
                    type="file"
                    name="coverFile"
                    accept="image/*"
                    className="mt-2 w-full rounded-md bg-white/6 border border-white/8 p-2 text-white outline-none"
                  />
                </label>

                <div className="w-full text-white/80 text-sm">
                  <div className="font-medium">Preview</div>
                  <div className="mt-1 text-xs text-white/60">{songFileName ?? "No song selected"}</div>
                </div>

                <div className="w-full mt-2 text-xs text-white/60">
                  <div><strong>Why premium?</strong></div>
                  <ul className="list-disc ml-4 mt-1">
                    <li>Priority processing</li>
                    <li>Higher bitrate support</li>
                    <li>Custom artwork handling</li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-6 text-xs text-white/50">
          By uploading you agree to our <span className="underline">terms</span>. Maximum file sizes: {maxFileMB}MB (audio) / {maxCoverMB}MB (image).
        </div>
      </motion.form>
    </div>
  );
}
