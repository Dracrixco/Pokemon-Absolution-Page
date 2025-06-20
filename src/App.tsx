"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Menu,
  X,
  Download,
  Zap,
  Users,
  Map,
  MessageCircle,
  Twitter,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function PokemonAbsolutionWebsite() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const gameFeatures = [
    {
      icon: <Zap className="h-8 w-8 text-purple-400" />,
      title: "New Battle Mechanics",
      description:
        "Experience enhanced battle systems with unique abilities and strategic depth",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-400" />,
      title: "Original Fakemon",
      description:
        "Discover over 100 custom-designed Pokémon with unique typings and movesets",
    },
    {
      icon: <Map className="h-8 w-8 text-purple-400" />,
      title: "Expansive Region",
      description:
        "Explore the vast Absolution region with multiple cities, routes, and hidden secrets",
    },
  ];

  const gameImages = [
    { id: 1, alt: "Battle Scene" },
    { id: 2, alt: "Overworld Map" },
    { id: 3, alt: "Pokémon Center" },
    { id: 4, alt: "Wild Encounter" },
    { id: 5, alt: "Gym Battle" },
    { id: 6, alt: "Town View" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <header className="bg-purple-900/90 backdrop-blur-sm border-b border-purple-700 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">PA</span>
              </div>
              <span className="text-white font-bold text-xl">
                Pokémon Absolution
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="#"
                className="text-purple-200 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                to="#"
                className="text-purple-200 hover:text-white transition-colors"
              >
                Fakemons
              </Link>
              <Link
                to="#"
                className="text-purple-200 hover:text-white transition-colors"
              >
                Characters
              </Link>
              <Link
                to="#"
                className="text-purple-200 hover:text-white transition-colors"
              >
                Download
              </Link>
              <Link
                to="#"
                className="text-purple-200 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-purple-700">
              <nav className="flex flex-col space-y-4">
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  Fakemons
                </Link>
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  Characters
                </Link>
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  Download
                </Link>
                <Link
                  to="#"
                  className="text-purple-200 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent">
            Welcome to Pokémon Absolution
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-2xl mx-auto">
            A fanmade experience
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 text-lg rounded-full transition-all transform hover:scale-105">
            <Download className="mr-2 h-5 w-5" />
            Download Now
          </Button>
        </div>
      </section>

      {/* Game Images Grid */}
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

      {/* Game Features */}
      <section className="py-16 px-4 bg-purple-900/30">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Game Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {gameFeatures.map((feature, index) => (
              <Card
                key={index}
                className="bg-purple-800/50 border-purple-600 hover:bg-purple-800/70 transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-purple-200">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-900/90 border-t border-purple-700 py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">PA</span>
              </div>
              <span className="text-white font-semibold">
                Pokémon Absolution
              </span>
            </div>

            <div className="flex space-x-6">
              <Link
                to="#"
                className="text-purple-200 hover:text-white transition-colors flex items-center space-x-2"
              >
                <MessageCircle className="h-5 w-5" />
                <span>Discord</span>
              </Link>
              <Link
                to="#"
                className="text-purple-200 hover:text-white transition-colors flex items-center space-x-2"
              >
                <Twitter className="h-5 w-5" />
                <span>Twitter</span>
              </Link>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-purple-700 text-center">
            <p className="text-purple-300 text-sm">
              © 2024 Pokémon Absolution. This is a fan-made project not
              affiliated with Nintendo or Game Freak.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
