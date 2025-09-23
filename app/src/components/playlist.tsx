"use client";

import React, { useState, useEffect } from "react";

export default function AllSongsPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const res = await fetch("/api/playlists");
        const data = await res.json();
        setPlaylists(data);
        if (data.length > 0) setSelectedPlaylistId(data[0].id.toString()); // default first playlist
      } catch (err) {
        console.error("Failed to fetch playlists:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPlaylists();
  }, []);

  const selectedPlaylist = playlists.find((pl) => pl.id.toString() === selectedPlaylistId);
  const songsToShow = selectedPlaylist?.songs ?? [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-serif">
        Loading playlists...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-800 p-4 md:p-6 font-serif">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left - playlists */}
        <div className="w-full lg:w-1/4 bg-neutral-900 rounded-2xl p-4 min-h-[400px]">
          <h2 className="text-white font-semibold mb-4 text-lg text-center">Playlists</h2>
          <div className="border-2 border-dashed border-white/20 h-full rounded-lg p-2 overflow-y-auto max-h-[480px]">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                className={`rounded-lg p-2 mb-2 cursor-pointer ${
                  selectedPlaylistId === pl.id.toString()
                    ? "bg-sky-800"
                    : "bg-neutral-800 hover:bg-neutral-700"
                }`}
                onClick={() => setSelectedPlaylistId(pl.id.toString())}
              >
                <h3 className="text-white font-semibold">{pl.name}</h3>
              </div>
            ))}
          </div>
        </div>

        {/* Right - songs */}
        <div className="w-full lg:w-3/4 bg-neutral-900 rounded-2xl p-4 min-h-[400px]">
          <h2 className="text-white font-semibold mb-4 text-lg text-center">
            Songs in "{selectedPlaylist?.name || "..."}"
          </h2>
          <div className="border-2 border-dashed border-white/20 rounded-lg p-2 overflow-y-auto max-h-[480px]">
            {songsToShow.length === 0 ? (
              <p className="text-gray-400 text-center mt-4">No songs in this playlist</p>
            ) : (
              songsToShow.map((song: any, index: number) => (
                <div
                  key={index}
                  className="p-2 mb-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
                >
                  <h3 className="text-white font-semibold">{song.title}</h3>
                  <p className="text-sm text-neutral-400">{song.album}</p>
                  <p className="text-sm text-neutral-400">{song.duration}</p>
                  {song.cover && (
                    <img
                      src={song.cover}
                      alt="cover"
                      className="w-16 h-16 mt-1 rounded"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
