import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export const GameImages = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const gameImages = [
    { id: 1, image: "[2025-06-20] 19_09_50.090", alt: "Battle Scene" },
    { id: 2, image: "[2025-06-20] 19_19_31.902", alt: "Overworld Map" },
    { id: 3, image: "[2025-06-20] 19_08_07.632", alt: "Pokémon Center" },
    { id: 4, image: "[2025-06-20] 19_08_48.183", alt: "Customization" },
    { id: 5, image: "[2025-06-20] 19_17_39.583", alt: "Gym Leader" },
    { id: 6, image: "[2025-06-20] 19_16_50.417", alt: "Route 2" },
    { id: 6, image: "[2025-06-20] 21_53_26.204", alt: "Team" },
  ];

  // // Auto-advance carousel
  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setCurrentSlide((prev) => (prev + 1) % Math.ceil(gameImages.length / 3));
  //   }, 10000);
  //   return () => clearInterval(timer);
  // }, [gameImages.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(gameImages.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(gameImages.length / 3)) %
        Math.ceil(gameImages.length / 3)
    );
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Game Screenshots
        </h2>

        <div className="max-w-6xl mx-auto">
          {/* Carousel Container */}
          <div className="relative overflow-hidden rounded-xl">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-purple-600/80 hover:bg-purple-600 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-purple-600/80 hover:bg-purple-600 text-white p-3 rounded-full transition-all duration-200 hover:scale-110 z-10"
              aria-label="Next slide"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {/* Create slides with 3 images each */}
              {Array.from(
                { length: Math.ceil(gameImages.length / 3) },
                (_, slideIndex) => (
                  <div key={slideIndex} className="w-full flex-shrink-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                      {gameImages
                        .slice(slideIndex * 3, slideIndex * 3 + 3)
                        .map((image) => (
                          <Card
                            key={image.id}
                            className="bg-purple-800/50 border-purple-600 overflow-hidden hover:transform hover:scale-105 transition-all duration-300 group"
                          >
                            <CardContent className="p-0">
                              <div className="relative">
                                <img
                                  src={`screenshots/${image.image}.png`}
                                  alt={image.alt}
                                  width={400}
                                  height={300}
                                  className="w-full h-48 object-cover"
                                />
                                {/* Overlay with description */}
                                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-white text-sm">
                                      {image.alt}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="p-4">
                                <h3 className="text-white font-semibold">
                                  {image.alt}
                                </h3>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from(
              { length: Math.ceil(gameImages.length / 3) },
              (_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    currentSlide === index
                      ? "bg-purple-400 scale-125"
                      : "bg-purple-600/50 hover:bg-purple-500"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              )
            )}
          </div>

          {/* Slide Counter */}
          <div className="text-center mt-4">
            <span className="text-purple-300 text-sm">
              {currentSlide + 1} of {Math.ceil(gameImages.length / 3)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
