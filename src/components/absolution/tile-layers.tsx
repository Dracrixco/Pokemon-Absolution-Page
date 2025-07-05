// src/components/TileLayers.tsx
import React, { useState } from "react";
import { type TileData } from "@/lib/map";

interface TileLayersProps {
  tile: TileData | null;
}

export const TileLayers: React.FC<TileLayersProps> = ({ tile }) => {
  const [showMap, setShowMap] = useState(true);
  const [showTrainers, setShowTrainers] = useState(true);
  const [showObjects, setShowObjects] = useState(true);

  if (!tile) {
    return (
      <p className="mt-4 text-gray-500">Haz click en una casilla válida</p>
    );
  }

  const { mapIngameID } = tile;

  return (
    <div className="mt-6">
      <h2 className="font-semibold mb-2">Capas de “{tile.mapName}”</h2>
      <div className="flex space-x-4 mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showMap}
            onChange={() => setShowMap(!showMap)}
          />
          <span>Mapa</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showTrainers}
            onChange={() => setShowTrainers(!showTrainers)}
          />
          <span>Entrenadores</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={showObjects}
            onChange={() => setShowObjects(!showObjects)}
          />
          <span>Objetos</span>
        </label>
      </div>

      <div
        className="relative"
        style={{
          width: 16 * /*puedes pasar ancho real*/ 16,
          height: 16 * /*alto real*/ 16,
        }}
      >
        {showMap && (
          <img
            src={"/maps/base/map_" + mapIngameID + ".png"}
            alt="Mapa"
            className="absolute top-0 left-0 z-0 w-full h-full"
          />
        )}
        {showTrainers && (
          <img
            src={"/maps/trainers/map_" + mapIngameID + ".png"}
            alt="Entrenadores"
            className="absolute top-0 left-0 z-10 w-full h-full"
          />
        )}
        {showObjects && (
          <img
            src={"/maps/items/map_" + mapIngameID + ".png"}
            alt="Objetos"
            className="absolute top-0 left-0 z-20 w-full h-full"
          />
        )}
      </div>
    </div>
  );
};
