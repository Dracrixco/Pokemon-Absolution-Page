import { CharacterCard } from "@/components/absolution/character-card";
import { characters } from "@/data/characters";

export const CharactersPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-white">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text">
            Meet the Characters
          </h1>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Discover the fascinating people you'll encounter on your journey
            through the Nazan region
          </p>
          <div className="text-purple-300 text-sm">
            Hover over cards to learn more about each character
          </div>
        </div>
      </section>

      {/* Characters Grid */}
      <section className="py-8 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {characters.map((character, idx) => (
              <CharacterCard key={idx} character={character} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
