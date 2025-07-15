import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { RandomLogo } from "./logos";

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="bg-purple-900/90 backdrop-blur-sm border-b border-purple-700 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <RandomLogo />
            <span className="text-white font-bold text-xl">
              Pokémon Absolution
            </span>
          </div>

          {/* Desktop Navigation */}
          <Navigation className="hidden md:flex space-x-8" />

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
            <Navigation className="flex flex-col space-y-4" />
          </div>
        )}
      </div>
    </header>
  );
};

const Navigation = ({ className = "" }: { className: string }) => {
  return (
    <nav className={className}>
      <Link
        to="/"
        className="text-purple-200 hover:text-white transition-colors"
      >
        Home
      </Link>
      <Link
        to="/fakemons"
        className="text-purple-200 hover:text-white transition-colors"
      >
        Fakemons
      </Link>
      <Link
        to="/characters"
        className="text-purple-200 hover:text-white transition-colors"
      >
        Characters
      </Link>
      <Link
        to="/maps"
        className="text-purple-200 hover:text-white transition-colors"
      >
        Maps
      </Link>
      <Link
        to="/updates"
        className="text-purple-200 hover:text-white transition-colors"
      >
        Updates
      </Link>
    </nav>
  );
};
