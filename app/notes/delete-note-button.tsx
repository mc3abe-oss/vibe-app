"use client";

import { useTransition } from "react";
import { deleteNote } from "./actions";

export function DeleteNoteButton({ noteId }: { noteId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("id", noteId);
      const result = await deleteNote(formData);
      if (result.error) {
        console.error("Failed to delete note:", result.error);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="ml-4 rounded-lg border border-white/10 px-3 py-1 text-xs text-white/60 hover:border-red-500/50 hover:text-red-400 disabled:opacity-50"
    >
      {isPending ? "..." : "Delete"}
    </button>
  );
}
