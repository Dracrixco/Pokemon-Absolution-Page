export interface TileData {
  id: string;
  mapIngameID: number;
  x: number;
  y: number;
  mapWidth?: number;
  mapHeight?: number;
  mapName: string;
}

export const tilesData: Record<string, TileData> = {
  "5_4": {
    id: "5_4",
    mapIngameID: 2,
    x: 5,
    y: 4,
    mapName: "Mapa de Pruebas",
  },
  "7_15": {
    id: "7_15",
    mapIngameID: 3,
    x: 7,
    y: 15,
    mapName: "Sunrise City",
  },
  "7_10": {
    id: "7_10",
    mapIngameID: 4,
    x: 7,
    y: 10,
    mapName: "Route 1",
    mapWidth: 1,
    mapHeight: 5,
  },
  "7_9": {
    id: "7_9",
    mapIngameID: 7,
    x: 7,
    y: 9,
    mapName: "Sunset City",
  },
  "8_15": {
    id: "8_15",
    mapIngameID: 8,
    x: 8,
    y: 15,
    mapName: "Route 2",
    mapWidth: 4,
    mapHeight: 4,
  },
  "12_15": {
    id: "12_15",
    mapIngameID: 11,
    x: 12,
    y: 15,
    mapName: "Parhelion City",
  },
  "9_13": {
    id: "9_13",
    mapIngameID: 12,
    x: 9,
    y: 13,
    mapName: "Big Zone 1",
    mapWidth: 2,
    mapHeight: 4,
  },
  "13_15": {
    id: "13_15",
    mapIngameID: 14,
    x: 13,
    y: 15,
    mapName: "Route 3",
    mapWidth: 2,
    mapHeight: 2,
  },
  "12_16": {
    id: "12_16",
    mapIngameID: 17,
    x: 12,
    y: 16,
    mapName: "Beach",
  },
  "12_11": {
    id: "12_11",
    mapIngameID: 18,
    x: 12,
    y: 11,
    mapName: "Route 4",
    mapWidth: 1,
    mapHeight: 4,
  },
  "11_7": {
    id: "11_7",
    mapIngameID: 19,
    x: 11,
    y: 7,
    mapName: "Dusk Forest",
    mapWidth: 3,
    mapHeight: 12,
  },
  "10_8": {
    id: "10_8",
    mapIngameID: 20,
    x: 10,
    y: 8,
    mapName: "Forest - History",
    mapWidth: 1,
    mapHeight: 2,
  },
  "12_6": {
    id: "12_6",
    mapIngameID: 21,
    x: 12,
    y: 6,
    mapName: "Twilight City",
  },
  "6_9": {
    id: "6_9",
    mapIngameID: 22,
    x: 6,
    y: 9,
    mapName: "Risco",
  },
  "7_8": {
    id: "7_8",
    mapIngameID: 23,
    x: 7,
    y: 8,
    mapName: "East",
  },
  "14_9": {
    id: "14_9",
    mapIngameID: 43,
    x: 14,
    y: 9,
    mapName: "Forest - Water Zone",
  },
  "10_9": {
    id: "10_9",
    mapIngameID: 45,
    x: 10,
    y: 9,
    mapName: "Fores - Spider Zone",
  },
};
