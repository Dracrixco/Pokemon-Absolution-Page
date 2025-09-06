import { moves } from "@/data/moves";
import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { getTypeColor } from "@/lib/type-colors";

interface MoveSelectorProps {
  value: string;
  onChange: (moveId: string) => void;
  availableMoves: string[];
  className?: string;
}

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

  const selectedMove = moves.find((move) => move.id === value);

  const filteredMoves = moves
    .filter((move) => availableMoves.includes(move.id))
    .filter(
      (move) =>
        move.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        move.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        move.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSelect = (moveId: string) => {
    onChange(moveId);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={`relative ${className}`}>
      {/* Button trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-left flex items-center justify-between hover:bg-gray-50 min-h-[42px]"
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
                    selectedMove.type
                  )}`}
                >
                  {selectedMove.type}
                </span>
              </div>
              <span className="truncate font-medium">{selectedMove.name}</span>
              {selectedMove.power && (
                <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {selectedMove.power}
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-500">Seleccionar movimiento</span>
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
        <div className="absolute top-full left-0 right-0 z-20 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
          {/* Search input */}
          <div className="p-2 border-b">
            <input
              type="text"
              placeholder="Buscar movimiento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>

          {/* Moves list */}
          <div className="overflow-y-auto max-h-64">
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
                <div className="font-medium text-gray-600">Sin movimiento</div>
                <div className="text-xs text-gray-400">Slot vacío</div>
              </div>
            </button>

            {filteredMoves.map((move) => (
              <button
                key={move.id}
                type="button"
                onClick={() => handleSelect(move.id)}
                className="w-full px-3 py-3 text-left hover:bg-gray-100 flex items-start gap-3 border-b last:border-b-0"
              >
                {/* Move Icon and Type */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <span className="text-lg">
                    {getCategoryIcon(move.category)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${getTypeColor(
                      move.type
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
                        move.category
                      )}`}
                    >
                      {move.category}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-xs text-gray-600 mb-1">
                    <span>Poder: {move.power || "—"}</span>
                    <span>Precisión: {move.accuracy || "—"}</span>
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
                      Objetivo: {move.target}
                    </div>
                  )}
                </div>
              </button>
            ))}

            {filteredMoves.length === 0 && searchTerm && (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                No se encontraron movimientos que coincidan con "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};
