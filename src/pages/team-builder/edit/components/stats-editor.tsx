import React, { useState } from "react";
import { BarChart3, Zap, RefreshCw } from "lucide-react";
import type { FakemonForTeam } from "@/types/fakemon";

interface StatsEditorProps {
  pokemon: FakemonForTeam;
  onChange: (pokemon: FakemonForTeam) => void;
}

const STAT_NAMES = ["HP", "Attack", "Defense", "Sp. Atk", "Sp. Def", "Speed"];
const STAT_COLORS = [
  "bg-green-500", // HP
  "bg-red-500", // Attack
  "bg-yellow-500", // Defense
  "bg-blue-500", // Sp. Attack
  "bg-purple-500", // Sp. Defense
  "bg-pink-500", // Speed
];

const EV_PRESETS = {
  physical: [4, 252, 0, 0, 0, 252], // HP/Atk/Speed
  special: [4, 0, 0, 252, 0, 252], // HP/SpAtk/Speed
  tank: [4, 0, 252, 0, 252, 0], // HP/Def/SpDef
  bulkyPhysical: [252, 252, 0, 0, 4, 0], // HP/Atk/SpDef
  bulkySpecial: [252, 0, 0, 252, 4, 0], // HP/SpAtk/SpDef
  mixed: [4, 126, 0, 126, 0, 252], // Atk/SpAtk/Speed
};

export const StatsEditor: React.FC<StatsEditorProps> = ({
  pokemon,
  onChange,
}) => {
  const [activeTab, setActiveTab] = useState<"evs" | "ivs">("evs");

  const handleEVChange = (index: number, value: string) => {
    const numValue = Math.max(0, Math.min(255, parseInt(value) || 0));
    const newEvs = [...pokemon.evs];
    newEvs[index] = numValue;

    // Check total EVs don't exceed 510
    const total = newEvs.reduce((sum, ev) => sum + ev, 0);
    if (total <= 510) {
      onChange({ ...pokemon, evs: newEvs });
    }
  };

  const handleIVChange = (index: number, value: string) => {
    const numValue = Math.max(0, Math.min(31, parseInt(value) || 0));
    const newIvs = [...pokemon.ivs];
    newIvs[index] = numValue;
    onChange({ ...pokemon, ivs: newIvs });
  };

  const applyEVPreset = (preset: keyof typeof EV_PRESETS) => {
    let nature = "";
    switch (preset) {
      case "physical":
        nature = "Adamant";
        break;
      case "special":
        nature = "Modest";
        break;
      case "tank":
        nature = "Bold";
        break;
      case "bulkyPhysical":
        nature = "Careful";
        break;
      case "bulkySpecial":
        nature = "Calm";
        break;
      case "mixed":
        nature = "Timid";
        break;
    }
    onChange({ ...pokemon, evs: [...EV_PRESETS[preset]], nature });
  };

  const maximizeIVs = () => {
    onChange({ ...pokemon, ivs: [31, 31, 31, 31, 31, 31] });
  };

  const resetIVs = () => {
    onChange({ ...pokemon, ivs: [0, 0, 0, 0, 0, 0] });
  };

  const resetEVs = () => {
    onChange({ ...pokemon, evs: [0, 0, 0, 0, 0, 0] });
  };

  const totalEVs = pokemon.evs.reduce((sum, ev) => sum + ev, 0);
  const remainingEVs = 510 - totalEVs;

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={20} className="text-green-500" />
        <h2 className="text-lg font-semibold">Stats</h2>
      </div>

      {/* Tab Selector */}
      <div className="flex mb-4 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab("evs")}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === "evs"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          EVs ({totalEVs}/510)
        </button>
        <button
          onClick={() => setActiveTab("ivs")}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === "ivs"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          IVs
        </button>
      </div>

      {/* EVs Tab */}
      {activeTab === "evs" && (
        <div className="space-y-4">
          {/* EV Presets */}
          <div>
            <h3 className="font-medium mb-2">Quick Presets</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => applyEVPreset("physical")}
                className="px-3 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                Physical Attacker
              </button>
              <button
                onClick={() => applyEVPreset("special")}
                className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm"
              >
                Special Attacker
              </button>
              <button
                onClick={() => applyEVPreset("tank")}
                className="px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm"
              >
                Tank
              </button>
              <button
                onClick={() => applyEVPreset("mixed")}
                className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors text-sm"
              >
                Mixed Attacker
              </button>
              <button
                onClick={() => applyEVPreset("bulkyPhysical")}
                className="px-3 py-2 bg-purple-100 text-amber-800 rounded-lg hover:bg-purple-200 transition-colors text-sm"
              >
                Bulky Physical
              </button>
              <button
                onClick={() => applyEVPreset("bulkySpecial")}
                className="px-3 py-2 bg-purple-100 text-cyan-800 rounded-lg hover:bg-purple-200 transition-colors text-sm"
              >
                Bulky Special
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Remaining EVs:{" "}
              <span
                className={`font-bold ${
                  remainingEVs < 0 ? "text-red-500" : "text-green-600"
                }`}
              >
                {remainingEVs}
              </span>
            </div>
            <button
              onClick={resetEVs}
              className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
            >
              <RefreshCw size={14} />
              Reset All
            </button>
          </div>

          {/* EV Inputs */}
          <div className="space-y-3">
            {STAT_NAMES.map((statName, index) => (
              <div key={statName}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    {statName}
                  </label>
                  <span className="text-xs text-gray-500">
                    {pokemon.evs[index]}/252
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${STAT_COLORS[index]}`}
                          style={{
                            width: `${(pokemon.evs[index] / 252) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="252"
                    step="4"
                    value={pokemon.evs[index]}
                    onChange={(e) => handleEVChange(index, e.target.value)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>

          {remainingEVs < 0 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">
                ⚠️ Total EVs exceed the maximum of 510. Please reduce some
                values.
              </p>
            </div>
          )}
        </div>
      )}

      {/* IVs Tab */}
      {activeTab === "ivs" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Individual Values</h3>
            <div className="flex gap-2">
              <button
                onClick={resetIVs}
                className="flex items-center gap-1 px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
              >
                <RefreshCw size={14} />
                Reset
              </button>
              <button
                onClick={maximizeIVs}
                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors text-sm"
              >
                <Zap size={14} />
                Maximize
              </button>
            </div>
          </div>

          {/* IV Inputs */}
          <div className="space-y-3">
            {STAT_NAMES.map((statName, index) => (
              <div key={statName}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">
                    {statName}
                  </label>
                  <span className="text-xs text-gray-500">
                    {pokemon.ivs[index]}/31
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${STAT_COLORS[index]}`}
                          style={{
                            width: `${(pokemon.ivs[index] / 31) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="31"
                    value={pokemon.ivs[index]}
                    onChange={(e) => handleIVChange(index, e.target.value)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
