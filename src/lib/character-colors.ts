export const roleColors: Record<string, string> = {
  "Pokémon Professor": "bg-blue-600",
  "Rival Trainer": "bg-red-600",
  "Gym Leader": "bg-yellow-600",
  Champion: "bg-gold-600",
  Villain: "bg-gray-800",
  Sage: "bg-green-600",
  "Ranger Captain": "bg-orange-600",
  "Elite Four": "bg-purple-600",
};

export function getRoleColor(role: string): string {
  return roleColors[role] || "bg-gray-600";
}
