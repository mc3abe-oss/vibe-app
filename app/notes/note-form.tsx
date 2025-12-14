"use client";

import { useState } from "react";
import { createNote, updateNote } from "./actions";

type Note = {
  id: string;
  user_id: string;
  title: string | null;
  body: string | null;
  created_at: string;
};

type NoteFormProps = {
  note?: Note;
  onCancel: () => void;
  onSuccess: () => void;
};

export function NoteForm({ note, onCancel, onSuccess }: NoteFormProps) {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const isEditing = !!note;

  async function handleSubmit(formData: FormData) {
    setMessage(null);
    setLoading(true);

    try {
      const result = isEditing ? await updateNote(formData) : await createNote(formData);
      if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        onSuccess();
      }
    } catch {
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`rounded-md p-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      {isEditing && <input type="hidden" name="id" value={note.id} />}

      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={note?.title || ""}
          className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
          placeholder="Note title"
        />
      </div>

      <div>
        <label
          htmlFor="body"
          className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Body
        </label>
        <textarea
          id="body"
          name="body"
          rows={4}
          defaultValue={note?.body || ""}
          className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500"
          placeholder="Write your note..."
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          {loading ? "Saving..." : isEditing ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
