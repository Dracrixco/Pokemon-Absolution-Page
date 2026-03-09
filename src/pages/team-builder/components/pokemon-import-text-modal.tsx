import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import { getAllFakemons, getPokemonData } from "@/lib/fakemons";
import { getAllItems } from "@/lib/items";
import { getAllMoves } from "@/lib/moves";
import { abilities } from "@/data/abilities";
import type { Fakemon, FakemonForTeam } from "@/types/fakemon";
import { getFormByNumber } from "@/lib/pokemon-forms";

interface PokemonImportTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  disabled?: boolean;
  createDefaultTeamPokemon: (pokemon: Fakemon) => FakemonForTeam;
  onAddPokemon: (pokemon: FakemonForTeam) => void;
}

type ParsedImport = {
  speciesName: string;
  itemName?: string;
  abilityName?: string;
  level?: number;
  nature?: string;
  formNumber?: number;
  evs?: Partial<Record<"hp" | "atk" | "def" | "spa" | "spd" | "spe", number>>;
  moves?: string[];
};

const normalizeKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9\s\-'.()]/g, "");

const toStatKey = (
  token: string,
): ParsedImport["evs"] extends infer T ? keyof NonNullable<T> : never => {
  const t = token.trim().toLowerCase();
  if (t === "hp") return "hp";
  if (t === "atk" || t === "attack") return "atk";
  if (t === "def" || t === "defense") return "def";
  if (t === "spa" || t === "spatk" || t === "sp. atk" || t === "spatk")
    return "spa";
  if (t === "spd" || t === "spdef" || t === "sp. def" || t === "spdef")
    return "spd";
  if (t === "spe" || t === "speed") return "spe";
  return "hp";
};

const parseEVsLine = (line: string) => {
  // EVs: 252 HP / 252 Def / 4 SpD
  const after = line.split(":").slice(1).join(":").trim();
  const parts = after
    .split("/")
    .map((p) => p.trim())
    .filter(Boolean);

  const evs: NonNullable<ParsedImport["evs"]> = {};

  for (const part of parts) {
    const match = part.match(/^(\d+)\s+(.+)$/i);
    if (!match) continue;
    const value = parseInt(match[1], 10);
    const statToken = match[2].trim();
    const key = toStatKey(statToken);
    if (!Number.isFinite(value)) continue;
    evs[key] = Math.max(0, Math.min(255, value));
  }

  return evs;
};

const parseShowdownLikeSet = (text: string): ParsedImport | null => {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length === 0) return null;

  const parsed: ParsedImport = { speciesName: "" };

  // First line: Species @ Item (or Nickname (Species) @ Item)
  const first = lines[0];
  const [left, right] = first.split("@").map((s) => s.trim());

  const speciesCandidate = left;
  const parenMatch = speciesCandidate.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const inner = parenMatch[1].trim();
    const before = speciesCandidate.replace(/\([^)]+\)\s*$/, "").trim();
    if (/^\d+$/.test(inner) && before.length > 0) {
      // Pattern like "Gastrodon (1)" → species = Gastrodon, formNumber = 1
      parsed.speciesName = before;
      parsed.formNumber = parseInt(inner, 10);
    } else {
      // Pattern like "Nickname (Species)" → species = inner
      parsed.speciesName = inner;
    }
  } else {
    parsed.speciesName = speciesCandidate.trim();
  }

  if (right) parsed.itemName = right.trim();

  for (const line of lines.slice(1)) {
    if (/^tera\s+type\s*:/i.test(line)) {
      // explicitly ignored for now
      continue;
    }
    if (/^ability\s*:/i.test(line)) {
      parsed.abilityName = line.split(":").slice(1).join(":").trim();
      continue;
    }
    if (/^level\s*:/i.test(line)) {
      const raw = line.split(":").slice(1).join(":").trim();
      const n = parseInt(raw, 10);
      if (Number.isFinite(n)) parsed.level = n;
      continue;
    }
    if (/^evs\s*:/i.test(line)) {
      parsed.evs = parseEVsLine(line);
      continue;
    }
    // Optional explicit form line: "Form: 1" or "Form = 1"
    if (/^form\s*[:=]\s*/i.test(line)) {
      const raw = line.split(/[:=]/).slice(1).join(":").trim();
      const n = parseInt(raw, 10);
      if (Number.isFinite(n)) parsed.formNumber = n;
      continue;
    }
    if (/nature\s*$/i.test(line)) {
      parsed.nature = line.replace(/nature\s*$/i, "").trim();
      continue;
    }
    if (/^-\s+/i.test(line)) {
      const moveName = line.replace(/^-\s+/, "").trim();
      parsed.moves = parsed.moves || [];
      parsed.moves.push(moveName);
      continue;
    }
  }

  return parsed.speciesName ? parsed : null;
};

