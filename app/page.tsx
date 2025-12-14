import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If already logged in, go where the value is
  if (user) redirect("/dashboard");

  // Otherwise, the home page *is* the login experience
  redirect("/login");
}