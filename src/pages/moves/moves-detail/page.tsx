import { getMoveById } from "@/lib/moves";
import { getTypeColor } from "@/lib/type-colors";
import { getCategoryColor, getTargetColor } from "@/lib/move-colors";
import { ArrowLeft, Zap, Target, Eye, Hash, FileText } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";

export const MoveDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const move = id ? getMoveById(id) : null;

  if (!move) {
    // En React Router no hay `notFound()`, así que redirigimos manualmente
    navigate("/fakemons", { replace: true });
    return null;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/fakemons"
          className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Fakemons
        </Link>

        <div className="max-w-4xl mx-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-6 mt-8">
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
        </div>
      </div>
    </div>
  );
};