export const PokemonImportTextModal: React.FC<PokemonImportTextModalProps> = ({
  isOpen,
  onClose,
  disabled = false,
  createDefaultTeamPokemon,
  onAddPokemon,
}) => {
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const fakemons = useMemo(() => getAllFakemons(), []);
  const allItems = useMemo(() => getAllItems(), []);
  const allMoves = useMemo(() => getAllMoves(), []);

  if (!isOpen) return null;

  const resolveAndAdd = () => {
    setErrors([]);

    const parsed = parseShowdownLikeSet(text);
    if (!parsed) {
      setErrors([
        "Paste a valid set (first line must include a Pokémon name).",
      ]);
      return;
    }

    const missing: string[] = [];

    const speciesKey = normalizeKey(parsed.speciesName);
    const fakemon = fakemons.find((p) => {
      const nameKey = normalizeKey(p.name);
      const idKey = normalizeKey(p.id);
      return nameKey === speciesKey || idKey === speciesKey;
    });

    if (!fakemon) {
      setErrors([`Pokémon not found: ${parsed.speciesName}`]);
      return;
    }

    const teamPokemon = createDefaultTeamPokemon(fakemon);
    const pokemonData = getPokemonData(
      fakemon.id,
      typeof parsed.formNumber === "number" ? parsed.formNumber : undefined,
    );
    // Form number (validate availability)
    if (
      typeof parsed.formNumber === "number" &&
      Number.isFinite(parsed.formNumber)
    ) {
      const form = getFormByNumber(fakemon.id, parsed.formNumber);
      if (!form) {
        missing.push(
          `Form ${parsed.formNumber} isn't available for ${fakemon.name}`,
        );
      } else {
        teamPokemon.formNumber = parsed.formNumber;
      }
    }

    if (typeof parsed.level === "number" && Number.isFinite(parsed.level)) {
      teamPokemon.level = parsed.level;
    }

    if (parsed.nature) {
      teamPokemon.nature = parsed.nature;
    }

    if (parsed.evs) {
      const evs = [0, 0, 0, 0, 0, 0];
      if (typeof parsed.evs.hp === "number") evs[0] = parsed.evs.hp;
      if (typeof parsed.evs.atk === "number") evs[1] = parsed.evs.atk;
      if (typeof parsed.evs.def === "number") evs[2] = parsed.evs.def;
      if (typeof parsed.evs.spa === "number") evs[3] = parsed.evs.spa;
      if (typeof parsed.evs.spd === "number") evs[4] = parsed.evs.spd;
      if (typeof parsed.evs.spe === "number") evs[5] = parsed.evs.spe;
      teamPokemon.evs = evs;
    }

    // Item (Hard + Absolution only)
    if (parsed.itemName) {
      const itemKey = normalizeKey(parsed.itemName);
      const item = allItems.find((i) => normalizeKey(i.name) === itemKey);
      if (!item) {
        missing.push(`Item not found: ${parsed.itemName}`);
        teamPokemon.item_hard = "";
        teamPokemon.item_absolution = "";
      } else {
        teamPokemon.item_hard = item.id;
        teamPokemon.item_absolution = item.id;
      }
    }

    // Ability (Hard + Absolution only)
    if (parsed.abilityName && pokemonData) {
      const abilityKey = normalizeKey(parsed.abilityName);
      const ability = abilities.find(
        (a) => normalizeKey(a.name) === abilityKey,
      );

      if (!ability) {
        missing.push(`Ability not found: ${parsed.abilityName}`);
      } else {
        const availableAbilityIds = [
          ...pokemonData.abilities,
          ...pokemonData.hiddenAbilities,
        ];
        const index = availableAbilityIds.findIndex((id) => id === ability.id);
        if (index < 0) {
          missing.push(
            `Ability '${parsed.abilityName}' isn't available for ${pokemonData.name}`,
          );
        } else {
          teamPokemon.abilityIndex_hard = index;
          teamPokemon.abilityIndex_absolution = index;
        }
      }
    }

    // Moves (Hard + Absolution only)
    if (parsed.moves && parsed.moves.length > 0) {
      const moveIds: string[] = [];

      for (const moveName of parsed.moves.slice(0, 4)) {
        const moveKey = normalizeKey(moveName);
        const move = allMoves.find((m) => normalizeKey(m.name) === moveKey);
        if (!move) {
          missing.push(`Move not found: ${moveName}`);
          moveIds.push("");
        } else {
          moveIds.push(move.id);
        }
      }

      while (moveIds.length < 4) moveIds.push("");

      teamPokemon.moves_hard = moveIds;
      teamPokemon.moves_absolution = moveIds;
    }

    onAddPokemon(teamPokemon);

    if (missing.length > 0) {
      setErrors(missing);
      return;
    }

    // Clear and close on a clean import
    setText("");
    setErrors([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Import Pokémon (text)</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              "Gastrodon @ Rocky Helmet\nAbility: Sticky Hold\nEVs: 252 HP / 252 Def / 4 SpD\nTera Type: Ghost\nRelaxed Nature\n- Spikes\n- Earthquake\n- Ice Beam\n- Recover"
            }
            className="w-full h-56 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono text-sm"
          />

          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
              <div className="font-semibold mb-1">Import warnings</div>
              <ul className="list-disc pl-5">
                {errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Close
            </button>
            <button
              onClick={resolveAndAdd}
              disabled={disabled}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Import to team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
