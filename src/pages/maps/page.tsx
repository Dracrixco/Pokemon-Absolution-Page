import React, { useState } from "react";

import { PixelMap } from "@/components/absolution/pixel-map";
import { EncountersPanel } from "@/components/absolution/encounters-panel";
import type { TileData } from "@/lib/map";
import MapViewer from "@/components/absolution/map-viewer";

export const NazanRegionMap: React.FC = () => {
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
            Nazan Region
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Embark on an epic journey through the vast and mysterious Nazan
            Region. Discover diverse habitats, encounter unique Pokémon, and
            uncover the secrets that await in every corner of this extraordinary
            world.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="space-y-4">
            <PixelMap
              width={38}
              height={26}
              onSelect={setSelectedTile}
              backgroundSrc={"/others/mapRegion0.png"}
            />
            {/* Map Image */}
            {selectedTile && (
              <div className="mb-6">
                <MapViewer tile={selectedTile} />
              </div>
            )}
          </div>

          {/* Information Panel */}
          <div className="space-y-6">
            <EncountersPanel tile={selectedTile} />

            {/* Additional Info */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>💡</span>
                Explorer Tips
              </h3>
              <div className="space-y-3 text-sm text-white/80">
                <div className="flex items-start gap-3">
                  <span className="text-yellow-400">🌟</span>
                  <span>
                    Different areas have unique encounter types - look for
                    special icons!
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-blue-400">🎣</span>
                  <span>
                    Water areas often have fishing encounters with rare aquatic
                    Pokémon.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400">🌳</span>
                  <span>
                    Tree encounters can be triggered by using Headbutt on
                    specific trees.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-400">⚔️</span>
                  <span>
                    Raid encounters are special battles with powerful Pokémon!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Region Lore */}
        <div className="mt-12 bg-gradient-to-r from-purple-800/30 to-blue-800/30 backdrop-blur-sm rounded-xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            The Legend of Nazan
          </h2>
          <p className="text-white/80 leading-relaxed text-center max-w-4xl mx-auto">
            Long ago, the Nazan Region was shaped by ancient forces that still
            influence its landscapes today. From the mystical forests where time
            seems to stand still, to the bustling cities that bridge the old
            world with the new, every location tells a story. Trainers who
            venture through Nazan discover not just Pokémon, but pieces of a
            greater legend waiting to be unveiled.
          </p>
        </div>
      </div>
    </div>
  );
};
