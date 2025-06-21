import { characters } from "@/data/characters";

export interface Character {
  name: string;
  artwork: string;
  description: string;
  role: string;
  favorite?: string;
}

export function getCharacterById(name: string): Character | undefined {
  return characters.find((character) => character.name === name);
}
