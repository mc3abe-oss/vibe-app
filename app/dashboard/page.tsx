import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Subtle snowman backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <svg viewBox="0 0 1200 700" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          {/* snow dots */}
          {Array.from({ length: 160 }).map((_, i) => {
            const x = (i * 73) % 1200;
            const y = (i * 47) % 700;
            const r = 0.7 + ((i * 11) % 24) / 10;
            return <circle key={i} cx={x} cy={y} r={r} fill="white" opacity="0.25" />;
          })}

          {/* snowman */}
          <g transform="translate(900 120)">
            <circle cx="0" cy="420" r="140" fill="white" opacity="0.9" />
            <circle cx="0" cy="270" r="110" fill="white" opacity="0.92" />
            <circle cx="0" cy="150" r="80" fill="white" opacity="0.95" />
            <circle cx="-22" cy="135" r="6" fill="#0f172a" />
            <circle cx="22" cy="135" r="6" fill="#0f172a" />
            <polygon points="0,150 80,170 0,185" fill="#fb923c" />
            <circle cx="0" cy="260" r="6" fill="#0f172a" />
            <circle cx="0" cy="300" r="6" fill="#0f172a" />
            <circle cx="0" cy="340" r="6" fill="#0f172a" />
            <rect x="-80" y="80" width="160" height="26" rx="10" fill="#0f172a" />
            <rect x="-50" y="-10" width="100" height="90" rx="16" fill="#0f172a" />
            <path d="M-110 220 Q0 255 110 220 Q0 310 -110 220 Z" fill="#ef4444" />
            <rect x="-10" y="250" width="20" height="80" rx="10" fill="#ef4444" />
          </g>

          {/* ground */}
          <path d="M0 560 Q300 520 600 560 T1200 560 V700 H0 Z" fill="white" opacity="0.07" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-10">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
            <p className="mt-1 text-sm text-white/70">
              Logged in as <span className="text-white">{user.email}</span>
            </p>
          </div>

          <form action={signOut}>
            <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white/90">
              Sign out
            </button>
          </form>
        </div>

        {/* Hero */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
          <h2 className="text-xl font-semibold">What do you want to build next?</h2>
          <p className="mt-1 text-sm text-white/70">
            Pick a direction. Ship one small thing. Repeat. That’s the whole game.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <Link
              href="/"
              className="rounded-xl border border-white/12 bg-white/5 p-4 hover:bg-white/10"
            >
              <div className="text-sm font-medium">Homepage</div>
              <div className="mt-1 text-xs text-white/70">Change the landing page vibe</div>
            </Link>

            <Link
              href="/login"
              className="rounded-xl border border-white/12 bg-white/5 p-4 hover:bg-white/10"
            >
              <div className="text-sm font-medium">Login screen</div>
              <div className="mt-1 text-xs text-white/70">Make it slicker, add magic link</div>
            </Link>

            <Link
              href="/dashboard"
              className="rounded-xl border border-white/12 bg-white/5 p-4 hover:bg-white/10"
            >
              <div className="text-sm font-medium">Profile</div>
              <div className="mt-1 text-xs text-white/70">Name, avatar, settings, saved in Supabase</div>
            </Link>
          </div>
        </div>

        {/* Debug (small + optional) */}
        <details className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <summary className="cursor-pointer text-sm text-white/80">Debug: user object</summary>
          <pre className="mt-3 overflow-auto rounded-lg bg-black/30 p-4 text-xs">
            {JSON.stringify(user, null, 2)}
          </pre>
        </details>
      </div>
    </main>
  );
}