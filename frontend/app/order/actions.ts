"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

interface OrderItemPayload {
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  notes?: string;
}

export async function createOrder(
  totalPrice: number,
  deliveryFee: number,
  items: OrderItemPayload[],
  deliveryInfo: { address: string; phone: string; notes?: string }
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Vous devez être connecté pour passer une commande." };
  }

  // Calculate final total including delivery fee
  const finalTotal = totalPrice + deliveryFee;

  // Insert the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount: finalTotal,
      status: "pending", // initial status
      delivery_address: deliveryInfo.address,
      contact_phone: deliveryInfo.phone,
      delivery_notes: deliveryInfo.notes,
    })
    .select()
    .single();

  if (orderError || !order) {
    console.error("Order Creation Error:", orderError);
    return { error: "Erreur lors de la création de la commande." };
  }

  // Insert order items
  const orderItemsData = items.map((item) => ({
    order_id: order.id,
    menu_item_id: item.menu_item_id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    notes: item.notes,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsData);

  if (itemsError) {
    console.error("Order Items Error:", itemsError);
    // Ideally we should rollback the order here or handle it properly
    return { error: "Erreur lors de l'ajout des articles à la commande." };
  }

  revalidatePath("/profile");
  
  return { success: true, orderId: order.id };
}
