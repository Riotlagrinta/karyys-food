"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function deleteUser(userId: string) {
  const supabase = createAdminClient();

  // Supprimer le profil utilisateur de la table public.profiles
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (error) {
    console.error("Error deleting user profile:", error);
    return { error: "Erreur lors de la suppression de l'utilisateur." };
  }

  // Également tenter de supprimer l'utilisateur auth s'il s'agit du client admin
  try {
    await supabase.auth.admin.deleteUser(userId);
  } catch (err) {
    console.warn("Auth deletion note:", err);
  }

  revalidatePath("/admin/users");
  return { success: true };
}

export async function updateUserRole(userId: string, newRole: "client" | "deliverer" | "admin") {
  const supabase = createAdminClient();

  const { error } = await supabase
    .from("profiles")
    .update({ role: newRole })
    .eq("id", userId);

  if (error) {
    console.error("Error updating user role:", error);
    return { error: "Erreur lors du changement de rôle." };
  }

  revalidatePath("/admin/users");
  return { success: true };
}
