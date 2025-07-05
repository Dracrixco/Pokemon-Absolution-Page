// src/components/PixelMap.tsx
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { tilesData, type TileData } from "@/lib/map";

const TILE_SIZE = 16;
const SHOW_SELECTED_TILE = true;

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

  const gridStyle: React.CSSProperties = {
    width: width * TILE_SIZE,
    height: height * TILE_SIZE,
    display: "grid",
    gridTemplateColumns: `repeat(${width}, ${TILE_SIZE}px)`,
    gridTemplateRows: `repeat(${height}, ${TILE_SIZE}px)`,
  };

  const handleTileClick = (tile: TileData | null, key: string) => {
    setSelectedTile(tile ? key : null);
    onSelect(tile);
  };

  return (
    <div
      className={cn([
        "bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg",
        "w-full overflow-x-scroll",
      ])}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <h2 className="text-xl font-bold text-gray-800">Nazan Region</h2>
        </div>
        {SHOW_SELECTED_TILE && (
          <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-gray-200 shadow-sm">
            <span className="text-sm font-medium text-gray-600">
              Coordinates: {coordinates[0]}, {coordinates[1]}
            </span>
          </div>
        )}
      </div>

      <div
        className={cn([
          "relative inline-block rounded-lg overflow-hidden",
          "shadow-xl border-2 border-white/50 bg-white/20 backdrop-blur-sm",
          "mx-auto",
        ])}
      >
        <div
          className="relative"
          style={{ width: width * TILE_SIZE, height: height * TILE_SIZE }}
        >
          {/* regional map as background */}
          <img
            src={backgroundSrc}
            alt="Regional map"
            className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
          />

          {/* transparent grid of tiles */}
          <div className="absolute top-0 left-0" style={gridStyle}>
            {rows.flatMap((y) =>
              cols.map((x) => {
                const key = `${x}_${y}`;
                const tile = tilesData[key];
                const isSelected = selectedTile === key;

                return (
                  <div
                    key={key}
                    className={cn(
                      `w-[${TILE_SIZE}px] h-[${TILE_SIZE}px] border-[0.5px] transition-all duration-200`,
                      tile
                        ? "cursor-pointer border-red-300/60 hover:bg-red-200/40 hover:border-red-400 hover:scale-105"
                        : "cursor-not-allowed border-gray-300/10 bg-blue-100/20",
                      isSelected
                        ? "bg-yellow-300/60 border-yellow-400 shadow-md scale-105 z-10"
                        : "",
                      tile ? "hover:shadow-md" : ""
                    )}
                    onClick={() => handleTileClick(tile || null, key)}
                    onMouseEnter={() => {
                      setCoordinates([x, y]);
                    }}
                  />
                );
              })
            )}
          </div>

          {/* Overlay indicators for available tiles */}
          {Object.entries(tilesData).map(([key, tile]) => (
            <div
              key={`indicator-${key}`}
              className="absolute pointer-events-none"
              style={{
                left: tile.x * TILE_SIZE + 2,
                top: tile.y * TILE_SIZE + 2,
                width: TILE_SIZE - 4,
                height: TILE_SIZE - 4,
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-red-400 to-red-500 rounded-sm border border-emerald-300/40 flex items-center justify-center">
                <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
