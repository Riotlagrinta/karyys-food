"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleMenuItemStatus(id: string, isAvailable: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("menu_items")
    .update({ is_available: isAvailable })
    .eq("id", id);

  if (error) {
    console.error("Error toggling menu item:", error);
    return { error: "Erreur lors de la mise à jour." };
  }

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  return { success: true };
}

export async function addOrUpdateMenuItem(formData: FormData, id?: string) {
  const supabase = await createClient();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseInt(formData.get("price") as string);
  const category_id = formData.get("category_id") as string;
  const is_available = formData.get("is_available") === "on";
  
  const imageFile = formData.get("image") as File;
  let image_url = formData.get("existing_image_url") as string || null;

  if (imageFile && imageFile.size > 0) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("menu_images")
      .upload(filePath, imageFile);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: "Erreur lors de l'upload de l'image." };
    }

    const { data: publicUrlData } = supabase.storage
      .from("menu_images")
      .getPublicUrl(filePath);

    image_url = publicUrlData.publicUrl;
  }

  const payload = {
    name,
    description,
    price,
    category_id,
    is_available,
    ...(image_url && { image_url }),
  };

  if (id) {
    const { error } = await supabase.from("menu_items").update(payload).eq("id", id);
    if (error) return { error: "Erreur lors de la modification." };
  } else {
    const { error } = await supabase.from("menu_items").insert([payload]);
    if (error) return { error: "Erreur lors de la création." };
  }

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  return { success: true };
}

export async function deleteMenuItem(id: string) {
  const supabase = await createClient();

  const { count } = await supabase
    .from("order_items")
    .select("*", { count: "exact", head: true })
    .eq("menu_item_id", id);

  if (count && count > 0) {
    await supabase.from("menu_items").update({ is_available: false }).eq("id", id);
    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    return { success: true, message: "Plat désactivé (lié à des commandes passées)." };
  }

  const { error } = await supabase.from("menu_items").delete().eq("id", id);
  if (error) {
    console.error("Error deleting menu item:", error);
    return { error: "Erreur lors de la suppression." };
  }

  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  return { success: true };
}
