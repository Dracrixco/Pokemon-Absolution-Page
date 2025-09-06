import type { Fakemon } from "@/types/fakemon";

interface PokemonImageProps {
  fakemon: Fakemon;
  size?: number;
}

export const PokemonImage = ({ fakemon, size = 160 }: PokemonImageProps) => {
  return (
    <img
      src={fakemon.artwork || "/placeholder.svg"}
      alt={`${fakemon.name} artwork`}
      width={size}
      height={size}
      className="object-contain pixelated"
      style={{ imageRendering: "pixelated" }}
    />
  );
};
