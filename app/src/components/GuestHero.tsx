"use client";

import Image from "next/image";
import Link from "next/link";

export default function GuestLanding() {
  return (
    <section className="relative w-full min-h-screen font-serif flex flex-col items-center justify-start pt-28 px-4 sm:px-6 md:px-10 overflow-hidden bg-white">
      {/* Gradient overlay for subtle premium feel */}
      <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent z-0" />

      {/* Main welcome section */}
      <div className="relative z-10 max-w-7xl w-full text-center md:text-left grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Text + CTA */}
        <div className="flex flex-col items-center md:items-start">
          <p className="text-xs sm:text-sm tracking-widest text-neutral-500 font-semibold mb-2">
            PREMIUM • TIMELESS • MUSIC
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 text-neutral-900">
            Discover <span className="text-sky-800">Resona</span>
          </h1>
          <p className="text-neutral-900 mb-4 text-sm sm:text-base md:text-lg max-w-lg">
            Stream your favorite songs, explore curated playlists, and enjoy a premium listening experience. Sign in to start your journey.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
            <Link href="/src/auth/signin">
              <button className="px-6 py-3 rounded-full bg-sky-800 hover:bg-sky-700 transition-all shadow-lg font-semibold text-white">
                Sign In
              </button>
            </Link>
            <Link href="/src/auth/signup">
              <button className="px-5 py-3 rounded-full border border-gray-800 hover:border-sky-700 transition-colors text-gray-900">
                Sign Up
              </button>
            </Link>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="flex justify-center md:justify-end">
          <div className="relative w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://media.istockphoto.com/id/1175435360/vector/music-note-icon-vector-illustration.jpg?s=612x612&w=0&k=20&c=R7s6RR849L57bv_c7jMIFRW4H87-FjLB8sqZ08mN0OU="
              alt="Music illustration"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Feature highlights */}
      <div className="relative z-10 mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-center w-full max-w-7xl">
        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
          <h3 className="font-semibold text-lg mb-2 text-neutral-900">Curated Playlists</h3>
          <p className="text-neutral-600 text-sm">
            Explore playlists selected by music experts for every mood and genre.
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
          <h3 className="font-semibold text-lg mb-2 text-neutral-900">High Quality Audio</h3>
          <p className="text-neutral-600 text-sm">
            Enjoy lossless music streaming and premium sound quality.
          </p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
          <h3 className="font-semibold text-lg mb-2 text-neutral-900">Any Device</h3>
          <p className="text-neutral-600 text-sm">
            Listen on your phone, desktop, or tablet seamlessly.
          </p>
        </div>
      </div>

      {/* Owner / Creator Info */}
      <div className="relative z-10 mt-20 max-w-4xl w-full flex flex-col md:flex-row items-center md:items-start gap-6 p-6 bg-white shadow-lg rounded-2xl">
        {/* Owner Image */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-sky-800">
          <Image
            src="/profile.png" // put your image in /public folder
            alt="Kishan Gupta"
            width={128}
            height={128}
            className="object-cover"
          />
        </div>

        {/* Owner Info */}
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-xl md:text-2xl font-semibold text-neutral-900">Kishan Gupta</h3>
          <p className="text-neutral-600 mt-1 text-sm md:text-base">
  Founder of Resona, a music app dedicated to delivering premium and accessible music experiences. Passionate about building innovative applications and creating seamless audio experiences for everyone.
</p>

          <div className="mt-3 flex justify-center md:justify-start gap-4">
            <a
              href="https://github.com/Kishan-Guptaa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-800 hover:text-sky-700 font-medium text-sm md:text-base"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/kishangupta09/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-800 hover:text-sky-700 font-medium text-sm md:text-base"
            >
              LinkedIn
            </a>
            <a
              href="mailto:kishangupta.code@gmail.com.com"
              className="text-sky-800 hover:text-sky-700 font-medium text-sm md:text-base"
            >
              Email
            </a>
          </div>
        </div>
      </div>

      {/* Social proof / encouragement */}
      <div className="relative z-10 mt-20 text-center text-gray-500 text-sm md:text-base max-w-2xl">
        Join thousands of music lovers already enjoying Resona’s premium experience. Sign up today to start listening!
      </div>
    </section>
  );
}
