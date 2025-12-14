"use client";

import { useState } from "react";
import { NoteForm } from "./note-form";
import { deleteNote } from "./actions";

type Note = {
  id: string;
  user_id: string;
  title: string | null;
  body: string | null;
  created_at: string;
};

export function NotesList({ initialNotes }: { initialNotes: Note[] }) {
  const [notes, setNotes] = useState(initialNotes);
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleCreateSuccess() {
    setShowForm(false);
    window.location.reload();
  }

  function handleEditSuccess() {
    setEditingNote(null);
    window.location.reload();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this note?")) return;

    setDeletingId(id);
    const formData = new FormData();
    formData.append("id", id);

    await deleteNote(formData);
    setNotes(notes.filter((n) => n.id !== id));
    setDeletingId(null);
  }

  return (
    <div className="space-y-6">
      {!showForm && !editingNote && (
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          New Note
        </button>
      )}

      {showForm && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="mb-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Create Note
          </h3>
          <NoteForm onCancel={() => setShowForm(false)} onSuccess={handleCreateSuccess} />
        </div>
      )}

      {editingNote && (
        <div className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
          <h3 className="mb-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
            Edit Note
          </h3>
          <NoteForm
            note={editingNote}
            onCancel={() => setEditingNote(null)}
            onSuccess={handleEditSuccess}
          />
        </div>
      )}

      {notes.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          No notes yet. Create your first note!
        </p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                    {note.title || "Untitled"}
                  </h3>
                  {note.body && (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">
                      {note.body}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                    {new Date(note.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingNote(note)}
                    className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(note.id)}
                    disabled={deletingId === note.id}
                    className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                  >
                    {deletingId === note.id ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
