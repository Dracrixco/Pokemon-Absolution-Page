import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { fakemons } from "@/data/pokemon_absolution";
import { getTypeColor } from "@/lib/type-colors";
import type { Fakemon } from "@/types/fakemon";

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
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPokemon = useMemo(() => {
    return fakemons.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pokemon.id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handlePokemonClick = (pokemon: Fakemon) => {
    onSelectPokemon(pokemon);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Seleccionar Pokémon</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-4">
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPokemon.map((pokemon) => (
            <div
              key={pokemon.id}
              onClick={() => handlePokemonClick(pokemon)}
              className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors border border-transparent hover:border-blue-300"
            >
              <div className="text-center">
                <img
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  className="w-16 h-16 mx-auto mb-2"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0zMiAxNkMzOC42Mjc0IDE2IDQ0IDIxLjM3MjYgNDQgMjhDNDQgMzQuNjI3NCAzOC42Mjc0IDQwIDMyIDQwQzI1LjM3MjYgNDAgMjAgMzQuNjI3NCAyMCAyOEMyMCAyMS4zNzI2IDI1LjM3MjYgMTYgMzIgMTZaIiBmaWxsPSIjRDFENURCIi8+CjxjaXJjbGUgY3g9IjI4IiBjeT0iMjUuNiIgcj0iMi40IiBmaWxsPSIjNkI3MjgwIi8+CjxjaXJjbGUgY3g9IjM2IiBjeT0iMjUuNiIgcj0iMi40IiBmaWxsPSIjNkI3MjgwIi8+CjxwYXRoIGQ9Ik0yOCAzMkMyOCAzMi44ODM2IDI4Ljg5NTQgMzMuNiAzMCAzMy42SDM0QzM1LjEwNDYgMzMuNiAzNiAzMi44ODM2IDM2IDMyVjMxLjJIMjhWMzJaIiBmaWxsPSIjNkI3MjgwIi8+Cjwvc3ZnPg==";
                  }}
                />
                <h3 className="font-semibold text-sm">{pokemon.name}</h3>
                <p className="text-xs text-gray-600">#{pokemon.id}</p>
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
          <div className="text-center py-8 text-gray-500">
            <p>No se encontraron Pokémon que coincidan con la búsqueda.</p>
          </div>
        )}
      </div>
    </div>
  );
};
