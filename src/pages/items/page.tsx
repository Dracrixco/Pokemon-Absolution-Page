import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Package,
  DollarSign,
  Grid3X3,
  List,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getAllItems } from "@/lib/items";

const items = getAllItems();

const POCKET_NAMES = {
  1: "Items",
  2: "Medicine",
  3: "Poké Balls",
  4: "TMs & HMs",
  5: "Berries",
  6: "Mail",
  7: "Battle Items",
  8: "Key Items",
} as const;

const PRICE_RANGES = [
  { label: "Free", min: 0, max: 0 },
  { label: "Under $500", min: 1, max: 499 },
  { label: "$500 - $1,000", min: 500, max: 1000 },
  { label: "$1,000 - $5,000", min: 1001, max: 5000 },
  { label: "Over $5,000", min: 5001, max: Infinity },
] as const;

export const ItemsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPocket, setSelectedPocket] = useState<number | "all">("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [selectedFlags, setSelectedFlags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"name" | "price" | "pocket">("name");

  // Get unique flags from all items
  const availableFlags = useMemo(() => {
    const flagsSet = new Set<string>();
    items.forEach((item) => {
      if (item.flags) {
        item.flags.split(",").forEach((flag) => {
          flagsSet.add(flag.trim());
        });
      }
    });
    return Array.from(flagsSet).sort();
  }, []);

  // Get unique pockets
  const availablePockets = useMemo(() => {
    const pocketsSet = new Set<number>();
    items.forEach((item) => pocketsSet.add(item.pocket));
    return Array.from(pocketsSet).sort((a, b) => a - b);
  }, []);

  const filteredItems = useMemo(() => {
    const filtered = items.filter((item) => {
      // Search filter
      if (
        searchTerm &&
        !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.description?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.id.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Pocket filter
      if (selectedPocket !== "all" && item.pocket !== selectedPocket) {
        return false;
      }

      // Price range filter
      if (selectedPriceRange !== "all") {
        const range = PRICE_RANGES.find((r) => r.label === selectedPriceRange);
        if (range && (item.price < range.min || item.price > range.max)) {
          return false;
        }
      }

      // Flags filter
      if (selectedFlags.length > 0) {
        const itemFlags = item.flags
          ? item.flags.split(",").map((f) => f.trim())
          : [];
        if (!selectedFlags.some((flag) => itemFlags.includes(flag))) {
          return false;
        }
      }

      return true;
    });

    // Sort items
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return b.price - a.price; // Descending by default
        case "pocket":
          return a.pocket - b.pocket || a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedPocket, selectedPriceRange, selectedFlags, sortBy]);

  const toggleFlag = (flag: string) => {
    setSelectedFlags((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedPocket("all");
    setSelectedPriceRange("all");
    setSelectedFlags([]);
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    return `$${price.toLocaleString()}`;
  };

  const getPocketColor = (pocket: number) => {
    const colors = {
      1: "bg-gray-500",
      2: "bg-red-500",
      3: "bg-blue-500",
      4: "bg-yellow-500",
      5: "bg-green-500",
      6: "bg-purple-500",
      7: "bg-orange-500",
      8: "bg-pink-500",
    };
    return colors[pocket as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Items Database
          </h1>
          <p className="text-lg text-gray-600">
            Explore all {items.length} items available in Pokémon Absolution
          </p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search items by name, description, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
              />
            </div>

            {/* Controls Row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Filter Toggle & Sort */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    showFilters
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <Filter size={20} />
                  Filters
                  {(selectedPocket !== "all" ||
                    selectedPriceRange !== "all" ||
                    selectedFlags.length > 0) && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {[
                        selectedPocket !== "all" ? 1 : 0,
                        selectedPriceRange !== "all" ? 1 : 0,
                        selectedFlags.length,
                      ].reduce((a, b) => a + b, 0)}
                    </span>
                  )}
                </button>

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "name" | "price" | "pocket")
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="pocket">Sort by Category</option>
                </select>
              </div>

              {/* View Mode & Results */}
              <div className="flex items-center gap-4">
                <span className="text-gray-600">
                  {filteredItems.length} of {items.length} items
                </span>

                <div className="flex rounded-lg border border-gray-300">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Grid3X3 size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-blue-500 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Pocket Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedPocket}
                      onChange={(e) =>
                        setSelectedPocket(
                          e.target.value === "all"
                            ? "all"
                            : parseInt(e.target.value)
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Categories</option>
                      {availablePockets.map((pocket) => (
                        <option key={pocket} value={pocket}>
                          {POCKET_NAMES[pocket as keyof typeof POCKET_NAMES] ||
                            `Category ${pocket}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <select
                      value={selectedPriceRange}
                      onChange={(e) => setSelectedPriceRange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Prices</option>
                      {PRICE_RANGES.map((range) => (
                        <option key={range.label} value={range.label}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Clear Filters */}
                  <div className="flex items-end">
                    <button
                      onClick={clearFilters}
                      className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>

                {/* Flags Filter */}
                {availableFlags.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Properties ({selectedFlags.length} selected)
                    </label>
                    <div className="max-h-32 overflow-y-auto">
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                        {availableFlags.map((flag) => (
                          <button
                            key={flag}
                            onClick={() => toggleFlag(flag)}
                            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                              selectedFlags.includes(flag)
                                ? "bg-blue-500 text-white"
                                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                            }`}
                          >
                            {flag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Items Display */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto mb-4 text-gray-300" size={64} />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No items found
              </h3>
              <p className="text-gray-500 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {filteredItems.map((item) => (
                    <Link
                      key={item.id}
                      to={`/items/${item.id}`}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all hover:shadow-md group"
                    >
                      <div className="text-center">
                        <div className="mb-3">
                          <img
                            src={item.sprite || "/items/default.png"}
                            alt={item.name}
                            className="w-16 h-16 mx-auto object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src =
                                "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjMyIiBjeT0iMzIiIHI9IjIwIiBmaWxsPSIjRDFENURCIi8+Cjx0ZXh0IHg9IjMyIiB5PSI0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjI0IiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4/PC90ZXh0Pgo8L3N2Zz4=";
                            }}
                          />
                        </div>

                        <h3 className="font-bold text-sm group-hover:text-blue-600 transition-colors mb-1">
                          {item.name}
                        </h3>

                        <div className="flex items-center justify-center gap-1 mb-2">
                          <span
                            className={`px-2 py-1 rounded text-white text-xs ${getPocketColor(
                              item.pocket
                            )}`}
                          >
                            {POCKET_NAMES[
                              item.pocket as keyof typeof POCKET_NAMES
                            ] || `Cat. ${item.pocket}`}
                          </span>
                        </div>

                        <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                          <DollarSign size={14} />
                          <span>{formatPrice(item.price)}</span>
                        </div>

                        {item.description && (
                          <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <Link
                      key={item.id}
                      to={`/items/${item.id}`}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all hover:shadow-md group"
                    >
                      <img
                        src={item.sprite || "/items/default.png"}
                        alt={item.name}
                        className="w-12 h-12 object-contain flex-shrink-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjRjNGNEY2Ii8+CjxjaXJjbGUgY3g9IjI0IiBjeT0iMjQiIHI9IjE2IiBmaWxsPSIjRDFENURCIi8+Cjx0ZXh0IHg9IjI0IiB5PSIzMiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNkI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj4/PC90ZXh0Pgo8L3N2Zz4=";
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-lg group-hover:text-blue-600 transition-colors">
                            {item.name}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span
                              className={`px-3 py-1 rounded text-white text-sm ${getPocketColor(
                                item.pocket
                              )}`}
                            >
                              {POCKET_NAMES[
                                item.pocket as keyof typeof POCKET_NAMES
                              ] || `Category ${item.pocket}`}
                            </span>
                            <div className="flex items-center gap-1 text-sm font-semibold text-gray-700">
                              <DollarSign size={16} />
                              {formatPrice(item.price)}
                            </div>
                          </div>
                        </div>

                        {item.description && (
                          <p className="text-gray-600 mb-2">
                            {item.description}
                          </p>
                        )}

                        {item.flags && (
                          <div className="flex flex-wrap gap-1">
                            {item.flags.split(",").map((flag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                              >
                                {flag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
