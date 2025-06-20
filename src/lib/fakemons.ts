import type { Fakemon } from "@/types/fakemon";
import { fakemons } from "@/data/pokemon";

export function getFakemonById(id: string): Fakemon | undefined {
  return fakemons.find((fakemon) => fakemon.id === id);
}
