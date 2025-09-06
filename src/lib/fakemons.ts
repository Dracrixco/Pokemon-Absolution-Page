import type { Fakemon } from "@/types/fakemon";
import { fakemons as originalFakemons } from "@/data/pokemon";
import { fakemons as fakemonsAbsolution } from "@/data/pokemon_absolution";

const allFakemons = [...originalFakemons, ...fakemonsAbsolution];

export function getFakemonById(id: string): Fakemon | undefined {
  return allFakemons.find((fakemon) => fakemon.id === id);
}

export function getAllFakemons(): Fakemon[] {
  return allFakemons;
}
