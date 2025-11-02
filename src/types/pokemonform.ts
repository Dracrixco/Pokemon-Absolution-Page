import type { Fakemon } from "./fakemon";

export interface PokemonForm extends Fakemon {
  formNumber: number;
  formName: string;
  baseId: string;
  megaStone?: string | null;
  color?: string;
}
