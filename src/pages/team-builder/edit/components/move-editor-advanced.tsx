import React, { useState, useMemo } from "react";
import { Search, Filter, Star, X, Zap, Target } from "lucide-react";
import { moves } from "@/data/moves";
import { getTypeColor } from "@/lib/type-colors";
import { levelUpMoveIds } from "@/lib/level-up-moves";
import type { Fakemon } from "@/types/fakemon";

interface MoveEditorAdvancedProps {
  pokemon: Fakemon;
  value: string[];
  onChange: (moves: string[]) => void;
  selectedDifficulty: string;
}

const getCategoryColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case "physical":
      return "bg-red-500 text-white";
    case "special":
      return "bg-blue-500 text-white";
    case "status":
      return "bg-gray-500 text-white";
    default:
      return "bg-gray-400 text-white";
  }
};

const getCategoryIcon = (category: string) => {
  switch (category?.toLowerCase()) {
    case "physical":
      return "💥";
    case "special":
      return "✨";
    case "status":
      return "🔧";
    default:
      return "❓";
  }
};

export const MoveEditorAdvanced: React.FC<MoveEditorAdvancedProps> = ({
  pokemon,
  value,
  onChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [powerRange, setPowerRange] = useState<[number, number]>([0, 200]);
  const [showFilters, setShowFilters] = useState(false);

  const availableMoves = useMemo(() => {
    const levelUpIds = new Set(levelUpMoveIds(pokemon.moves));
    return moves
      .filter((move) => levelUpIds.has(move.id))
      .filter((move) => {
        if (searchTerm) {
          return (
            move.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            move.description
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            move.type.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return true;
      })
      .filter((move) => !typeFilter || move.type === typeFilter)
      .filter((move) => !categoryFilter || move.category === categoryFilter)
      .filter((move) => {
        if (!move.power) return powerRange[0] === 0;
        const power = parseInt(move.power.toString());
        return power >= powerRange[0] && power <= powerRange[1];
      })
      .sort((a, b) => {
        // Prioritize selected moves
        const aSelected = value.includes(a.id);
        const bSelected = value.includes(b.id);
        if (aSelected && !bSelected) return -1;
        if (!aSelected && bSelected) return 1;
        return a.name.localeCompare(b.name);
      });
  }, [
    pokemon.moves,
    searchTerm,
    typeFilter,
    categoryFilter,
    powerRange,
    value,
  ]);

  const availableTypes = useMemo(() => {
    return Array.from(new Set(availableMoves.map((m) => m.type))).sort();
  }, [availableMoves]);

  const handleMoveToggle = (moveId: string) => {
    const newMoves = [...value];
    const index = newMoves.indexOf(moveId);

    if (index >= 0) {
      // Remove move
      newMoves[index] = "";
    } else {
      // Add move to first empty slot
      const emptyIndex = newMoves.findIndex((m) => !m);
      if (emptyIndex >= 0) {
        newMoves[emptyIndex] = moveId;
      }
    }

    onChange(newMoves);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setCategoryFilter("");
    setPowerRange([0, 200]);
  };

  return (
    <div className="space-y-4">
      {/* Selected Moves */}
      <div>
        <h3 className="font-medium mb-3 text-gray-700">
          Selected Moves ({value.filter(Boolean).length}/4)
        </h3>
        <div className="grid grid-cols-1 gap-3 mb-6">
          {value.map((moveId, index) => {
            const move = moves.find((m) => m.id === moveId);
            return (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 min-h-[70px] transition-all ${
                  move
                    ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                    : "bg-gray-50 border-dashed border-gray-300"
                }`}
              >
                {move ? (
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">
                          {getCategoryIcon(move.category)}
                        </span>
                        <span className="font-medium">{move.name}</span>
                        <button
                          onClick={() => handleMoveToggle(moveId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${getTypeColor(
                            move.type,
                          )}`}
                        >
                          {move.type}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(
                            move.category,
                          )}`}
                        >
                          {move.category}
                        </span>
                        {move.power && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                            Power: {move.power}
                          </span>
                        )}
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Acc: {move.accuracy || "—"}
                        </span>
                      </div>
                      {move.description && (
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {move.description}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Target className="mx-auto mb-1 opacity-50" size={20} />
                      <span className="text-sm">Move Slot {index + 1}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search moves..."
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
            Advanced Filters
            {(typeFilter ||
              categoryFilter ||
              powerRange[0] > 0 ||
              powerRange[1] < 200) && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                Active
              </span>
            )}
          </button>

          {(typeFilter ||
            categoryFilter ||
            powerRange[0] > 0 ||
            powerRange[1] < 200 ||
            searchTerm) && (
            <button
              onClick={clearFilters}
              className="text-gray-600 hover:text-gray-800 text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>

        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  {availableTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="Physical">Physical</option>
                  <option value="Special">Special</option>
                  <option value="Status">Status</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Power Range: {powerRange[0]} - {powerRange[1]}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="10"
                  value={powerRange[0]}
                  onChange={(e) =>
                    setPowerRange([parseInt(e.target.value), powerRange[1]])
                  }
                  className="w-full"
                />
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="10"
                  value={powerRange[1]}
                  onChange={(e) =>
                    setPowerRange([powerRange[0], parseInt(e.target.value)])
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Available Moves */}
      <div>
        <h3 className="font-medium mb-3 text-gray-700">
          Available Moves ({availableMoves.length})
        </h3>
        <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
          <div className="divide-y divide-gray-200">
            {availableMoves.map((move) => {
              const isSelected = value.includes(move.id);
              const canSelect = value.filter(Boolean).length < 4;

              return (
                <button
                  key={move.id}
                  onClick={() => handleMoveToggle(move.id)}
                  disabled={!isSelected && !canSelect}
                  className={`w-full p-4 text-left transition-colors ${
                    isSelected
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : canSelect
                        ? "hover:bg-gray-50"
                        : "opacity-50 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">
                          {getCategoryIcon(move.category)}
                        </span>
                        <span className="font-medium">{move.name}</span>
                        {isSelected && (
                          <Star
                            size={14}
                            className="text-blue-500 fill-current"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${getTypeColor(
                            move.type,
                          )}`}
                        >
                          {move.type}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${getCategoryColor(
                            move.category,
                          )}`}
                        >
                          {move.category}
                        </span>
                        {move.power && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                            Power: {move.power}
                          </span>
                        )}
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                          Acc: {move.accuracy || "—"}
                        </span>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                          PP: {move.totalPP}
                        </span>
                      </div>
                      {move.description && (
                        <p className="text-sm text-gray-600 mb-1">
                          {move.description}
                        </p>
                      )}
                      {move.target && (
                        <p className="text-xs text-gray-500">
                          Target: {move.target}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {availableMoves.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Zap className="mx-auto mb-3 text-gray-300" size={48} />
            <p className="text-lg mb-2">No moves found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
