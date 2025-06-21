export interface Fakemon {
  id: string;
  name: string;
  types: string[];
  sprite: string;
  artwork: string;
  description: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  };
  height: string;
  weight: string;
  abilities: string[];
  hiddenAbilities: string[];
  category: string;
  moves?: string[];
  tutorMoves?: string[];
  eggMoves?: string[];
}
