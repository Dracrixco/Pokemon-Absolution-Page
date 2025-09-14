import { getAllFakemons } from "./fakemons";
import type { Fakemon } from "@/types/fakemon";

export interface PokemonMoveLearn {
  pokemon: Fakemon;
  learnMethod: "level" | "tutor" | "egg";
  level?: number; // Only for level-up moves
}

export const getPokemonThatLearnMove = (moveId: string): PokemonMoveLearn[] => {
  const allFakemons = getAllFakemons();
  const results: PokemonMoveLearn[] = [];

  allFakemons.forEach((pokemon) => {
    // Check level-up moves
    if (pokemon.moves && pokemon.moves.includes(moveId)) {
      results.push({
        pokemon,
        learnMethod: "level",
        // Note: We don't have level data in the current structure
        // This would need to be added to the Fakemon type if needed
      });
    }

    // Check tutor moves
    if (pokemon.tutorMoves && pokemon.tutorMoves.includes(moveId)) {
      results.push({
        pokemon,
        learnMethod: "tutor",
      });
    }

    // Check egg moves
    if (pokemon.eggMoves && pokemon.eggMoves.includes(moveId)) {
      results.push({
        pokemon,
        learnMethod: "egg",
      });
    }
  });

  // Sort by Pokemon name
  return results.sort((a, b) => a.pokemon.name.localeCompare(b.pokemon.name));
};

export const getMoveLearnStats = (moveId: string) => {
  const learners = getPokemonThatLearnMove(moveId);

  const stats = {
    total: learners.length,
    byLevel: learners.filter((l) => l.learnMethod === "level").length,
    byTutor: learners.filter((l) => l.learnMethod === "tutor").length,
    byEgg: learners.filter((l) => l.learnMethod === "egg").length,
  };

  return { learners, stats };
};

export const getCategorizedPokemonForMove = (moveId: string) => {
  const learners = getPokemonThatLearnMove(moveId);

  return {
    levelMoves: learners
      .filter((l) => l.learnMethod === "level")
      .map((l) => ({
        id: l.pokemon.id,
        name: l.pokemon.name,
        types: l.pokemon.types,
        level: l.level,
      })),
    tutorMoves: learners
      .filter((l) => l.learnMethod === "tutor")
      .map((l) => ({
        id: l.pokemon.id,
        name: l.pokemon.name,
        types: l.pokemon.types,
      })),
    eggMoves: learners
      .filter((l) => l.learnMethod === "egg")
      .map((l) => ({
        id: l.pokemon.id,
        name: l.pokemon.name,
        types: l.pokemon.types,
      })),
  };
};
