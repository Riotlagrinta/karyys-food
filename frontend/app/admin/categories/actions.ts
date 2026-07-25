"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name || name.trim() === "") {
    return { error: "Le nom de la catégorie est obligatoire." };
  }

  const { error } = await supabase.from("categories").insert([
    {
      name: name.trim(),
      description: description ? description.trim() : null,
    },
  ]);

  if (error) {
    console.error("Error creating category:", error);
    return { error: "Erreur lors de la création de la catégorie." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name || name.trim() === "") {
    return { error: "Le nom de la catégorie est obligatoire." };
  }

  const { error } = await supabase
    .from("categories")
    .update({
      name: name.trim(),
      description: description ? description.trim() : null,
    })
    .eq("id", id);

  if (error) {
    console.error("Error updating category:", error);
    return { error: "Erreur lors de la modification de la catégorie." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();

  // Check if there are menu items linked to this category
  const { count, error: countError } = await supabase
    .from("menu_items")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (countError) {
    console.error("Error checking linked items:", countError);
    return { error: "Erreur lors de la vérification des plats associés." };
  }

  if (count && count > 0) {
    return {
      error: `Impossible de supprimer cette catégorie car ${count} plat(s) y sont actuellement associé(s). Veuillez d'abord déplacer ou supprimer ces plats.`,
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error("Error deleting category:", error);
    return { error: "Erreur lors de la suppression de la catégorie." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
  return { success: true };
}
