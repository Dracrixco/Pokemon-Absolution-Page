import React from "react";
import { cn } from "@/lib/utils";
import type { TileData } from "@/lib/map";
import { PokemonImage } from "./pokemon-image";

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

  const totalEncounters = tile.encounters.reduce(
    (sum, encounter) => sum + encounter.pokes.length,
    0
  );

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
                getMapColorClass(tile.color)
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
          <span>🎯 {totalEncounters} Pokémon species</span>
        </div>
      </div>

      {/* Encounters Section */}
      {tile.encounters.length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span>🔍</span>
            Pokémon Encounters
          </h3>

          {tile.encounters.map((encounter, index) => (
            <EncounterTypeSection
              key={index}
              type={encounter.type}
              pokes={encounter.pokes}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-xl">🏙️</span>
          </div>
          <p className="text-white/70">
            No wild Pokémon encounters in this area
          </p>
          <p className="text-sm text-white/50 mt-1">
            This might be a city or indoor location
          </p>
        </div>
      )}
    </div>
  );
};

interface EncounterTypeSectionProps {
  type: string;
  pokes: string[];
}

const EncounterTypeSection: React.FC<EncounterTypeSectionProps> = ({
  type,
  pokes,
}) => {
  const getEncounterIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "land":
      case "grass":
        return "🌱";
      case "water":
      case "surf":
        return "🌊";
      case "fishing":
      case "fish":
        return "🎣";
      case "tree":
      case "headbutt":
        return "🌳";
      case "raid":
        return "⚔️";
      case "cave":
      case "rock":
        return "⛰️";
      case "special":
        return "✨";
      case "gift":
        return "🎁";
      default:
        return "❓";
    }
  };

  const getEncounterColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "land":
      case "grass":
        return "bg-green-500/20 border-green-400/30";
      case "water":
      case "surf":
        return "bg-blue-500/20 border-blue-400/30";
      case "fishing":
      case "fish":
        return "bg-cyan-500/20 border-cyan-400/30";
      case "tree":
      case "headbutt":
        return "bg-amber-500/20 border-amber-400/30";
      case "raid":
        return "bg-red-500/20 border-red-400/30";
      case "cave":
      case "rock":
        return "bg-stone-500/20 border-stone-400/30";
      case "special":
        return "bg-purple-500/20 border-purple-400/30";
      case "gift":
        return "bg-pink-500/20 border-pink-400/30";
      default:
        return "bg-gray-500/20 border-gray-400/30";
    }
  };

  return (
    <div className={cn("rounded-lg border p-4", getEncounterColor(type))}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{getEncounterIcon(type)}</span>
        <h4 className="text-white font-medium capitalize">{type} Encounters</h4>
        <span className="text-sm text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
          {pokes.length} species
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {pokes.map((pokeId) => (
          <PokemonImage key={pokeId} fakemon={pokeId} />
        ))}
      </div>
    </div>
  );
};

// Helper function to get map color classes
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
