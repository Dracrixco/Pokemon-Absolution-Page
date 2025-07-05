import React, { useState } from "react";

import { PixelMap } from "@/components/absolution/pixel-map";
import { TileLayers } from "@/components/absolution/tile-layers";
import type { TileData } from "@/lib/map";

export const MapEditorPage: React.FC = () => {
  const [selectedTile, setSelectedTile] = useState<TileData | null>(null);

  return (
    <div className="p-6">
      <PixelMap
        width={38}
        height={26}
        onSelect={setSelectedTile}
        backgroundSrc={"/others/mapRegion0.png"}
      />
      <TileLayers tile={selectedTile} />
    </div>
  );
};
