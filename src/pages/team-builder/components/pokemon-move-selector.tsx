import { moves } from "@/data/moves";
import React, { useState, useMemo } from "react";
import { X, ChevronDown } from "lucide-react";
import { getTypeColor } from "@/lib/type-colors";
import { cn } from "@/lib/utils";

interface MoveSelectorProps {
  value: string;
  onChange: (moveId: string) => void;
  availableMoves: string[];
  className?: string;
}

type CategoryFilter = "all" | "physical" | "special" | "status";
type TypeFilter = "all" | string;

const getCategoryColor = (category: string) => {
  switch (category?.toLowerCase()) {
    case "physical":
      return "bg-red-500";
    case "special":
      return "bg-blue-500";
    case "status":
      return "bg-gray-500";
    default:
      return "bg-gray-400";
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

export const MoveSelector: React.FC<MoveSelectorProps> = ({
  value,
  onChange,
  availableMoves,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const selectedMove = moves.find((move) => move.id === value);

  // Obtener tipos únicos de los movimientos disponibles
  const availableTypes = useMemo(() => {
    const types = new Set(
      moves
        .filter((move) => availableMoves.includes(move.id))
        .map((move) => move.type),
    );
    return Array.from(types).sort();
  }, [availableMoves]);

  const filteredMoves = useMemo(() => {
    return moves
      .filter((move) => availableMoves.includes(move.id))
      .filter((move) => {
        // Filtro por búsqueda
        const matchesSearch =
          move.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          move.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          move.type.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        // Filtro por categoría
        if (
          categoryFilter !== "all" &&
          move.category.toLowerCase() !== categoryFilter
        ) {
          return false;
        }

        // Filtro por tipo
        if (typeFilter !== "all" && move.type !== typeFilter) {
          return false;
        }

        return true;
      });
  }, [availableMoves, searchTerm, categoryFilter, typeFilter]);

  const handleSelect = (moveId: string) => {
    onChange(moveId);
    setIsOpen(false);
    setSearchTerm("");
    setCategoryFilter("all");
    setTypeFilter("all");
  };

  // Contar movimientos por categoría
  const getCategoryCount = (category: CategoryFilter): number => {
    if (category === "all") {
      return moves.filter((move) => availableMoves.includes(move.id)).length;
    }
    return moves.filter(
      (move) =>
        availableMoves.includes(move.id) &&
        move.category.toLowerCase() === category,
    ).length;
  };

  // Contar movimientos por tipo
  const getTypeCount = (type: TypeFilter): number => {
    if (type === "all") {
      return moves.filter((move) => availableMoves.includes(move.id)).length;
    }
    return moves.filter(
      (move) => availableMoves.includes(move.id) && move.type === type,
    ).length;
  };

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Button trigger */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full px-3 py-2 border border-gray-300",
            "rounded-lg focus:ring-2",
            "focus:ring-blue-500 bg-white text-left",
            "flex items-center justify-between",
            "hover:bg-gray-50",
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            {selectedMove ? (
              <>
                <div className="flex items-center gap-1">
                  <span className="text-lg">
                    {getCategoryIcon(selectedMove.category)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${getTypeColor(
                      selectedMove.type,
                    )}`}
                  >
                    {selectedMove.type}
                  </span>
                </div>
                <span className="truncate font-medium">
                  {selectedMove.name}
                </span>
                {selectedMove.power && (
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    {selectedMove.power}
                  </span>
                )}
              </>
            ) : (
              <span className="text-gray-500">Select move</span>
            )}
          </div>
          <ChevronDown
            size={16}
            className={`flex-shrink-0 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

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
                <h3 className="text-lg font-semibold">Select Move</h3>
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
                placeholder="Search move..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                autoFocus
              />

              {/* Filtros por categoría */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-600 uppercase">
                  Category
                </div>
                <div className="flex flex-wrap gap-2">
                  {(
                    ["all", "physical", "special", "status"] as CategoryFilter[]
                  ).map((category) => {
                    const count = getCategoryCount(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setCategoryFilter(category)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1",
                          categoryFilter === category
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                        )}
                      >
                        <span>
                          {category === "physical"
                            ? "💥"
                            : category === "special"
                              ? "✨"
                              : category === "status"
                                ? "🔧"
                                : "🎯"}
                        </span>
                        <span>
                          {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filtros por tipo */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-600 uppercase">
                  Type
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTypeFilter("all")}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                      typeFilter === "all"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    )}
                  >
                    All Types ({getTypeCount("all")})
                  </button>
                  {availableTypes.map((type) => {
                    const count = getTypeCount(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setTypeFilter(type)}
                        className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium transition-colors text-white",
                          typeFilter === type
                            ? "ring-2 ring-blue-500 ring-offset-2"
                            : "",
                          getTypeColor(type),
                        )}
                      >
                        {type} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Moves list */}
            <div className="overflow-y-auto h-[calc(100%-340px)]">
              {/* Sin movimiento option */}
              <button
                type="button"
                onClick={() => handleSelect("")}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center gap-2 border-b"
              >
                <div className="w-8 h-8 flex-shrink-0 bg-gray-200 rounded flex items-center justify-center">
                  <X size={12} className="text-gray-500" />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-600">No move</div>
                  <div className="text-xs text-gray-400">Empty slot</div>
                </div>
              </button>

              {filteredMoves.map((move) => (
                <MoveButton
                  key={move.id}
                  move={move}
                  handleSelect={handleSelect}
                />
              ))}

              {filteredMoves.length === 0 && searchTerm && (
                <div className="px-3 py-4 text-center text-gray-500 text-sm">
                  No moves found matching "{searchTerm}"
                </div>
              )}
            </div>

            {/* Overlay to close dropdown */}
            {isOpen && selectedMove && (
              <MoveButton
                key={selectedMove.id}
                move={selectedMove}
                handleSelect={handleSelect}
              />
            )}
          </div>
        )}
      </div>
    </>
  );
};

const MoveButton = ({
  move,
  handleSelect,
}: {
  move: (typeof moves)[number];
  handleSelect: (moveId: string) => void;
}) => {
  return (
    <button
      key={move.id}
      type="button"
      onClick={() => handleSelect(move.id)}
      className="w-full px-3 py-3 text-left hover:bg-gray-100 flex items-start gap-3 border-b last:border-b-0"
    >
      {/* Move Icon and Type */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0">
        <span className="text-lg">{getCategoryIcon(move.category)}</span>
        <span
          className={`px-2 py-1 rounded text-white text-xs ${getTypeColor(
            move.type,
          )}`}
        >
          {move.type}
        </span>
      </div>

      {/* Move Details */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <div className="font-medium text-sm">{move.name}</div>
          <span
            className={`px-2 py-1 rounded text-white text-xs ${getCategoryColor(
              move.category,
            )}`}
          >
            {move.category}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-gray-600 mb-1">
          <span>Power: {move.power || "—"}</span>
          <span>Accuracy: {move.accuracy || "—"}</span>
          <span>PP: {move.totalPP}</span>
        </div>

        {/* Description */}
        {move.description && (
          <div className="text-xs text-gray-600 line-clamp-2">
            {move.description}
          </div>
        )}

        {/* Target */}
        {move.target && (
          <div className="text-xs text-gray-400 mt-1">
            Target: {move.target}
          </div>
        )}
      </div>
    </button>
  );
};
