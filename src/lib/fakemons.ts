import type { Fakemon } from "@/types/fakemon";
import type { PokemonForm } from "@/types/pokemonform";
import { fakemons as originalFakemons } from "@/data/pokemon";
import { fakemons as fakemonsAbsolution } from "@/data/pokemon_absolution";
import { getFormByNumber } from "@/lib/pokemon-forms";

const allFakemons = [...originalFakemons, ...fakemonsAbsolution];

export function getFakemonById(id: string): Fakemon | undefined {
  return allFakemons.find((fakemon) => fakemon.id === id);
}

export function getAllFakemons(): Fakemon[] {
  return allFakemons;
}

/**
 * Get pokemon data considering form selection
 * Returns form data if formNumber is provided, otherwise returns base pokemon
 */
export function getPokemonData(
  id: string,
  formNumber?: number
): Fakemon | PokemonForm | undefined {
  const basePokemon = getFakemonById(id);

  if (!basePokemon) {
    return undefined;
  }

  // If no form number or form 0, return base pokemon
  if (!formNumber || formNumber === 0) {
    return basePokemon;
  }

  // Try to get the form
  const form = getFormByNumber(id, formNumber);
  return form || basePokemon;
}
