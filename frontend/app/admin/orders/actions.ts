"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, newStatus: string, delivererId?: string) {
  const supabase = await createClient();

  const updateData: any = { status: newStatus };
  if (delivererId !== undefined) {
    updateData.deliverer_id = delivererId || null;
  }

  const { error } = await supabase
    .from("orders")
    .update(updateData)
    .eq("id", orderId);

  if (error) {
    console.error("Failed to update order status:", error);
    return { error: "Erreur lors de la mise à jour du statut." };
  }

  // Fetch the order to get the user_id for notification
  const { data: orderInfo } = await supabase.from("orders").select("user_id").eq("id", orderId).single();
  
  if (orderInfo) {
    let message = `Votre commande est maintenant ${newStatus}`;
    if (newStatus === 'on_route') message = 'Votre commande est en route !';
    if (newStatus === 'delivered') message = 'Votre commande a été livrée ! Bon appétit !';
    if (newStatus === 'preparing') message = 'Votre commande est en cours de préparation.';
    if (newStatus === 'cancelled') message = 'Votre commande a été annulée.';

    await supabase.from("notifications").insert({
      user_id: orderInfo.user_id,
      title: "Mise à jour de commande",
      message: message,
    });
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath(`/order/${orderId}`);

  return { success: true };
}
