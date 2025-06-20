"use client";

// import { HomeHeader } from "./components/header";
import { HomeFooter } from "./components/footer";
import { HeroSection } from "./components/hero";
import { GameImages } from "./components/game-images";
import { GameFeatures } from "./components/game-features";

export const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      {/* <HomeHeader /> */}

      {/* Hero Section */}
      <HeroSection />

      {/* Game Images Grid */}
      <GameImages />

      {/* Game Features */}
      <GameFeatures />

      {/* Footer */}
      <HomeFooter />
    </div>
  );
};
