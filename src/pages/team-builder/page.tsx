import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Trash2,
  Download,
  X,
  Edit,
  ExternalLink,
  Eye,
} from "lucide-react";
import { useTeamBuilder } from "./components/team-builder-context";
import { PokemonSelectorModal } from "./components/pokemon-selector-modal";
import { PokemonEditorModal } from "./components/pokemon-edit-modal";
import { TrainerEditor } from "./components/trainer-editor";
import { getTypeColor } from "@/lib/type-colors";
import type { Fakemon, FakemonForTeam } from "@/types/fakemon";
import { getPokemonData } from "@/lib/fakemons";
import { PokemonImage } from "@/components/absolution/pokemon-image";
import { pickDefaultMovesForLevel } from "@/lib/pick-default-moves";

export const TeamBuilder = () => {
  const navigate = useNavigate();
  const {
    team,
    trainer,
    addPokemon,
    removePokemon,
    updatePokemon,
    updateTrainer,
    clearTeam,
  } = useTeamBuilder();
  const [showPokemonSelector, setShowPokemonSelector] = useState(false);
  const [editingPokemon, setEditingPokemon] = useState<{
    pokemon: FakemonForTeam;
    index: number;
  } | null>(null);

  const createDefaultTeamPokemon = (pokemon: Fakemon): FakemonForTeam => {
    const level = trainer.defaultTeamLevel ?? 50;
    const pokemonData = getPokemonData(pokemon.id);
    const defaultMoves = pickDefaultMovesForLevel(pokemonData?.moves, level);

    return {
      id: pokemon.id,
      ivs: [31, 31, 31, 31, 31, 31],
      evs: [85, 85, 85, 85, 85, 85],
      level,
      nature: "Hardy",
      abilityIndex_easy: 0,
      abilityIndex_normal: 0,
      abilityIndex_hard: 1,
      abilityIndex_absolution: 2,
      item_easy: "",
      item_normal: "",
      item_hard: "ORANBERRY",
      item_absolution: "SITRUSBERRY",
      moves_easy: defaultMoves,
      moves_normal: defaultMoves,
      moves_hard: defaultMoves,
      moves_absolution: defaultMoves,
      randomId: Math.random().toString(36).substring(2, 15),
    };
  };

  const handleAddPokemon = (pokemon: Fakemon) => {
    const teamPokemon = createDefaultTeamPokemon(pokemon);
    addPokemon(teamPokemon);
  };

  const handleEditPokemon = (pokemon: FakemonForTeam, index: number) => {
    setEditingPokemon({ pokemon, index });
  };

  const handleAdvancedEdit = (index: number) => {
    // Navigate to the advanced edit page using React Router
    navigate(`/team-builder/edit/${index}`);
  };

  const handleSaveEdit = (pokemon: FakemonForTeam) => {
    if (editingPokemon) {
      updatePokemon(editingPokemon.index, pokemon);
      setEditingPokemon(null);
    }
  };

  const exportTeam = (exportAsFile = false) => {
    let exportText = "";

    exportText += `#-------------------------------\n`;
    exportText += `[${trainer.trainerID},${trainer.name}]\n`;
    exportText += `LoseText = ${trainer.loseText}\n`;
    exportText += `StartText = ${trainer.startText}\n`;

    team.forEach((pokemon) => {
      exportText += `Pokemon = ${pokemon.id},${pokemon.level}\n`;
      // Add form if not base form
      if (pokemon.formNumber && pokemon.formNumber > 0) {
        exportText += `    Form = ${pokemon.formNumber}\n`;
      }
      exportText += `    Gender = male\n`;
      exportText += `    IV = ${pokemon.ivs.join(",")}\n`;
      exportText += `    EV = ${pokemon.evs.join(",")}\n`;
      // exportText += `    Ball = ULTRABALL\n`;
      [
        pokemon.moves_easy,
        pokemon.moves_normal,
        pokemon.moves_hard,
        pokemon.moves_absolution,
      ].map((moves, idx) => {
        // Remove empty strings in the array
        moves = moves.filter((move) => move !== "");
        if (moves.length === 0) return;
        exportText += "    ";
        exportText += [
          "Moves_easy",
          "Moves_normal",
          "Moves_hard",
          "Moves_absolution",
        ][idx];
        exportText += ` = ${moves.join(",")}\n`;
      });

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
    });

    // Create and download file

    if (exportAsFile) {
      const blob = new Blob([exportText], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "team_export.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      console.clear();
      console.log(exportText);
    }

    // Set to clipboard
    navigator.clipboard.writeText(exportText);
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
              My Team ({team.length}/6)
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPokemonSelector(true)}
                disabled={team.length >= 6}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
                Add Pokémon
              </button>
              <button
                onClick={() => {
                  exportTeam(false);
                }}
                disabled={team.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Download size={20} />
                Export
              </button>
              <button
                onClick={clearTeam}
                disabled={team.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Trash2 size={20} />
                Clear
              </button>
            </div>
          </div>

          {/* Trainer Information */}
          <TrainerEditor trainer={trainer} onUpdate={updateTrainer} />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.map((teamPokemon, index) => {
              const pokemonData = getPokemonData(
                teamPokemon.id,
                teamPokemon.formNumber,
              );
              return (
                <div
                  key={`${teamPokemon.id}-${index}`}
                  className="bg-gray-50 rounded-lg p-4 relative"
                >
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() =>
                        window.open(`/fakemons/${teamPokemon.id}`, "_blank")
                      }
                      className="text-purple-500 hover:text-purple-700 p-1 bg-white rounded shadow-sm"
                      title="See"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEditPokemon(teamPokemon, index)}
                      className="text-blue-500 hover:text-blue-700 p-1 bg-white rounded shadow-sm"
                      title="Quick Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleAdvancedEdit(index)}
                      className="text-green-500 hover:text-green-700 p-1 bg-white rounded shadow-sm"
                      title="Advanced Edit"
                    >
                      <ExternalLink size={16} />
                    </button>
                    <button
                      onClick={() => removePokemon(teamPokemon.randomId)}
                      className="text-red-500 hover:text-red-700 p-1 bg-white rounded shadow-sm"
                      title="Remove"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {pokemonData && (
                    <div
                      className="text-center flex flex-col items-center"
                      onClick={() => handleEditPokemon(teamPokemon, index)}
                    >
                      <PokemonImage fakemon={pokemonData} />
                      <h3 className="font-bold text-lg">{pokemonData.name}</h3>
                      {teamPokemon.formNumber &&
                        teamPokemon.formNumber > 0 &&
                        "formName" in pokemonData && (
                          <div className="text-xs text-purple-600 font-medium -mt-1 mb-1">
                            {pokemonData.formName}
                          </div>
                        )}
                      <div className="flex justify-center gap-1 mb-2">
                        {pokemonData.types.map((type) => (
                          <span
                            key={type}
                            className={`px-2 py-1 rounded text-white text-xs ${getTypeColor(
                              type,
                            )}`}
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Level: {teamPokemon.level}</p>
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
                  <p>Empty slot</p>
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
