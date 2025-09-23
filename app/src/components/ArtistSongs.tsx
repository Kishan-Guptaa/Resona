"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import useSWR from "swr";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Volume2, VolumeX } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ArtistSongsPremium() {
  const { id } = useParams();
  const { data: singer, error, mutate } = useSWR(id ? `/api/artists/${id}` : null, fetcher);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [isFollowing, setIsFollowing] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (singer?.songs?.length && selectedIndex >= singer.songs.length) setSelectedIndex(0);
    // set follow state from API payload if present
    if (singer?.isFollowed !== undefined) setIsFollowing(Boolean(singer.isFollowed));
  }, [singer, selectedIndex]);

  useEffect(() => {
    if (!singer?.songs?.length) return;
    const song = singer.songs[selectedIndex];
    if (!audioRef.current) return;
    audioRef.current.src = song.url;
    audioRef.current.load();
    setProgress(0);
    setLiked((l) => ({ ...l, [song.id]: Boolean(song.liked) }));

    if (isPlaying) {
      audioRef.current.play().catch((err) => console.error(err));
    }
  }, [selectedIndex, singer, isPlaying]);


  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;

    const onTime = () => {
      if (!audio.duration || Number.isNaN(audio.duration)) return;
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const onEnd = () => {
      // auto-advance
      if (singer?.songs?.length) {
        setSelectedIndex((i) => (i + 1) % singer.songs.length);
        setIsPlaying(true);
      }
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
    };
  }, [singer, volume]);

  if (error) return <p className="text-center mt-10 text-red-500">Failed to load</p>;
  if (!singer) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (!singer.songs || singer.songs.length === 0) return <p className="text-center mt-10 text-gray-500">No songs found</p>;

  const selectedSong = singer.songs[selectedIndex];

  
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

  function seekTo(percent: number) {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    audio.currentTime = (percent / 100) * audio.duration;
    setProgress(percent);
  }

  function prev() {
  setSelectedIndex((i) => (i - 1 + singer.songs.length) % singer.songs.length);
  setIsPlaying(true); // auto play
}

