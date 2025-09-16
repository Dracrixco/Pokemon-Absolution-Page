import type { Fakemon } from "@/types/fakemon";
import { getFakemonById } from "@/lib/fakemons";

interface PokemonImageProps {
  fakemon: Fakemon | string;
  size?: number;
  showBack?: boolean;
}

export const PokemonImage = ({
  fakemon,
  size = 160,
  showBack,
}: PokemonImageProps) => {
  const fakemonToShow =
    typeof fakemon === "string" ? getFakemonById(fakemon) : fakemon;

  if (!fakemonToShow) {
    return null;
  }

  const imageToShow = showBack
    ? fakemonToShow.backSprite
    : fakemonToShow.sprite;
  return (
    <img
      src={imageToShow || "/placeholder.svg"}
      alt={`${fakemonToShow.name} sprite`}
      width={size}
      height={size}
      className="object-contain pixelated"
      style={{ imageRendering: "pixelated" }}
    />
  );
};
