"use client";

import type { Fakemon } from "@/types/fakemon";
import { getTypeColor } from "@/lib/type-colors";
import { Link } from "react-router-dom";
import { useState } from "react";

interface FakemonCardPokemonProps {
  fakemon: Fakemon;
}

export default function FakemonCardPokemon({
  fakemon,
}: FakemonCardPokemonProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const maxStat = Math.max(...Object.values(fakemon.stats));

  return (
    <Link to={`/fakemons/${fakemon.id}`}>
      <div
        className="relative w-full h-80 cursor-pointer perspective-1000"
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of Card - Artwork */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl border-2 border-purple-600 shadow-lg overflow-hidden h-full">
              {/* Header with name and types */}
              <div className="bg-purple-900/80 p-3 border-b border-purple-600">
                <h3 className="text-white font-bold text-lg text-center mb-2">
                  {fakemon.name}
                </h3>
                <div className="flex justify-center gap-2">
                  {fakemon.types.map((type) => (
                    <span
                      key={type}
                      className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${getTypeColor(
                        type
                      )}`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Artwork */}
              <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-purple-700/30 to-purple-800/30">
                <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-purple-400/20 to-purple-600/20 border-2 border-purple-400/30 flex items-center justify-center">
                  <img
                    src={fakemon.artwork || "/placeholder.svg"}
                    alt={`${fakemon.name} artwork`}
                    width={160}
                    height={160}
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Pokédex number */}
              <div className="bg-purple-900/60 p-2 text-center">
                <span className="text-purple-200 text-sm font-mono">
                  #{fakemon.id.padStart(3, "0")}
                </span>
              </div>
            </div>
          </div>

          {/* Back of Card - Sprite and Stats */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl border-2 border-purple-600 shadow-lg overflow-hidden h-full">
              {/* Header with name and types */}
              <div className="bg-purple-900/80 p-3 border-b border-purple-600">
                <h3 className="text-white font-bold text-lg text-center mb-2">
                  {fakemon.name}
                </h3>
                <div className="flex justify-center gap-2">
                  {fakemon.types.map((type) => (
                    <span
                      key={type}
                      className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${getTypeColor(
                        type
                      )}`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sprite and Stats */}
              <div className="p-4 space-y-3">
                {/* Sprite */}
                <div className="flex justify-center mb-4">
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-400/20 to-purple-600/20 border border-purple-400/30 flex items-center justify-center">
                    <img
                      src={fakemon.sprite || "/placeholder.svg"}
                      alt={`${fakemon.name} sprite`}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-2">
                  {Object.entries(fakemon.stats).map(
                    ([statName, statValue]) => (
                      <div key={statName} className="flex items-center gap-2">
                        <span className="text-purple-200 text-xs font-medium w-12 capitalize">
                          {statName === "spAttack"
                            ? "SpA"
                            : statName === "spDefense"
                            ? "SpD"
                            : statName.slice(0, 3)}
                        </span>
                        <div className="flex-1 bg-purple-900/50 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-400 to-purple-500 transition-all duration-500"
                            style={{ width: `${(statValue / maxStat) * 100}%` }}
                          />
                        </div>
                        <span className="text-purple-200 text-xs font-mono w-8 text-right">
                          {statValue}
                        </span>
                      </div>
                    )
                  )}
                </div>

                {/* Total Stats */}
                <div className="border-t border-purple-600 pt-2 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200 text-xs font-medium">
                      Total
                    </span>
                    <span className="text-purple-200 text-xs font-mono">
                      {Object.values(fakemon.stats).reduce(
                        (sum, stat) => sum + stat,
                        0
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hover indicator */}
        <div className="absolute bottom-2 right-2 bg-purple-600/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
      </div>
    </Link>
  );
}
