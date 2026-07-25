import { createAdminClient } from "@/lib/supabase/admin";
import UserRow from "./UserRow";

export const revalidate = 0;

export default async function AdminUsers() {
  const supabase = createAdminClient();

  const { data: users, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-serif text-foreground">
            Gestion des Utilisateurs
          </h1>
          <p className="text-muted text-sm mt-1">
            Gérez les rôles (Clients, Livreurs, Admins) et modérez les comptes inscrits
          </p>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-xs border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 text-muted text-sm font-semibold border-b border-border">
                <th className="p-4 font-semibold">Utilisateur</th>
                <th className="p-4 font-semibold">Rôle</th>
                <th className="p-4 font-semibold">Date d'inscription</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-foreground">
              {users?.map((user) => (
                <UserRow key={user.id} user={user} />
              ))}

              {!users?.length && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
