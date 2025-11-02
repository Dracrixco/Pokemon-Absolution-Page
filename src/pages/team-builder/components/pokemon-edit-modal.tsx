import React, { useState, useEffect } from "react";
import { X, Save, Sparkles } from "lucide-react";
import { getPokemonData } from "@/lib/fakemons";
import { getFormsByBaseId } from "@/lib/pokemon-forms";
import { abilities } from "@/data/abilities";
import { getTypeColor } from "@/lib/type-colors";
import type { FakemonForTeam } from "@/types/fakemon";
import { ItemSelector } from "./pokemon-item-selector";
import { MoveSelector } from "./pokemon-move-selector";
import { PokemonImage } from "@/components/absolution/pokemon-image";
import { cn } from "@/lib/utils";

interface PokemonEditorModalProps {
  isOpen: boolean;
  pokemon: FakemonForTeam | null;
  onClose: () => void;
  onSave: (pokemon: FakemonForTeam) => void;
}

type applyEVPresetType =
  | "physical"
  | "special"
  | "tank"
  | "Physicalspeedy"
  | "Specialspeedy"
  | "mixed";

const NATURE_EFFECTS = {
  // attack =======================================
  Adamant: {
    increase: "attack",
    decrease: "spAttack",
    applyEVPresetType: "Physicalspeedy",
  },
  // defense =======================================
  Bold: { increase: "defense", decrease: "attack", applyEVPresetType: "tank" },
  Relaxed: {
    increase: "defense",
    decrease: "speed",
    applyEVPresetType: "tank",
  },
  Impish: {
    increase: "defense",
    decrease: "spAttack",
    applyEVPresetType: "tank",
  },
  Lax: {
    increase: "defense",
    decrease: "spDefense",
    applyEVPresetType: "tank",
  },
  //  speed =======================================
  Timid: {
    increase: "speed",
    decrease: "attack",
    applyEVPresetType: "Physicalspeedy",
  },
  Jolly: {
    increase: "speed",
    decrease: "spAttack",
    applyEVPresetType: "Specialspeedy",
  },
  // special attack =======================================
  Modest: {
    increase: "spAttack",
    decrease: "attack",
    applyEVPresetType: "Specialspeedy",
  },
  // special defense =======================================
  Calm: {
    increase: "spDefense",
    decrease: "attack",
    applyEVPresetType: "Physicalspeedy",
  },
  Gentle: {
    increase: "spDefense",
    decrease: "defense",
    applyEVPresetType: "Specialspeedy",
  },
  Sassy: {
    increase: "spDefense",
    decrease: "speed",
    applyEVPresetType: "Specialspeedy",
  },
  Careful: {
    increase: "spDefense",
    decrease: "spAttack",
    applyEVPresetType: "Specialspeedy",
  },
} as const;

const NATURES = Object.keys(NATURE_EFFECTS) as (keyof typeof NATURE_EFFECTS)[];

type DIFFICULTY_LEVELS_TYPE = "easy" | "normal" | "hard" | "absolution";
const DIFFICULTY_LEVELS = ["easy", "normal", "hard", "absolution"] as const;

// Function to get difficulties that should be updated in cascade
const getDifficultiesToUpdate = (
  currentDifficulty: DIFFICULTY_LEVELS_TYPE
): DIFFICULTY_LEVELS_TYPE[] => {
  switch (currentDifficulty) {
    case "easy":
      return ["easy", "normal", "hard", "absolution"];
    case "normal":
      return ["normal", "hard", "absolution"];
    case "hard":
      return ["hard", "absolution"];
    case "absolution":
      return ["absolution"];
    default:
      return [currentDifficulty];
  }
};

