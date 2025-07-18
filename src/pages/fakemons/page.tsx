"use client";
import FakemonCardPokemon from "@/components/absolution/fakemon-card";
import { fakemons } from "@/data/pokemon";

export const FakemonsList = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text">
            Discover Fakemons
          </h1>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Explore our collection of original Pokémon with unique abilities and
            designs
          </p>
          <div className="text-purple-300 text-sm">
            Hover over cards to see detailed stats
          </div>
        </div>
      </section>

      {/* Fakemons Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {fakemons.map((fakemon) => (
              <FakemonCardPokemon key={fakemon.id} fakemon={fakemon} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
