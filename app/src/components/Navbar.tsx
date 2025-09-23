// app/components/Navbar.tsx
"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<{ id?: string; name?: string; email?: string } | null>(null);
  const router = useRouter();

  const COLLAPSE_THRESHOLD = 80;

  // read user from localStorage (safe-guard for SSR)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        setUser(JSON.parse(raw));
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
  }, []);

  // listen to storage events from other tabs/windows
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "user") {
        try {
          const newValue = e.newValue ? JSON.parse(e.newValue) : null;
          setUser(newValue);
        } catch {
          setUser(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // scroll collapse effect
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldCollapse = window.scrollY > COLLAPSE_THRESHOLD;
          setCollapsed(shouldCollapse);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = useCallback(() => {
    // clear localStorage
    try {
      localStorage.removeItem("user");
      // Optionally clear other auth-related keys here (token, etc)
      setUser(null);
      // Let other tabs know
      window.dispatchEvent(new StorageEvent("storage", { key: "user", newValue: null as any }));
    } catch (e) {
      // ignore
    }
    router.push("/");
  }, [router]);

  return (
    <>
      {/* Main navbar */}
      <nav
        className={`fixed top-6 left-0 right-0 z-40 mx-4 md:mx-20 transition-all font-serif duration-300 ease-out
          ${collapsed ? "pointer-events-none" : "pointer-events-auto"}`}
        aria-hidden={collapsed}
      >
        <div
          className={`mx-auto max-w-7xl px-4 transition-all duration-300 ease-out
            ${collapsed ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
        >
          <div className="bg-neutral-950/70 text-white shadow-2xl  rounded-3xl">
            <div className="flex justify-between items-center h-16 md:h-20 px-4">
              {/* Left (Logo + Name + Web tagline) */}
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/music.png"
                  alt="Resona logo"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex flex-col leading-tight">
                  <span className="text-lg md:text-xl font-semibold tracking-tight">
                    Resona
                  </span>
                  <span className="text-[10px] md:text-xs text-sky-200">
                    Your music, anytime
                  </span>
                  <span className="text-[9px] md:text-xs text-neutral-400 italic">
                    resona.app
                  </span>
                </div>
              </Link>

              {/* Right (Links for desktop) */}
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/" className="hover:text-black text-lg">Home</Link>
                <Link href="/about" className="hover:text-black text-lg">About</Link>
                <Link href="/contact" className="hover:text-black text-lg">Contact</Link>

                {/* conditional auth links */}
                {!user ? (
                  <>
                    <Link href="/src/auth/signin" className="hover:text-black text-lg">Sign In</Link>
                    <Link href="/src/auth/signup" className="hover:text-black text-lg">Sign Up</Link>
                  </>
                ) : (
                  <>
                    {/* show user name (optional) */}
                    <button
                      onClick={() => router.push("/src/profile")}
                      className="text-lg hover:underline hidden lg:inline"
                      title={`Signed in as ${user.name ?? user.email}`}
                    >
                      {user.name ? `Hi, ${user.name.split(" ")[0]}` : "Profile"}
                    </button>

                    <button
                      onClick={handleLogout}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-lg"
                    >
                      Logout
                    </button>
                  </>
                )}

                <div className="ml-2">
                  <Image
                    src="/user.png"
                    alt="User"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
              </div>

              {/* Mobile Right Section */}
              <div className="flex md:hidden items-center gap-3">
                <Image
                  src="/user.png"
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full border border-sky-300"
                />
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-2xl focus:outline-none"
                  aria-label={isOpen ? "Close menu" : "Open menu"}
                >
                  {isOpen ? "✖" : "☰"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Collapsed tiny avatar on the right when scrolled */}
      <div
        className={`fixed top-6 right-6 z-50 transition-all duration-300 ease-out flex items-center justify-center
          ${collapsed ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none"}`}
      >
        <Link href="/src/profile" aria-label="Open profile">
          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden shadow-2xl shadow-neutral-800 bg-neutral-900/60 border border-neutral-700 flex items-center justify-center transition-transform transform hover:scale-105">
            <Image src="/user.png" alt="User" width={48} height={48} className="rounded-full" />
          </div>
        </Link>
      </div>

      {/* Mobile Fullscreen Menu */}
      {isOpen && (
        <div className="md:hidden font-serif fixed inset-0 bg-neutral-950/70 backdrop-blur-xl z-40 flex flex-col items-center justify-center space-y-8 text-2xl font-semibold animate-fadeIn">
          <Link href="/" className="hover:text-black text-white" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/about" className="hover:text-black text-white" onClick={() => setIsOpen(false)}>About</Link>
          <Link href="/contact" className="hover:text-black text-white" onClick={() => setIsOpen(false)}>Contact</Link>

          {!user ? (
            <>
              <Link href="/src/auth/signin" className="hover:text-black text-white" onClick={() => setIsOpen(false)}>Sign In</Link>
              <Link href="/src/auth/signup" className="hover:text-black text-white" onClick={() => setIsOpen(false)}>Sign Up</Link>
            </>
          ) : (
            <>
              <button
                onClick={() => { setIsOpen(false); router.push("/src  /profile"); }}
                className="hover:text-black text-white"
              >
                Profile
              </button>
              <button
                onClick={() => { setIsOpen(false); handleLogout(); }}
               className="hover:text-black text-white"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
