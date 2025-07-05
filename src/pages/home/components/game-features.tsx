import { Card, CardContent } from "@/components/ui/card";
import {
  Zap,
  Users,
  Map,
  // User,
  // Sparkles,
  Share2,
  Settings,
  Gamepad2,
} from "lucide-react";
import { fakemons } from "@/data/pokemon";

export const GameFeatures = () => {
  const FakemonQty = fakemons.length - (fakemons.length % 10);

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
      description: `Discover over +${FakemonQty} custom-designed Pokémon with unique typings and movesets`,
    },
    {
      icon: <Map className="h-8 w-8 text-purple-400" />,
      title: "Expansive Region",
      description:
        "Explore the vast Nazan Region with multiple cities, routes, and hidden secrets",
    },
    {
      icon: <Share2 className="h-8 w-8 text-purple-400" />,
      title: "Multiplayer",
      description:
        "Battle and trade with friends or players around the world in real time",
    },
    // {
    //   icon: <User className="h-8 w-8 text-purple-400" />,
    //   title: "Unique Characters",
    //   description:
    //     "Meet a cast of memorable characters, each with their own story and personality",
    // },
    // {
    //   icon: <Sparkles className="h-8 w-8 text-purple-400" />,
    //   title: "Amazing Moves & Abilities",
    //   description:
    //     "Unleash incredible moves and abilities never seen before in Pokémon games",
    // },
    {
      icon: <Settings className="h-8 w-8 text-purple-400" />,
      title: "Customization",
      description:
        "Personalize your character and experience with various customization options",
    },
    {
      icon: <Gamepad2 className="h-8 w-8 text-purple-400" />,
      title: "Minigames",
      description: "Enjoy a variety of fun minigames throughout your adventure",
    },
  ];

  return (
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
  );
};
