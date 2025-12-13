import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/login/actions";
import { ProfileForm } from "./profile-form";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Dashboard
          </h1>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Sign out
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
            Welcome back!
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            You are signed in as <span className="font-medium">{user.email}</span>
          </p>

          <div className="mt-4">
            <Link
              href="/dashboard/notes"
              className="text-sm font-medium text-zinc-900 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
            >
              Notes &rarr;
            </Link>
          </div>

          {profile ? (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                Edit Profile
              </h3>
              <div className="mt-4">
                <ProfileForm profile={profile} />
              </div>
            </div>
          ) : (
            <div className="mt-6">
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                No profile found. Run the SQL migration to create the profiles table.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
