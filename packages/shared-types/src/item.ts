import type { GenericPBS } from "./genericPBS";

export interface Item extends GenericPBS {
  name: string;
  namePlural: string;
  pocket: number;
  price: number;
  flags: string;
  sprite: string;
}
