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
export interface EncounterEntry {
  rate: number;
  species: string;
  minLevel: number;
  maxLevel: number;
}
export type EncountersData = Record<string, Record<string, EncounterEntry[]>>;
