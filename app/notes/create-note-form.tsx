"use client";

import { useActionState } from "react";
import { createNote, type ActionResult } from "./actions";

const initialState: ActionResult = { success: false };

export function CreateNoteForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prevState: ActionResult, formData: FormData) => {
      return await createNote(formData);
    },
    initialState
  );

  return (
    <form action={formAction} className="mt-8">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-medium">New Note</h2>

        {state.error && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            Error: {state.error}
          </div>
        )}

        {state.success && (
          <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            Note created successfully!
          </div>
        )}

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
          disabled={isPending}
          className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Creating..." : "Create Note"}
        </button>
      </div>
    </form>
  );
}
