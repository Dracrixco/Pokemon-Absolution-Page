import type { Fakemon } from "@/types/fakemon";

interface PokemonImageProps {
  fakemon: Fakemon;
  size?: number;
  showBack?: boolean;
}

export const PokemonImage = ({
  fakemon,
  size = 160,
  showBack,
}: PokemonImageProps) => {
  const imageToShow = showBack ? fakemon.backSprite : fakemon.sprite;
  return (
    <img
      src={imageToShow || "/placeholder.svg"}
      alt={`${fakemon.name} sprite`}
      width={size}
      height={size}
      className="object-contain pixelated"
      style={{ imageRendering: "pixelated" }}
    />
  );
};
