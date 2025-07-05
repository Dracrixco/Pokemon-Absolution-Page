import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface MapImageProps {
  showMap: boolean;
  showTrainers: boolean;
  showObjects: boolean;
  showPokemon: boolean;
  mapIngameID: number;
}

export const MapImage = ({
  mapIngameID,
  showMap,
  showObjects,
  showPokemon,
  showTrainers,
}: MapImageProps) => {
  const [showFullyImage, setShowFullyImage] = useState(false);

  if (showFullyImage) {
    return (
      <MapImageFullyMode
        mapIngameID={mapIngameID}
        showMap={showMap}
        showTrainers={showTrainers}
        showObjects={showObjects}
        showPokemon={showPokemon}
        setShowFullyImage={setShowFullyImage}
      />
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border-2 border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Vista previa</h3>
        <Button onClick={() => setShowFullyImage(true)}>Show Fully</Button>
      </div>

      <div
        onClick={() => setShowFullyImage(true)}
        className={cn([
          "relative mx-auto border-2 border-gray-300 rounded-lg",
          "overflow-hidden shadow-inner bg-white",
        ])}
        style={{
          width: 16 * 20,
          height: 16 * 20,
        }}
      >
        {showMap && (
          <img
            src={"/maps/base/map_" + mapIngameID + ".png"}
            alt="Map"
            className={cn([
              "absolute top-0 left-0 transition-opacity duration-300",
              "w-full h-full object-cover z-0",
            ])}
            style={{ opacity: showMap ? 1 : 0 }}
          />
        )}
        {showTrainers && (
          <img
            src={"/maps/trainers/map_" + mapIngameID + ".png"}
            alt="Trainers"
            className={cn([
              "absolute top-0 left-0 transition-opacity duration-300",
              "w-full h-full object-cover z-10",
            ])}
            style={{ opacity: showTrainers ? 1 : 0 }}
          />
        )}
        {showObjects && (
          <img
            src={"/maps/items/map_" + mapIngameID + ".png"}
            alt="Items"
            className={cn([
              "absolute top-0 left-0 transition-opacity duration-300",
              "w-full h-full object-cover z-20",
            ])}
            style={{ opacity: showObjects ? 1 : 0 }}
          />
        )}
        {showPokemon && (
          <img
            src={"/maps/pokemon/map_" + mapIngameID + ".png"}
            alt="Items"
            className={cn([
              "absolute top-0 left-0 transition-opacity duration-300",
              "w-full h-full object-cover z-30",
            ])}
            style={{ opacity: showPokemon ? 1 : 0 }}
          />
        )}

        {/* Overlay cuando no hay capas seleccionadas */}
        {!showMap && !showTrainers && !showObjects && !showPokemon && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12l-2.122-2.122m0 0L7.76 7.76m2.122 2.122L12 12"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Active some layer...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface MapImageFullyModeProps extends MapImageProps {
  setShowFullyImage: (value: React.SetStateAction<boolean>) => void;
}

const MapImageFullyMode = ({
  mapIngameID,
  showMap,
  showObjects,
  showPokemon,
  showTrainers,
  setShowFullyImage,
}: MapImageFullyModeProps) => {
  return (
    <div
      onClick={() => setShowFullyImage(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-zoom-out"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {showMap && (
          <img
            src={"/maps/base/map_" + mapIngameID + ".png"}
            alt="Map"
            className="absolute top-0 left-0 z-0 w-full h-full object-contain transition-opacity duration-300"
            style={{ opacity: showMap ? 1 : 0 }}
          />
        )}
        {showTrainers && (
          <img
            src={"/maps/trainers/map_" + mapIngameID + ".png"}
            alt="Trainers"
            className="absolute top-0 left-0 z-10 w-full h-full object-contain transition-opacity duration-300"
            style={{ opacity: showTrainers ? 1 : 0 }}
          />
        )}
        {showObjects && (
          <img
            src={"/maps/items/map_" + mapIngameID + ".png"}
            alt="Items"
            className="absolute top-0 left-0 z-20 w-full h-full object-contain transition-opacity duration-300"
            style={{ opacity: showObjects ? 1 : 0 }}
          />
        )}
        {showPokemon && (
          <img
            src={"/maps/pokemon/map_" + mapIngameID + ".png"}
            alt="Pokemon"
            className="absolute top-0 left-0 z-30 w-full h-full object-contain transition-opacity duration-300"
            style={{ opacity: showPokemon ? 1 : 0 }}
          />
        )}

        {/* Overlay when no layers are selected */}
        {!showMap && !showTrainers && !showObjects && !showPokemon && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-2">
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12l-2.122-2.122m0 0L7.76 7.76m2.122 2.122L12 12"
                  />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Enable at least one layer</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
