"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function parseEmails(input: string): string[] {
  if (!input || !input.trim()) return [];
  return input
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

export async function createNote(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const toEmails = parseEmails(formData.get("to") as string);
  const ccEmails = parseEmails(formData.get("cc") as string);

  const { data: note, error } = await supabase
    .from("notes")
    .insert({
      user_id: user.id,
      title: title || null,
      body: body || null,
    })
    .select("id")
    .single();

  if (error) {
    return;
  }

  // Insert recipients if any
  const recipients = [
    ...toEmails.map((email) => ({ note_id: note.id, email, role: "to" })),
    ...ccEmails.map((email) => ({ note_id: note.id, email, role: "cc" })),
  ];

  if (recipients.length > 0) {
    await supabase.from("note_recipients").insert(recipients);
  }

  revalidatePath("/notes");
}

export async function updateNote(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  await supabase
    .from("notes")
    .update({
      title: title || null,
      body: body || null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/notes");
}

export async function deleteNote(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const id = formData.get("id") as string;

  await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/notes");
}
