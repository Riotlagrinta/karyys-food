"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useDebounce } from "@/hooks/use-debounce";
import { MenuCard, MenuItem } from "@/components/ui/MenuCard";
import { MenuModal } from "@/components/ui/MenuModal";
import { Search } from "lucide-react";
import { ChefSuggestions } from "@/components/ai/ChefSuggestions";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface MenuClientProps {
  initialCategories: Category[];
  initialItems: MenuItem[];
}

export default function MenuClient({ initialCategories, initialItems }: MenuClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const filteredItems = useMemo(() => {
    return initialItems.filter((item) => {
      // Filtrage par catégorie
      if (selectedCategory !== "ALL" && item.category_id !== selectedCategory) {
        return false;
      }
      
      // Filtrage par recherche (nom ou description)
      if (debouncedSearch) {
        const lowerSearch = debouncedSearch.toLowerCase();
        return (
          item.name.toLowerCase().includes(lowerSearch) ||
          (item.description && item.description.toLowerCase().includes(lowerSearch))
        );
      }
      
      return true;
    });
  }, [initialItems, selectedCategory, debouncedSearch]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border border-brand-light/10 shadow-sm">
        {/* Barre de recherche optimisée */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            type="text"
            placeholder="Rechercher un plat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        {/* Filtres par catégories */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
          <Button
            variant={selectedCategory === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("ALL")}
            className="rounded-full"
          >
            Tous
          </Button>
          {initialCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="rounded-full"
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Bandeau Suggestions IA */}
      {(selectedCategory === "ALL" && !debouncedSearch) && (
        <ChefSuggestions menuItems={initialItems} onOpenModal={(item) => setSelectedItem(item)} />
      )}

      {/* Grille des plats */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuCard 
              key={item.id} 
              item={item} 
              onOpenModal={(item) => setSelectedItem(item)} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">Aucun plat ne correspond à votre recherche.</p>
        </div>
      )}

      {/* Modale d'ajout au panier */}
      {selectedItem && (
        <MenuModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}
    </div>
  );
}
