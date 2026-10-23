import type {
  Ability,
  Fakemon,
  PokemonForm,
  Move,
  Item,
  TileData,
  EncountersData,
} from "@absolution/shared-types";
import { isHiddenSpecies } from "./exclusions.ts";

export interface Section {
  id: string;
  fields: Record<string, string>;
}
export function sections(text: string): Section[] {
  const result: Section[] = [];
  let current: Section | undefined;
  for (const raw of text.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const header = line.match(/^\[([^\]]+)\]/);
    if (header) {
      current = { id: header[1].trim(), fields: {} };
      result.push(current);
    } else if (current && line.includes("=")) {
      const index = line.indexOf("=");
      current.fields[line.slice(0, index).trim()] = line
        .slice(index + 1)
        .trim();
    }
  }
  return result;
}

const list = (text = "") =>
  text
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
const number = (value = "", fallback = 0) =>
  Number.isFinite(Number(value)) && value !== "" ? Number(value) : fallback;

export function parseLevelUpMoves(text = "") {
  const tokens = list(text);
  const moves: { level: number; move: string }[] = [];
  for (let i = 0; i + 1 < tokens.length; i += 2) {
    if (/^\d+$/.test(tokens[i]))
      moves.push({ level: Number(tokens[i]), move: tokens[i + 1] });
  }
  return moves;
}

function pokemon(section: Section, suffix: string, base?: Fakemon): Fakemon {
  const { id, fields: f } = section;
  const stats = list(f.BaseStats).map(Number);
  const result: Fakemon = base
    ? structuredClone(base)
    : {
        id,
        name: "",
        types: [],
        sprite: `/Front/${id.toUpperCase()}.png`,
        backSprite: `/Back/${id.toUpperCase()}.png`,
        description: "",
        stats: {
          hp: 0,
          attack: 0,
          defense: 0,
          spAttack: 0,
          spDefense: 0,
          speed: 0,
        },
        height: "",
        weight: "",
        abilities: [],
        hiddenAbilities: [],
        category: "",
        moves: [],
        tutorMoves: [],
        eggMoves: [],
        suffix,
        evolution: [],
        color: "",
      };
  result.suffix = suffix;
  for (const [key, field] of Object.entries({
    Name: "name",
    Pokedex: "description",
    Height: "height",
    Weight: "weight",
    Category: "category",
    Color: "color",
  } as const)) {
    if (key in f) result[field] = f[key];
  }
  for (const [key, field] of Object.entries({
    Types: "types",
    Abilities: "abilities",
    HiddenAbilities: "hiddenAbilities",
    TutorMoves: "tutorMoves",
    EggMoves: "eggMoves",
  } as const)) {
    if (key in f) result[field] = list(f[key]);
  }
  if (stats.length) {
    if (stats.length !== 6 || stats.some((value) => !Number.isFinite(value)))
      throw new Error(`Invalid BaseStats for ${id}`);
    result.stats = {
      hp: stats[0],
      attack: stats[1],
      defense: stats[2],
      speed: stats[3],
      spAttack: stats[4],
      spDefense: stats[5],
    };
  }
  if ("Moves" in f) result.moves = parseLevelUpMoves(f.Moves);
  const evolutions = f.Evolutions ?? f.Evolution;
  if (evolutions !== undefined) {
    result.evolution = [];
    const tokens = list(evolutions);
    for (let i = 0; i + 2 < tokens.length; i += 3) {
      if (!isHiddenSpecies(tokens[i]))
        result.evolution.push({
          to: tokens[i],
          method: tokens[i + 1],
          value: tokens[i + 2],
        });
    }
  }
  return result;
}

export function parsePokemon(text: string, suffix: string): Fakemon[] {
  return sections(text)
    .filter((s) => !isHiddenSpecies(s.id))
    .map((s) => pokemon(s, suffix));
}

