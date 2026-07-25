"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function markOrderAsDelivered(orderId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Non autorisé." };
  }

  // Vérifier que la commande appartient bien à ce livreur et qu'elle est en cours
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, status, deliverer_id, user_id")
    .eq("id", orderId)
    .single();

  if (fetchError || !order) {
    return { error: "Commande introuvable." };
  }

  if (order.deliverer_id !== user.id) {
    return { error: "Cette commande ne vous est pas assignée." };
  }

  if (order.status !== "on_route") {
    return { error: "Le statut de cette commande ne permet pas cette action." };
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update({ status: "delivered" })
    .eq("id", orderId);

  if (updateError) {
    console.error("Error updating order:", updateError);
    return { error: "Impossible de mettre à jour la commande." };
  }

  // Create notification
  if (order.user_id) {
    await supabase.from("notifications").insert({
      user_id: order.user_id,
      title: "Mise à jour de commande",
      message: "Votre commande a été livrée ! Bon appétit !",
    });
  }

  revalidatePath("/delivery/dashboard");
  revalidatePath("/delivery/history");
  
  redirect("/delivery/dashboard");
}