export const PokemonEditorModal: React.FC<PokemonEditorModalProps> = ({
  isOpen,
  pokemon,
  onClose,
  onSave,
}) => {
  const [editedPokemon, setEditedPokemon] = useState<FakemonForTeam | null>(
    null
  );
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DIFFICULTY_LEVELS_TYPE>("easy");

  useEffect(() => {
    if (pokemon) {
      setEditedPokemon({ ...pokemon });
    }
  }, [pokemon]);

  if (!isOpen || !pokemon || !editedPokemon) return null;

  // Get available forms for this pokemon
  const availableForms = getFormsByBaseId(pokemon.id);

  // Get pokemon data considering the selected form
  const pokemonData = getPokemonData(pokemon.id, editedPokemon.formNumber);

  if (!pokemonData) return null;

  const handleSave = () => {
    setSelectedDifficulty("easy");
    if (editedPokemon) {
      onSave(editedPokemon);
      onClose();
    }
  };

  // Aplicar preset basado en la naturaleza
  const applyNaturePreset = (nature: keyof typeof NATURE_EFFECTS) => {
    const effect = NATURE_EFFECTS[nature];
    const applyEVPresetType = effect.applyEVPresetType;
    applyEVPreset(applyEVPresetType);
  };

  const handleEVChange = (index: number, value: string) => {
    const numValue = Math.max(0, Math.min(255, parseInt(value) || 0));
    const newEvs = [...editedPokemon.evs];
    newEvs[index] = numValue;
    setEditedPokemon({ ...editedPokemon, evs: newEvs });
  };

  const handleIVChange = (index: number, value: string) => {
    const numValue = Math.max(0, Math.min(31, parseInt(value) || 0));
    const newIvs = [...editedPokemon.ivs];
    newIvs[index] = numValue;
    setEditedPokemon({ ...editedPokemon, ivs: newIvs });
  };

  const handleMoveChange = (index: number, moveId: string) => {
    const difficultiesToUpdate = getDifficultiesToUpdate(selectedDifficulty);

    setEditedPokemon((prev) => {
      if (!prev) return null;

      const updated = { ...prev };

      // Aplicar cambio a todas las dificultades en cascada
      difficultiesToUpdate.forEach((difficulty) => {
        const difficultyKey = `moves_${difficulty}` as
          | "moves_easy"
          | "moves_normal"
          | "moves_hard"
          | "moves_absolution";
        const currentMoves = [...(updated[difficultyKey] as string[])];

        // Asegurar que siempre tengamos 4 slots
        while (currentMoves.length < 4) {
          currentMoves.push("");
        }

        currentMoves[index] = moveId;
        updated[difficultyKey] = currentMoves;
      });

      return updated;
    });
  };

  const getCurrentMoves = () => {
    const difficultyKey = `moves_${selectedDifficulty}` as keyof FakemonForTeam;
    const moves = editedPokemon[difficultyKey] as string[];

    // Verificar si moves existe y es un array
    if (!moves || !Array.isArray(moves)) {
      return ["", "", "", ""];
    }

    // Asegurar que siempre tengamos 4 slots
    const paddedMoves = [...moves];
    while (paddedMoves.length < 4) {
      paddedMoves.push("");
    }

    return paddedMoves.slice(0, 4);
  };

  const getCurrentItem = () => {
    const itemKey = `item_${selectedDifficulty}` as keyof FakemonForTeam;
    const item = editedPokemon[itemKey] as string;
    // Asegurar que devolvemos un string válido
    return item || "";
  };

  const getCurrentAbilityIndex = () => {
    const abilityKey =
      `abilityIndex_${selectedDifficulty}` as keyof FakemonForTeam;
    const abilityIndex = editedPokemon[abilityKey] as number;
    // Asegurar que devolvemos un número válido
    return typeof abilityIndex === "number" ? abilityIndex : 0;
  };

  const handleItemChange = (item: string) => {
    const difficultiesToUpdate = getDifficultiesToUpdate(selectedDifficulty);

    setEditedPokemon((prev) => {
      if (!prev) return null;

      const updated = { ...prev };

      // Aplicar cambio a todas las dificultades en cascada
      difficultiesToUpdate.forEach((difficulty) => {
        const itemKey = `item_${difficulty}` as
          | "item_easy"
          | "item_normal"
          | "item_hard"
          | "item_absolution";
        updated[itemKey] = item;
      });

      return updated;
    });
  };

  const handleAbilityIndexChange = (index: number) => {
    const difficultiesToUpdate = getDifficultiesToUpdate(selectedDifficulty);

    setEditedPokemon((prev) => {
      if (!prev) return null;

      const updated = { ...prev };

      // Aplicar cambio a todas las dificultades en cascada
      difficultiesToUpdate.forEach((difficulty) => {
        const abilityKey = `abilityIndex_${difficulty}` as
          | "abilityIndex_easy"
          | "abilityIndex_normal"
          | "abilityIndex_hard"
          | "abilityIndex_absolution";
        updated[abilityKey] = index;
      });

      return updated;
    });
  };

  // Presets comunes de EVs
  const applyEVPreset = (preset: applyEVPresetType) => {
    let newEvs = [0, 0, 0, 0, 0, 0];

    switch (preset) {
      case "physical":
        newEvs = [252, 252, 0, 0, 0, 4]; // HP/Atk/Speed
        break;
      case "special":
        newEvs = [252, 0, 0, 252, 0, 4]; // HP/SpAtk/Speed
        break;
      case "tank":
        newEvs = [252, 0, 252, 0, 4, 0]; // HP/Def/SpDef
        break;
      case "Physicalspeedy":
        newEvs = [4, 252, 0, 0, 0, 252]; // HP/Atk/Speed
        break;
      case "Specialspeedy":
        newEvs = [4, 0, 0, 252, 0, 252]; // HP/SpAtk/Speed
        break;
      case "mixed":
        newEvs = [252, 126, 0, 126, 0, 4]; // HP/Atk/SpAtk/Speed
        break;
    }

    setEditedPokemon({ ...editedPokemon, evs: newEvs });
  };

  const statNames = ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"];
  const availableMoves = [
    ...(pokemonData.moves || []),
    ...(pokemonData.eggMoves || []),
    ...(pokemonData.tutorMoves || []),
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
          <div className="flex items-center gap-4">
            <PokemonImage fakemon={pokemonData} />

            <div>
              <h2 className="text-2xl font-bold">{pokemonData.name}</h2>
              <div className="flex gap-1">
                {pokemonData.types.map((type) => (
                  <span
                    key={type}
                    className={`px-2 py-1 rounded text-white text-xs ${getTypeColor(
                      type
                    )}`}
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Save size={20} />
              Save
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Form Selector */}
          {availableForms.length > 0 && (
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-purple-900">
                <Sparkles className="h-5 w-5" />
                Available Forms
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {/* Base Form */}
                <button
                  type="button"
                  onClick={() =>
                    setEditedPokemon({ ...editedPokemon, formNumber: 0 })
                  }
                  className={cn(
                    "bg-white rounded-lg p-3 border-2 transition-all hover:scale-105",
                    !editedPokemon.formNumber || editedPokemon.formNumber === 0
                      ? "border-purple-500 shadow-lg shadow-purple-300"
                      : "border-gray-300 hover:border-purple-300"
                  )}
                >
                  <div className="relative">
                    <img
                      src={getPokemonData(pokemon.id, 0)?.sprite}
                      alt="Base Form"
                      className="w-full h-16 object-contain mb-2"
                      onError={(e) => {
                        e.currentTarget.src = "/Front/MISSINGNO.png";
                      }}
                    />
                  </div>
                  <div className="text-xs font-medium text-center text-gray-700">
                    Base Form
                  </div>
                </button>

                {/* Other Forms */}
                {availableForms.map((form) => (
                  <button
                    key={`${form.baseId}-${form.formNumber}`}
                    type="button"
                    onClick={() =>
                      setEditedPokemon({
                        ...editedPokemon,
                        formNumber: form.formNumber,
                      })
                    }
                    className={cn(
                      "bg-white rounded-lg p-3 border-2 transition-all hover:scale-105",
                      editedPokemon.formNumber === form.formNumber
                        ? "border-purple-500 shadow-lg shadow-purple-300"
                        : "border-gray-300 hover:border-purple-300"
                    )}
                  >
                    <div className="relative">
                      <img
                        src={form.sprite}
                        alt={form.formName}
                        className="w-full h-16 object-contain mb-2"
                        onError={(e) => {
                          e.currentTarget.src = "/Front/MISSINGNO.png";
                        }}
                      />
                      {form.megaStone && (
                        <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-1 py-0.5 rounded">
                          ⭐
                        </div>
                      )}
                    </div>
                    <div
                      className="text-xs font-medium text-center text-gray-700 truncate"
                      title={form.formName}
                    >
                      {form.formName}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Level</label>
              <input
                type="number"
                min="1"
                max="100"
                value={editedPokemon.level}
                onChange={(e) =>
                  setEditedPokemon({
                    ...editedPokemon,
                    level: Math.max(
                      1,
                      Math.min(100, parseInt(e.target.value) || 1)
                    ),
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nature</label>
              <div className="flex gap-2">
                <select
                  value={editedPokemon.nature}
                  onChange={(e) =>
                    setEditedPokemon({
                      ...editedPokemon,
                      nature: e.target.value,
                    })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {NATURES.map((nature) => {
                    const effect = NATURE_EFFECTS[nature];
                    return (
                      <option key={nature} value={nature}>
                        {nature}
                        {effect.increase && effect.decrease
                          ? ` (+${effect.increase}, -${effect.decrease})`
                          : " (Neutral)"}
                      </option>
                    );
                  })}
                </select>
                <button
                  onClick={() =>
                    applyNaturePreset(
                      editedPokemon.nature as keyof typeof NATURE_EFFECTS
                    )
                  }
                  className="px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm"
                >
                  Apply Preset
                </button>
              </div>
            </div>
          </div>

          {/* Difficulty Level Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Configuration for Difficulty
            </label>
            <div className="flex gap-2">
              {DIFFICULTY_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedDifficulty(level)}
                  className={`px-4 py-2 rounded-lg capitalize ${
                    selectedDifficulty === level
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {level === "absolution" ? "Absolution" : level}
                </button>
              ))}
            </div>

            {/* Cascade Info */}
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Cascade:</span> Changes in{" "}
              <span className="font-semibold capitalize">
                {selectedDifficulty === "absolution"
                  ? "Absolution"
                  : selectedDifficulty}
              </span>{" "}
              will apply to:{" "}
              <span className="text-blue-600">
                {getDifficultiesToUpdate(selectedDifficulty)
                  .map((d) => (d === "absolution" ? "Absolution" : d))
                  .join(" → ")}
              </span>
            </div>
          </div>

          {/* Current Difficulty Settings */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold mb-4 capitalize">
              Configuration -{" "}
              {selectedDifficulty === "absolution"
                ? "Absolution"
                : selectedDifficulty}
            </h3>

            {/* Moves */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Moves (4 slots)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getCurrentMoves().map((moveId, index) => (
                  <div key={index}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Move {index + 1}
                    </label>
                    <MoveSelector
                      value={moveId}
                      onChange={(newMoveId: string) =>
                        handleMoveChange(index, newMoveId)
                      }
                      availableMoves={availableMoves}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Item */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Item</label>
              <ItemSelector
                value={getCurrentItem()}
                onChange={handleItemChange}
              />
            </div>

            {/* Ability */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Ability</label>
              <select
                value={getCurrentAbilityIndex()}
                onChange={(e) =>
                  handleAbilityIndexChange(parseInt(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {pokemonData.abilities.map((abilityId, index) => {
                  const ability = abilities.find((a) => a.id === abilityId);
                  return (
                    <option key={index} value={index}>
                      {ability?.name || abilityId} - {ability?.description}
                    </option>
                  );
                })}
                {pokemonData.hiddenAbilities.map((abilityId, index) => {
                  const ability = abilities.find((a) => a.id === abilityId);
                  return (
                    <option
                      key={pokemonData.abilities.length + index}
                      value={pokemonData.abilities.length + index}
                    >
                      {ability?.name || abilityId} (Hidden) -{" "}
                      {ability?.description}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* EV Presets */}
          <div>
            <label className="block text-sm font-medium mb-2">EV Presets</label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => applyEVPreset("physical")}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Physical (HP/Atk/Spe)
              </button>
              <button
                onClick={() => applyEVPreset("special")}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Special (HP/SpA/Spe)
              </button>
              <button
                onClick={() => applyEVPreset("tank")}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Tank (HP/Def/SpD)
              </button>
              <button
                onClick={() => applyEVPreset("Physicalspeedy")}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                Fast (Atk/Spe)
              </button>
              <button
                onClick={() => applyEVPreset("Specialspeedy")}
                className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600"
              >
                Fast (SpA/Spe)
              </button>
              <button
                onClick={() => applyEVPreset("mixed")}
                className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
              >
                Mixed (HP/Atk/SpA)
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IVs */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">IVs (0-31)</h3>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      setEditedPokemon({
                        ...editedPokemon,
                        ivs: [31, 31, 31, 31, 31, 31],
                      })
                    }
                    className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                  >
                    Max
                  </button>
                  <button
                    onClick={() =>
                      setEditedPokemon({
                        ...editedPokemon,
                        ivs: [0, 0, 0, 0, 0, 0],
                      })
                    }
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                  >
                    Min
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {statNames.map((stat, index) => (
                  <div key={stat} className="flex items-center justify-between">
                    <label className="text-sm font-medium w-20">{stat}:</label>
                    <input
                      type="number"
                      min="0"
                      max="31"
                      value={editedPokemon.ivs[index]}
                      onChange={(e) => handleIVChange(index, e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* EVs */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold">EVs (0-255)</h3>
                <button
                  onClick={() =>
                    setEditedPokemon({
                      ...editedPokemon,
                      evs: [0, 0, 0, 0, 0, 0],
                    })
                  }
                  className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                >
                  Reset
                </button>
              </div>
              <div className="space-y-2">
                {statNames.map((stat, index) => (
                  <div key={stat} className="flex items-center justify-between">
                    <label className="text-sm font-medium w-20">{stat}:</label>
                    <input
                      type="number"
                      min="0"
                      max="255"
                      value={editedPokemon.evs[index]}
                      onChange={(e) => handleEVChange(index, e.target.value)}
                      className="w-16 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Total EVs: {editedPokemon.evs.reduce((sum, ev) => sum + ev, 0)}
                /510
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
