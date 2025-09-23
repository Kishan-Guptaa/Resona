"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Volume2, VolumeX } from "lucide-react";

export interface Song {
  id: string;
  title: string;
  album?: string;
  cover?: string;
  url: string;
  description?: string;
  duration?: string;
  liked?: boolean;
}

interface MusicPlayerProps {
  songs: Song[];
  selectedIndexProp?: number; // optional prop to control selected song externally
}

export default function MusicPlayer({ songs, selectedIndexProp }: MusicPlayerProps) {
  const [selectedIndex, setSelectedIndex] = useState(selectedIndexProp ?? 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  const selectedSong = songs[selectedIndex];

  // update selectedIndex from prop (for playlist clicks)
  useEffect(() => {
    if (selectedIndexProp !== undefined) setSelectedIndex(selectedIndexProp);
  }, [selectedIndexProp]);

  // load selected song
  useEffect(() => {
    if (!selectedSong || !audioRef.current) return;

    audioRef.current.src = selectedSong.url;
    audioRef.current.load();
    setProgress(0);
    setLiked((l) => ({ ...l, [selectedSong.id]: Boolean(selectedSong.liked) }));

    if (isPlaying) {
      audioRef.current.play().catch((err) => console.error(err));
    }
  }, [selectedSong, isPlaying]);

  // update progress & handle song end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;

    const onTime = () => {
      if (!audio.duration || Number.isNaN(audio.duration)) return;
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const onEnd = () => {
      setSelectedIndex((i) => (i + 1) % songs.length);
      setIsPlaying(true);
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [songs, volume]);

  function togglePlay() {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  function prev() {
    setSelectedIndex((i) => (i - 1 + songs.length) % songs.length);
    setIsPlaying(true);
  }

  function next() {
    setSelectedIndex((i) => (i + 1) % songs.length);
    setIsPlaying(true);
  }

  function seekTo(percent: number) {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = (percent / 100) * audio.duration;
    setProgress(percent);
  }

  async function toggleLike(songId: string) {
    setLiked((l) => ({ ...l, [songId]: !l[songId] }));
    // Optional: call your API here to persist like
    // await fetch(`/api/songs/${songId}/like`, { method: "POST" });
  }

  return (
    <div className="bg-neutral-900 rounded-2xl p-6 shadow-lg w-full">
      {/* Song Info */}
      <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
        <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl overflow-hidden border border-white/10 shadow-lg">
          <Image
            src={selectedSong.cover || "/placeholder.jpg"}
            alt={selectedSong.title}
            width={400}
            height={400}
            className="object-cover w-full h-full"
          />
        </div>

        <div className="flex-1 w-full text-center lg:text-left">
          <h2 className="text-2xl sm:text-3xl text-white font-serif">
            {selectedSong.title}
          </h2>
          <p className="text-sm text-white/60 mt-1 font-serif">
            Album: {selectedSong.album ?? "Single"}
          </p>
          <p className="text-sm text-white/50 mt-2 font-serif italic">
            {selectedSong.description ?? "No description available."}
          </p>

          {/* Controls */}
          <div className="mt-6 flex flex-wrap justify-center lg:justify-start gap-4">
            <button
              onClick={prev}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              ◀︎
            </button>

            <button
              onClick={togglePlay}
              className="px-6 py-3 rounded-full bg-sky-800 hover:bg-sky-600 text-black font-serif font-bold transition"
            >
              {isPlaying ? "Pause" : "Play"}
            </button>

            <button
              onClick={next}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              ▶︎
            </button>

            <button
              onClick={() => toggleLike(selectedSong.id)}
              className={`px-4 py-2 rounded-full text-sm font-serif font-medium transition ${
                liked[selectedSong.id]
                  ? "bg-rose-500 hover:bg-rose-400 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {liked[selectedSong.id] ? "♥ Liked" : "♡ Like"}
            </button>
          </div>

          {/* Progress + Volume */}
          <div className="mt-6">
            <div
              ref={progressRef}
              onClick={(e) => {
                const rect = progressRef.current!.getBoundingClientRect();
                const x = (e as React.MouseEvent).clientX - rect.left;
                const pct = (x / rect.width) * 100;
                seekTo(pct);
              }}
              className="h-2 w-full rounded-full bg-white/10 cursor-pointer relative overflow-hidden"
            >
              <div
                className="absolute left-0 top-0 bottom-0 rounded-full bg-sky-800 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>
                {Math.floor((audioRef.current?.currentTime ?? 0) / 60)}:
                {String(
                  Math.floor((audioRef.current?.currentTime ?? 0) % 60)
                ).padStart(2, "0")}
              </span>
              <span>{selectedSong.duration ?? "0:00"}</span>
            </div>

            <div className="flex items-center gap-3 w-full max-w-sm mt-2">
              <button
                onClick={() => setVolume(volume > 0 ? 0 : 0.5)}
                className="text-white/70 hover:text-sky-800 transition"
              >
                {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
              <div className="relative flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-sky-800 transition-all"
                  style={{ width: `${volume * 100}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-xs text-white/60 w-10 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} />
    </div>
  );
}
