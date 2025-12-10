import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { TileData } from "@/lib/map";

interface MapViewerProps {
  tile: TileData;
  compact?: boolean;
  className?: string;
}

export const MapViewer: React.FC<MapViewerProps> = ({
  tile,
  compact = false,
  className = "",
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageSrc = `/Maps/map_${tile.mapIngameID}.png`;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (!imageLoaded && imageSrc.includes("default.png")) {
    return (
      <div
        className={cn(
          "bg-black/20 rounded-lg border border-white/10 p-6",
          className,
        )}
      >
        <div className="flex flex-col items-center justify-center text-white/50 min-h-[200px]">
          <div className="text-4xl mb-3">🗺️</div>
          <div className="text-lg font-medium mb-1">{tile.mapName}</div>
          <div className="text-sm">Map image not available</div>
          <div className="text-xs text-white/30 mt-2">
            ID: {tile.mapIngameID} | Size: {tile.mapWidth}×{tile.mapHeight}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Compact/Normal View */}
      <div
        className={cn(
          "relative bg-black/20 rounded-lg overflow-hidden border border-white/10 h-full",
          className,
        )}
      >
        <img
          src={imageSrc}
          alt={`${tile.mapName} map`}
          className={cn(
            "w-full h-full object-contain bg-gray-900/50",
            compact && "!h-32",
          )}
          onLoad={handleImageLoad}
        />

        {/* Overlay Info */}
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {tile.mapWidth}×{tile.mapHeight}
        </div>

        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          ID: {tile.mapIngameID}
        </div>

        {/* Map Title for compact mode */}
        {compact && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <div className="text-white text-sm font-medium truncate">
              {tile.mapName}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

interface MapViewerSimpleProps {
  tileId: string;
  className?: string;
}

export const MapViewerSimple: React.FC<MapViewerSimpleProps> = ({
  tileId,
  className = "",
}) => {
  // This would need to be implemented based on how you get tile data by ID
  // For now, returning null as we'd need access to the tiles data
  return (
    <div
      className={cn(
        "bg-black/20 rounded-lg border border-white/10 p-4",
        className,
      )}
    >
      <div className="text-white/50 text-center">
        <div className="text-lg">🗺️</div>
        <div className="text-sm">Tile ID: {tileId}</div>
        <div className="text-xs">MapViewerSimple needs tile data access</div>
      </div>
    </div>
  );
};

export default MapViewer;
