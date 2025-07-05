"use client";
import { Twitter, Badge } from "lucide-react";
import { Link } from "react-router-dom";
import { RandomLogo } from "@/components/absolution/logos";
import { Footer } from "@/components/absolution/footer";
import type { JSX } from "react";

export const HomeFooter = () => {
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
      url: "#",
    },
  ];
  return (
    <footer className="bg-purple-900/90 border-t border-purple-700 py-8 px-4">
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

        <Footer />
      </div>
    </footer>
  );
};
