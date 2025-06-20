import { Card, CardContent } from "@/components/ui/card";

export const GameImages = () => {
  const gameImages = [
    { id: 1, image: "[2025-06-20] 19_09_50.090", alt: "Battle Scene" },
    { id: 2, image: "[2025-06-20] 19_19_31.902", alt: "Overworld Map" },
    { id: 3, image: "[2025-06-20] 19_08_07.632", alt: "Pokémon Center" },
    { id: 4, image: "[2025-06-20] 19_08_48.183", alt: "Customization" },
    { id: 5, image: "[2025-06-20] 19_17_39.583", alt: "Gym Leader" },
    { id: 6, image: "[2025-06-20] 19_16_50.417", alt: "Town View" },
  ];

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Game Screenshots
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gameImages.map((imageData) => (
            <Card
              key={imageData.id}
              className="relative bg-purple-800/50 border-purple-600 overflow-hidden hover:scale-105 transition-transform duration-300"
            >
              <CardContent className="p-0">
                {/* Imagen como fondo absoluto */}
                <img
                  src={`/screenshots/${imageData.image}.png`}
                  alt={imageData.alt}
                  className="w-full h-64 object-cover"
                />

                {/* Franja de texto superpuesta */}
                <div className="absolute bottom-0 left-0 w-full bg-black/60 p-4">
                  <h3 className="text-white font-semibold">{imageData.alt}</h3>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