export function parseForms(
  text: string,
  suffix: string,
  bases: Fakemon[],
): PokemonForm[] {
  const byId = new Map(bases.map((p) => [p.id, p]));
  return sections(text)
    .filter((s) => !isHiddenSpecies(s.id))
    .map((s) => {
      const [baseId, form] = list(s.id);
      if (!form || !/^\d+$/.test(form))
        throw new Error(`Invalid Pokémon form: ${s.id}`);
      const formNumber = Number(form);
      return {
        ...pokemon({ ...s, id: baseId }, suffix, byId.get(baseId)),
        id: baseId,
        baseId,
        formNumber,
        formName: s.fields.FormName || "",
        megaStone: s.fields.MegaStone || null,
        sprite: `/Front/${baseId.toUpperCase()}_${formNumber}.png`,
        backSprite: `/Back/${baseId.toUpperCase()}_${formNumber}.png`,
      };
    });
}

export function parseMoves(text: string): Move[] {
  return sections(text).map(({ id, fields: f }) => {
    if (!["Physical", "Special", "Status"].includes(f.Category))
      throw new Error(`Invalid move category for ${id}: ${f.Category}`);
    return {
      id,
      name: f.Name || "",
      type: f.Type || "",
      category: f.Category as Move["category"],
      power: number(f.Power) || null,
      accuracy: number(f.Accuracy) || null,
      totalPP: number(f.TotalPP),
      target: f.Target || "",
      description: f.Description || "",
      suffix: "normal",
      ...(f.PasiveDescription || f.PassiveDescription
        ? { passiveEffect: f.PassiveDescription || f.PasiveDescription }
        : {}),
    };
  });
}

export function parseItems(text: string, suffix: string): Item[] {
  return sections(text).map(({ id, fields: f }) => ({
    id,
    name: f.Name || "",
    namePlural: f.NamePlural || "",
    pocket: number(f.Pocket),
    price: number(f.Price),
    flags: f.Flags || "",
    description: f.Description || "",
    sprite: `/Items/${id.toUpperCase()}.png`,
    suffix,
  }));
}

export function parseAbilities(text: string): Ability[] {
  return sections(text).map(({ id, fields: f }) => ({
    id,
    name: f.Name || "",
    description: f.Description || "",
    suffix: "normal",
  }));
}

export function parseMaps(text: string): Record<string, TileData> {
  const result: Record<string, TileData> = {};
  for (const { id, fields: f } of sections(text)) {
    const flags = list(f.Flags);
    const position = list(f.MapPosition).map(Number);
    if (!flags.includes("ForWebPage") || position.length < 3) continue;
    const [width, mask] = list(f.MapSize);
    const mapWidth = Math.max(1, number(width, 1));
    const mapName = f.Name || "";
    const color =
      [
        ["City", "blue"],
        ["Route", "green"],
        ["Cave", "gray"],
        ["Forest", "emerald"],
        ["Beach", "yellow"],
      ].find(([name]) => mapName.includes(name))?.[1] || "purple";
    const tile = {
      id,
      mapIngameID: number(id),
      mapName,
      x: position[1],
      y: position[2],
      mapWidth,
      mapHeight: Math.max(1, Math.ceil((mask?.length || 1) / mapWidth)),
      color,
      flags,
      outdoor: f.Outdoor?.toLowerCase() === "true",
      showArea: f.ShowArea?.toLowerCase() === "true",
      bicycle: f.Bicycle?.toLowerCase() === "true",
    };
    result[`${tile.x}-${tile.y}`] = tile;
  }
  return result;
}

export function parseEncounters(text: string): EncountersData {
  const result: EncountersData = {};
  let map: string | undefined;
  let method: string | undefined;
  for (const raw of text.replace(/^\uFEFF/, "").split(/\r?\n/)) {
    const line = raw.split("#")[0].trim();
    if (!line) continue;
    const header = line.match(/^\[(\d+)(?:,\d+)?\]/);
    if (header) {
      map = String(Number(header[1]));
      method = undefined;
      continue;
    }
    if (!map) continue;
    const methodMatch = line.match(/^([A-Za-z][A-Za-z_0-9]*)(?:,\d+)?$/);
    if (methodMatch) {
      method = methodMatch[1];
      result[map] ??= {};
      result[map][method] = [];
    } else if (method) {
      const [rate, species, min, max = min] = list(line);
      if (species && min && !isHiddenSpecies(species))
        result[map][method].push({
          rate: number(rate),
          species,
          minLevel: number(min),
          maxLevel: number(max),
        });
    }
  }
  return result;
}
