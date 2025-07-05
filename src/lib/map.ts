// src/types.ts
export interface TileData {
  id: string;
  x: number;
  mapIngameID: number;
  y: number;
  mapName: string;
}

export const tilesData: Record<string, TileData> = {
  "0_0": {
    id: "0_0",
    mapIngameID: 0,
    x: 0,
    y: 0,
    mapName: "Región A",
  },
  "7_9": {
    id: "7_9",
    mapIngameID: 7,
    x: 7,
    y: 9,
    mapName: "Región A",
  },
};
