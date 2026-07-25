import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdmin(email: string, full_name: string) {
  // Create user
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email,
    password: "password123", // Default password
    email_confirm: true,
    user_metadata: {
      full_name,
    },
  });

  if (createError) {
    if (createError.message.includes("already registered")) {
      console.log(`User ${email} already exists. Fetching...`);
    } else {
      console.error(`Error creating user ${email}:`, createError);
      return;
    }
  }

  // Fetch the user ID
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers();
  if (usersError) {
    console.error("Error listing users:", usersError);
    return;
  }

  const userId = usersData.users.find((u) => u.email === email)?.id;

  if (userId) {
    // Update role in profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", userId);

    if (profileError) {
      console.error(`Error updating role for ${email}:`, profileError);
    } else {
      console.log(`Successfully created/promoted Admin: ${email} (Password: password123)`);
    }
  }
}

async function main() {
  console.log("Creating admin accounts...");
  await createAdmin("admin@karyysfood.com", "Karyy Admin");
  await createAdmin("kelvyn@karyysfood.com", "Kelvyn Admin"); // User's account
  console.log("Done.");
}

main();
