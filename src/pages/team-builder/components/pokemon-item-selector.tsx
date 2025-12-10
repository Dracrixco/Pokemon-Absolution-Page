import { getAllItems } from "@/lib/items";
import React, { useState, useMemo } from "react";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Item } from "@/types/item";

const items = getAllItems();

// Categorías de items basadas en flags
const ITEM_CATEGORIES = {
  all: "All Items",
  berry: "Berries",
  medicine: "Medicine",
  battleItem: "Battle Items",
  holdable: "Holdable",
  keyItem: "Key Items",
  tm: "TMs",
  mail: "Mail",
  ball: "Poké Balls",
} as const;

type CategoryKey = keyof typeof ITEM_CATEGORIES;

export const ItemSelector: React.FC<{
  value: string;
  onChange: (itemId: string) => void;
  className?: string;
}> = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");

  const selectedItem = items.find((item) => item.id === value);

  // Función para determinar la categoría de un item basándose en sus flags
  const getItemCategory = (item: Item): CategoryKey[] => {
    const categories: CategoryKey[] = [];
    const flags = item.flags.toLowerCase();

    if (flags.includes("berry")) categories.push("berry");
    if (flags.includes("medicine") || flags.includes("heal"))
      categories.push("medicine");
    if (flags.includes("battleitem")) categories.push("battleItem");
    if (
      flags.includes("holdable") ||
      flags.includes("typeenhancing") ||
      flags.includes("typeprotection")
    )
      categories.push("holdable");
    if (flags.includes("keyitem")) categories.push("keyItem");
    if (flags.includes("tm") || flags.includes("hm")) categories.push("tm");
    if (flags.includes("mail")) categories.push("mail");
    if (flags.includes("ball")) categories.push("ball");

    return categories;
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Respeta el filtro de pocket y flags específicos
      // if (item.pocket !== 1) return false;
      if (item.flags.includes("Repel")) return false;
      if (item.flags.includes("EvolutionStone")) return false;

      // Filtro por búsqueda
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Filtro por categoría
      if (selectedCategory === "all") return true;

      const itemCategories = getItemCategory(item);
      return itemCategories.includes(selectedCategory);
    });
  }, [searchTerm, selectedCategory]);

  const handleSelect = (itemId: string) => {
    onChange(itemId);
    setIsOpen(false);
    setSearchTerm("");
    setSelectedCategory("all");
  };

  // Contar items por categoría
  const getCategoryCount = (category: CategoryKey): number => {
    if (category === "all") {
      return items.filter(
        (item) =>
          // item.pocket === 1 &&
          !item.flags.includes("Repel") &&
          !item.flags.includes("EvolutionStone"),
      ).length;
    }

    return items.filter((item) => {
      // if (item.pocket !== 1) return false;
      if (item.flags.includes("Repel")) return false;
      if (item.flags.includes("EvolutionStone")) return false;

      const itemCategories = getItemCategory(item);
      return itemCategories.includes(category);
    }).length;
  };

  return (
    <div className={`relative ${className}`}>
      {/* Button trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between hover:bg-gray-50"
      >
        <div className="flex items-center gap-2 min-w-0">
          {selectedItem ? (
            <>
              <img
                src={selectedItem.sprite || "/items/default.png"}
                alt={selectedItem.name}
                className="w-6 h-6 flex-shrink-0"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjgiIGZpbGw9IiNEMUQ1REIiLz4KPHRleHQgeD0iMTIiIHk9IjE2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPj88L3RleHQ+Cjwvc3ZnPg==";
                }}
              />
              <span className="truncate">{selectedItem.name}</span>
            </>
          ) : (
            <span className="text-gray-500">No item</span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "fixed z-20 mt-1 bg-white",
            "border border-gray-300",
            "rounded-lg shadow-lg overflow-hidden",
            "top-0 left-0 right-0 bottom-0",
            "w-screen h-screen",
          )}
        >
          {/* Header con búsqueda y filtros */}
          <div className="p-4 border-b space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Select Item</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Search item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              autoFocus
            />

            {/* Filtros por categoría */}
            <div className="flex flex-wrap gap-2">
              {(Object.keys(ITEM_CATEGORIES) as CategoryKey[]).map(
                (category) => {
                  const count = getCategoryCount(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                        selectedCategory === category
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                      )}
                    >
                      {ITEM_CATEGORIES[category]} ({count})
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* Items list */}
          <div className="overflow-y-auto h-[calc(100%-200px)]">
            {/* Sin objeto option */}
            <button
              type="button"
              onClick={() => handleSelect("")}
              className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2 border-b"
            >
              <div className="w-6 h-6 flex-shrink-0 bg-gray-200 rounded flex items-center justify-center">
                <X size={12} className="text-gray-500" />
              </div>
              <div className="min-w-0">
                <div className="font-medium text-gray-600">No item</div>
                <div className="text-xs text-gray-400">
                  Don't equip any item
                </div>
              </div>
            </button>

            {filteredItems.map((item) => (
              <ItemButton
                key={item.id}
                item={item}
                handleSelect={handleSelect}
              />
            ))}

            {filteredItems.length === 0 && searchTerm && (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                No items found matching "{searchTerm}"
              </div>
            )}
          </div>

          {/* Overlay to close dropdown */}
          {isOpen && selectedItem && (
            <ItemButton
              key={selectedItem.id}
              item={selectedItem}
              handleSelect={handleSelect}
            />
          )}
        </div>
      )}
    </div>
  );
};

const ItemButton = ({
  item,
  handleSelect,
}: {
  item: Item;
  handleSelect: (itemId: string) => void;
}) => {
  return (
    <button
      key={item.id}
      type="button"
      onClick={() => handleSelect(item.id)}
      className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-start gap-2 border-b last:border-b-0"
    >
      <img
        src={item.sprite || "/items/default.png"}
        alt={item.name}
        className="w-6 h-6 flex-shrink-0 mt-0.5"
        onError={(e) => {
          e.currentTarget.src =
            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjgiIGZpbGw9IiNEMUQ1REIiLz4KPHRleHQgeD0iMTIiIHk9IjE2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPj88L3RleHQ+Cjwvc3ZnPg==";
        }}
      />
      <div className="min-w-0 flex-1">
        <div className="font-medium text-sm">{item.name}</div>
        {item.description && (
          <div className="text-xs text-gray-600 line-clamp-2">
            {item.description}
          </div>
        )}
        <div className="text-xs text-gray-400 mt-0.5">Flags: {item.flags}</div>
      </div>
    </button>
  );
};

export default ItemButton;
