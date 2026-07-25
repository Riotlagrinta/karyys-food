"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function createDelivererAccount(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("full_name") as string;

  if (!email || !password || !fullName) {
    return { error: "Tous les champs sont requis." };
  }

  // We need service role to create users via admin API
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
    },
  });

  if (error) {
    console.error("Error creating deliverer:", error);
    return { error: error.message };
  }

  // Wait briefly to ensure trigger creates the profile
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Update role in profiles
  if (data.user) {
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ role: "deliverer" })
      .eq("id", data.user.id);

    if (profileError) {
      console.error("Error updating profile role:", profileError);
      return { error: "Compte créé mais erreur lors de l'assignation du rôle livreur." };
    }
  }

  revalidatePath("/admin/deliverers");
  return { success: true };
}
