// Write to Us: stores messages in the "contact_messages" Supabase table,
// checked manually via the Supabase dashboard for now (see the SQL in the
// project notes for the table + RLS policy this expects). No email layer
// yet — that would need a transactional email provider (e.g. Resend) and
// an API key added separately; this is the storage-only version.
import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/lib/storage";

const supabase = createClient();

export async function submitContactMessage(message) {
  const trimmed = (message || "").trim();
  if (!trimmed) return { error: "Write something before sending." };

  const user = await getCurrentUser();
  const { error } = await supabase.from("contact_messages").insert({
    message: trimmed,
    user_id: user?.id || null,
  });

  return { error: error ? error.message : null };
}
