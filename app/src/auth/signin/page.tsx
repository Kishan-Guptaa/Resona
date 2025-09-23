// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function SignIn() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");
//     setLoading(true);

//     const formData = new FormData(e.currentTarget);
//     const email = String(formData.get("email") || "");
//     const password = String(formData.get("password") || "");

//     try {
//       const res = await fetch("/api/signin", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         const errMsg =
//           data?.error?.message ||
//           (data?.error && typeof data.error === "string" ? data.error : "Signin failed");
//         setError(String(errMsg));
//       } else {
//         if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));
//         setSuccess("Signin successful! Redirecting to home...");
//         setTimeout(() => router.push("/"), 700);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
//       {/* Background */}
//       <div className="absolute inset-0 bg-[url('/')] bg-cover bg-center filter blur-sm" />

//       {/* Form container */}
//       <div className="relative z-10 flex flex-col w-full max-w-md sm:max-w-lg bg-neutral-800/80 shadow-2xl rounded-xl overflow-hidden">
//         <div className="w-full p-6 sm:p-10">
//           <h1 className="text-3xl sm:text-4xl text-white text-center font-serif mb-6">SIGN IN</h1>
//           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//             <div>
//               <label className="block text-md text-gray-200 mb-1">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 required
//                 className="w-full px-4 py-2 rounded-lg text-black border-2 border-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-600 text-sm sm:text-base"
//                 placeholder="you@example.com"
//               />
//             </div>
//             <div>
//               <label className="block text-md text-gray-200 mb-1">Password</label>
//               <input
//                 type="password"
//                 name="password"
//                 required
//                 className="w-full px-4 py-2 rounded-lg text-black border-2 border-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-600 text-sm sm:text-base"
//                 placeholder="Enter Password"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-2 mt-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition disabled:opacity-50 text-sm sm:text-base"
//             >
//               {loading ? "Signing in..." : "Signin"}
//             </button>
//           </form>

//           {error && <p className="text-red-400 text-center mt-2 text-sm sm:text-base">{error}</p>}
//           {success && <p className="text-green-400 text-center mt-2 text-sm sm:text-base">{success}</p>}

//           <p className="text-sm sm:text-base text-gray-300 text-center mt-4">
//             Don’t have an account?{" "}
//             <a href="/src/auth/signup" className="text-sky-400 hover:underline">
//               Sign Up
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignIn() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg =
          data?.error?.message ||
          (data?.error && typeof data.error === "string" ? data.error : "Signin failed");
        setError(String(errMsg));
      } else {
        if (data?.user) localStorage.setItem("user", JSON.stringify(data.user));
        setSuccess("Signin successful! Redirecting to home...");
        setTimeout(() => router.push("/"), 700);
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-serif bg-neutral-800">
      {/* Blurred Background */}
      <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center filter blur-xl opacity-60" />

      {/* Glassy Login Card */}
      <div className="relative z-10 w-full max-w-sm bg-black/60 backdrop-blur-md rounded-xl shadow-2xl p-8 flex flex-col items-center">
        {/* Profile Icon */}
        <div className="w-24 h-24 mb-6 relative">
          <Image
            src="/profile.png"
            alt="Profile"
            fill
            className="object-cover rounded-full shadow-lg"
          />
        </div>

        <h1 className="text-white text-2xl font-semibold mb-6">LOGIN</h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="email"
            name="email"
            placeholder="Username"
            required
            className="w-full px-4 py-2 rounded-md bg-black/40 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
          <input
            type="password"
            name="password"
            placeholder="********"
            required
            className="w-full px-4 py-2 rounded-md bg-black/40 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />

          <div className="flex justify-between items-center text-sm text-gray-300 mt-1">
            <label className="flex items-center gap-1">
              <input type="checkbox" className="accent-sky-500" /> Remember me
            </label>
            <a href="#" className="hover:underline">Forgot Password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-semibold transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "LOGIN"}
          </button>
        </form>

        {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
        {success && <p className="text-green-400 mt-2 text-sm">{success}</p>}
      </div>
    </div>
  );
}
