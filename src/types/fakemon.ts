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
