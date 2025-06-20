export const typeColors: Record<string, string> = {
  Normal: "bg-gray-400",
  Fire: "bg-red-500",
  Water: "bg-blue-500",
  Electric: "bg-yellow-400",
  Grass: "bg-green-500",
  Ice: "bg-blue-300",
  Fighting: "bg-red-700",
  Poison: "bg-purple-500",
  Ground: "bg-yellow-600",
  Flying: "bg-indigo-400",
  Psychic: "bg-pink-500",
  Bug: "bg-green-400",
  Rock: "bg-yellow-800",
  Ghost: "bg-purple-700",
  Dragon: "bg-indigo-700",
  Dark: "bg-gray-800",
  Steel: "bg-gray-500",
  Fairy: "bg-pink-300",
  Crystal: "bg-purple-300",
};

export function getTypeColor(type: string): string {
  return typeColors[type] || "bg-gray-400";
}
