export const typeColors: Record<string, string> = {
  NORMAL: "bg-gray-400",
  FIRE: "bg-red-500",
  WATER: "bg-blue-500",
  ELECTRIC: "bg-yellow-400",
  GRASS: "bg-green-500",
  ICE: "bg-blue-300",
  FIGHTING: "bg-red-700",
  POISON: "bg-purple-500",
  GROUND: "bg-yellow-600",
  FLYING: "bg-indigo-400",
  PSYCHIC: "bg-pink-500",
  BUG: "bg-green-400",
  ROCK: "bg-yellow-800",
  GHOST: "bg-purple-700",
  DRAGON: "bg-indigo-700",
  DARK: "bg-gray-800",
  STEEL: "bg-gray-500",
  FAIRY: "bg-pink-300",
};

export function getTypeColor(type: string): string {
  return typeColors[type] || "bg-gray-400";
}
