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

  const gridStyle: React.CSSProperties = {
    width: width * TILE_SIZE,
    height: height * TILE_SIZE,
    display: "grid",
    gridTemplateColumns: `repeat(${width}, ${TILE_SIZE}px)`,
    gridTemplateRows: `repeat(${height}, ${TILE_SIZE}px)`,
  };

  return (
    <div
      className="relative inline-block"
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
            return (
              <div
                key={key}
                className={cn(
                  `w-[${TILE_SIZE}px] h-[${TILE_SIZE}px] border border-gray-300`,
                  tile ? "cursor-pointer hover:bg-gray-200" : "bg-transparent",
                  tile ? "" : "cursor-not-allowed bg-blue-50/50"
                )}
                onClick={() => onSelect(tile || null)}
                onMouseEnter={() => {
                  setCoordinates([x, y]);
                }}
              />
            );
          })
        )}
      </div>

      <div className="absolute top-0 left-0 z-50">
        <h2>Nazan Region</h2>
        {SHOW_SELECTED_TILE && (
          <p>
            {coordinates[0]}, {coordinates[1]}
          </p>
        )}
      </div>
    </div>
  );
};
