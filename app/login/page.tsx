"use client";

import { useState } from "react";
import { login, signup, signInWithMagicLink } from "./actions";

type AuthMode = "login" | "signup" | "magic-link";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      let result;
      if (mode === "magic-link") {
        result = await signInWithMagicLink(formData);
        if (result?.success) {
          setMessage(result.success);
        }
      } else if (mode === "signup") {
        result = await signup(formData);
      } else {
        result = await login(formData);
      }

      if (result?.error) {
        setError(result.error);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            {mode === "login" && "Sign in to your account"}
            {mode === "signup" && "Create your account"}
            {mode === "magic-link" && "Sign in with magic link"}
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {mode === "magic-link"
              ? "We'll send you a link to sign in"
              : "Enter your credentials below"}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
            {message}
          </div>
        )}

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
              placeholder="you@example.com"
            />
          </div>

          {mode !== "magic-link" && (
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {loading ? (
              "Loading..."
            ) : mode === "login" ? (
              "Sign in"
            ) : mode === "signup" ? (
              "Sign up"
            ) : (
              "Send magic link"
            )}
          </button>
        </form>

        <div className="space-y-2 text-center text-sm">
          {mode === "login" && (
            <>
              <button
                onClick={() => setMode("signup")}
                className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Don&apos;t have an account? <span className="font-medium">Sign up</span>
              </button>
              <div>
                <button
                  onClick={() => setMode("magic-link")}
                  className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  Or use a <span className="font-medium">magic link</span>
                </button>
              </div>
            </>
          )}
          {mode === "signup" && (
            <button
              onClick={() => setMode("login")}
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Already have an account? <span className="font-medium">Sign in</span>
            </button>
          )}
          {mode === "magic-link" && (
            <button
              onClick={() => setMode("login")}
              className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              Back to <span className="font-medium">password login</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
