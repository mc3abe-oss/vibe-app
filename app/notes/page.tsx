import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createNote, deleteNote } from "./actions";

export default async function NotesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: notes } = await supabase
    .from("notes")
    .select("*, note_recipients(email, role)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Notes</h1>
            <p className="mt-1 text-sm text-white/70">
              Capture ideas, thoughts, and todos
            </p>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Create Note Form */}
        <form action={createNote} className="mt-8">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-medium">New Note</h2>
            <input
              type="text"
              name="title"
              placeholder="Title (optional)"
              className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none"
            />
            <textarea
              name="body"
              placeholder="What's on your mind?"
              rows={3}
              className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none resize-none"
            />
            <div className="mt-3 grid grid-cols-2 gap-3">
              <input
                type="text"
                name="to"
                placeholder="To: emails (comma-separated)"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none"
              />
              <input
                type="text"
                name="cc"
                placeholder="CC: emails (comma-separated)"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white/90"
            >
              Create Note
            </button>
          </div>
        </form>

        {/* Notes List */}
        <div className="mt-8 space-y-4">
          {notes && notes.length > 0 ? (
            notes.map((note) => {
              const toRecipients = note.note_recipients?.filter(
                (r: { role: string }) => r.role === "to"
              ) || [];
              const ccRecipients = note.note_recipients?.filter(
                (r: { role: string }) => r.role === "cc"
              ) || [];

              return (
                <div
                  key={note.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {note.title && (
                        <h3 className="text-lg font-medium">{note.title}</h3>
                      )}
                      {note.body && (
                        <p className="mt-2 text-white/70 whitespace-pre-wrap">
                          {note.body}
                        </p>
                      )}
                      {(toRecipients.length > 0 || ccRecipients.length > 0) && (
                        <div className="mt-3 space-y-1 text-xs text-white/50">
                          {toRecipients.length > 0 && (
                            <p>
                              <span className="text-white/70">To:</span>{" "}
                              {toRecipients.map((r: { email: string }) => r.email).join(", ")}
                            </p>
                          )}
                          {ccRecipients.length > 0 && (
                            <p>
                              <span className="text-white/70">CC:</span>{" "}
                              {ccRecipients.map((r: { email: string }) => r.email).join(", ")}
                            </p>
                          )}
                        </div>
                      )}
                      <p className="mt-3 text-xs text-white/40">
                        {new Date(note.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <form action={deleteNote}>
                      <input type="hidden" name="id" value={note.id} />
                      <button
                        type="submit"
                        className="ml-4 rounded-lg border border-white/10 px-3 py-1 text-xs text-white/60 hover:border-red-500/50 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
              <p className="text-white/50">No notes yet. Create your first one above.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
