import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  allPokemonForms,
  getFormsBySuffix,
  searchForms,
  getFormsStats,
} from "@/lib/pokemon-forms";
import type { PokemonForm } from "@/types/pokemonform";
import { getTypeColor } from "@/lib/type-colors";
import { cn } from "@/lib/utils";

export default function PokemonFormsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<
    "all" | "mega" | "gmax" | "regional" | "normal" | "absolution"
  >("all");
  const [groupByBase, setGroupByBase] = useState(false);

  // Get stats
  const stats = useMemo(() => getFormsStats(), []);

  // Filter forms based on search and filter type
  const filteredForms = useMemo(() => {
    let forms = searchQuery ? searchForms(searchQuery) : allPokemonForms;

    switch (filterType) {
      case "mega":
        forms = forms.filter((f) => f.megaStone);
        break;
      case "gmax":
        forms = forms.filter((f) =>
          f.formName.toLowerCase().includes("gigantamax")
        );
        break;
      case "regional":
        forms = forms.filter(
          (f) =>
            f.formName.toLowerCase().includes("nazanian") ||
            f.formName.toLowerCase().includes("alolan") ||
            f.formName.toLowerCase().includes("galarian") ||
            f.formName.toLowerCase().includes("hisuian") ||
            f.formName.toLowerCase().includes("paldean")
        );
        break;
      case "normal":
        forms = getFormsBySuffix("normal");
        break;
      case "absolution":
        forms = getFormsBySuffix("absolution");
        break;
    }

    return forms;
  }, [searchQuery, filterType]);

  // Group forms if needed
  const groupedForms = useMemo(() => {
    if (!groupByBase) return null;
    const groups = new Map<string, PokemonForm[]>();
    filteredForms.forEach((form) => {
      if (!groups.has(form.baseId)) {
        groups.set(form.baseId, []);
      }
      groups.get(form.baseId)!.push(form);
    });
    return groups;
  }, [filteredForms, groupByBase]);

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-900 via-blue-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🔄 Pokémon Forms
          </h1>
          <p className="text-white/70 text-lg">
            Explore all the different forms and variations of Pokémon
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <StatCard
            icon="📊"
            label="Total Forms"
            value={stats.total}
            color="bg-blue-500/20"
          />
          <StatCard
            icon="⭐"
            label="Mega Forms"
            value={stats.megaForms}
            color="bg-purple-500/20"
          />
          <StatCard
            icon="👑"
            label="Gigantamax"
            value={stats.gigantamaxForms}
            color="bg-red-500/20"
          />
          <StatCard
            icon="🌍"
            label="Regional"
            value={stats.regionalForms}
            color="bg-green-500/20"
          />
          <StatCard
            icon="🎯"
            label="Base Pokémon"
            value={stats.uniqueBasePokemon}
            color="bg-yellow-500/20"
          />
          <StatCard
            icon="⚡"
            label="Absolution"
            value={stats.bySuffix.absolution || 0}
            color="bg-indigo-500/20"
          />
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, base Pokémon, or form..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Filter Type */}
            <div className="flex gap-2 flex-wrap">
              <FilterButton
                active={filterType === "all"}
                onClick={() => setFilterType("all")}
                icon="📋"
                label="All"
              />
              <FilterButton
                active={filterType === "mega"}
                onClick={() => setFilterType("mega")}
                icon="⭐"
                label="Mega"
              />
              <FilterButton
                active={filterType === "gmax"}
                onClick={() => setFilterType("gmax")}
                icon="👑"
                label="G-Max"
              />
              <FilterButton
                active={filterType === "regional"}
                onClick={() => setFilterType("regional")}
                icon="🌍"
                label="Regional"
              />
              <FilterButton
                active={filterType === "normal"}
                onClick={() => setFilterType("normal")}
                icon="📦"
                label="Normal"
              />
              <FilterButton
                active={filterType === "absolution"}
                onClick={() => setFilterType("absolution")}
                icon="⚡"
                label="Absolution"
              />
            </div>

            {/* Group Toggle */}
            <button
              onClick={() => setGroupByBase(!groupByBase)}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all",
                groupByBase
                  ? "bg-purple-600 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              )}
            >
              {groupByBase ? "Ungroup" : "Group by Base"}
            </button>
          </div>

          <div className="mt-4 text-white/70 text-sm">
            Showing {filteredForms.length} form
            {filteredForms.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Forms Grid */}
        {groupByBase && groupedForms ? (
          <div className="space-y-8">
            {Array.from(groupedForms.entries()).map(([baseId, forms]) => (
              <div
                key={baseId}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>#{baseId}</span>
                  <span className="text-white/50 text-lg">
                    ({forms.length} form{forms.length !== 1 ? "s" : ""})
                  </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {forms.map((form) => (
                    <FormCard
                      key={`${form.baseId}-${form.formNumber}`}
                      form={form}
                      navigate={navigate}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredForms.map((form) => (
              <FormCard
                key={`${form.baseId}-${form.formNumber}`}
                form={form}
                navigate={navigate}
              />
            ))}
          </div>
        )}

        {filteredForms.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No forms found
            </h3>
            <p className="text-white/70">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// Components
interface StatCardProps {
  icon: string;
  label: string;
  value: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className={cn("rounded-lg p-4 border border-white/10", color)}>
    <div className="text-2xl mb-1">{icon}</div>
    <div className="text-2xl font-bold text-white">{value}</div>
    <div className="text-xs text-white/70">{label}</div>
  </div>
);

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  active,
  onClick,
  icon,
  label,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
      active
        ? "bg-purple-600 text-white shadow-lg"
        : "bg-white/10 text-white/70 hover:bg-white/20"
    )}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

interface FormCardProps {
  form: PokemonForm;
  navigate: (path: string) => void;
}

const FormCard: React.FC<FormCardProps> = ({ form, navigate }) => {
  const totalStats = Object.values(form.stats).reduce((a, b) => a + b, 0);

  return (
    <div
      onClick={() => navigate(`/forms/${form.baseId}/${form.formNumber}`)}
      className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:border-purple-400/50 transition-all hover:scale-105 cursor-pointer"
    >
      {" "}
      {/* Form Image */}
      <div className="relative mb-3">
        <img
          src={form.sprite}
          alt={`${form.name} - ${form.formName}`}
          className="w-full h-32 object-contain"
          onError={(e) => {
            e.currentTarget.src = "/Front/MISSINGNO.png";
          }}
        />
        {form.megaStone && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold">
            ⭐ MEGA
          </div>
        )}
        {form.formName.toLowerCase().includes("gigantamax") && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full font-bold">
            👑 G-MAX
          </div>
        )}
      </div>
      {/* Form Info */}
      <div className="space-y-2">
        <div>
          <div className="text-white/60 text-xs">{form.baseId}</div>
          <h3 className="text-white font-bold text-lg">
            {form.name || form.baseId}
          </h3>
          <div className="text-purple-300 text-sm font-medium">
            {form.formName}
          </div>
        </div>

        {/* Types */}
        <div className="flex gap-1">
          {form.types.map((type) => (
            <span
              key={type}
              className={cn(
                "px-2 py-1 rounded text-xs font-bold text-white",
                getTypeColor(type)
              )}
            >
              {type}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-black/20 rounded p-2">
          <div className="text-white/70 text-xs mb-1">Base Stats Total</div>
          <div className="text-white font-bold text-lg">{totalStats}</div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between text-xs">
          <span
            className={cn(
              "px-2 py-1 rounded",
              form.suffix === "absolution"
                ? "bg-indigo-500/30 text-indigo-200"
                : "bg-gray-500/30 text-gray-200"
            )}
          >
            {form.suffix}
          </span>
          <span className="text-white/50">Form #{form.formNumber}</span>
        </div>
      </div>
    </div>
  );
};
