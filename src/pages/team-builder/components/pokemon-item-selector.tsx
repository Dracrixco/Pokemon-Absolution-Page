import { getAllItems } from "@/lib/items";
import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";

const items = getAllItems();
export const ItemSelector: React.FC<{
  value: string;
  onChange: (itemId: string) => void;
  className?: string;
}> = ({ value, onChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const selectedItem = items.find((item) => item.id === value);

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSelect = (itemId: string) => {
    onChange(itemId);
    setIsOpen(false);
    setSearchTerm("");
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
        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Search item..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Items list */}
          <div className="overflow-y-auto max-h-64">
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
                  <div className="text-xs text-gray-400 mt-0.5">
                    Flags: {item.flags}
                  </div>
                </div>
              </button>
            ))}

            {filteredItems.length === 0 && searchTerm && (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                No items found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-0" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
