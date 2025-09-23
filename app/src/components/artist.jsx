

"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// your artists array (same as before)
const artists = [
  { id: 1, name: "Arijit Singh", image: "https://cdn.wallpapersafari.com/34/93/0ePSUb.jpg" },
  { id: 2, name: "Sonu Nigam", image: "https://m.media-amazon.com/images/I/61+R4CnLSrL.jpg" },
  { id: 3, name: "Shreya Ghoshal", image: "https://kelaayah.com/cdn/shop/files/IMG_7743.jpg?v=1753879372&width=2048" },
  { id: 4, name: "Alka Yagnik", image: "https://upload.wikimedia.org/wikipedia/commons/9/99/Alka_Yagnik_in_2023_%28cropped%29.jpg" },
  { id: 5, name: "Jubin Nautiyal", image: "https://archive.siasat.com/wp-content/uploads/2021/09/jubin-nautiyals.jpg" },
  { id: 6, name: "Neha Kakkar", image: "https://www.timeoutdubai.com/cloud/timeoutdubai/2023/07/31/Neha-Kakkar.png" },
  { id: 7, name: "Guru Randhawa", image: "https://drytickets.com.au/assets/upload/750/450/60/celebrities/77-guru-randhawa.jpg" },
  { id: 8, name: "Darshan Raval", image: "https://analyticsjobs.in/blogs/wp-content/uploads/2023/05/darshan-raval.webp" },
  { id: 9, name: "Badshah", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTowX6nNYMvPTicOH6LfM9e_wGvrUCVPK5Tt3MRNewvbdKxhv6vM-I6Qi5XYu1GiHuI-JxpvfnmRbLdPKY4iycnkytBGc67aDwZ_Pr-cwWGHg" },
  { id: 10, name: "Karan Aujla", image: "https://i0.wp.com/img.mabumbe.net/wp-content/uploads/2025/08/karan-aujla.jpg?w=600&resize=600,600&ssl=1" },
  { id: 11, name: "Vishal Mishra", image: "https://vishal-mishra.com/wp-content/uploads/2024/05/1.jpg" },
  { id: 12, name: "Palak Muchhal", image: "https://pbs.twimg.com/media/FSn81rbVsAEn9Q1.jpg:large" },
  { id: 13, name: "Sunidhi Chauhan", image: "https://media.insider.in/image/upload/c_crop,g_custom/v1758259225/xjzccolkuyfxrcm0ccki.jpg" },
  { id: 14, name: "Harrdy Sandhu", image: "https://viberate-upload.ams3.cdn.digitaloceanspaces.com/prod/entity/artist/hardy-sandhu-moB0X" },
  { id: 15, name: "Arjun Kanungo", image: "https://i.scdn.co/image/ab676161000051745cba1119b62e3a6c4c145830" },
  { id: 16, name: "Armaan Malik", image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTOQwMcT2MG0WMWiizn_dhjeOvaG4FTJwBwz-82QtxY0YezlGRGy1oKUg9u0JUQti--QkszVVhquFefRvB5QbUbDoi0dyOCq0_8RG8SOi2s" },
  { id: 17, name: "Dhvani Bhanushali", image: "https://upload.wikimedia.org/wikipedia/commons/7/76/Dhvani_Bhanushali_snapped_in_Khar_%28cropped%29.jpg" },
  { id: 18, name: "KK", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCqeMLRoWsX_DlNt6DXqOdjb2AApM_aqn9mkagBc9NNOvDQq5RjdUEMtlTl0TFXUca7gv0KLK4fu9eIq_WaBaeY14U0fq72161h-xyukBTOg" },
  { id: 19, name: "Honey Singh", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZrX28tIqeJ2H8jmATYpA_I8TEOB34JO4o0GgF6WE264UR6px6x53Su_XR4v4X7IJcpeTWPoLHxc_Jq3t9TxPsz_6aW4U7_IFI1J052Qi79A" },
  { id: 20, name: "Aastha Gill", image: "https://images.ctfassets.net/opz1rk40r4ou/1BbcecUYAIYMteWdt1jbDx/f6fba22227db65dd5dd131191c391021/Badshah_feat__Aastha_Gill_and_Rico_perform_during_Late_Nights_at_Expo_at_Jubilee_Stage_m8468.jpg" },
  { id: 21, name: "Diljit Dosanjh", image: "https://akm-img-a-in.tosshub.com/indiatoday/images/story/202501/diljit-273755237-16x9.jpg?VersionId=GuyYrXucsgP0nAvEp_lFEOm8IDxeRk44&size=690:388" },
  { id: 22, name: "Diljit Dosanjh", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSSvVdliGnKTUuq7OyjgpEzszCZlyrfCh6oWVI-a1Cbk9C5Iw5usN-X1vIiH2JG2ajIvOaNCrUcG4v4PIL7n1kD_nWnJ2B2d6jsE0FBRnlEw" },
];


export default function ArtistCarousel() {
  const [visible, setVisible] = useState(1);
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);

  // responsive visible count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setVisible(1);
      else if (window.innerWidth < 1024) setVisible(3);
      else setVisible(5);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const total = artists.length;
  const maxStart = Math.max(0, total - visible);

  const prevArtists = () => setStartIndex((s) => (s === 0 ? maxStart : s - 1));
  const nextArtists = () => setStartIndex((s) => (s >= maxStart ? 0 : s + 1));

  // autoplay
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      setStartIndex((s) => (s >= maxStart ? 0 : s + 1));
    }, 5000);
    return () => clearInterval(id);
  }, [isPaused, maxStart]);

  const translateX = -(startIndex * (100 / visible));

  return (
    <section className="w-full py-10  font-serif ">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-4 sm:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Top Artists</h2>
        <div className="flex gap-3">
          <button
            aria-label="previous artists"
            onClick={() => {
              prevArtists();
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 4000);
            }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md bg-white hover:bg-sky-100 transition"
          >
            ◀
          </button>
          <button
            aria-label="next artists"
            onClick={() => {
              nextArtists();
              setIsPaused(true);
              setTimeout(() => setIsPaused(false), 4000);
            }}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md bg-white hover:bg-sky-100 transition"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
  className="flex sm:gap-4 md:gap-6 gap-0" // 👈 no gap on mobile, edge-to-edge
  animate={{ x: `${translateX}%` }}
  transition={{ type: "spring", stiffness: 120, damping: 18 }}
>
  {artists.map((artist, index) => (
    <motion.div
      key={artist.id}
      style={{ flex: `0 0 calc(100% / ${visible})` }}
      className={`relative overflow-hidden shadow-lg sm:shadow-xl cursor-pointer bg-white
        ${visible === 1 ? "w-full" : ""} // 👈 mobile: full width card
        rounded-none sm:rounded-2xl`}   // 👈 mobile: edge-to-edge
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <Link href={`/artist/${artist.id}`} className="block w-full">
        <div className="relative w-full h-64 sm:h-56 md:h-72 overflow-hidden">
          <Image
            src={artist.image}
            alt={artist.name}
            width={400}
            height={400}
            className="w-full h-full object-cover"
            draggable={false}
          />
          {/* Gradient overlay only for mobile */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent sm:bg-none" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4/5 py-2 px-3 bg-white/20 sm:bg-white/70 backdrop-blur-lg rounded-full text-center">
            <p className="text-lg sm:text-base md:text-lg font-semibold text-white sm:text-gray-900 truncate">
              {artist.name}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  ))}
</motion.div>

      </div>
    </section>
  );
}