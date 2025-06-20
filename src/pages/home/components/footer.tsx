"use client";
import { MessageCircle, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export const HomeFooter = () => {
  return (
    <footer className="bg-purple-900/90 border-t border-purple-700 py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">PA</span>
            </div>
            <span className="text-white font-semibold">Pokémon Absolution</span>
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
            © 2024 Pokémon Absolution. This is a fan-made project not affiliated
            with Nintendo or Game Freak.
          </p>
        </div>
      </div>
    </footer>
  );
};
