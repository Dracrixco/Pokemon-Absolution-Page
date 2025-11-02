import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Zap,
  Shield,
  Heart,
  RotateCcw,
  BarChart3,
  Package2,
} from "lucide-react";
import { useTeamBuilder } from "../components/team-builder-context";
import { getAllFakemons } from "@/lib/fakemons";
import { getTypeColor } from "@/lib/type-colors";
import { abilities } from "@/data/abilities";
import type { FakemonForTeam } from "@/types/fakemon";
import { PokemonImage } from "@/components/absolution/pokemon-image";
import { MoveEditorAdvanced } from "./components/move-editor-advanced";
import { ItemEditorAdvanced } from "./components/item-editor-advanced";
import { StatsEditor } from "./components/stats-editor";

type DifficultyLevel = "easy" | "normal" | "hard" | "absolution";

const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  "easy",
  "normal",
  "hard",
  "absolution",
];

const NATURE_EFFECTS = {
  Hardy: { increase: null, decrease: null },
  Adamant: { increase: "attack", decrease: "spAttack" },
  Bold: { increase: "defense", decrease: "attack" },
  Relaxed: { increase: "defense", decrease: "speed" },
  Impish: { increase: "defense", decrease: "spAttack" },
  Lax: { increase: "defense", decrease: "spDefense" },
  Timid: { increase: "speed", decrease: "attack" },
  Jolly: { increase: "speed", decrease: "spAttack" },
  Modest: { increase: "spAttack", decrease: "attack" },
  Calm: { increase: "spDefense", decrease: "attack" },
  Gentle: { increase: "spDefense", decrease: "defense" },
  Sassy: { increase: "spDefense", decrease: "speed" },
  Careful: { increase: "spDefense", decrease: "spAttack" },
} as const;

const NATURES = Object.keys(NATURE_EFFECTS) as (keyof typeof NATURE_EFFECTS)[];

