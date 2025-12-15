import React from "react";
import { cn } from "@/lib/utils";
import type { TileData } from "@/lib/map";
import { encountersData, type EncounterEntry } from "@/data/encounters";
import { getAllFakemons } from "@/lib/fakemons";
import { PokemonImage } from "./pokemon-image";
import { Link } from "react-router-dom";

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

  // Get encounters for this map
  const mapEncounters = encountersData[tile.mapIngameID] || {};
  const hasEncounters = Object.keys(mapEncounters).length > 0;

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

      {/* Encounters Section */}
      {hasEncounters ? (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Wild Encounters
          </h3>
          {Object.entries(mapEncounters).map(([encounterType, encounters]) => (
            <div key={encounterType} className="space-y-2">
              <h4 className="text-lg font-medium text-white/90">
                {encounterType}
              </h4>
              <div className="overflow-x-auto pb-2">
                <div className="flex gap-3 min-w-min">
                  {encounters.map((encounter, idx) => (
                    <EncounterCard key={idx} encounter={encounter} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-white/60">
          No encounters available for this location.
        </div>
      )}
    </div>
  );
};

interface EncounterCardProps {
  encounter: EncounterEntry;
}

const EncounterCard: React.FC<EncounterCardProps> = ({ encounter }) => {
  const pokemon = getAllFakemons().find((p) => p.id === encounter.species);

  if (!pokemon) {
    return null;
  }

  return (
    <Link
      to={`/fakemons/${pokemon.id}`}
      className="shrink-0 w-40 bg-white/5 rounded-lg p-3 border border-white/10 hover:border-white/30 transition-colors cursor-pointer"
    >
      <div className="flex flex-col items-center gap-2">
        <div className="w-20 h-20 relative">
          <PokemonImage fakemon={pokemon} size={80} />
        </div>
        <div className="text-center w-full">
          <p className="text-white font-medium text-sm truncate">
            {pokemon.name}
          </p>
          <div className="flex items-center justify-center gap-2 mt-1 text-xs text-white/70">
            <span>
              Lv. {encounter.minLevel}
              {encounter.minLevel !== encounter.maxLevel
                ? `-${encounter.maxLevel}`
                : ""}
            </span>
          </div>
          <div className="mt-1 text-xs text-white/60">
            {encounter.rate}% chance
          </div>
        </div>
      </div>
    </Link>
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