function next() {
  setSelectedIndex((i) => (i + 1) % singer.songs.length);
  setIsPlaying(true); // auto play
}


  async function toggleLike(songId: string) {
    // optimistic UI
    setLiked((l) => ({ ...l, [songId]: !l[songId] }));
    try {
      const res = await fetch(`/api/songs/${songId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed');
      // optionally mutate singer to refresh likes count
      mutate();
    } catch (err) {
      // rollback on error
      setLiked((l) => ({ ...l, [songId]: !l[songId] }));
      console.error(err);
    }
  }

  async function handleFollow() {
    const next = !isFollowing;
    setIsFollowing(next);
    try {
      const res = await fetch(`/api/artists/${id}/follow`, {
        method: next ? 'POST' : 'DELETE'
      });
      if (!res.ok) throw new Error('Follow request failed');
      // refresh artist data e.g. follower count
      mutate();
    } catch (err) {
      setIsFollowing(!next);
      console.error(err);
    }
  }

 return (
  <div className="min-h-screen  bg-neutral-800 p-4 md:p-6">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mb-6 text-center sm:text-left"
      >
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <Image
            src={singer.image || "/placeholder.jpg"}
            alt={singer.name}
            fill
            className="object-cover"
          />
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-serif">
            {singer.name}
          </h1>
          <p className="text-sm text-white/60 font-serif">{singer.songs.length} tracks</p>

          <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-3">
            <button
              onClick={handleFollow}
              className={`px-4 py-2 rounded-full text-sm  font-serif font-medium transition ${
                isFollowing
                  ? "bg-sky-500 hover:bg-sky-800 text-black"
                  : "bg-white/10 hover:bg-white/20 text-white"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>

            <button
              onClick={() =>
                navigator.share
                  ? navigator.share({
                      title: singer.name,
                      text: "Listen to " + singer.name,
                      url: window.location.href,
                    })
                  : navigator.clipboard.writeText(window.location.href)
              }
              className="px-4 py-2 rounded-full bg-white/10  font-serif hover:bg-white/20 text-white text-sm font-medium transition"
            >
              Share
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Player + Tracklist */}
        <section className="md:col-span-2 bg-neutral-900 rounded-2xl p-6 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
            {/* Song Cover */}
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-xl overflow-hidden border border-white/10 shadow-lg">
              <Image
                src={selectedSong.cover || "/placeholder.jpg"}
                alt={selectedSong.title}
                width={400}
                height={400}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Song Info + Controls */}
            <div className="flex-1 w-full text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl text-white font-serif">
                {selectedSong.title}
              </h2>
              <p className="text-sm text-white/60 mt-1  font-serif">
                Album: {selectedSong.album ?? "Single"}
              </p>
              <p className="text-sm text-white/50 mt-2  font-serif italic">
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
                  className={`px-4 py-2 rounded-full text-sm  font-serif font-medium transition ${
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

                <div className="flex items-center gap-3 w-full max-w-sm">
                  {/* Icon */}
                  <button
                    onClick={() => setVolume(volume > 0 ? 0 : 0.5)}
                    className="text-white/70 hover:text-sky-800 transition"
                  >
                    {volume > 0 ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  </button>

                  {/* Slider */}
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

                  {/* Percentage */}
                  <span className="text-xs text-white/60 w-10 text-right">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tracklist */}
         <div className="mt-8">
            <h3 className="text-white/90 font-semibold mb-3 text-lg font-serif">
              Tracklist
            </h3>
            <div className="bg-neutral-900/60 rounded-2xl divide-y divide-white/10 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-500/50 scrollbar-track-transparent font-serif">
              {singer.songs.map((s: any, idx: number) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setSelectedIndex(idx);
                    setIsPlaying(true); // auto play
                  }}
                  className={`flex items-center gap-4 p-3 cursor-pointer transition-colors duration-200 rounded-lg ${
                    selectedIndex === idx
                      ? "bg-sky-500/20"
                      : "hover:bg-white/10"
                  }`}
                >
                  {/* Track number */}
                  <div className="w-6 flex-shrink-0 text-center text-white/50">
                    {idx + 1}
                  </div>

                  {/* Cover Image */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden">
                    <Image
                      src={s.cover || "/placeholder.jpg"}
                      alt={s.title}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {/* Song Info */}
                  <div className="flex-1 flex flex-col justify-center truncate">
                    <div className="text-white font-medium truncate">{s.title}</div>
                    <div className="text-xs text-white/60 truncate">{s.album ?? "Single"}</div>
                  </div>

                  {/* Duration */}
                  <div className="text-sm text-white/50">{s.duration}</div>
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Sidebar */}
        <aside className="md:col-span-1 h-100 bg-neutral-900  font-serif rounded-2xl p-6 flex flex-col gap-5 items-center shadow-lg mt-6 md:mt-0">
          <div className="w-32 h-32 sm:w-44 sm:h-44  rounded-xl overflow-hidden border border-white/10 shadow-lg">
            <Image
              src={singer.image || "/placeholder.jpg"}
              alt={singer.name}
              width={240}
              height={240}
              className="object-cover"
            />
          </div>

          <div className="text-center">
            <div className="text-white font-semibold text-lg">
              {singer.name}
            </div>
            <div className="text-xs text-white/60">
              {singer.followers ?? "Some"} followers
            </div>
          </div>

          <button
            onClick={() =>
              navigator.share
                ? navigator.share({
                    title: singer.name,
                    text: "Check out this artist",
                    url: window.location.href,
                  })
                : navigator.clipboard.writeText(window.location.href)
            }
            className="w-full px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            Share Artist
          </button>

          <div className="w-full mt-auto text-center text-xs text-white/60">
            Your plan: <strong className="text-white">Premium</strong>
          </div>
        </aside>
      </div>

      <audio ref={audioRef} />
    </div>
  </div>
);


}
