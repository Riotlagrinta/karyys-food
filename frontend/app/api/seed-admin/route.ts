import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const email = "admin@karyysfood.com";
    const password = "password123";

    // 1. Créer ou récupérer l'utilisateur dans Supabase Auth
    const { data: usersData, error: listError } = await supabase.auth.admin.listUsers();
    let existingUser = usersData?.users?.find(u => u.email === email);

    if (!existingUser) {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: "Administrateur Karyy" }
      });
      if (createError) {
        return NextResponse.json({ error: createError.message }, { status: 500 });
      }
      existingUser = newUser.user;
    }

    // 2. Mettre à jour son rôle dans public.profiles vers 'admin'
    if (existingUser) {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: existingUser.id,
          full_name: "Administrateur Karyy",
          role: "admin"
        });

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Compte Admin créé/mis à jour avec succès !",
      email: email,
      password: password,
      role: "admin"
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
