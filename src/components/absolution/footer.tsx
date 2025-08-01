"use client";
import { Twitter, Badge } from "lucide-react";
import { Link } from "react-router-dom";
import { RandomLogo } from "@/components/absolution/logos";
import type { JSX } from "react";

export const Footer = () => {
  const SOCIAL_MEDIA_LIST: {
    name: string;
    icon?: JSX.Element;
    url: string;
  }[] = [
    {
      name: "Twitter",
      icon: <Twitter className="h-5 w-5" />,
      url: "https://x.com/dracrixco",
    },
    {
      name: "Discord",
      icon: <Badge className="h-5 w-5" />,
      url: "https://discord.gg/m9hCTZch",
    },
  ];

  return (
    <footer className="bg-purple-900/90 border-t border-purple-700 py-4 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <RandomLogo size={50} />
            <span className="text-white font-semibold">Pokémon Absolution</span>
          </div>

          <div className="flex space-x-6">
            {SOCIAL_MEDIA_LIST.map((social, key) => (
              <Link
                key={key}
                to={social.url}
                className="text-purple-200 hover:text-white transition-colors flex items-center space-x-2"
              >
                {social.icon && social.icon}
                <span>{social.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto text-center">
        <p className="text-purple-300 text-sm">
          Pokémon Absolution, a non-profit fangame. This is a fan-made project
          not affiliated with Nintendo or Game Freak.
        </p>
      </div>
    </footer>
  );
};
