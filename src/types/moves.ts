export interface Move {
  id: string;
  name: string;
  type: string;
  category: "Physical" | "Special" | "Status";
  power: number | null;
  accuracy: number | null;
  totalPP: number;
  target: string;
  description: string;
}
