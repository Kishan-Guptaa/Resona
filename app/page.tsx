"use client";

import { useEffect, useState } from "react";
import Navbar from "./src/components/Navbar";
import Hero from "./src/components/hero"; // logged-in hero
import GuestHero from "./src/components/GuestHero"; // new hero for guests
import Artist from "./src/components/artist";
import Playlist from "./src/components/playlist";

export default function Home() {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  if (loading) return null; // optional loading spinner

  return (
    <main className="mt-28 px-4">
      <Navbar />
      {!user ? (
        <GuestHero /> // guest sees this hero
      ) : (
        <>
          <Hero />      
          <Artist />
          <Playlist />
          {/* other homepage sections */}
        </>
      )}
    </main>
  );
}
