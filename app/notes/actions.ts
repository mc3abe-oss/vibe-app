"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sendNoteEmail, type EmailRecipient } from "@/lib/email/send-note";

export type ActionResult = {
  success: boolean;
  error?: string;
};

function parseEmails(input: string): string[] {
  if (!input || !input.trim()) return [];
  return input
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
}

export async function createNote(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error("[createNote] Auth error:", authError);
    return { success: false, error: "Authentication failed" };
  }

  if (!user) {
    console.error("[createNote] No user found, redirecting to login");
    redirect("/login");
  }

  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const toEmails = parseEmails(formData.get("to") as string);
  const ccEmails = parseEmails(formData.get("cc") as string);

  console.log("[createNote] Attempting to create note for user:", user.id);
  console.log("[createNote] Title:", title, "Body length:", body?.length || 0);

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
    console.error("[createNote] Supabase insert error:", error);
    return { success: false, error: error.message };
  }

  console.log("[createNote] Note created with id:", note.id);

  // Insert recipients if any
  const recipients = [
    ...toEmails.map((email) => ({ note_id: note.id, email, role: "to" })),
    ...ccEmails.map((email) => ({ note_id: note.id, email, role: "cc" })),
  ];

  if (recipients.length > 0) {
    const { error: recipientError } = await supabase
      .from("note_recipients")
      .insert(recipients);

    if (recipientError) {
      console.error("[createNote] Recipients insert error:", recipientError);
      // Note was created, so we don't fail the whole operation
    } else {
      // Send email to recipients after successfully saving them
      console.log("[createNote] Sending email to recipients...");
      const emailRecipients: EmailRecipient[] = recipients.map(r => ({
        email: r.email,
        role: r.role as 'to' | 'cc'
      }));

      const emailResult = await sendNoteEmail({
        recipients: emailRecipients,
        title: title || 'New Note',
        body: body || '',
      });

      if (!emailResult.success) {
        console.error("[createNote] Email sending failed:", emailResult.message);
        // Don't fail the whole operation if email fails
      } else {
        console.log("[createNote] Email sent successfully");
      }
    }
  }

  revalidatePath("/notes");
  return { success: true };
}

export async function updateNote(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error("[updateNote] Auth error:", authError);
    return { success: false, error: "Authentication failed" };
  }

  if (!user) {
    console.error("[updateNote] No user found, redirecting to login");
    redirect("/login");
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const body = formData.get("body") as string;

  console.log("[updateNote] Updating note:", id);

  const { error } = await supabase
    .from("notes")
    .update({
      title: title || null,
      body: body || null,
    })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("[updateNote] Supabase update error:", error);
    return { success: false, error: error.message };
  }

  console.log("[updateNote] Note updated successfully");
  revalidatePath("/notes");
  return { success: true };
}

export async function deleteNote(formData: FormData): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.error("[deleteNote] Auth error:", authError);
    return { success: false, error: "Authentication failed" };
  }

  if (!user) {
    console.error("[deleteNote] No user found, redirecting to login");
    redirect("/login");
  }

  const id = formData.get("id") as string;

  console.log("[deleteNote] Deleting note:", id);

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("[deleteNote] Supabase delete error:", error);
    return { success: false, error: error.message };
  }

  console.log("[deleteNote] Note deleted successfully");
  revalidatePath("/notes");
  return { success: true };
}
