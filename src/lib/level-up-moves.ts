import type { Fakemon, LevelUpMove, LevelUpMoveEntry } from "@/types/fakemon";

export function normalizeLevelUpMoves(
  moves: Fakemon["moves"] | undefined,
): LevelUpMove[] {
  if (!moves || moves.length === 0) return [];

  return moves
    .map((entry: LevelUpMoveEntry) => {
      if (typeof entry === "string") {
        return { level: 0, move: entry };
      }
      return entry;
    })
    .filter((m) => !!m.move && Number.isFinite(m.level));
}
