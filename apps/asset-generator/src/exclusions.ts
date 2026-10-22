// Keep unrevealed Pokémon out of generated data and sprite exports.
export const NOT_ABLE_TO_SHOW_FAKEMONS = [
  "BUSHIERA",
  "WEREWOODS",
  "DOLORN",
  "MALICEAR",
  "ABANDOLED",
  "FLOVERN",
  "WYWERDEN",
  "OTTRICK",
  "LUTRION",
  "MAJOTTER",
  "DOLOVE",
  "SERENOVE",
  "ANTICORE",
  "DRANTICORE",
  "MAGMON",
  "LIZAP",
  "VOLTAIL",
  "ARMALITO",
  "ROCKAROLL",
  "WETMOR",
  "ANGELNEON",
  "CHAINSEW",
  "CHAINXURE",
  "CHAINSAURUS",
  "FLEMBLE",
  "BLAZERAITH",
  "SACKID",
  "SNATCHSACK",
  "KRAMPUSACK",
  "TARCHILL",
  "CRYOSALT",
  "TARVALANCHE",
  "THUNDARTIC",
  "CORRUPTEON",
  "GHOUVIAL",
  "GHOULDRON",
  "CANNONAUGHT",
  "EMPYREAPE",
  "ABYSSALIGATR",
  "TANATOISE",
  "FAGOCICLUS",
  "FLAMOUR",
  "FLAMOURE",
] as const;

const hidden = new Set<string>(NOT_ABLE_TO_SHOW_FAKEMONS);
export function isHiddenSpecies(id: string): boolean {
  return hidden.has(id.split(",")[0].trim().toUpperCase());
}

export function isHiddenSprite(path: string): boolean {
  return path.split("/").some((part) => {
    const name = part.toUpperCase();
    return NOT_ABLE_TO_SHOW_FAKEMONS.some(
      (id) =>
        name === id ||
        [".", "_", "-"].some((separator) => name.startsWith(id + separator)),
    );
  });
}
