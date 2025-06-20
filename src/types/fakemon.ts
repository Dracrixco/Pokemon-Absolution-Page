export interface Fakemon {
  id: string;
  name: string;
  types: string[];
  sprite: string;
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
  category: string;
}
