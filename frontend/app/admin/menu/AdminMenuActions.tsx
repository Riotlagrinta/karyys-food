"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddMenuItemModal from "./AddMenuItemModal";

export default function AdminMenuActions({ categories }: { categories: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Ajouter un plat
      </button>

      <AddMenuItemModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        categories={categories} 
      />
    </>
  );
}
