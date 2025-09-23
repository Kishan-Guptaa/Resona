"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import MusicPlayer, { Song } from "../components/MusicPlayer"; // adjust path

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Hero() {
  const { data: artists, error } = useSWR("/api/artists/all", fetcher);
  const [allSongs, setAllSongs] = useState<Song[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // flatten songs from all artists
  useEffect(() => {
    if (artists?.length) {
      const songs: Song[] = artists.flatMap((artist: any) =>
        (artist.songs || []).map((s: any) => ({
          id: s.id.toString(),
          title: s.title,
          album: s.album ?? "Single",
          cover: s.cover ?? "/placeholder.jpg",
          url: s.url,
          description: `By ${artist.name}`,
          duration: s.duration ?? "0:00",
        }))
      );
      setAllSongs(songs);
    }
  }, [artists]);

  return (
    <section className="relative w-full min-h-[90vh] font-serif flex flex-col md:flex-row gap-6 p-4 sm:p-6 md:p-10 rounded-2xl overflow-hidden">
    {/* Left: Text Section (smaller now) */}
    <div className="relative flex-[0.6]  rounded-3xl p-4 sm:p-6 md:p-10 flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0  to-transparent rounded-3xl pointer-events-none" />
      <div className="relative z-10 text-center md:text-left">
        <p className="text-xs sm:text-sm md:text-sm text-black tracking-[0.2em] font-medium mb-2 sm:mb-3">
          PREMIUM • TIMELESS • MUSIC
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-black leading-snug sm:leading-tight md:leading-tight">
          Welcome to <span className="text-sky-800">Resona</span>
        </h1>

        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-black max-w-full sm:max-w-lg md:max-w-xl">
          A premium music experience — blending timeless classics with the rhythm of today.
        </p>

        <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-black max-w-full sm:max-w-md">
          Lossless streaming • Curated playlists • Pure listening
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 justify-center md:justify-start">
          <button className="w-full sm:w-auto px-6 py-3 rounded-full text-white font-semibold bg-sky-800 shadow-lg hover:from-sky-500 hover:to-sky-300 transition-all text-sm sm:text-base">
            Start Listening
          </button>

          <button className="w-full sm:w-auto px-5 py-3 text-black rounded-full border border-neutral-400 text-sm sm:text-base hover:border-sky-800 transition-colors mt-2 sm:mt-0">
            Explore Library
          </button>
        </div>
      </div>
    </div>
    {/* Right: MusicPlayer Section (larger now) */}
    <div className="relative flex-[1.4] rounded-3xl flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/95 to-neutral-800/80 rounded-3xl pointer-events-none" />
      
      <div className="relative w-full h-full p-4 sm:p-6 md:p-8 flex flex-col">
        {error && <p className="text-white">Failed to load songs</p>}
        {!artists && !error && <p className="text-white">Loading songs...</p>}
        {allSongs.length > 0 && (
          <>
            {/* MusicPlayer - bigger */}
            <div className="flex-[1.2] mb-4">
              <MusicPlayer songs={allSongs} selectedIndexProp={selectedIndex} />
            </div>

            {/* Tracklist in grid style */}
            <div className="bg-neutral-900 rounded-2xl p-4 mt-4 max-h-80 overflow-y-auto">
              <h2 className="text-white font-semibold mb-3 text-lg text-center">Tracklist</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {allSongs.map((song, idx) => (
                  <div
                    key={song.id}
                    onClick={() => setSelectedIndex(idx)}
                    className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                      selectedIndex === idx
                        ? "bg-sky-600/30 shadow-lg scale-105"
                        : "bg-white/5 hover:bg-white/10"
                    }`}
                  >
                    <p className="text-white font-medium truncate">{song.title}</p>
                    <p className="text-xs text-white/50 truncate">{song.album ?? "Single"}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>


 
    
  </section>

  );
}
