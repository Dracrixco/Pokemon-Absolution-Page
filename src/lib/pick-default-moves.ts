import type { Fakemon } from "@/types/fakemon";
import { normalizeLevelUpMoves } from "@/lib/level-up-moves";

export const pickDefaultMovesForLevel = (
  moves: Fakemon["moves"] | undefined,
  level: number,
) => {
  const normalized = normalizeLevelUpMoves(moves);
  if (normalized.length === 0) {
    return ["", "", "", ""];
  }

  const clampedLevel = Math.max(1, Math.min(100, Math.floor(level)));
  const allLevelsUnknown = normalized.every((m) => m.level === 0);

  if (allLevelsUnknown) {
    const uniqueMoveIds: string[] = [];
    for (const entry of normalized) {
      if (!uniqueMoveIds.includes(entry.move)) {
        uniqueMoveIds.push(entry.move);
      }
    }

    if (uniqueMoveIds.length === 0) return ["", "", "", ""];

    const learnedCount = Math.max(
      1,
      Math.min(
        uniqueMoveIds.length,
        Math.round((clampedLevel / 100) * uniqueMoveIds.length),
      ),
    );
    const learnedMoves = uniqueMoveIds.slice(0, learnedCount);
    const lastFour = learnedMoves.slice(-4);
    while (lastFour.length < 4) lastFour.unshift("");
    return lastFour;
  }

  const sorted = [...normalized].sort((a, b) => a.level - b.level);

  const learnable = sorted.filter((m) => m.level <= clampedLevel);
  const chosenPool = learnable.length > 0 ? learnable : sorted;

  const uniqueMoveIds: string[] = [];
  for (const entry of chosenPool) {
    if (!uniqueMoveIds.includes(entry.move)) {
      uniqueMoveIds.push(entry.move);
    }
  }

  const lastFour = uniqueMoveIds.slice(-4);
  while (lastFour.length < 4) lastFour.unshift("");
  return lastFour;
};
