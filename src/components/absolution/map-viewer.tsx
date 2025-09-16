import React, { useState } from "react";
import { cn } from "@/lib/utils";
import type { TileData } from "@/lib/map";
import { X, Maximize2, Download } from "lucide-react";

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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageSrc = `/maps/map_${tile.mapIngameID}.png`;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
  };

  const downloadMap = () => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = `${tile.mapName.replace(/\s+/g, "_")}_${
      tile.mapIngameID
    }.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!imageLoaded && imageSrc.includes("default.png")) {
    return (
      <div
        className={cn(
          "bg-black/20 rounded-lg border border-white/10 p-6",
          className
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
          "relative bg-black/20 rounded-lg overflow-hidden border border-white/10",
          className
        )}
      >
        <img
          src={imageSrc}
          alt={`${tile.mapName} map`}
          className={cn(
            "w-full object-contain bg-gray-900/50 transition-all duration-300",
            compact ? "h-32" : "h-48",
            "hover:scale-105 cursor-pointer"
          )}
          onLoad={handleImageLoad}
          onClick={openFullscreen}
        />

        {/* Overlay Info */}
        <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          {tile.mapWidth}×{tile.mapHeight}
        </div>

        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          ID: {tile.mapIngameID}
        </div>

        {/* Expand Button */}
        <button
          onClick={openFullscreen}
          className="absolute bottom-2 right-2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded transition-colors"
          title="View fullscreen"
        >
          <Maximize2 size={14} />
        </button>

        {/* Map Title for compact mode */}
        {compact && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <div className="text-white text-sm font-medium truncate">
              {tile.mapName}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 bg-black/50 rounded-lg p-4">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {tile.mapName}
                </h2>
                <div className="flex items-center gap-4 text-sm text-white/70 mt-1">
                  <span>
                    📍 Position: ({tile.x}, {tile.y})
                  </span>
                  <span>
                    📏 Size: {tile.mapWidth}×{tile.mapHeight} tiles
                  </span>
                  <span>🆔 ID: {tile.mapIngameID}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={downloadMap}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  title="Download map"
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Download</span>
                </button>

                <button
                  onClick={closeFullscreen}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                  title="Close fullscreen"
                >
                  <X size={16} />
                  <span className="hidden sm:inline">Close</span>
                </button>
              </div>
            </div>

            {/* Fullscreen Image */}
            <div className="relative bg-black/30 rounded-lg overflow-hidden border border-white/20">
              <img
                src={imageSrc}
                alt={`${tile.mapName} map - Fullscreen`}
                className="w-full h-auto max-h-[calc(100vh-200px)] object-contain"
              />

              {/* Zoom Indicator */}
              <div className="absolute top-4 left-4 bg-black/60 text-white text-sm px-3 py-2 rounded-lg">
                <div className="font-medium">{tile.mapName}</div>
                <div className="text-xs text-white/70">
                  Click and drag to pan • Scroll to zoom
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
        className
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
