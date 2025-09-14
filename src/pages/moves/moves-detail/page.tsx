import { getMoveById } from "@/lib/moves";
import { getTypeColor } from "@/lib/type-colors";
import { getCategoryColor, getTargetColor } from "@/lib/move-colors";
import { getCategorizedPokemonForMove } from "@/lib/move-learners";
import {
  ArrowLeft,
  Zap,
  Target,
  Eye,
  Hash,
  FileText,
  Users,
} from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";

export const MoveDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const move = id ? getMoveById(id) : null;
  const pokemonLearners = move ? getCategorizedPokemonForMove(move.id) : null;

  if (!move) {
    // En React Router no hay `notFound()`, así que redirigimos manualmente
    navigate("/moves", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/moves"
          className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Moves
        </Link>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-8 mb-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                {move.name}
              </h1>
              <div className="flex justify-center gap-4 mb-6">
                <span
                  className={`px-4 py-2 rounded-full text-white font-semibold ${getTypeColor(
                    move.type
                  )}`}
                >
                  {move.type}
                </span>
                <span
                  className={`px-4 py-2 rounded-full text-white font-semibold ${getCategoryColor(
                    move.category
                  )}`}
                >
                  {move.category}
                </span>
              </div>
              <p className="text-purple-200 text-lg leading-relaxed max-w-2xl mx-auto">
                {move.description}
              </p>
            </div>
          </div>

          {/* Move Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Basic Stats */}
            <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-6">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Move Statistics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-purple-700">
                  <span className="text-purple-200 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    Power
                  </span>
                  <span className="text-white font-bold text-lg">
                    {move.power !== null ? move.power : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-purple-700">
                  <span className="text-purple-200 flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Accuracy
                  </span>
                  <span className="text-white font-bold text-lg">
                    {move.accuracy !== null ? `${move.accuracy}%` : "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-purple-700">
                  <span className="text-purple-200 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    PP
                  </span>
                  <span className="text-white font-bold text-lg">
                    {move.totalPP}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-purple-200 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Target
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getTargetColor(
                      move.target
                    )}`}
                  >
                    {move.target}
                  </span>
                </div>
              </div>
            </div>

            {/* Move Details */}
            <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-6">
              <h3 className="text-xl font-bold text-white mb-6">
                Move Details
              </h3>
              <div className="space-y-4">
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <h4 className="text-purple-300 text-sm font-medium mb-2">
                    Type
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-white font-semibold ${getTypeColor(
                      move.type
                    )}`}
                  >
                    {move.type}
                  </span>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <h4 className="text-purple-300 text-sm font-medium mb-2">
                    Category
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-white font-semibold ${getCategoryColor(
                      move.category
                    )}`}
                  >
                    {move.category}
                  </span>
                </div>
                <div className="bg-purple-900/50 rounded-lg p-4">
                  <h4 className="text-purple-300 text-sm font-medium mb-2">
                    Target
                  </h4>
                  <span
                    className={`px-3 py-1 rounded-full text-white font-semibold ${getTargetColor(
                      move.target
                    )}`}
                  >
                    {move.target}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Power Rating Visual */}
          {move.power !== null && (
            <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">
                Power Rating
              </h3>
              <div className="relative">
                <div className="w-full bg-purple-900/50 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-500 transition-all duration-1000 ease-out"
                    style={{
                      width: `${Math.min((move.power / 150) * 100, 100)}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-purple-300 text-sm mt-2">
                  <span>0</span>
                  <span className="text-white font-bold">{move.power}</span>
                  <span>150+</span>
                </div>
              </div>
            </div>
          )}

          {/* Pokemon That Learn This Move */}
          {pokemonLearners && (
            <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Users className="h-6 w-6" />
                Pokémon That Learn This Move
              </h3>

              {pokemonLearners.levelMoves.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-purple-200 mb-4">
                    By Level Up ({pokemonLearners.levelMoves.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {pokemonLearners.levelMoves.map((pokemon) => (
                      <PokemonCard key={pokemon.id} pokemon={pokemon} />
                    ))}
                  </div>
                </div>
              )}

              {pokemonLearners.tutorMoves.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-purple-200 mb-4">
                    By Move Tutor ({pokemonLearners.tutorMoves.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {pokemonLearners.tutorMoves.map((pokemon) => (
                      <PokemonCard key={pokemon.id} pokemon={pokemon} />
                    ))}
                  </div>
                </div>
              )}

              {pokemonLearners.eggMoves.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-purple-200 mb-4">
                    By Egg Move ({pokemonLearners.eggMoves.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {pokemonLearners.eggMoves.map((pokemon) => (
                      <PokemonCard key={pokemon.id} pokemon={pokemon} />
                    ))}
                  </div>
                </div>
              )}

              {pokemonLearners.levelMoves.length === 0 &&
                pokemonLearners.tutorMoves.length === 0 &&
                pokemonLearners.eggMoves.length === 0 && (
                  <div className="text-center py-8">
                    <Users className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-purple-200 text-lg">
                      No Pokémon can learn this move yet.
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface PokemonCardProps {
  pokemon: {
    id: string;
    name: string;
    types: string[];
  };
}

const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  return (
    <Link
      to={`/fakemons/${pokemon.id}`}
      className="group bg-purple-700/30 backdrop-blur-sm rounded-lg border border-purple-500/50 p-4 hover:bg-purple-600/40 hover:border-purple-400 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1"
    >
      <h5 className="text-white font-semibold mb-2 group-hover:text-purple-200 transition-colors">
        {pokemon.name}
      </h5>
      <div className="flex gap-1 flex-wrap">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className={`px-2 py-1 rounded text-xs font-medium text-white ${getTypeColor(
              type
            )}`}
          >
            {type}
          </span>
        ))}
      </div>
    </Link>
  );
};
