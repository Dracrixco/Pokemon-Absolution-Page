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
  suffix: string;
}

export interface FakemonForTeam {
  id: string;
  ivs: number[];
  evs: number[];
  level: number;
  nature: string;
  abilityIndex_easy: number;
  abilityIndex_normal: number;
  abilityIndex_hard: number;
  abilityIndex_absolution: number;
  item_easy: string;
  item_normal: string;
  item_hard: string;
  item_absolution: string;
  moves_easy: string[];
  moves_normal: string[];
  moves_hard: string[];
  moves_absolution: string[];
}
