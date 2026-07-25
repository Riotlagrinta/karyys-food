"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteUser, updateUserRole } from "./actions";

export default function UserRow({ user }: { user: any }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirm(`Voulez-vous vraiment supprimer le compte de "${user.full_name || 'cet utilisateur'}" ?`)) {
      setIsDeleting(true);
      const res = await deleteUser(user.id);
      setIsDeleting(false);

      if (res?.error) {
        alert(res.error);
      }
    }
  };

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as "client" | "deliverer" | "admin";
    const res = await updateUserRole(user.id, newRole);
    if (res?.error) {
      alert(res.error);
    }
  };

  return (
    <tr className={`hover:bg-muted/40 transition-colors ${isDeleting ? "opacity-50" : ""}`}>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
            {user.full_name ? user.full_name.charAt(0).toUpperCase() : "U"}
          </div>
          <div>
            <div className="font-semibold text-foreground">
              {user.full_name || "Client Inconnu"}
            </div>
            <div className="text-xs text-muted font-mono">
              {user.id.slice(0, 8)}...
            </div>
          </div>
        </div>
      </td>

      <td className="p-4">
        <select
          value={user.role || "client"}
          onChange={handleRoleChange}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-ring outline-none"
        >
          <option value="client">Client</option>
          <option value="deliverer">Livreur</option>
          <option value="admin">Admin</option>
        </select>
      </td>

      <td className="p-4 text-sm text-muted">
        {new Date(user.created_at).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </td>

      <td className="p-4 text-right">
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 text-muted hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors disabled:opacity-50"
          title="Supprimer l'utilisateur"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin text-destructive" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </td>
    </tr>
  );
}
