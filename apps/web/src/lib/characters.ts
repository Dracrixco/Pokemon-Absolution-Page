import { characters } from "@/data/characters";

import type { Character } from "@absolution/shared-types";
export type { Character } from "@absolution/shared-types";

export function getCharacterByName(name: string): Character | undefined {
  return characters.find((character) => character.name === name);
}
