import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  tilesData,
  getMapAtCoordinate,
  colorClasses,
  type TileData,
} from "@/lib/map";

const TILE_SIZE = 16;
const SHOW_COORDINATES = true;

interface PixelMapProps {
  width: number;
  height: number;
  onSelect: (tile: TileData | null) => void;
  backgroundSrc: string;
}

export const PixelMap: React.FC<PixelMapProps> = ({
  width,
  height,
  onSelect,
  backgroundSrc,
}) => {
  const cols = Array.from({ length: width }, (_, i) => i);
  const rows = Array.from({ length: height }, (_, i) => i);
  const [coordinates, setCoordinates] = useState([0, 0]);
  const [selectedTile, setSelectedTile] = useState<string | null>(null);
  const [, setHoveredTile] = useState<TileData | null>(null);

  const gridStyle: React.CSSProperties = {
    width: width * TILE_SIZE,
    height: height * TILE_SIZE,
    display: "grid",
    gridTemplateColumns: `repeat(${width}, ${TILE_SIZE}px)`,
    gridTemplateRows: `repeat(${height}, ${TILE_SIZE}px)`,
  };

  const handleTileClick = (tile: TileData | null) => {
    setSelectedTile(tile ? tile.id : null);
    onSelect(tile);
  };

  const totalMaps = Object.keys(tilesData).length;
  const totalEncounters = Object.values(tilesData).reduce(
    (sum, tile) =>
      sum +
      tile.encounters.reduce(
        (encounterSum, encounter) => encounterSum + encounter.pokes.length,
        0
      ),
    0
  );

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-4 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg"></div>
            <h2 className="text-xl font-bold text-white">
              Nazan Region Explorer
            </h2>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="bg-white/10 px-3 py-1 rounded-full">
              <span className="text-white/70">🗺️ {totalMaps} locations</span>
            </div>
            <div className="bg-white/10 px-3 py-1 rounded-full">
              <span className="text-white/70">
                🔮 {totalEncounters} encounters
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Info Bar */}
        <div className="flex items-center justify-between">
          {SHOW_COORDINATES && (
            <div className="flex items-center gap-3">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/30">
                <span className="text-sm font-medium text-white">
                  📍 {coordinates[0]}, {coordinates[1]}
                </span>
              </div>
            </div>
          )}

          <div className="text-xs text-white/60">
            Click on highlighted areas to explore
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="p-4">
        <div
          className={cn([
            "relative inline-block rounded-lg overflow-hidden",
            "shadow-2xl border-2 border-white/30 bg-black/20",
            "mx-auto transition-all duration-300 hover:shadow-3xl",
          ])}
        >
          <div
            className="relative"
            style={{ width: width * TILE_SIZE, height: height * TILE_SIZE }}
          >
            {/* Regional map as background */}
            <img
              src={backgroundSrc}
              alt="Regional map"
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none z-0"
              onError={(e) => {
                console.error("Failed to load map image:", backgroundSrc);
                (e.target as HTMLImageElement).style.display = "none";
              }}
              onLoad={() => {
                console.log("Map image loaded successfully:", backgroundSrc);
              }}
            />

            {/* Grid overlay */}
            <div className="absolute top-0 left-0 z-10" style={gridStyle}>
              {rows.flatMap((y) =>
                cols.map((x) => {
                  const key = `${x}_${y}`;
                  const tile = getMapAtCoordinate(x, y);
                  const isSelected = selectedTile === tile?.id;

                  return (
                    <div
                      key={key}
                      className={cn(
                        `w-[${TILE_SIZE}px] h-[${TILE_SIZE}px] border-[0.25px] transition-all duration-300`,
                        tile
                          ? "cursor-pointer border-white/15 hover:bg-white/5 hover:border-white/30"
                          : "cursor-default border-white/3",
                        isSelected
                          ? "bg-yellow-400/20 border-yellow-300 shadow-lg z-20 scale-105"
                          : "",
                        tile ? "hover:shadow-md hover:scale-102" : ""
                      )}
                      onClick={() => handleTileClick(tile || null)}
                      onMouseEnter={() => {
                        setCoordinates([x, y]);
                        setHoveredTile(tile);
                      }}
                      onMouseLeave={() => {
                        setHoveredTile(null);
                      }}
                    />
                  );
                })
              )}
            </div>

            {/* Map indicators */}
            {Object.entries(tilesData).map(([key, tile]) => {
              const colorClass =
                colorClasses[tile.color as keyof typeof colorClasses] ||
                "bg-red-400 border-red-500";

              const isSelected = selectedTile === tile.id;

              return (
                <div
                  key={`indicator-${key}`}
                  className="absolute pointer-events-none z-20"
                  style={{
                    left: tile.x * TILE_SIZE + 1,
                    top: tile.y * TILE_SIZE + 1,
                    width: tile.mapWidth * TILE_SIZE - 2,
                    height: tile.mapHeight * TILE_SIZE - 2,
                  }}
                >
                  <div
                    className={cn(
                      "w-full h-full rounded-sm border-2 flex items-center",
                      "justify-center relative overflow-hidden transition-all duration-300",
                      colorClass,
                      isSelected ? "scale-105 shadow-lg" : "opacity-50"
                    )}
                  >
                    {/* Pulse effect for single tiles or smaller maps */}
                    {tile.mapWidth <= 2 && tile.mapHeight <= 2 && (
                      <div className="relative">
                        <div className="w-3 h-3 bg-white rounded-full shadow-lg"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Selection highlight */}
            {selectedTile && (
              <div className="absolute inset-0 pointer-events-none z-30">
                <div className="w-full h-full border-2 border-yellow-400 bg-yellow-400/10 rounded animate-pulse"></div>
              </div>
            )}
          </div>
        </div>

        {/* Map Legend */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs text-white/80">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>Explorable Areas</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs text-white/80">
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <span>Pokémon Encounters</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs text-white/80">
            <span>🔍</span>
            <span>Hover for details</span>
          </div>
        </div>
      </div>
    </div>
  );
};
