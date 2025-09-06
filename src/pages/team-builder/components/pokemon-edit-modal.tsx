import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { fakemons } from "@/data/pokemon_absolution";
import { moves } from "@/data/moves";
import { abilities } from "@/data/abilities";
import { getTypeColor } from "@/lib/type-colors";
import type { FakemonForTeam } from "@/types/fakemon";

interface PokemonEditorModalProps {
  isOpen: boolean;
  pokemon: FakemonForTeam | null;
  onClose: () => void;
  onSave: (pokemon: FakemonForTeam) => void;
}

const NATURES = [
  "Hardy",
  "Lonely",
  "Brave",
  "Adamant",
  "Naughty",
  "Bold",
  "Docile",
  "Relaxed",
  "Impish",
  "Lax",
  "Timid",
  "Hasty",
  "Serious",
  "Jolly",
  "Naive",
  "Modest",
  "Mild",
  "Quiet",
  "Bashful",
  "Rash",
  "Calm",
  "Gentle",
  "Sassy",
  "Careful",
  "Quirky",
];

const DIFFICULTY_LEVELS = ["easy", "normal", "hard", "absolution"] as const;

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
    useState<string>("absolution");

  useEffect(() => {
    if (pokemon) {
      setEditedPokemon({ ...pokemon });
    }
  }, [pokemon]);

  if (!isOpen || !pokemon || !editedPokemon) return null;

  const pokemonData = fakemons.find((p) => p.id === pokemon.id);
  if (!pokemonData) return null;

  const handleSave = () => {
    if (editedPokemon) {
      onSave(editedPokemon);
      onClose();
    }
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
    const difficultyKey = `moves_${selectedDifficulty}` as keyof FakemonForTeam;
    const currentMoves = [...(editedPokemon[difficultyKey] as string[])];
    currentMoves[index] = moveId;
    setEditedPokemon({
      ...editedPokemon,
      [difficultyKey]: currentMoves,
    });
  };

  const getCurrentMoves = () => {
    const difficultyKey = `moves_${selectedDifficulty}` as keyof FakemonForTeam;
    return editedPokemon[difficultyKey] as string[];
  };

  const getCurrentItem = () => {
    const itemKey = `item_${selectedDifficulty}` as keyof FakemonForTeam;
    return editedPokemon[itemKey] as string;
  };

  const handleItemChange = (item: string) => {
    const itemKey = `item_${selectedDifficulty}` as keyof FakemonForTeam;
    setEditedPokemon({
      ...editedPokemon,
      [itemKey]: item,
    });
  };

  const getCurrentAbilityIndex = () => {
    const abilityKey =
      `abilityIndex_${selectedDifficulty}` as keyof FakemonForTeam;
    return editedPokemon[abilityKey] as number;
  };

  const handleAbilityIndexChange = (index: number) => {
    const abilityKey =
      `abilityIndex_${selectedDifficulty}` as keyof FakemonForTeam;
    setEditedPokemon({
      ...editedPokemon,
      [abilityKey]: index,
    });
  };

  const statNames = [
    "HP",
    "Ataque",
    "Defensa",
    "At. Esp",
    "Def. Esp",
    "Velocidad",
  ];
  const availableMoves = pokemonData.moves || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src={pokemonData.sprite}
              alt={pokemonData.name}
              className="w-16 h-16"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAxNkMzOC42Mjc0IDE2IDQ0IDIxLjM3MjYgNDQgMjhDNDQgMzQuNjI3NCAzOC42Mjc0IDQwIDMyIDQwQzI1LjM3MjYgNDAgMjAgMzQuNjI3NCAyMCAyOEMyMCAyMS4zNzI2IDI1LjM3MjYgMTYgMzIgMTZaIiBmaWxsPSIjRDFENURCIi8+CjxjaXJjbGUgY3g9IjI4IiBjeT0iMjUuNiIgcj0iMi40IiBmaWxsPSIjNkI3MjgwIi8+CjxjaXJjbGUgY3g9IjM2IiBjeT0iMjUuNiIgcj0iMi40IiBmaWxsPSIjNkI3MjgwIi8+CjxwYXRoIGQ9Ik0yOCAzMkMyOCAzMi44ODM2IDI4Ljg5NTQgMzMuNiAzMCAzMy42SDM0QzM1LjEwNDYgMzMuNiAzNiAzMi44ODM2IDM2IDMyVjMxLjJIMjhWMzJaIiBmaWxsPSIjNkI3MjgwIi8+Cjwvc3ZnPg==";
              }}
            />
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
              Guardar
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
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nivel</label>
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
              <label className="block text-sm font-medium mb-1">
                Naturaleza
              </label>
              <select
                value={editedPokemon.nature}
                onChange={(e) =>
                  setEditedPokemon({ ...editedPokemon, nature: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {NATURES.map((nature) => (
                  <option key={nature} value={nature}>
                    {nature}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Difficulty Level Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Configuración para Dificultad
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
          </div>

          {/* Current Difficulty Settings */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-bold mb-4 capitalize">
              Configuración -{" "}
              {selectedDifficulty === "absolution"
                ? "Absolution"
                : selectedDifficulty}
            </h3>

            {/* Ability */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Habilidad
              </label>
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
                      {ability?.name || abilityId}
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
                      {ability?.name || abilityId} (Oculta)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Item */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Objeto</label>
              <input
                type="text"
                value={getCurrentItem()}
                onChange={(e) => handleItemChange(e.target.value)}
                placeholder="Ej: SITRUSBERRY"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Moves */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Movimientos
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {getCurrentMoves().map((moveId, index) => (
                  <select
                    key={index}
                    value={moveId || ""}
                    onChange={(e) => handleMoveChange(index, e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar movimiento</option>
                    {availableMoves.map((availableMoveId) => {
                      const move = moves.find((m) => m.id === availableMoveId);
                      return (
                        <option key={availableMoveId} value={availableMoveId}>
                          {move?.name || availableMoveId}
                        </option>
                      );
                    })}
                  </select>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IVs */}
            <div>
              <h3 className="font-bold mb-3">IVs (0-31)</h3>
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
              <h3 className="font-bold mb-3">EVs (0-255)</h3>
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
