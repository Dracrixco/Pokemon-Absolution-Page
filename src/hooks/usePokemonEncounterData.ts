import { useMemo } from "react";
import { getAllFakemons } from "@/lib/fakemons";

interface PokemonEncounterData {
  id: string;
  name: string;
  sprite: string;
  types: string[];
}

export function usePokemonEncounterData(
  pokeIds: string[]
): Record<string, PokemonEncounterData> {
  const allFakemons = getAllFakemons();

  return useMemo(() => {
    const pokemonData: Record<string, PokemonEncounterData> = {};

    pokeIds.forEach((id) => {
      const pokemon = allFakemons.find((p) => p.id === id);
      if (pokemon) {
        pokemonData[id] = {
          id: pokemon.id,
          name: pokemon.name,
          sprite: pokemon.sprite,
          types: pokemon.types,
        };
      } else {
        // Fallback for unknown Pokemon
        pokemonData[id] = {
          id,
          name: id.charAt(0).toUpperCase() + id.slice(1).toLowerCase(),
          sprite: "MISSINGNO.png",
          types: ["UNKNOWN"],
        };
      }
    });

    return pokemonData;
  }, [pokeIds, allFakemons]);
}

export function getEncounterTypeStats(
  encounters: { type: string; pokes: string[] }[]
) {
  return encounters.reduce((stats, encounter) => {
    stats[encounter.type] =
      (stats[encounter.type] || 0) + encounter.pokes.length;
    return stats;
  }, {} as Record<string, number>);
}
