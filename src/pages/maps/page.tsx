import React, { useState } from "react";

import { PixelMap } from "@/components/absolution/pixel-map";
import { TileLayers } from "@/components/absolution/tile-layers";
import type { TileData } from "@/lib/map";

export const NazanRegionMap: React.FC = () => {
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-white">
      <div className="container mx-auto px-4 py-8 text-white">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Nazan Region</h1>
          <p className="text-lg">
            Explore the vast and mysterious Nazan Region, home to diverse
            Pokémon and adventures waiting to unfold.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Map Section */}

          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-1 border border-white/60">
            <PixelMap
              width={38}
              height={26}
              onSelect={setSelectedTile}
              backgroundSrc={"/others/mapRegion0.png"}
            />
          </div>

          {/* Layers Section */}
          <div className="space-y-4">
            <TileLayers tile={selectedTile} />
          </div>
        </div>
      </div>
    </div>
  );
};
