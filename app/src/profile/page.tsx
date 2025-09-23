"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return router.push("/auth/signin");
    setUser(JSON.parse(raw));
  }, [router]);

  if (!user) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      localStorage.setItem("user", JSON.stringify(user));
      setMsg("Saved!");
    } catch {
      setMsg("Failed to save.");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 2000);
    }
  };

  const handleUpgrade = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, plan: "Premium" }),
      });
      if (res.ok) {
        setUser({
          ...user,
          plan: "Premium",
          membershipExpiry: new Date(
            Date.now() + 1000 * 60 * 60 * 24 * 30
          ).toISOString(),
        });
        setMsg("Upgraded!");
      }
    } catch {}
    finally {
      setSaving(false);
      setTimeout(() => setMsg(null), 2000);
    }
  };

  return (
    <main className="min-h-screen font-serif bg-neutral-800 to-black text-white p-4 sm:p-6 md:p-12 flex flex-col gap-8">
      {/* Header Card */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-neutral-900 rounded-2xl p-6 shadow-xl w-full">
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden ring-4 ring-sky-800 flex-shrink-0">
          <img
            src={user.profileImage || "/profile.png"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col gap-2 text-center md:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">{user.name}</h1>
          <p className="text-neutral-300 text-sm sm:text-base truncate">{user.email}</p>

          <div className="mt-2 flex flex-wrap justify-center md:justify-start gap-2">
            <span className="bg-neutral-700 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              Plan: {user.plan}
            </span>
            {user.plan !== "Premium" && (
              <button
                onClick={handleUpgrade}
                className="bg-amber-500 px-3 py-1 rounded-lg font-semibold text-black hover:bg-amber-400 transition text-xs sm:text-sm"
              >
                Upgrade
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Profile Form Card */}
      <div className="bg-neutral-900 rounded-2xl p-4 sm:p-6 md:p-10 shadow-xl w-full flex flex-col gap-6">
        <h2 className="text-xl sm:text-2xl font-semibold border-b border-neutral-700 pb-2 mb-4">
          Profile Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[
            { label: "Name", value: "name" },
            { label: "Location", value: "location" },
            { label: "Favorite Genre", value: "favoriteGenre" },
            { label: "Playlists Count", value: "playlistsCount", type: "number" },
          ].map((field) => (
            <div key={field.value} className="flex flex-col gap-1">
              <label className="text-sm text-neutral-300">{field.label}</label>
              <input
                type={field.type || "text"}
                className="p-2 rounded-lg bg-neutral-700 border border-neutral-600 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition text-sm sm:text-base"
                value={user[field.value] || ""}
                onChange={(e) =>
                  setUser({
                    ...user,
                    [field.value]:
                      field.type === "number"
                        ? Number(e.target.value)
                        : e.target.value,
                  })
                }
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="self-center md:self-start bg-sky-800 hover:bg-sky-700 px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50 mt-2"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        {msg && <p className="text-green-400 mt-2 font-medium text-center md:text-left">{msg}</p>}
      </div>
    </main>
  );
}
