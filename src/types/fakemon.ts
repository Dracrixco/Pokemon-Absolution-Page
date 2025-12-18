import type { GenericPBS } from "./genericPBS";

export interface LevelUpMove {
  level: number;
  move: string;
}

export type LevelUpMoveEntry = string | LevelUpMove;

export interface Fakemon extends GenericPBS {
  name: string;
  types: string[];
  sprite: string;
  backSprite: string;
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
  moves?: LevelUpMoveEntry[];
  tutorMoves?: string[];
  eggMoves?: string[];
  dateToShow?: Date;
  color?: string;
  evolution: {
    to: string;
    method: string;
    value: string;
  }[];
}

export interface FakemonForTeam {
  id: string;
  randomId: string;
  formNumber?: number; // Número de la forma seleccionada (0 = base)
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
