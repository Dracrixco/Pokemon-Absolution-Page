import { getFakemonById } from "@/lib/fakemons";
import { getCategoryColor } from "@/lib/move-colors";
import { getMoveById, getMovesByIds } from "@/lib/moves";
import { getTypeColor } from "@/lib/type-colors";
import { getFormsByBaseId } from "@/lib/pokemon-forms";
import { normalizeLevelUpMoves } from "@/lib/level-up-moves";
import type { Move } from "@/types/move";
import type { PokemonForm } from "@/types/pokemonform";
import type { Fakemon } from "@/types/fakemon";
import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  GraduationCap,
  Heart,
  Ruler,
  Weight,
  Zap,
  Sparkles,
  type LucideProps,
} from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { PokemonImage } from "@/components/absolution/pokemon-image";
import { EvolutionChain } from "@/components/absolution/evolution-chain";
import { cn } from "@/lib/utils";

export const FakemonDetailPage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedForm, setSelectedForm] = useState<PokemonForm | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const fakemon = id ? getFakemonById(id) : null;

  // Get all forms for this Pokemon (needs to be before early return)
  const availableForms = useMemo(() => {
    if (!fakemon) return [];
    return getFormsByBaseId(fakemon.id);
  }, [fakemon]);

  if (!fakemon) {
    // En React Router no hay `notFound()`, así que redirigimos manualmente
    navigate("/fakemons", { replace: true });
    return null;
  }

  // Use selected form data or base fakemon data
  const displayData: Fakemon | PokemonForm = selectedForm || fakemon;

  const levelUpMoves = normalizeLevelUpMoves(displayData.moves)
    .map((entry) => ({ level: entry.level, move: getMoveById(entry.move) }))
    .filter((entry): entry is { level: number; move: Move } => !!entry.move)
    .sort((a, b) => a.level - b.level);
  const tutorMoves = getMovesByIds(displayData.tutorMoves || []);
  const eggMoves = getMovesByIds(displayData.eggMoves || []);

  if (!fakemon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900">
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

  const maxStat = 130; // Math.max(...Object.values(displayData.stats));
  const totalStats = Object.values(displayData.stats).reduce(
    (sum, stat) => sum + stat,
    0,
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          to="/fakemons"
          className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Fakemons
        </Link>

        {/* Form Selector */}
        {availableForms.length > 0 && (
          <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Available Forms
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {/* Base Form */}
              <button
                onClick={() => setSelectedForm(null)}
                className={cn(
                  "bg-purple-900/50 rounded-lg p-4 border-2 transition-all hover:scale-105",
                  !selectedForm
                    ? "border-purple-400 shadow-lg shadow-purple-500/50"
                    : "border-purple-700 hover:border-purple-500",
                )}
              >
                <div className="relative">
                  <img
                    src={fakemon.sprite}
                    alt={fakemon.name}
                    className="w-full h-24 object-contain mb-2"
                    onError={(e) => {
                      e.currentTarget.src = "/Front/MISSINGNO.png";
                    }}
                  />
                </div>
                <div className="text-white text-sm font-medium text-center">
                  Base Form
                </div>
              </button>

              {/* Other Forms */}
              {availableForms.map((form) => (
                <button
                  key={`${form.baseId}-${form.formNumber}`}
                  onClick={() => setSelectedForm(form)}
                  className={cn(
                    "bg-purple-900/50 rounded-lg p-4 border-2 transition-all hover:scale-105",
                    selectedForm?.formNumber === form.formNumber
                      ? "border-purple-400 shadow-lg shadow-purple-500/50"
                      : "border-purple-700 hover:border-purple-500",
                  )}
                >
                  <div className="relative">
                    <img
                      src={form.sprite}
                      alt={form.formName}
                      className="w-full h-24 object-contain mb-2"
                      onError={(e) => {
                        e.currentTarget.src = "/Front/MISSINGNO.png";
                      }}
                    />
                    {form.megaStone && (
                      <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs px-1.5 py-0.5 rounded">
                        ⭐
                      </div>
                    )}
                  </div>
                  <div className="text-white text-sm font-medium text-center truncate">
                    {form.formName}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - img and Basic Info */}
          <div className="space-y-6">
            {/* Main img */}
            <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-8">
              <div className="flex justify-center mb-6">
                <div
                  className="relative w-64 h-64 rounded-full bg-linear-to-br from-purple-400/20 to-purple-600/20 border-2 border-purple-400/30 flex items-center justify-center transition-transform duration-300 hover:scale-105 group"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <PokemonImage
                    fakemon={displayData}
                    size={300}
                    showBack={isHovered}
                  />
                </div>
              </div>

              <div className="text-center">
                <h1 className="text-4xl font-bold text-white mb-2">
                  {displayData.name}
                </h1>
                {selectedForm && (
                  <div className="text-purple-300 text-lg font-medium mb-2">
                    {selectedForm.formName}
                  </div>
                )}
                <p className="text-purple-200 mb-4">{displayData.category}</p>

                {/* Types */}
                <div className="flex justify-center gap-3 mb-6">
                  {displayData.types.map((type) => (
                    <span
                      key={type}
                      className={`px-4 py-2 rounded-full text-white font-semibold ${getTypeColor(
                        type,
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
                    <div className="text-white font-bold">
                      {displayData.height}
                    </div>
                  </div>
                  <div className="bg-purple-900/50 rounded-lg p-3">
                    <div className="flex items-center justify-center gap-2 text-purple-200 mb-1">
                      <Weight className="h-4 w-4" />
                      <span className="text-sm">Weight</span>
                    </div>
                    <div className="text-white font-bold">
                      {displayData.weight}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Abilities */}
            <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Abilities</h3>
              <div className="space-y-2">
                {displayData.abilities.map((ability, index) => (
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
                {displayData.description}
              </p>
            </div>

            {/* Base Stats */}
            <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-6">
              <h3 className="text-xl font-bold text-white mb-4">Base Stats</h3>
              <div className="space-y-4">
                {Object.entries(displayData.stats).map(
                  ([statName, statValue]) => (
                    <div key={statName} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-purple-200 font-medium capitalize">
                          {statName === "spAttack"
                            ? "Sp. Attack"
                            : statName === "spDefense"
                              ? "Sp. Defense"
                              : statName}
                        </span>
                        <span className="text-white font-bold">
                          {statValue}
                        </span>
                      </div>
                      <div className="w-full bg-purple-900/50 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-full bg-linear-to-r from-purple-400 to-purple-500 transition-all duration-1000 ease-out"
                          style={{ width: `${(statValue / maxStat) * 100}%` }}
                        />
                      </div>
                    </div>
                  ),
                )}

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

        {/* Evolution Chain */}
        <div className="mt-8">
          <EvolutionChain
            key={
              selectedForm
                ? `${fakemon.id}-form-${selectedForm.formNumber}`
                : `${fakemon.id}-base`
            }
            pokemon={displayData}
          />
        </div>

        {/* Moves Section */}
        <div className="mt-12 space-y-8">
          {/* Level Up Moves */}
          <LevelUpMovesSectionContainer
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
          move.type,
        )}`}
      >
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold">{move.name}</h4>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold bg-black/30 ${getCategoryColor(
              move.category,
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

const TinyLevelUpMoveCard = ({
  entry,
}: {
  entry: { level: number; move: Move };
}) => {
  return (
    <Link to={`/moves/${entry.move.id}`}>
      <div
        className={`rounded-lg p-4 hover:brightness-110 transition-all cursor-pointer text-white ${getTypeColor(
          entry.move.type,
        )}`}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold bg-black/30 px-2 py-1 rounded">
              Lv {entry.level > 0 ? entry.level : "?"}
            </span>
            <h4 className="font-semibold">{entry.move.name}</h4>
          </div>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold bg-black/30 ${getCategoryColor(
              entry.move.category,
            )}`}
          >
            {entry.move.category}
          </span>
        </div>
        <div className="flex justify-between text-sm text-white/90">
          <span>Power: {entry.move.power ?? "—"}</span>
          <span>PP: {entry.move.totalPP}</span>
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

const LevelUpMovesSectionContainer = ({
  title,
  Icon,
  moves,
}: {
  title: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  moves: { level: number; move: Move }[];
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
          {moves.map((entry, idx) => (
            <TinyLevelUpMoveCard key={idx} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
};
