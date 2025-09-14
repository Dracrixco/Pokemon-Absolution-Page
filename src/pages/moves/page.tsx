import { useState, useMemo } from "react";
import { getAllMoves } from "@/lib/moves";
import { getTypeColor } from "@/lib/type-colors";
import { getCategoryColor } from "@/lib/move-colors";
import { Search, Filter, Zap, Target, Hash } from "lucide-react";
import { Link } from "react-router-dom";
import type { Move } from "@/types/move";

export const MovesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "power" | "accuracy" | "pp">(
    "name"
  );

  const allMoves = getAllMoves();

  // Get unique types and categories for filters
  const types = useMemo(() => {
    const uniqueTypes = Array.from(new Set(allMoves.map((move) => move.type)));
    return uniqueTypes.sort();
  }, [allMoves]);

  const categories = ["Physical", "Special", "Status"];

  // Filter and sort moves
  const filteredAndSortedMoves = useMemo(() => {
    const filtered = allMoves.filter((move) => {
      const matchesSearch =
        move.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        move.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === "all" || move.type === selectedType;
      const matchesCategory =
        selectedCategory === "all" || move.category === selectedCategory;

      return matchesSearch && matchesType && matchesCategory;
    });

    // Sort moves
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "power": {
          const powerA = a.power || 0;
          const powerB = b.power || 0;
          return powerB - powerA; // Descending
        }
        case "accuracy": {
          const accuracyA = a.accuracy || 0;
          const accuracyB = b.accuracy || 0;
          return accuracyB - accuracyA; // Descending
        }
        case "pp":
          return b.totalPP - a.totalPP; // Descending
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [allMoves, searchTerm, selectedType, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Moves Database</h1>
          <p className="text-xl text-purple-200">
            Explore the complete collection of moves in Pokémon Absolution
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 h-4 w-4" />
              <input
                type="text"
                placeholder="Search moves..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-purple-700/50 border border-purple-500 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 bg-purple-700/50 border border-purple-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              >
                <option value="all">All Types</option>
                {types.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 bg-purple-700/50 border border-purple-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "name" | "power" | "accuracy" | "pp"
                  )
                }
                className="w-full px-4 py-2 bg-purple-700/50 border border-purple-500 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="power">Sort by Power</option>
                <option value="accuracy">Sort by Accuracy</option>
                <option value="pp">Sort by PP</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-purple-200 text-sm">
            Showing {filteredAndSortedMoves.length} of {allMoves.length} moves
          </div>
        </div>

        {/* Moves Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedMoves.map((move) => (
            <MoveCard key={move.id} move={move} />
          ))}
        </div>

        {/* No results */}
        {filteredAndSortedMoves.length === 0 && (
          <div className="text-center py-12">
            <Filter className="h-16 w-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No moves found
            </h3>
            <p className="text-purple-200">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

interface MoveCardProps {
  move: Move;
}

const MoveCard = ({ move }: MoveCardProps) => {
  return (
    <Link
      to={`/moves/${move.id}`}
      className="group bg-purple-800/30 backdrop-blur-sm rounded-xl border border-purple-600 p-6 hover:bg-purple-700/40 hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1"
    >
      {/* Move Name */}
      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-200 transition-colors">
        {move.name}
      </h3>

      {/* Type and Category */}
      <div className="flex gap-2 mb-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getTypeColor(
            move.type
          )}`}
        >
          {move.type}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(
            move.category
          )}`}
        >
          {move.category}
        </span>
      </div>

      {/* Stats */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-purple-200">
            <Zap className="h-4 w-4" />
            <span>Power</span>
          </div>
          <span className="text-white font-semibold">{move.power || "-"}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-purple-200">
            <Target className="h-4 w-4" />
            <span>Accuracy</span>
          </div>
          <span className="text-white font-semibold">
            {move.accuracy || "-"}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-purple-200">
            <Hash className="h-4 w-4" />
            <span>PP</span>
          </div>
          <span className="text-white font-semibold">{move.totalPP}</span>
        </div>
      </div>

      {/* Description preview */}
      {move.description && (
        <div className="mt-4 pt-4 border-t border-purple-600/50">
          <p className="text-purple-200 text-sm line-clamp-2">
            {move.description}
          </p>
        </div>
      )}
    </Link>
  );
};

export default MovesPage;
