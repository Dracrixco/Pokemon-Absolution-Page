import { getFakemonById } from "@/lib/fakemons";
import { getCategoryColor } from "@/lib/move-colors";
import { getMovesByIds } from "@/lib/moves";
import { getTypeColor } from "@/lib/type-colors";
import type { Move } from "@/types/move";
import React, { useState } from "react";
import {
  ArrowLeft,
  GraduationCap,
  Heart,
  Ruler,
  Weight,
  Zap,
  type LucideProps,
} from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";

export const FakemonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fakemon = id ? getFakemonById(id) : null;

  if (!fakemon) {
    // En React Router no hay `notFound()`, así que redirigimos manualmente
    navigate("/fakemons", { replace: true });
    return null;
  }
  const levelUpMoves = getMovesByIds(fakemon.moves || []);
  const tutorMoves = getMovesByIds(fakemon.tutorMoves || []);
  const eggMoves = getMovesByIds(fakemon.eggMoves || []);

  if (!fakemon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Fakemon not found
          </h1>
          <Link
            to="/fakemons"
            className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Fakemons
          </Link>
        </div>
      </div>
    );
  }

  const maxStat = 130; // Math.max(...Object.values(fakemon.stats));
  const totalStats = Object.values(fakemon.stats).reduce(
    (sum, stat) => sum + stat,
    0
  );

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - img and Basic Info */}
          <div className="space-y-6">
            {/* Main img */}
            <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-8">
              <div className="flex justify-center mb-6">
                <div className="relative w-64 h-64 rounded-full bg-gradient-to-br from-purple-400/20 to-purple-600/20 border-2 border-purple-400/30 flex items-center justify-center">
                  <img
                    src={fakemon.artwork || "/placeholder.svg"}
                    alt={fakemon.name}
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {fakemon.name}
                </h1>
                <p className="text-purple-200 mb-4">
                  #{fakemon.id.padStart(3, "0")} • {fakemon.category}
                </p>

                {/* Types */}
                <div className="flex justify-center gap-3 mb-6">
                  {fakemon.types.map((type) => (
                    <span
                      key={type}
                      className={`px-4 py-2 rounded-full text-white font-semibold ${getTypeColor(
                        type
                      )}`}
                    >
                      {type}
                    </span>
                  ))}
                </div>

                {/* Physical Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-purple-900/50 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-2 text-purple-200 mb-1">
                      <Ruler className="h-4 w-4" />
                      <span className="text-sm">Height</span>
                    </div>
                    <div className="text-white font-bold">{fakemon.height}</div>
                  </div>
                  <div className="bg-purple-900/50 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-2 text-purple-200 mb-1">
                      <Weight className="h-4 w-4" />
                      <span className="text-sm">Weight</span>
                    </div>
                    <div className="text-white font-bold">{fakemon.weight}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Abilities */}
            <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Abilities</h3>
              <div className="space-y-2">
                {fakemon.abilities.map((ability, index) => (
                  <div key={index} className="bg-purple-900/50 rounded-lg p-3">
                    <span className="text-purple-200 font-medium">
                      {ability}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Description */}
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Description</h3>
              <p className="text-purple-200 leading-relaxed">
                {fakemon.description}
              </p>
            </div>

            {/* Base Stats */}
            <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Base Stats</h3>
              <div className="space-y-4">
                {Object.entries(fakemon.stats).map(([statName, statValue]) => (
                  <div key={statName} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-200 font-medium capitalize">
                        {statName === "spAttack"
                          ? "Sp. Attack"
                          : statName === "spDefense"
                          ? "Sp. Defense"
                          : statName}
                      </span>
                      <span className="text-white font-bold">{statValue}</span>
                    </div>
                    <div className="w-full bg-purple-900/50 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-purple-500 transition-all duration-1000 ease-out"
                        style={{ width: `${(statValue / maxStat) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}

                {/* Total */}
                <div className="border-t border-purple-600 pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200 font-bold">Total</span>
                    <span className="text-white font-bold text-lg">
                      {totalStats}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Moves Section */}
        <div className="mt-12 space-y-8">
          {/* Level Up Moves */}
          <MovesSectionContainer
            title="Level Up Moves"
            Icon={Zap}
            moves={levelUpMoves}
          />

          {/* Tutor Moves */}
          <MovesSectionContainer
            title="Tutor Moves"
            Icon={GraduationCap}
            moves={tutorMoves}
          />

          {/* Egg Moves */}
          <MovesSectionContainer
            title="Egg Moves"
            Icon={Heart}
            moves={eggMoves}
          />
        </div>
      </div>
    </div>
  );
};

const TinyMoveCard = ({ move }: { move: Move }) => {
  return (
    <Link to={`/moves/${move.id}`}>
      <div
        className={`rounded-lg p-4 hover:brightness-110 transition-all cursor-pointer text-white ${getTypeColor(
          move.type
        )}`}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold">{move.name}</h4>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold bg-black/30 ${getCategoryColor(
              move.category
            )}`}
          >
            {move.category}
          </span>
        </div>
        <div className="flex justify-between text-sm text-white/90">
          <span>Power: {move.power ?? "—"}</span>
          <span>PP: {move.totalPP}</span>
        </div>
      </div>
    </Link>
  );
};

const MovesSectionContainer = ({
  title,
  Icon,
  moves,
}: {
  title: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  moves: Move[];
}) => {
  const [open, setOpen] = useState(false);

  if (moves.length === 0) {
    return null;
  }

  return (
    <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-6">
      <button
        className="w-full flex items-center gap-2 text-left focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <Icon className="h-6 w-6" />
        <span className="text-2xl font-bold text-white flex-1">{title}</span>
        <span className="text-purple-200 text-xl">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moves.map((move, idx) => (
            <TinyMoveCard key={idx} move={move} />
          ))}
        </div>
      )}
    </div>
  );
};
