"use client";

import useSWR from "swr";
import Link from "next/link";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ArtistsList() {
  const { data: artists, error } = useSWR("/api/artists", fetcher);

  if (error) return <p className="text-red-500 text-center mt-10">Failed to load artists.</p>;
  if (!artists) return <p className="text-gray-500 text-center mt-10">Loading...</p>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 p-6">
      {artists.map((artist: any) => (
        <Link key={artist.id} href={`/artist/${artist.id}`} className="group">
          <div className="flex flex-col items-center cursor-pointer">
            <div className="relative w-36 h-36">
              <Image
                src={artist.image || "/placeholder.jpg"}
                alt={artist.name}
                fill
                className="rounded-full border-2 border-sky-400 shadow-md object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="mt-2 text-sm font-medium text-center truncate w-36">{artist.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
