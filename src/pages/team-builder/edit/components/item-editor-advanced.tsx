import React, { useState, useMemo } from "react";
import { Search, Filter, Package, X } from "lucide-react";
import { getAllItems } from "@/lib/items";
const items = getAllItems();

interface ItemEditorAdvancedProps {
  value: string;
  onChange: (item: string) => void;
  selectedDifficulty: string;
}

export const ItemEditorAdvanced: React.FC<ItemEditorAdvancedProps> = ({
  value,
  onChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === value),
    [value]
  );

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (searchTerm) {
          return (
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return true;
      })
      .filter((item) => {
        if (!categoryFilter) return true;
        return item.flags?.toLowerCase().includes(categoryFilter.toLowerCase());
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [searchTerm, categoryFilter]);

  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    items.forEach((item) => {
      if (item.flags) {
        item.flags.split(",").forEach((flag) => {
          categories.add(flag.trim());
        });
      }
    });
    return Array.from(categories).sort();
  }, []);

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
  };

  return (
    <div className="space-y-4">
      {/* Selected Item */}
      <div>
        <h3 className="font-medium mb-3 text-gray-700">Selected Item</h3>
        <div
          className={`p-4 rounded-lg border-2 min-h-[100px] transition-all ${
            selectedItem
              ? "bg-purple-50 border-purple-200"
              : "bg-gray-50 border-dashed border-gray-300"
          }`}
        >
          {selectedItem ? (
            <div className="flex items-start gap-3">
              <img
                src={selectedItem.sprite || "/items/default.png"}
                alt={selectedItem.name}
                className="w-12 h-12 flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjI0IiBjeT0iMjQiIHI9IjE2IiBmaWxsPSIjRDFENURCIi8+Cjx0ZXh0IHg9IjI0IiB5PSIzMiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIwIiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4/PC90ZXh0Pgo8L3N2Zz4=";
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-lg">{selectedItem.name}</h4>
                  <button
                    onClick={() => onChange("")}
                    className="text-red-500 hover:text-red-700 flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
                {selectedItem.description && (
                  <p className="text-sm text-gray-700 mb-2">
                    {selectedItem.description}
                  </p>
                )}
                {selectedItem.flags && (
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.flags.split(",").map((flag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
                      >
                        {flag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Package className="mx-auto mb-2 opacity-50" size={24} />
                <span className="text-sm">No item equipped</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Filter size={16} />
            Filter by Category
            {categoryFilter && (
              <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </button>

          {(categoryFilter || searchTerm) && (
            <button
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {availableCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Available Items */}
      <div>
        <h3 className="font-medium mb-3 text-gray-700">
          Available Items ({filteredItems.length})
          {!value && (
            <button
              onClick={() => onChange("")}
              className="ml-3 text-sm text-gray-500 hover:text-gray-700"
            >
              (Remove current item)
            </button>
          )}
        </h3>

        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
          {/* No Item Option */}
          <button
            onClick={() => onChange("")}
            className={`w-full p-3 text-left border-b border-gray-200 transition-colors ${
              !value
                ? "bg-purple-50 border-l-4 border-purple-500"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 flex-shrink-0 bg-gray-200 rounded flex items-center justify-center">
                <X size={16} className="text-gray-500" />
              </div>
              <div>
                <div className="font-medium text-gray-700">No Item</div>
                <div className="text-sm text-gray-500">
                  Don't equip any item
                </div>
              </div>
            </div>
          </button>

          {/* Items List */}
          <div className="divide-y divide-gray-200">
            {filteredItems.map((item) => {
              const isSelected = value === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onChange(item.id)}
                  className={`w-full p-3 text-left transition-colors ${
                    isSelected
                      ? "bg-purple-50 border-l-4 border-purple-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={item.sprite || "/items/default.png"}
                      alt={item.name}
                      className="w-8 h-8 flex-shrink-0"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjE2IiBjeT0iMTYiIHI9IjEwIiBmaWxsPSIjRDFENURCIi8+Cjx0ZXh0IHg9IjE2IiB5PSIyMiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4/PC90ZXh0Pgo8L3N2Zz4=";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 mb-1">
                        {item.name}
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      {item.flags && (
                        <div className="flex flex-wrap gap-1">
                          {item.flags
                            .split(",")
                            .slice(0, 3)
                            .map((flag, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {flag.trim()}
                              </span>
                            ))}
                          {item.flags.split(",").length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                              +{item.flags.split(",").length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Package className="mx-auto mb-3 text-gray-300" size={48} />
            <p className="text-lg mb-2">No items found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
