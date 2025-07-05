"use client";

import { HeroSection } from "./components/hero";
import { GameImages } from "./components/game-images";
import { GameFeatures } from "./components/game-features";
import { TrailerSection } from "@/pages/home/components/trailer";

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      <HeroSection />
      <TrailerSection />
      <GameImages />
      <GameFeatures />
    </div>
  );
};
