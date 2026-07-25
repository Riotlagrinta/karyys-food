"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return redirect(`/login?message=Email ou mot de passe incorrect`);
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  
  // By default, everyone registering through this route gets the 'client' role.
  // Profile is created via Postgres trigger on auth.users insert.

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        full_name: formData.get("full_name") as string,
        phone_number: formData.get("phone_number") as string,
      },
      emailRedirectTo: `${(await headers()).get("origin")}/auth/callback`,
    },
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return redirect(`/register?message=${encodeURIComponent(error.message)}`);
  }

  return redirect(`/register/verify?email=${encodeURIComponent(data.email)}`);
}

export async function verifySignupOtp(email: string, token: string) {
  const supabase = await createClient();
  
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/update-password`,
  });

  if (error) {
    return redirect(`/reset-password?message=${encodeURIComponent("Impossible d'envoyer le lien de réinitialisation.")}`);
  }

  return redirect(`/reset-password?message=${encodeURIComponent("Un e-mail de réinitialisation a été envoyé.")}`);
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return redirect(`/update-password?message=${encodeURIComponent("La mise à jour du mot de passe a échoué.")}`);
  }

  return redirect(`/login?message=${encodeURIComponent("Mot de passe mis à jour avec succès.")}`);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  
  revalidatePath("/", "layout");
  redirect("/login");
}
