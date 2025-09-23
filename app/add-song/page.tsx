"use client";

import React, { useState, useEffect } from "react";

export default function AddSongPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [songs, setSongs] = useState<any[]>([]);
  const [playlistId, setPlaylistId] = useState("");
  const [songId, setSongId] = useState("");

  useEffect(() => {
    async function fetchData() {
      const [plRes, songRes] = await Promise.all([
        fetch("/api/playlists"),
        fetch("/api/song"),
      ]);
      const [plData, songData] = await Promise.all([plRes.json(), songRes.json()]);
      setPlaylists(plData);
      setSongs(songData);
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistId || !songId) return alert("Select playlist and song");

    const res = await fetch(`/api/playlists/${playlistId}/add-song`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songId }),
    });

    const data = await res.json();
    if (data.success) {
      alert("Song added successfully!");
      setSongId("");
    } else {
      alert(data.error || "Error adding song");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-800 p-6 text-white font-serif">
      <h1 className="text-2xl font-bold mb-6 text-center">Add Song to Playlist</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-neutral-900 p-6 rounded-2xl shadow-md"
      >
        <label className="block mb-2 text-sm">Select Playlist</label>
        <select
          value={playlistId}
          onChange={(e) => setPlaylistId(e.target.value)}
          className="w-full mb-4 p-2 rounded-lg bg-neutral-800 text-white"
        >
          <option value="">-- Choose Playlist --</option>
          {playlists.map((pl) => (
            <option key={pl.id} value={pl.id}>
              {pl.name}
            </option>
          ))}
        </select>

        <label className="block mb-2 text-sm">Select Song</label>
        <select
          value={songId}
          onChange={(e) => setSongId(e.target.value)}
          className="w-full mb-4 p-2 rounded-lg bg-neutral-800 text-white"
        >
          <option value="">-- Choose Song --</option>
          {songs.map((song) => (
            <option key={song.id} value={song.id}>
              {song.title} - {song.artist}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 py-2 rounded-lg font-semibold"
        >
          Add Song
        </button>
      </form>
    </div>
  );
}
