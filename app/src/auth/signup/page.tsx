// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function SignUp() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     try {
//       const res = await fetch("/api/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password }),
//       });

//       let data;
//       try {
//         data = await res.json();
//       } catch {
//         setMessage("Server returned invalid response");
//         setLoading(false);
//         return;
//       }

//       if (res.ok) {
//         setMessage("Signup successful! Redirecting to Sign In...");
//         setTimeout(() => router.push("/src/auth/signin"), 1000);
//       } else {
//         // Parse errors
//         const errMsg = data?.error
//           ? typeof data.error === "string"
//             ? data.error
//             : Object.values(data.error).flat().join(", ")
//           : "Signup failed";
//         setMessage(errMsg);
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative h-screen flex items-center justify-center">
//       <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center filter blur-sm" />
//       <div className="relative z-10 flex bg-neutral-800/80 shadow-2xl rounded-xl overflow-hidden">
//         <div className="w-[400px] p-10">
//           <h1 className="text-4xl text-white text-center font-serif mb-6">SIGN UP</h1>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label className="block text-md text-gray-200 mb-1">Name</label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 rounded-lg text-black border-2 border-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
//                 placeholder="Your Name"
//               />
//             </div>
//             <div className="mb-3">
//               <label className="block text-md text-gray-200 mb-1">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 rounded-lg text-black border-2 border-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
//                 placeholder="you@example.com"
//               />
//             </div>
//             <div className="mb-3">
//               <label className="block text-md text-gray-200 mb-1">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 rounded-lg text-black border-2 border-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
//                 placeholder="Enter Password"
//               />
//             </div>
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full py-2 mt-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition disabled:opacity-50"
//             >
//               {loading ? "Signing up..." : "Signup"}
//             </button>
//           </form>

//           {message && (
//             <p
//               className={`text-center mt-4 ${
//                 message.toLowerCase().includes("success") ? "text-green-400" : "text-red-400"
//               }`}
//             >
//               {message}
//             </p>
//           )}

//           <p className="text-sm text-gray-300 text-center mt-4">
//             Already have an account?{" "}
//             <a href="/src/auth/signin" className="text-sky-400 hover:underline">
//               Sign In
//             </a>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
// "use client";
// import React, { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function SignUp() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     try {
//       const res = await fetch("/api/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name, email, password }),
//       });

//       let data;
//       try {
//         data = await res.json();
//       } catch {
//         setMessage("Server returned invalid response");
//         setLoading(false);
//         return;
//       }

//       if (res.ok) {
//         setMessage("Signup successful! Redirecting to Sign In...");
//         setTimeout(() => router.push("/src/auth/signin"), 1000);
//       } else {
//         const errMsg = data?.error
//           ? typeof data.error === "string"
//             ? data.error
//             : Object.values(data.error).flat().join(", ")
//           : "Signup failed";
//         setMessage(errMsg);
//       }
//     } catch (err) {
//       console.error(err);
//       setMessage("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6">
//       {/* Background */}
//       <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center filter blur-sm" />

//       {/* Form container */}
//       <div className="relative z-10 flex flex-col w-full max-w-md sm:max-w-lg bg-neutral-800/80 shadow-2xl rounded-xl overflow-hidden">
//         <div className="w-full p-6 sm:p-10">
//           <h1 className="text-3xl sm:text-4xl text-white text-center font-serif mb-6">
//             SIGN UP
//           </h1>
//           <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//             <div>
//               <label className="block text-md text-gray-200 mb-1">Name</label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 rounded-lg text-black border-2 border-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-600 text-sm sm:text-base"
//                 placeholder="Your Name"
//               />
//             </div>
//             <div>
//               <label className="block text-md text-gray-200 mb-1">Email</label>
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 rounded-lg text-black border-2 border-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-600 text-sm sm:text-base"
//                 placeholder="you@example.com"
//               />
//             </div>
//             <div>
//               <label className="block text-md text-gray-200 mb-1">Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
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
//               {loading ? "Signing up..." : "Signup"}
//             </button>
//           </form>

//           {message && (
//             <p
//               className={`text-center mt-4 ${
//                 message.toLowerCase().includes("success") ? "text-green-400" : "text-red-400"
//               } text-sm sm:text-base`}
//             >
//               {message}
//             </p>
//           )}

//           <p className="text-sm sm:text-base text-gray-300 text-center mt-4">
//             Already have an account?{" "}
//             <a href="/src/auth/signin" className="text-sky-400 hover:underline">
//               Sign In
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

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setMessage("Server returned invalid response");
        setLoading(false);
        return;
      }

      if (res.ok) {
        setMessage("Signup successful! Redirecting to Sign In...");
        setTimeout(() => router.push("/src/auth/signin"), 1000);
      } else {
        const errMsg = data?.error
          ? typeof data.error === "string"
            ? data.error
            : Object.values(data.error).flat().join(", ")
          : "Signup failed";
        setMessage(errMsg);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center font-serif bg-neutral-800">
      {/* Blurred Background */}
      <div className="absolute inset-0 bg-[url('/background.jpg')] bg-cover bg-center filter blur-xl opacity-60" />

      {/* Glassy Signup Card */}
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

        <h1 className="text-white text-2xl font-semibold mb-6">SIGN UP</h1>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <input
            type="text"
            name="name"
            value={name}
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-black/40 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-black/40 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />
          <input
            type="password"
            name="password"
            value={password}
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-md bg-black/40 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 text-white font-semibold transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "SIGN UP"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-2 text-sm ${
              message.toLowerCase().includes("success")
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}

        <p className="text-sm text-gray-300 text-center mt-4">
          Already have an account?{" "}
          <a href="/src/auth/signin" className="text-sky-400 hover:underline">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
