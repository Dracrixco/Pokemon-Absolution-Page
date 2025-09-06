import React, { useState, useMemo } from "react";
import { Search, X, Filter } from "lucide-react";
import { getAllFakemons } from "@/lib/fakemons";
import { getTypeColor } from "@/lib/type-colors";
import type { Fakemon } from "@/types/fakemon";
import { pokemonTypes } from "@/data/types";

interface PokemonSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPokemon: (pokemon: Fakemon) => void;
}

export const PokemonSelectorModal: React.FC<PokemonSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectPokemon,
}) => {
  const fakemons = getAllFakemons();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [showTypeFilters, setShowTypeFilters] = useState(false);

  const filteredPokemon = useMemo(() => {
    return fakemons.filter((pokemon) => {
      // Filtro por nombre/ID
      const matchesSearch =
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.id.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por tipos
      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.every((type) => pokemon.types.includes(type));

      return matchesSearch && matchesType;
    });
  }, [fakemons, searchTerm, selectedTypes]);

  const handlePokemonClick = (pokemon: Fakemon) => {
    onSelectPokemon(pokemon);
    onClose();
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearTypeFilters = () => {
    setSelectedTypes([]);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedTypes([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Seleccionar Pokémon</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filtros */}
        <div className="mb-4 space-y-4">
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar Pokémon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Toggle de filtros de tipo */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowTypeFilters(!showTypeFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Filter size={16} />
              Filtrar por tipos
              {selectedTypes.length > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  {selectedTypes.length}
                </span>
              )}
            </button>

            {/* Botón para limpiar filtros */}
            {(selectedTypes.length > 0 || searchTerm) && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-2 text-gray-600 hover:text-gray-800 text-sm"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Filtros de tipo */}
          {showTypeFilters && (
            <div className="bg-gray-50 rounded-lg p-4 border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm text-gray-700">
                  Filtrar por tipos (
                  {selectedTypes.length > 0 ? "Y" : "Cualquier tipo"})
                </h3>
                {selectedTypes.length > 0 && (
                  <button
                    onClick={clearTypeFilters}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Limpiar tipos
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2">
                {pokemonTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleTypeToggle(type)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      selectedTypes.includes(type)
                        ? `${getTypeColor(
                            type
                          )} text-white ring-2 ring-white shadow-md`
                        : `${getTypeColor(
                            type
                          )} text-white opacity-60 hover:opacity-100`
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {selectedTypes.length > 0 && (
                <div className="mt-3 text-xs text-gray-600">
                  <span className="font-medium">Tipos seleccionados:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedTypes.map((type) => (
                      <span
                        key={type}
                        className={`px-2 py-1 rounded text-white text-xs ${getTypeColor(
                          type
                        )}`}
                      >
                        {type}
                        <button
                          onClick={() => handleTypeToggle(type)}
                          className="ml-1 hover:bg-black hover:bg-opacity-20 rounded-full w-4 h-4 flex items-center justify-center"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Resultados */}
        <div className="flex-1 overflow-y-auto">
          <div className="mb-3 text-sm text-gray-600">
            {filteredPokemon.length === fakemons.length
              ? `Mostrando todos los ${filteredPokemon.length} Pokémon`
              : `Mostrando ${filteredPokemon.length} de ${fakemons.length} Pokémon`}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredPokemon.map((pokemon) => (
              <div
                key={pokemon.id}
                onClick={() => handlePokemonClick(pokemon)}
                className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors border border-transparent hover:border-blue-300 hover:shadow-md"
              >
                <div className="text-center">
                  <img
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    className="w-16 h-16 mx-auto mb-2 pixelated"
                    style={{ imageRendering: "pixelated" }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAxNkMzOC42Mjc0IDE2IDQ0IDIxLjM3MjYgNDQgMjhDNDQgMzQuNjI3NCAzOC42Mjc0IDQwIDMyIDQwQzI1LjM3MjYgNDAgMjAgMzQuNjI3NCAyMCAyOEMyMCAyMS4zNzI2IDI1LjM3MjYgMTYgMzIgMTZaIiBmaWxsPSIjRDFENURCIi8+CjxjaXJjbGUgY3g9IjI4IiBjeT0iMjUuNiIgcj0iMi40IiBmaWxsPSIjNkI3MjgwIi8+CjxjaXJjbGUgY3g9IjM2IiBjeT0iMjUuNiIgcj0iMi40IiBmaWxsPSIjNkI3MjgwIi8+CjxwYXRoIGQ9Ik0yOCAzMkMyOCAzMi44ODM2IDI4Ljg5NTQgMzMuNiAzMCAzMy42SDM0QzM1LjEwNDYgMzMuNiAzNiAzMi44ODM2IDM2IDMyVjMxLjJIMjhWMzJaIiBmaWxsPSIjNkI3MjgwIi8+Cjwvc3ZnPg==";
                    }}
                  />
                  <h3
                    className="font-semibold text-sm mb-1 truncate"
                    title={pokemon.name}
                  >
                    {pokemon.name}
                  </h3>
                  <div className="flex justify-center gap-1 mt-2">
                    {pokemon.types.map((type) => (
                      <span
                        key={type}
                        className={`px-2 py-1 rounded text-white text-xs ${getTypeColor(
                          type
                        )}`}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPokemon.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="mb-4">
                <Search className="mx-auto text-gray-300" size={48} />
              </div>
              <p className="text-lg mb-2">No se encontraron Pokémon</p>
              <p className="text-sm">
                {searchTerm && selectedTypes.length > 0
                  ? `No hay Pokémon que coincidan con "${searchTerm}" y tengan los tipos seleccionados`
                  : searchTerm
                  ? `No hay Pokémon que coincidan con "${searchTerm}"`
                  : selectedTypes.length > 0
                  ? "No hay Pokémon con los tipos seleccionados"
                  : "Intenta con diferentes filtros"}
              </p>
              {(searchTerm || selectedTypes.length > 0) && (
                <button
                  onClick={clearAllFilters}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Limpiar todos los filtros
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
