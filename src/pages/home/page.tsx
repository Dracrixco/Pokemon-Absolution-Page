"use client";

import { HeroSection } from "./components/hero";
import { GameImages } from "./components/game-images";
import { GameFeatures } from "./components/game-features";
import { TrailerSection } from "@/pages/home/components/trailer";

export const Home = () => {
  return (
    <div className="flex-1">
      <HeroSection />
      <TrailerSection />
      <GameImages />
      <GameFeatures />
    </div>
  );
};
