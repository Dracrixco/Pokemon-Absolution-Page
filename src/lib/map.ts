export interface TileData {
  id: string;
  mapIngameID: number;
  x: number;
  y: number;
  mapWidth: number;
  mapHeight: number;
  outdoor: boolean;
  showArea: boolean;
  bicycle: boolean;
  mapName: string;
  color?: string;

  flags: string[];
}
import { tilesData } from "@/data/maps";

// Helper function to check if a coordinate belongs to a map area
export function getMapAtCoordinate(x: number, y: number): TileData | null {
  for (const tile of Object.values(tilesData)) {
    if (
      x >= tile.x &&
      x < tile.x + tile.mapWidth &&
      y >= tile.y &&
      y < tile.y + tile.mapHeight
    ) {
      return tile;
    }
  }
  return null;
}

// Helper function to get all coordinates covered by a map
export function getMapCoordinates(tile: TileData): { x: number; y: number }[] {
  const coordinates: { x: number; y: number }[] = [];
  for (let x = tile.x; x < tile.x + tile.mapWidth; x++) {
    for (let y = tile.y; y < tile.y + tile.mapHeight; y++) {
      coordinates.push({ x, y });
    }
  }
  return coordinates;
}

// Color mapping for different map colors
export const colorClasses = {
  purple: "bg-purple-400 border-purple-500",
  yellow: "bg-yellow-400 border-yellow-500",
  green: "bg-green-400 border-green-500",
  orange: "bg-orange-400 border-orange-500",
  blue: "bg-blue-400 border-blue-500",
  pink: "bg-pink-400 border-pink-500",
  red: "bg-red-400 border-red-500",
  teal: "bg-teal-400 border-teal-500",
  cyan: "bg-cyan-400 border-cyan-500",
  indigo: "bg-indigo-400 border-indigo-500",
  emerald: "bg-emerald-400 border-emerald-500",
  lime: "bg-lime-400 border-lime-500",
  violet: "bg-violet-400 border-violet-500",
  stone: "bg-stone-400 border-stone-500",
  amber: "bg-amber-400 border-amber-500",
  sky: "bg-sky-400 border-sky-500",
  slate: "bg-slate-400 border-slate-500",
} as const;
