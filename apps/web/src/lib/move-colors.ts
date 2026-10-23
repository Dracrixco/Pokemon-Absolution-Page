export const categoryColors: Record<string, string> = {
  Physical: "bg-red-600",
  Special: "bg-blue-600",
  Status: "bg-gray-600",
};

export const targetColors: Record<string, string> = {
  "Single Enemy": "bg-orange-600",
  "All Enemies": "bg-red-700",
  "Single Ally": "bg-green-600",
  "All Allies": "bg-green-700",
  Self: "bg-purple-600",
  "Random Enemy": "bg-yellow-600",
  "All Pokémon": "bg-indigo-600",
};

export function getCategoryColor(category: string): string {
  return categoryColors[category] || "bg-gray-600";
}

export function getTargetColor(target: string): string {
  return targetColors[target] || "bg-gray-600";
}
