import type { Fakemon } from "@/types/fakemon";
import { fakemons } from "@/data/pokemon";
import { fakemons as fakemonsAbsolution } from "@/data/pokemon_absolution";

export function getFakemonById(id: string): Fakemon | undefined {
  return fakemons.find((fakemon) => fakemon.id === id);
}

export function getAllFakemons(): Fakemon[] {
  return [...fakemons, ...fakemonsAbsolution];
}
