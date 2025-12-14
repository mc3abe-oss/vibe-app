"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createNote(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  const { error } = await supabase
    .from("notes")
    .insert({
      user_id: user.id,
      title: title || null,
      body: body || null,
    });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/notes");
  return { success: true };
}

export async function updateNote(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  const { error } = await supabase
    .from("notes")
    .update({
      title: title || null,
      body: body || null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/notes");
  return { success: true };
}

export async function deleteNote(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const id = formData.get("id") as string;

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/notes");
  return { success: true };
}
