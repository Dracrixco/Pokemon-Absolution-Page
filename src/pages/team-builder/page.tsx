import { useState } from "react";
import { Plus, Trash2, Download, X, Edit } from "lucide-react";
import { useTeamBuilder } from "./components/team-builder-context";
import { PokemonSelectorModal } from "./components/pokemon-selector-modal";
import { PokemonEditorModal } from "./components/pokemon-edit-modal";
import { fakemons } from "@/data/pokemon_absolution";
import { getTypeColor } from "@/lib/type-colors";
import type { Fakemon, FakemonForTeam } from "@/types/fakemon";

export const TeamBuilder = () => {
  const { team, addPokemon, removePokemon, updatePokemon, clearTeam } =
    useTeamBuilder();
  const [showPokemonSelector, setShowPokemonSelector] = useState(false);
  const [editingPokemon, setEditingPokemon] = useState<{
    pokemon: FakemonForTeam;
    index: number;
  } | null>(null);

  const createDefaultTeamPokemon = (pokemon: Fakemon): FakemonForTeam => ({
    id: pokemon.id,
    ivs: [31, 31, 31, 31, 31, 31],
    evs: [0, 252, 0, 0, 0, 252],
    level: 50,
    nature: "Hardy",
    abilityIndex_easy: 0,
    abilityIndex_normal: 0,
    abilityIndex_hard: 1,
    abilityIndex_absolution: 1,
    item_easy: "",
    item_normal: "",
    item_hard: "ORANBERRY",
    item_absolution: "SITRUSBERRY",
    moves_easy: pokemon.moves?.slice(0, 1) || ["TACKLE"],
    moves_normal: pokemon.moves?.slice(0, 2) || ["TACKLE", "GROWL"],
    moves_hard: pokemon.moves?.slice(0, 3) || [
      "TACKLE",
      "GROWL",
      "QUICKATTACK",
    ],
    moves_absolution: pokemon.moves?.slice(0, 4) || [
      "TACKLE",
      "GROWL",
      "QUICKATTACK",
      "BITE",
    ],
  });

  const handleAddPokemon = (pokemon: Fakemon) => {
    const teamPokemon = createDefaultTeamPokemon(pokemon);
    addPokemon(teamPokemon);
  };

  const handleEditPokemon = (pokemon: FakemonForTeam, index: number) => {
    setEditingPokemon({ pokemon, index });
  };

  const handleSaveEdit = (pokemon: FakemonForTeam) => {
    if (editingPokemon) {
      updatePokemon(editingPokemon.index, pokemon);
      setEditingPokemon(null);
    }
  };

  const exportTeam = () => {
    let exportText = "";

    team.forEach((pokemon, index) => {
      exportText += `Pokemon = ${pokemon.id},5\n`;
      exportText += `    Gender = male\n`;
      exportText += `    IV = ${pokemon.ivs.join(",")}\n`;
      exportText += `    EV = ${pokemon.evs.join(",")}\n`;
      exportText += `    Ball = ULTRABALL\n`;
      exportText += `    Moves_easy = ${pokemon.moves_easy.join(",")}\n`;
      exportText += `    Moves_normal = ${pokemon.moves_normal.join(",")}\n`;
      exportText += `    Moves_hard = ${pokemon.moves_hard.join(",")}\n`;
      exportText += `    Moves_absolution = ${pokemon.moves_absolution.join(
        ","
      )}\n`;

      // Solo incluir items si no están vacíos
      if (pokemon.item_hard) {
        exportText += `    Item_hard = ${pokemon.item_hard}\n`;
      }
      if (pokemon.item_absolution) {
        exportText += `    Item_absolution = ${pokemon.item_absolution}\n`;
      }

      exportText += `    AbilityIndex_easy = ${pokemon.abilityIndex_easy}\n`;
      exportText += `    AbilityIndex_normal = ${pokemon.abilityIndex_normal}\n`;
      exportText += `    AbilityIndex_hard = ${pokemon.abilityIndex_hard}\n`;
      exportText += `    AbilityIndex_absolution = ${pokemon.abilityIndex_absolution}\n`;

      if (index < team.length - 1) {
        exportText += "\n";
      }
    });

    // Create and download file
    const blob = new Blob([exportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "team_export.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Team Builder - Fakemon
        </h1>

        {/* Team Display */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Mi Equipo ({team.length}/6)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPokemonSelector(true)}
                disabled={team.length >= 6}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
                Agregar Pokémon
              </button>
              <button
                onClick={exportTeam}
                disabled={team.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Download size={20} />
                Exportar
              </button>
              <button
                onClick={clearTeam}
                disabled={team.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Trash2 size={20} />
                Limpiar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map((teamPokemon, index) => {
              const pokemonData = fakemons.find((p) => p.id === teamPokemon.id);
              return (
                <div
                  key={`${teamPokemon.id}-${index}`}
                  className="bg-gray-50 rounded-lg p-4 relative"
                >
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => handleEditPokemon(teamPokemon, index)}
                      className="text-blue-500 hover:text-blue-700 p-1"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => removePokemon(teamPokemon.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {pokemonData && (
                    <div className="text-center">
                      <img
                        src={pokemonData.sprite}
                        alt={pokemonData.name}
                        className="w-20 h-20 mx-auto mb-2"
                        onError={(e) => {
                          e.currentTarget.src =
                            "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00MCAyMEM0OC4yODQzIDIwIDU1IDI2LjcxNTcgNTUgMzVDNTUgNDMuMjg0MyA0OC4yODQzIDUwIDQwIDUwQzMxLjcxNTcgNTAgMjUgNDMuMjg0MyAyNSAzNUMyNSAyNi43MTU3IDMxLjcxNTcgMjAgNDAgMjBaIiBmaWxsPSIjRDFENURCIi8+CjxjaXJjbGUgY3g9IjM1IiBjeT0iMzIiIHI9IjMiIGZpbGw9IiM2QjcyODAiLz4KPGNpcmNsZSBjeD0iNDUiIGN5PSIzMiIgcj0iMyIgZmlsbD0iIzZCNzI4MCIvPgo8cGF0aCBkPSJNMzUgNDBDMzUgNDEuMTA0NiAzNS44OTU0IDQyIDM3IDQySDQzQzQ0LjEwNDYgNDIgNDUgNDEuMTA0NiA0NSA0MFYzOUgzNVY0MFoiIGZpbGw9IiM2QjcyODAiLz4KPC9zdmc+";
                        }}
                      />
                      <h3 className="font-bold text-lg">{pokemonData.name}</h3>
                      <div className="flex justify-center gap-1 mb-2">
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
                      <div className="text-sm text-gray-600">
                        <p>Nivel: {teamPokemon.level}</p>
                        <p>Naturaleza: {teamPokemon.nature}</p>
                        <p className="text-xs mt-1">
                          EVs: {teamPokemon.evs.join("/")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Empty slots */}
            {Array.from({ length: 6 - team.length }).map((_, index) => (
              <div
                onClick={() => setShowPokemonSelector(true)}
                key={`empty-${index}`}
                className="bg-gray-200 rounded-lg p-4 h-48 flex items-center justify-center border-2 border-dashed border-gray-400"
              >
                <div className="text-center text-gray-500">
                  <Plus size={40} className="mx-auto mb-2 opacity-50" />
                  <p>Slot vacío</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pokemon Selector Modal */}
        <PokemonSelectorModal
          isOpen={showPokemonSelector}
          onClose={() => setShowPokemonSelector(false)}
          onSelectPokemon={handleAddPokemon}
        />

        {/* Pokemon Editor Modal */}
        <PokemonEditorModal
          isOpen={!!editingPokemon}
          pokemon={editingPokemon?.pokemon || null}
          onClose={() => setEditingPokemon(null)}
          onSave={handleSaveEdit}
        />
      </div>
    </div>
  );
};

export default TeamBuilder;
