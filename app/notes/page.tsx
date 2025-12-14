import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CreateNoteForm } from "./create-note-form";
import { DeleteNoteButton } from "./delete-note-button";

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
        <CreateNoteForm />

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
                    <DeleteNoteButton noteId={note.id} />
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
