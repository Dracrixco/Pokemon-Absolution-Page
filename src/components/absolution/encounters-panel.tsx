import React from "react";
import { cn } from "@/lib/utils";
import type { TileData } from "@/lib/map";

interface EncountersPanelProps {
  tile: TileData | null;
}

export const EncountersPanel: React.FC<EncountersPanelProps> = ({ tile }) => {
  if (!tile) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🗺️</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Select a Location
          </h3>
          <p className="text-white/70">
            Click on any highlighted area of the map to view detailed
            information and Pokémon encounters.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      {/* Map Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-white">{tile.mapName}</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">
              ID: {tile.mapIngameID}
            </span>
            <div
              className={cn(
                "w-4 h-4 rounded-full border-2 border-white/50",
                getMapColorClass(tile.color),
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-white/70">
          <span>
            📍 Position: ({tile.x}, {tile.y})
          </span>
          <span>
            📏 Size: {tile.mapWidth}×{tile.mapHeight}
          </span>
        </div>
      </div>
    </div>
  );
};

function getMapColorClass(color?: string): string {
  switch (color) {
    case "purple":
      return "bg-purple-400";
    case "yellow":
      return "bg-yellow-400";
    case "green":
      return "bg-green-400";
    case "orange":
      return "bg-orange-400";
    case "blue":
      return "bg-blue-400";
    case "pink":
      return "bg-pink-400";
    case "red":
      return "bg-red-400";
    case "teal":
      return "bg-teal-400";
    case "cyan":
      return "bg-cyan-400";
    case "indigo":
      return "bg-indigo-400";
    case "emerald":
      return "bg-emerald-400";
    case "lime":
      return "bg-lime-400";
    case "violet":
      return "bg-violet-400";
    case "stone":
      return "bg-stone-400";
    case "amber":
      return "bg-amber-400";
    case "sky":
      return "bg-sky-400";
    case "slate":
      return "bg-slate-400";
    default:
      return "bg-gray-400";
  }
}
