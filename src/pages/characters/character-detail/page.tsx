import { getCharacterByName } from "@/lib/characters";
import { getRoleColor } from "@/lib/character-colors";
import { ArrowLeft } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";

export const CharacterDetailPage = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const character = name ? getCharacterByName(name) : null;

  if (!character) {
    navigate("/characters", { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/characters"
          className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Characters
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - img and Basic Info */}
          <div className="space-y-6">
            {/* Main img */}
            <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-8">
              <div className="relative w-full h-96 rounded-lg overflow-hidden mb-6">
                <img
                  src={character.artwork || "/placeholder.svg"}
                  alt={character.name}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent" />
              </div>

              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {character.name}
                </h1>
                <div className="flex justify-center mb-4">
                  <span
                    className={`px-4 py-2 rounded-full text-white font-semibold ${getRoleColor(
                      character.role
                    )}`}
                  >
                    {character.role}
                  </span>
                </div>

                {/* Location */}
                {character.favorite && (
                  <div className="bg-purple-900/50 rounded-lg p-4">
                    <div className="flex items-center justify-center gap-2 text-purple-200 mb-1">
                      <span className="text-sm">Favorite Thing</span>
                    </div>
                    <div className="text-white font-bold">
                      {character.favorite}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Description and Team */}
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                About {character.name}
              </h3>
              <p className="text-purple-200 leading-relaxed">
                {character.description}
              </p>
            </div>

            {/* Additional Info */}
            <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Character Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-purple-700">
                  <span className="text-purple-200">Role</span>
                  <span className="text-white font-medium">
                    {character.role}
                  </span>
                </div>
                {character.favorite && (
                  <div className="flex justify-between items-center py-2 border-b border-purple-700">
                    <span className="text-purple-200">Favorite Thing</span>
                    <span className="text-white font-medium">
                      {character.favorite}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
