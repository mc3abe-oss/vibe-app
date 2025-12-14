"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabaseClient";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMsg("Enter a new password and save it.");
  }, []);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMsg("Password updated. Now go log in. ✅");
      setTimeout(() => (window.location.href = "/login"), 1200);
    } catch (err: any) {
      setMsg(err?.message ?? "Could not update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <form
        onSubmit={handleUpdate}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <p className="mt-2 text-sm text-white/70">{msg}</p>

        <label className="mt-5 block text-sm text-white/80">New password</label>
        <input
          className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-white outline-none"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white/90 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save new password"}
        </button>
      </form>
    </main>
  );
}