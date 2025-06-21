"use client";

import type { Character } from "@/lib/characters";
import { getRoleColor } from "@/lib/character-colors";
import { Link } from "react-router-dom";
import { useState } from "react";

interface CharacterCardProps {
  character: Character;
}

export const CharacterCard = ({ character }: CharacterCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <Link to={`/characters/${character.name}`}>
      <div
        className="relative w-full h-96 cursor-pointer perspective-1000"
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          {/* Front of Card - Artwork */}
          <div className="absolute inset-0 w-full h-full backface-hidden">
            <div className="relative w-full h-full rounded-xl border-2 border-purple-600 shadow-lg overflow-hidden">
              {/* Imagen ocupa toda la tarjeta */}
              <img
                src={character.artwork || "/placeholder.svg"}
                alt={`${character.name} artwork`}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Gradiente para mejorar legibilidad */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              {/* Texto encima de la imagen */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <h3 className="text-white font-bold text-xl text-shadow">
                  {character.name}
                </h3>
                {character.favorite && (
                  <p className="text-purple-200 text-sm">
                    {character.favorite}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Back of Card - Name and Description */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
            <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl border-2 border-purple-600 shadow-lg overflow-hidden h-full">
              {/* Header */}
              <div className="bg-purple-900/80 p-4 border-b border-purple-600">
                <h3 className="text-white font-bold text-xl text-center mb-2">
                  {character.name}
                </h3>
                <div className="flex justify-center">
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${getRoleColor(
                      character.role
                    )}`}
                  >
                    {character.role}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 flex-1 flex flex-col justify-center">
                <div className="space-y-4">
                  <p className="text-purple-200 text-sm leading-relaxed">
                    {character.description}
                  </p>

                  {character.favorite && (
                    <div className="bg-purple-900/50 rounded-lg p-3">
                      <div className="text-purple-300 text-xs font-medium mb-1">
                        Favorite Thing:
                      </div>
                      <div className="text-white text-sm">
                        {character.favorite}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hover indicator */}
        <div className="absolute bottom-2 right-2 bg-purple-600/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        </div>
      </div>
    </Link>
  );
};