export const PokemonEditPage: React.FC = () => {
  const { pokemonIndex } = useParams<{ pokemonIndex: string }>();
  const navigate = useNavigate();
  const { team, updatePokemon } = useTeamBuilder();
  const fakemons = getAllFakemons();

  const [selectedDifficulty, setSelectedDifficulty] =
    useState<DifficultyLevel>("easy");
  const [activeTab, setActiveTab] = useState<"stats" | "moves" | "items">(
    "stats",
  );
  const [editedPokemon, setEditedPokemon] = useState<FakemonForTeam | null>(
    null,
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const pokemonIndexNum = parseInt(pokemonIndex || "0");
  const originalPokemon = team[pokemonIndexNum];

  console.log("=== POKEMON EDIT PAGE DEBUG ===");
  console.log("pokemonIndex from URL:", pokemonIndex);
  console.log("pokemonIndexNum:", pokemonIndexNum);
  console.log("team:", team);
  console.log("team length:", team.length);
  console.log("originalPokemon:", originalPokemon);
  console.log("===============================");

  const pokemonData = useMemo(
    () => fakemons.find((p) => p.id === originalPokemon?.id),
    [fakemons, originalPokemon?.id],
  );

  useEffect(() => {
    if (originalPokemon) {
      setEditedPokemon({ ...originalPokemon });
    }
  }, [originalPokemon]);

  useEffect(() => {
    if (originalPokemon && editedPokemon) {
      const hasChanges =
        JSON.stringify(originalPokemon) !== JSON.stringify(editedPokemon);
      setHasUnsavedChanges(hasChanges);
    }
  }, [originalPokemon, editedPokemon]);

  if (!originalPokemon || !editedPokemon || !pokemonData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Pokémon not found
          </h1>
          <button
            onClick={() => navigate("/team-builder")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <ArrowLeft size={20} />
            Back to Team Builder
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    if (editedPokemon) {
      updatePokemon(pokemonIndexNum, editedPokemon);
      setHasUnsavedChanges(false);
      navigate("/team-builder");
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all changes?")) {
      setEditedPokemon({ ...originalPokemon });
      setHasUnsavedChanges(false);
    }
  };

  const handleNatureChange = (nature: keyof typeof NATURE_EFFECTS) => {
    setEditedPokemon((prev) => (prev ? { ...prev, nature } : null));
  };

  const handleLevelChange = (level: number) => {
    setEditedPokemon((prev) => (prev ? { ...prev, level } : null));
  };

  const getDifficultiesToUpdate = (
    currentDifficulty: DifficultyLevel,
  ): DifficultyLevel[] => {
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

  const handleMovesChange = (moves: string[]) => {
    const difficultiesToUpdate = getDifficultiesToUpdate(selectedDifficulty);

    setEditedPokemon((prev) => {
      if (!prev) return null;
      const updated = { ...prev };

      difficultiesToUpdate.forEach((difficulty) => {
        switch (difficulty) {
          case "easy":
            updated.moves_easy = [...moves];
            break;
          case "normal":
            updated.moves_normal = [...moves];
            break;
          case "hard":
            updated.moves_hard = [...moves];
            break;
          case "absolution":
            updated.moves_absolution = [...moves];
            break;
        }
      });

      return updated;
    });
  };

  const handleItemChange = (item: string) => {
    const difficultiesToUpdate = getDifficultiesToUpdate(selectedDifficulty);

    setEditedPokemon((prev) => {
      if (!prev) return null;
      const updated = { ...prev };

      difficultiesToUpdate.forEach((difficulty) => {
        switch (difficulty) {
          case "easy":
            updated.item_easy = item;
            break;
          case "normal":
            updated.item_normal = item;
            break;
          case "hard":
            updated.item_hard = item;
            break;
          case "absolution":
            updated.item_absolution = item;
            break;
        }
      });

      return updated;
    });
  };

  const handleAbilityChange = (abilityIndex: number) => {
    const difficultiesToUpdate = getDifficultiesToUpdate(selectedDifficulty);

    setEditedPokemon((prev) => {
      if (!prev) return null;
      const updated = { ...prev };

      difficultiesToUpdate.forEach((difficulty) => {
        switch (difficulty) {
          case "easy":
            updated.abilityIndex_easy = abilityIndex;
            break;
          case "normal":
            updated.abilityIndex_normal = abilityIndex;
            break;
          case "hard":
            updated.abilityIndex_hard = abilityIndex;
            break;
          case "absolution":
            updated.abilityIndex_absolution = abilityIndex;
            break;
        }
      });

      return updated;
    });
  };

  const getCurrentMoves = (): string[] => {
    const key = `moves_${selectedDifficulty}` as keyof FakemonForTeam;
    const moves = editedPokemon[key] as string[];
    if (!moves || !Array.isArray(moves)) return ["", "", "", ""];

    const paddedMoves = [...moves];
    while (paddedMoves.length < 4) paddedMoves.push("");
    return paddedMoves.slice(0, 4);
  };

  const getCurrentItem = (): string => {
    const key = `item_${selectedDifficulty}` as keyof FakemonForTeam;
    return (editedPokemon[key] as string) || "";
  };

  const getCurrentAbilityIndex = (): number => {
    const key = `abilityIndex_${selectedDifficulty}` as keyof FakemonForTeam;
    return (editedPokemon[key] as number) || 0;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/team-builder")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft size={20} />
                Back to Team
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center">
                <PokemonImage fakemon={pokemonData} />
                <div>
                  <h1 className="text-xl font-bold">
                    Editing {pokemonData.name}
                  </h1>
                  <div className="flex gap-1">
                    {pokemonData.types.map((type) => (
                      <span
                        key={type}
                        className={`px-2 py-0.5 rounded text-white text-xs ${getTypeColor(
                          type,
                        )}`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {hasUnsavedChanges && (
                <div className="flex items-center gap-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Unsaved changes</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {hasUnsavedChanges && (
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              )}
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
                disabled={!hasUnsavedChanges}
              >
                <Save size={20} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Difficulty Selector */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">Difficulty Level</h2>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTY_LEVELS.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                    selectedDifficulty === difficulty
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Changes made to <strong>{selectedDifficulty}</strong> will cascade
              to higher difficulties.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("stats")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "stats"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 size={20} />
                  Stats & Info
                </div>
              </button>
              <button
                onClick={() => setActiveTab("moves")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "moves"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap size={20} />
                  Moves
                </div>
              </button>
              <button
                onClick={() => setActiveTab("items")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "items"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Package2 size={20} />
                  Items
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg p-6">
          {activeTab === "stats" && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Heart size={20} className="text-red-500" />
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={editedPokemon.level}
                      onChange={(e) =>
                        handleLevelChange(
                          Math.max(
                            1,
                            Math.min(100, parseInt(e.target.value) || 1),
                          ),
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Nature */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nature
                    </label>
                    <select
                      value={editedPokemon.nature}
                      onChange={(e) =>
                        handleNatureChange(
                          e.target.value as keyof typeof NATURE_EFFECTS,
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {NATURES.map((nature) => {
                        const effect = NATURE_EFFECTS[nature];
                        return (
                          <option key={nature} value={nature}>
                            {nature}
                            {effect.increase &&
                              effect.decrease &&
                              ` (+${effect.increase}, -${effect.decrease})`}
                          </option>
                        );
                      })}
                    </select>
                    {NATURE_EFFECTS[
                      editedPokemon.nature as keyof typeof NATURE_EFFECTS
                    ]?.increase && (
                      <p className="text-xs text-gray-600 mt-1">
                        +
                        {
                          NATURE_EFFECTS[
                            editedPokemon.nature as keyof typeof NATURE_EFFECTS
                          ].increase
                        }
                        , -
                        {
                          NATURE_EFFECTS[
                            editedPokemon.nature as keyof typeof NATURE_EFFECTS
                          ].decrease
                        }
                      </p>
                    )}
                  </div>

                  {/* Ability */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ability ({selectedDifficulty})
                    </label>
                    <select
                      value={getCurrentAbilityIndex()}
                      onChange={(e) =>
                        handleAbilityChange(parseInt(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {[
                        ...pokemonData.abilities,
                        ...pokemonData.hiddenAbilities,
                      ].map((abilityId, index) => {
                        const ability = abilities.find(
                          (a) => a.id === abilityId,
                        );
                        return (
                          <option key={abilityId} value={index}>
                            {ability?.name || abilityId}{" "}
                            {index === 0 ? "(Primary)" : "(Secondary)"}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              {/* Stats Editor */}
              <StatsEditor
                pokemon={editedPokemon}
                onChange={setEditedPokemon}
              />
            </div>
          )}

          {activeTab === "moves" && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap size={20} className="text-yellow-500" />
                Moves ({selectedDifficulty})
              </h2>
              <MoveEditorAdvanced
                pokemon={pokemonData}
                value={getCurrentMoves()}
                onChange={handleMovesChange}
                selectedDifficulty={selectedDifficulty}
              />
            </div>
          )}

          {activeTab === "items" && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield size={20} className="text-purple-500" />
                Item ({selectedDifficulty})
              </h2>
              <ItemEditorAdvanced
                value={getCurrentItem()}
                onChange={handleItemChange}
                selectedDifficulty={selectedDifficulty}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PokemonEditPage;
