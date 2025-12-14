"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "./actions";

function LoginForm() {
  const params = useSearchParams();
  const error = params.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      action={login}
      className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
    >
      <h1 className="text-2xl font-semibold">Welcome back</h1>
      <p className="text-sm text-white/70">Snowman security is watching ⛄️</p>

      {error && (
        <div className="mt-4 rounded bg-red-500/20 px-3 py-2 text-sm">
          {error}
        </div>
      )}

      <label className="mt-5 block text-sm">Email</label>
      <input
        name="email"
        type="email"
        required
        className="mt-1 w-full rounded bg-white/10 px-3 py-2"
        onChange={(e) => setEmail(e.target.value)}
      />

      <label className="mt-4 block text-sm">Password</label>
      <input
        name="password"
        type="password"
        required
        className="mt-1 w-full rounded bg-white/10 px-3 py-2"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className="mt-6 w-full rounded bg-white py-2 text-slate-900 font-medium"
      >
        Log in
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Snowman backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <svg viewBox="0 0 800 450" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          {Array.from({ length: 120 }).map((_, i) => (
            <circle
              key={i}
              cx={(i * 37) % 800}
              cy={(i * 53) % 450}
              r={1 + ((i * 11) % 10) / 5}
              fill="white"
              opacity="0.35"
            />
          ))}

          <g transform="translate(540 120)">
            <circle cx="0" cy="210" r="95" fill="white" />
            <circle cx="0" cy="110" r="70" fill="white" />
            <circle cx="0" cy="40" r="50" fill="white" />
            <circle cx="-16" cy="30" r="4" fill="#0f172a" />
            <circle cx="16" cy="30" r="4" fill="#0f172a" />
            <polygon points="0,40 52,54 0,60" fill="#fb923c" />
          </g>
        </svg>
      </div>

      {/* Login card */}
      <div className="relative flex min-h-screen items-center justify-center px-6">
        <Suspense fallback={
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <div className="animate-pulse">Loading...</div>
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
