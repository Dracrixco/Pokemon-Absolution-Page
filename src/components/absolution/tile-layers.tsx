// src/components/TileLayers.tsx
import React, { useState } from "react";
import { type TileData } from "@/lib/map";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface TileLayersProps {
  tile: TileData | null;
}

export const TileLayers: React.FC<TileLayersProps> = ({ tile }) => {
  const [showMap, setShowMap] = useState(true);
  const [showTrainers, setShowTrainers] = useState(true);
  const [showObjects, setShowObjects] = useState(true);
  const [showPokemon, setShowPokemon] = useState(true);

  if (!tile) {
    return (
      <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-gray-500 text-lg">
            Select a valid tile to view the layers
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Click on a green area of the map
          </p>
        </div>
      </div>
    );
  }

  const { mapIngameID } = tile;

  const layers = [
    {
      key: "map",
      label: "Map",
      checked: showMap,
      setter: setShowMap,
      color: "blue",
      icon: "🗺️",
    },
    {
      key: "trainers",
      label: "Trainers",
      checked: showTrainers,
      setter: setShowTrainers,
      color: "red",
      icon: "👥",
    },
    {
      key: "objects",
      label: "Items",
      checked: showObjects,
      setter: setShowObjects,
      color: "green",
      icon: "🎒",
    },
    {
      key: "pokemon",
      label: "Pokemon",
      checked: showPokemon,
      setter: setShowPokemon,
      color: "green",
      icon: "🐾",
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">{tile.mapName}</h2>
        <p className="text-indigo-100 text-sm">
          ID: {mapIngameID} | Posición: ({tile.x}, {tile.y})
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {layers.map((layer) => (
            <label key={layer.key} className="group cursor-pointer">
              <div
                className={cn(
                  "flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-200",
                  layer.checked
                    ? `border-${layer.color}-200 bg-${layer.color}-50 shadow-md`
                    : "border-gray-200 bg-gray-50 hover:border-gray-300"
                )}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={layer.checked}
                    onChange={() => layer.setter(!layer.checked)}
                    className={cn(
                      "w-5 h-5 rounded border-2 transition-all duration-200",
                      layer.checked
                        ? `text-${layer.color}-600 border-${layer.color}-300 focus:ring-${layer.color}-500`
                        : "border-gray-300 focus:ring-gray-500"
                    )}
                  />
                  {layer.checked && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white">
                      <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{layer.icon}</span>
                    <span
                      className={cn(
                        "font-medium transition-colors duration-200",
                        layer.checked
                          ? `text-${layer.color}-700`
                          : "text-gray-600"
                      )}
                    >
                      {layer.label}
                    </span>
                  </div>
                </div>
              </div>
            </label>
          ))}
        </div>

        <MapImage
          showMap={showMap}
          showTrainers={showTrainers}
          showObjects={showObjects}
          showPokemon={showPokemon}
          mapIngameID={mapIngameID}
        />
      </div>
    </div>
  );
};

interface MapImageProps {
  showMap: boolean;
  showTrainers: boolean;
  showObjects: boolean;
  showPokemon: boolean;
  mapIngameID: number;
}

const MapImage = ({
  mapIngameID,
  showMap,
  showObjects,
  showPokemon,
  showTrainers,
}: MapImageProps) => {
  const [showFullyImage, setShowFullyImage] = useState(false);

  if (showFullyImage) {
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
                <p className="text-gray-500 text-sm">
                  Enable at least one layer
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
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
            className="absolute top-0 left-0 transition-opacity duration-300 z-0"
            style={{ opacity: showMap ? 1 : 0 }}
          />
        )}
        {showTrainers && (
          <img
            src={"/maps/trainers/map_" + mapIngameID + ".png"}
            alt="Trainers"
            className="absolute top-0 left-0 transition-opacity duration-300 z-10"
            style={{ opacity: showTrainers ? 1 : 0 }}
          />
        )}
        {showObjects && (
          <img
            src={"/maps/items/map_" + mapIngameID + ".png"}
            alt="Items"
            className="absolute top-0 left-0 transition-opacity duration-300 z-20"
            style={{ opacity: showObjects ? 1 : 0 }}
          />
        )}
        {showPokemon && (
          <img
            src={"/maps/pokemon/map_" + mapIngameID + ".png"}
            alt="Items"
            className="absolute top-0 left-0 transition-opacity duration-300 z-30"
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
