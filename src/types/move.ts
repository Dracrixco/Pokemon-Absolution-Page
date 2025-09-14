import type { GenericPBS } from "./genericPBS";

export interface Move extends GenericPBS {
  name: string;
  type: string;
  category: "Physical" | "Special" | "Status";
  power: number | null;
  accuracy: number | null;
  totalPP: number;
  target: string;
}
