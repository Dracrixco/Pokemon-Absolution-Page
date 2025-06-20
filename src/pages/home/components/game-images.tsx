import { Card, CardContent } from "@/components/ui/card";

export const GameImages = () => {
  const gameImages = [
    { id: 1, alt: "Battle Scene" },
    { id: 2, alt: "Overworld Map" },
    { id: 3, alt: "Pokémon Center" },
    { id: 4, alt: "Wild Encounter" },
    { id: 5, alt: "Gym Battle" },
    { id: 6, alt: "Town View" },
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Game Screenshots
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameImages.map((image) => (
            <Card
              key={image.id}
              className="bg-purple-800/50 border-purple-600 overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
            >
              <CardContent className="p-0">
                <img
                  src={`/placeholder.svg?height=300&width=400`}
                  alt={image.alt}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-white font-semibold">{image.alt}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
