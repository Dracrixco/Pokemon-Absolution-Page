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

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Side - Pixel Map */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">World Map</h2>
            <PixelMap
              width={38}
              height={26}
              onSelect={setSelectedTile}
              backgroundSrc="/Others/mapRegion0.png"
            />
          </div>

          {/* Right Side - Map Viewer */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 flex flex-col h-[600px]">
            <h2 className="text-2xl font-bold text-white mb-4">
              {selectedTile ? selectedTile.mapName : "Select a Location"}
            </h2>
            {selectedTile ? (
              <div className="flex-1 min-h-0">
                <MapViewer tile={selectedTile} className="h-full" />
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/60 text-center">
                <div>
                  <span className="text-6xl mb-4 block">🗺️</span>
                  <p className="text-lg">
                    Click on a location in the map to view details
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom - Encounters Panel (Full Width Horizontal) */}
        {selectedTile && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <EncountersPanel tile={selectedTile} />
          </div>
        )}

        {/* Region Lore */}
        <div className="mt-8 bg-gradient-to-r from-purple-800/30 to-blue-800/30 backdrop-blur-sm rounded-xl p-8 border border-white/20">
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
