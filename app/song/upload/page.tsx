// /app/upload/page.tsx (React client component)
"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function UploadSongPage() {
  const [playlists, setPlaylists] = useState<{ id: number; name: string }[]>([]);
  const [playlistId, setPlaylistId] = useState("");
  const [songName, setSongName] = useState("");
  const [artistNames, setArtistNames] = useState(""); // comma-separated
  const [songFile, setSongFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const fileRef = useRef<HTMLInputElement | null>(null);
  const coverRef = useRef<HTMLInputElement | null>(null);

  const maxFileMB = 20;
  const maxCoverMB = 5;

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const res = await fetch("/api/playlists");
        if (!res.ok) throw new Error("Failed to fetch playlists");
        const data = await res.json();
        setPlaylists(data);
        if (data.length > 0) setPlaylistId(data[0].id.toString());
      } catch (err) {
        console.error(err);
      }
    }
    fetchPlaylists();
  }, []);

  const handleSongChange = () => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    if (file.size / 1024 / 1024 > maxFileMB) {
      alert(`Song file must be < ${maxFileMB} MB`);
      fileRef.current!.value = "";
      return;
    }
    setSongFile(file);
    if (!songName) setSongName(file.name.replace(/\.[^.]+$/, ""));
  };

  const handleCoverChange = () => {
    const file = coverRef.current?.files?.[0];
    if (!file) return;
    if (file.size / 1024 / 1024 > maxCoverMB) {
      alert(`Cover image must be < ${maxCoverMB} MB`);
      coverRef.current!.value = "";
      return;
    }
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!songFile) return alert("Select a song file");
    if (!playlistId) return alert("Select a playlist");
    if (!artistNames.trim()) return alert("Enter artist name(s)");

    const formData = new FormData();
    formData.append("title", songName);
    formData.append("playlistId", playlistId);
    formData.append("artists", artistNames);
    formData.append("file", songFile);
    if (coverFile) formData.append("cover", coverFile);

    setLoading(true);
    setProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/song/upload");

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
    };

    xhr.onload = () => {
      setLoading(false);
      setProgress(null);
      if (xhr.status >= 200 && xhr.status < 300) {
        alert("Song uploaded successfully!");
        setSongName("");
        setArtistNames("");
        setSongFile(null);
        setCoverFile(null);
        setCoverPreview(null);
        fileRef.current!.value = "";
        coverRef.current!.value = "";
      } else {
        alert("Upload failed: " + xhr.statusText);
      }
    };

    xhr.onerror = () => {
      setLoading(false);
      setProgress(null);
      alert("Network error during upload");
    };

    xhr.send(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-900 p-6">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/5 backdrop-blur-md border border-white/6 rounded-2xl p-8 shadow-2xl space-y-4 text-white"
      >
        <h1 className="text-2xl font-bold">Upload a Track</h1>

        <label className="block">
          <span>Playlist</span>
          <select
            value={playlistId}
            onChange={(e) => setPlaylistId(e.target.value)}
            required
            className="mt-2 block w-full rounded-lg bg-white/6 border border-white/8 p-3 text-white outline-none"
          >
            {playlists.map((pl) => (
              <option key={pl.id} value={pl.id}>
                {pl.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span>Artist Name(s)</span>
          <input
            value={artistNames}
            onChange={(e) => setArtistNames(e.target.value)}
            placeholder="e.g., Arijit Singh, Neha Kakkar"
            required
            className="mt-2 block w-full rounded-lg bg-white/6 border border-white/8 p-3 text-white outline-none"
          />
        </label>

        <label className="block">
          <span>Song Title</span>
          <input
            value={songName}
            onChange={(e) => setSongName(e.target.value)}
            placeholder="Song Title"
            required
            className="mt-2 block w-full rounded-lg bg-white/6 border border-white/8 p-3 text-white outline-none"
          />
        </label>

        <label className="block">
          <span>Song File (max {maxFileMB}MB)</span>
          <input
            ref={fileRef}
            type="file"
            accept="audio/*"
            required
            onChange={handleSongChange}
            className="mt-2 w-full text-white"
          />
          {songFile && <div className="mt-1">{songFile.name}</div>}
        </label>

        <label className="block">
          <span>Cover Image (optional, max {maxCoverMB}MB)</span>
          <input
            ref={coverRef}
            type="file"
            accept="image/*"
            onChange={handleCoverChange}
            className="mt-2 w-full text-white"
          />
        </label>

        {coverPreview && (
          <img
            src={coverPreview}
            alt="cover"
            className="w-36 h-36 object-cover rounded-lg border border-white/8 mt-2"
          />
        )}

        {progress !== null && (
          <div className="mt-2 w-full bg-white/6 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-sky-500 transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-sky-500 to-violet-500 hover:scale-[1.01]"
        >
          {loading ? "Uploading..." : "Upload Song"}
        </button>
      </motion.form>
    </div>
  );
}
