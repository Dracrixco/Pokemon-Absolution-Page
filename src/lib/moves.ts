import { moves } from "@/data/moves";
import type { Move } from "@/types/moves";

export function getMoveById(id: string): Move | undefined {
  return moves.find((move) => move.id === id);
}

export function getMovesByIds(ids: string[]): Move[] {
  return ids
    .map((id) => getMoveById(id))
    .filter((move): move is Move => move !== undefined);
}
