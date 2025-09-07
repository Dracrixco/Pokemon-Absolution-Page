import type { GenericPBS } from "./genericPBS";

export interface TrainerType extends GenericPBS {
  sprite: string;
  name: string;
  gender: string;
  baseMoney: number;
  suffix: string;
}
