"use server";

import { createClient } from "@/lib/supabase/server";

export async function getMessages(orderId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select(`
      id,
      content,
      created_at,
      sender_id,
      profiles (
        full_name,
        role
      )
    `)
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
  return data;
}

export async function sendMessage(orderId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase.from("messages").insert({
    order_id: orderId,
    sender_id: user.id,
    content: content,
  });

  if (error) {
    console.error("Error sending message:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
