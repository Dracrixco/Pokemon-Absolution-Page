import type { Fakemon } from "@/types/fakemon";
import { getFakemonById } from "@/lib/fakemons";
import { Link } from "react-router-dom";

interface PokemonImageProps {
  fakemon: Fakemon | string;
  size?: number;
  showBack?: boolean;
  withLink?: boolean;
}

export const PokemonImage = ({
  fakemon,
  size = 160,
  showBack,
  withLink = false,
}: PokemonImageProps) => {
  const fakemonToShow =
    typeof fakemon === "string" ? getFakemonById(fakemon) : fakemon;

  if (!fakemonToShow) {
    return null;
  }

  const imageToShow = showBack
    ? fakemonToShow.backSprite
    : fakemonToShow.sprite;

  if (withLink) {
    return (
      <Link to={`/fakemons/${fakemonToShow.id}`}>
        <img
          src={imageToShow || "/placeholder.svg"}
          alt={`${fakemonToShow.name} sprite`}
          width={size}
          height={size}
          className="object-contain pixelated"
          style={{ imageRendering: "pixelated" }}
        />
      </Link>
    );
  }
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
