import React from "react";
import { X, Zap, Target, Clock, Users } from "lucide-react";
import { getTypeColor } from "@/lib/type-colors";
import { getMoveLearnStats } from "@/lib/move-learners";
import { PokemonImage } from "@/components/absolution/pokemon-image";
import type { Move } from "@/types/move";

interface MoveDetailModalProps {
  isOpen: boolean;
  move: Move | null;
  onClose: () => void;
}

export const MoveDetailModal: React.FC<MoveDetailModalProps> = ({
  isOpen,
  move,
  onClose,
}) => {
  if (!isOpen || !move) return null;

  const { learners, stats } = getMoveLearnStats(move.id);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Physical":
        return "bg-red-500";
      case "Special":
        return "bg-blue-500";
      case "Status":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getLearnMethodColor = (method: string) => {
    switch (method) {
      case "level":
        return "bg-green-100 text-green-800 border-green-200";
      case "tutor":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "egg":
        return "bg-pink-100 text-pink-800 border-pink-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getLearnMethodIcon = (method: string) => {
    switch (method) {
      case "level":
        return "📈";
      case "tutor":
        return "🎓";
      case "egg":
        return "🥚";
      default:
        return "❓";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-4">
            <Zap className="text-yellow-500" size={32} />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{move.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getTypeColor(
                    move.type
                  )}`}
                >
                  {move.type}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getCategoryColor(
                    move.category
                  )}`}
                >
                  {move.category}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6">
            {/* Move Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-red-50 rounded-lg p-4 text-center border border-red-200">
                <div className="text-2xl font-bold text-red-600">
                  {move.power || "—"}
                </div>
                <div className="text-sm text-red-800">Power</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">
                  {move.accuracy || "—"}
                  {move.accuracy && "%"}
                </div>
                <div className="text-sm text-blue-800">Accuracy</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                <div className="text-2xl font-bold text-green-600">
                  {move.totalPP}
                </div>
                <div className="text-sm text-green-800">PP</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
                <div className="text-lg font-bold text-purple-600">
                  <Target size={24} className="mx-auto" />
                </div>
                <div className="text-sm text-purple-800">{move.target}</div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Clock className="text-gray-500" size={20} />
                Description
              </h3>
              <p className="text-gray-700 bg-gray-50 rounded-lg p-4 leading-relaxed">
                {move.description || "No description available."}
              </p>
            </div>

            {/* Pokemon That Learn This Move */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Users className="text-gray-500" size={20} />
                Pokémon that can learn this move ({stats.total})
              </h3>

              {/* Learn Method Stats */}
              {stats.total > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {stats.byLevel > 0 && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm border ${getLearnMethodColor(
                        "level"
                      )}`}
                    >
                      {getLearnMethodIcon("level")} Level: {stats.byLevel}
                    </span>
                  )}
                  {stats.byTutor > 0 && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm border ${getLearnMethodColor(
                        "tutor"
                      )}`}
                    >
                      {getLearnMethodIcon("tutor")} Tutor: {stats.byTutor}
                    </span>
                  )}
                  {stats.byEgg > 0 && (
                    <span
                      className={`px-3 py-1 rounded-full text-sm border ${getLearnMethodColor(
                        "egg"
                      )}`}
                    >
                      {getLearnMethodIcon("egg")} Egg: {stats.byEgg}
                    </span>
                  )}
                </div>
              )}

              {/* Pokemon List */}
              {stats.total === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No Pokémon can learn this move</p>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-1 gap-2 p-4">
                    {learners.map((learner, index) => (
                      <div
                        key={`${learner.pokemon.id}-${learner.learnMethod}-${index}`}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 flex-shrink-0">
                            <PokemonImage fakemon={learner.pokemon} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {learner.pokemon.name}
                            </h4>
                            <div className="flex gap-1">
                              {learner.pokemon.types.map((type) => (
                                <span
                                  key={type}
                                  className={`px-2 py-0.5 rounded text-white text-xs ${getTypeColor(
                                    type
                                  )}`}
                                >
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs border ${getLearnMethodColor(
                              learner.learnMethod
                            )}`}
                          >
                            {getLearnMethodIcon(learner.learnMethod)}{" "}
                            {learner.learnMethod}
                          </span>
                          {learner.level && (
                            <div className="text-xs text-gray-500 mt-1">
                              Level {learner.level}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
