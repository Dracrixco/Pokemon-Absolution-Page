import { useParams, useNavigate } from "react-router-dom";
import { getFormByNumber } from "@/lib/pokemon-forms";
import { getTypeColor } from "@/lib/type-colors";
import { cn } from "@/lib/utils";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function FormDetailPage() {
  const { baseId, formNumber } = useParams<{
    baseId: string;
    formNumber: string;
  }>();
  const navigate = useNavigate();

  if (!baseId || !formNumber) {
    return <div>Form not found</div>;
  }

  const form = getFormByNumber(baseId, parseInt(formNumber));

  if (!form) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Form Not Found</h1>
          <button
            onClick={() => navigate("/forms")}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Forms
          </button>
        </div>
      </div>
    );
  }

  const totalStats = Object.values(form.stats).reduce((a, b) => a + b, 0);
  const maxStat = Math.max(...Object.values(form.stats));

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate("/forms")}
          className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Forms</span>
        </button>

        {/* Header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Image */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src={form.sprite}
                  alt={`${form.name} - ${form.formName}`}
                  className="w-64 h-64 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/Front/MISSINGNO.png";
                  }}
                />
                {form.megaStone && (
                  <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-2 rounded-lg font-bold flex items-center gap-2">
                    <Sparkles size={16} />
                    <span>MEGA</span>
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                <div className="text-white/60 text-sm mb-1">Base Pokémon</div>
                <div className="text-white text-2xl font-bold">
                  {form.baseId}
                </div>
              </div>
            </div>

            {/* Right: Info */}
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">
                {form.name || form.baseId}
              </h1>
              <div className="text-purple-300 text-2xl font-medium mb-4">
                {form.formName}
              </div>

              {form.megaStone && (
                <div className="bg-purple-600/30 border border-purple-400/50 rounded-lg p-3 mb-4">
                  <div className="text-white/70 text-sm">
                    Mega Stone Required
                  </div>
                  <div className="text-white font-bold text-lg">
                    {form.megaStone}
                  </div>
                </div>
              )}

              {/* Types */}
              <div className="mb-6">
                <div className="text-white/70 text-sm mb-2">Type</div>
                <div className="flex gap-2">
                  {form.types.map((type) => (
                    <span
                      key={type}
                      className={cn(
                        "px-4 py-2 rounded-lg text-lg font-bold text-white",
                        getTypeColor(type)
                      )}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Abilities */}
              <div className="mb-6">
                <div className="text-white/70 text-sm mb-2">Abilities</div>
                <div className="space-y-2">
                  {form.abilities.map((ability, index) => (
                    <div
                      key={index}
                      className="bg-white/10 rounded-lg px-3 py-2 text-white"
                    >
                      {ability}
                    </div>
                  ))}
                  {form.hiddenAbilities.length > 0 && (
                    <div className="bg-purple-600/30 border border-purple-400/50 rounded-lg px-3 py-2 text-white">
                      <span className="text-purple-300 text-xs">Hidden: </span>
                      {form.hiddenAbilities.join(", ")}
                    </div>
                  )}
                </div>
              </div>

              {/* Physical Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white/70 text-xs mb-1">Height</div>
                  <div className="text-white font-bold">{form.height} m</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-white/70 text-xs mb-1">Weight</div>
                  <div className="text-white font-bold">{form.weight} kg</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">Base Stats</h2>
          <div className="space-y-4">
            {Object.entries(form.stats).map(([stat, value]) => {
              const percentage = (value / maxStat) * 100;
              return (
                <div key={stat}>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/70 capitalize">
                      {stat === "spAttack"
                        ? "Sp. Attack"
                        : stat === "spDefense"
                          ? "Sp. Defense"
                          : stat}
                    </span>
                    <span className="text-white font-bold">{value}</span>
                  </div>
                  <div className="bg-white/10 rounded-full h-3 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        value >= 100
                          ? "bg-green-500"
                          : value >= 75
                            ? "bg-blue-500"
                            : value >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                      )}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex justify-between">
                <span className="text-white/70 font-bold">Total</span>
                <span className="text-white font-bold text-xl">
                  {totalStats}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {form.description && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">Description</h2>
            <p className="text-white/80 text-lg leading-relaxed">
              {form.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
