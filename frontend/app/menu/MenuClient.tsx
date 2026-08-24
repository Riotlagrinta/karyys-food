"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useDebounce } from "@/hooks/use-debounce";
import { MenuCard, MenuItem } from "@/components/ui/MenuCard";
import { MenuModal } from "@/components/ui/MenuModal";
import { Search, X, ArrowUpDown } from "lucide-react";
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
  const debouncedSearch = useDebounce(searchTerm, 250);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");

  const filteredItems = useMemo(() => {
    const result = initialItems.filter((item) => {
      // Filter by category
      if (selectedCategory !== "ALL" && item.category_id !== selectedCategory) {
        return false;
      }

      // Filter by search
      if (debouncedSearch) {
        const lowerSearch = debouncedSearch.toLowerCase();
        return (
          item.name.toLowerCase().includes(lowerSearch) ||
          (item.description && item.description.toLowerCase().includes(lowerSearch))
        );
      }

      return true;
    });

    if (sortBy === "price-asc") {
      return [...result].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return [...result].sort((a, b) => b.price - a.price);
    }
    return result;
  }, [initialItems, selectedCategory, debouncedSearch, sortBy]);

  return (
    <div className="space-y-8">
      {/* Search and Filters Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-card/80 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-border/80 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <Input
            type="text"
            placeholder="Rechercher une pâtisserie ou un plat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-9 bg-background/80 rounded-2xl border-border/80"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground p-1 rounded-full cursor-pointer"
              aria-label="Effacer la recherche"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort Options & Active Count */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 lg:pb-0">
          <div className="flex items-center gap-1.5 text-xs text-muted font-medium shrink-0 bg-background/60 px-3 py-2 rounded-xl border border-border/60">
            <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
            <span>Trier :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "default" | "price-asc" | "price-desc")}
              className="bg-transparent text-foreground font-semibold focus:outline-none cursor-pointer"
            >
              <option value="default">Recommandés</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>

          <span className="text-xs text-muted font-medium shrink-0 hidden sm:inline px-2">
            {filteredItems.length} {filteredItems.length <= 1 ? "délice" : "délices"}
          </span>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory("ALL")}
          className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 cursor-pointer shadow-xs ${
            selectedCategory === "ALL"
              ? "bg-gradient-to-r from-primary to-brand-brown-light text-white ring-2 ring-primary/30"
              : "bg-card/80 border border-border/80 text-muted hover:text-foreground hover:bg-muted/40"
          }`}
        >
          ✨ Tous les délices
        </button>
        {initialCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 shrink-0 cursor-pointer shadow-xs ${
              selectedCategory === category.id
                ? "bg-gradient-to-r from-brand-rose to-primary text-white ring-2 ring-brand-rose/30"
                : "bg-card/80 border border-border/80 text-muted hover:text-foreground hover:bg-muted/40"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* AI Chef Recommendations (When showing all categories) */}
      {selectedCategory === "ALL" && !debouncedSearch && (
        <ChefSuggestions
          menuItems={initialItems}
          onOpenModal={(item) => setSelectedItem(item)}
        />
      )}

      {/* Food Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onOpenModal={(itemToOpen) => setSelectedItem(itemToOpen)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 bg-card/40 rounded-3xl border border-border/60 backdrop-blur-md">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6 text-brand-rose" />
          </div>
          <p className="font-serif text-xl font-bold text-foreground">
            Aucun plat ne correspond à votre recherche
          </p>
          <p className="text-sm text-muted mt-1 max-w-sm mx-auto">
            Essayez de modifier votre mot-clé ou sélectionnez une autre catégorie pour explorer notre carte.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("ALL");
            }}
            className="rounded-full mt-4"
          >
            Réinitialiser les filtres
          </Button>
        </div>
      )}

      {/* Add To Cart Modal */}
      {selectedItem && (
        <MenuModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
