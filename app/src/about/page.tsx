"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
// import ArtistCarousel from "../components/ArtistCarousel"; // You can reuse your artist carousel

export default function About() {
  return (
    <div className="relative min-h-screen w-full font-serif bg-black text-white">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/background.jpg"
          alt="Music Background"
          fill
          className="object-cover brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
        <div className="z-10 text-center px-4 sm:px-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Your Ultimate Music Experience</h1>
          <p className="text-gray-300 sm:text-lg max-w-xl mx-auto">
            Discover, play, and enjoy music from artists around the world. Stream your favorite
            songs anytime, create playlists, and immerse yourself in premium sound quality.
          </p>
          <Link
            href="/signup"
            className="inline-block mt-6 px-8 py-3 bg-sky-600 hover:bg-sky-500 rounded-full font-semibold text-white transition"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 w-full max-w-6xl mx-auto py-16 px-4 sm:px-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            icon: "/icons/discover.svg",
            title: "Discover Music",
            desc: "Explore trending songs, albums, and artists from all over the world.",
          },
          {
            icon: "/icons/play.svg",
            title: "Seamless Playback",
            desc: "High-quality audio with smooth uninterrupted streaming.",
          },
          {
            icon: "/icons/playlist.svg",
            title: "Create Playlists",
            desc: "Organize your favorite songs for any mood or occasion.",
          },
          {
            icon: "/icons/favorite.svg",
            title: "Favorites & History",
            desc: "Keep track of favorites and your listening history.",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="flex flex-col items-center bg-white/10 p-6 rounded-2xl backdrop-blur-md shadow-lg transition hover:scale-105 hover:bg-white/20"
          >
            <Image src={feature.icon} alt={feature.title} width={60} height={60} className="mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-300 text-center">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Artist Carousel Section */}
      <div className="w-full py-16 bg-gradient-to-t from-neutral-900 via-neutral-800 to-neutral-900">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8">Featured Artists</h2>
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          {/* <ArtistCarousel /> */}
        </div>
      </div>

      {/* Call to Action */}
      <div className="w-full py-16 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
          Ready to Start Listening?
        </h2>
        <p className="text-gray-300 text-center max-w-2xl mb-6">
          Sign up today and join millions of music lovers around the world.
        </p>
        <Link
          href="/signup"
          className="px-10 py-4 bg-sky-600 hover:bg-sky-500 rounded-full font-semibold text-white transition"
        >
          Join Now
        </Link>
      </div>
    </div>
  );
}
