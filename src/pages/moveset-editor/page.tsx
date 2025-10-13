import { useState, useMemo } from "react";
import {
  Download,
  Trash2,
  BarChart3,
  Search,
  Zap,
  Info,
  Upload,
} from "lucide-react";
import { getAllMoves } from "@/lib/moves";
import { getTypeColor } from "@/lib/type-colors";
import { MoveDetailModal } from "./components/move-detail-modal";
import type { Move } from "@/types/move";

interface LevelMove {
  level: number;
  moveId: string;
}

interface MovesetData {
  levelMoves: LevelMove[];
  tutorMoves: string[];
  eggMoves: string[];
}

export const MovesetEditor = () => {
  const allMoves = getAllMoves();
  const [moveset, setMoveset] = useState<MovesetData>({
    levelMoves: [],
    tutorMoves: [],
    eggMoves: [],
  });

  const [activeTab, setActiveTab] = useState<"level" | "tutor" | "egg">(
    "level",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showStats, setShowStats] = useState(false);
  const [selectedMoveForModal, setSelectedMoveForModal] = useState<Move | null>(
    null,
  );
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState("");
  const [autoSort, setAutoSort] = useState(true);

  // Get all unique types and categories
  const availableTypes = Array.from(
    new Set(allMoves.map((m) => m.type)),
  ).sort();
  const availableCategories = Array.from(
    new Set(allMoves.map((m) => m.category)),
  ).sort();

  // Filter moves based on search and filters
  const filteredMoves = useMemo(() => {
    // Get all already added move IDs
    const levelMoveIds = moveset.levelMoves.map((lm) => lm.moveId);
    const allAddedMoveIds = new Set([
      ...levelMoveIds,
      ...moveset.tutorMoves,
      ...moveset.eggMoves,
    ]);

    return allMoves
      .filter((move) => {
        // Exclude already added moves
        if (allAddedMoveIds.has(move.id)) return false;

        const matchesSearch =
          move.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          move.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType =
          selectedType === "all" || move.type === selectedType;
        const matchesCategory =
          selectedCategory === "all" || move.category === selectedCategory;

        return matchesSearch && matchesType && matchesCategory;
      })
      .sort((a, b) => {
        // Sort by power descending (highest first), then by name
        const powerA = a.power || 0;
        const powerB = b.power || 0;

        if (powerB !== powerA) {
          return powerB - powerA;
        }

        // If power is the same, sort alphabetically by name
        return a.name.localeCompare(b.name);
      });
  }, [allMoves, searchTerm, selectedType, selectedCategory, moveset]);

  // Calculate statistics
  const stats = useMemo(() => {
    const levelMoveIds = moveset.levelMoves.map((lm) => lm.moveId);
    const allAddedMoves = [
      ...levelMoveIds,
      ...moveset.tutorMoves,
      ...moveset.eggMoves,
    ];

    const typeStats: Record<
      string,
      { level: number; tutor: number; egg: number; total: number }
    > = {};

    availableTypes.forEach((type) => {
      typeStats[type] = { level: 0, tutor: 0, egg: 0, total: 0 };
    });

    moveset.levelMoves.forEach((lm) => {
      const move = allMoves.find((m) => m.id === lm.moveId);
      if (move) {
        typeStats[move.type].level++;
        typeStats[move.type].total++;
      }
    });

    moveset.tutorMoves.forEach((moveId) => {
      const move = allMoves.find((m) => m.id === moveId);
      if (move) {
        typeStats[move.type].tutor++;
        typeStats[move.type].total++;
      }
    });

    moveset.eggMoves.forEach((moveId) => {
      const move = allMoves.find((m) => m.id === moveId);
      if (move) {
        typeStats[move.type].egg++;
        typeStats[move.type].total++;
      }
    });

    return {
      totalMoves: allAddedMoves.length,
      uniqueMoves: new Set(allAddedMoves).size,
      levelMoves: moveset.levelMoves.length,
      tutorMoves: moveset.tutorMoves.length,
      eggMoves: moveset.eggMoves.length,
      typeStats,
    };
  }, [moveset, allMoves, availableTypes]);

  // Add move functions
  const addLevelMove = (moveId: string, level: number = 1) => {
    const exists = moveset.levelMoves.some((lm) => lm.moveId === moveId);
    if (!exists) {
      const newLevelMoves = [...moveset.levelMoves, { level, moveId }];
      if (autoSort) {
        newLevelMoves.sort(
          (a, b) => a.level - b.level || a.moveId.localeCompare(b.moveId),
        );
      }
      setMoveset((prev) => ({ ...prev, levelMoves: newLevelMoves }));
    }
  };

  const addTutorMove = (moveId: string) => {
    if (!moveset.tutorMoves.includes(moveId)) {
      const newTutorMoves = [...moveset.tutorMoves, moveId].sort();
      setMoveset((prev) => ({ ...prev, tutorMoves: newTutorMoves }));
    }
  };

  const addEggMove = (moveId: string) => {
    if (!moveset.eggMoves.includes(moveId)) {
      const newEggMoves = [...moveset.eggMoves, moveId].sort();
      setMoveset((prev) => ({ ...prev, eggMoves: newEggMoves }));
    }
  };

  // Remove move functions
  const removeLevelMove = (index: number) => {
    const newLevelMoves = moveset.levelMoves.filter((_, i) => i !== index);
    setMoveset((prev) => ({ ...prev, levelMoves: newLevelMoves }));
  };

  const removeTutorMove = (moveId: string) => {
    const newTutorMoves = moveset.tutorMoves.filter((id) => id !== moveId);
    setMoveset((prev) => ({ ...prev, tutorMoves: newTutorMoves }));
  };

  const removeEggMove = (moveId: string) => {
    const newEggMoves = moveset.eggMoves.filter((id) => id !== moveId);
    setMoveset((prev) => ({ ...prev, eggMoves: newEggMoves }));
  };

  // Update level move level
  const updateLevelMoveLevel = (index: number, newLevel: number) => {
    const newLevelMoves = [...moveset.levelMoves];
    newLevelMoves[index].level = Math.max(1, Math.min(100, newLevel));
    if (autoSort) {
      newLevelMoves.sort(
        (a, b) => a.level - b.level || a.moveId.localeCompare(b.moveId),
      );
    }
    setMoveset((prev) => ({ ...prev, levelMoves: newLevelMoves }));
  };

  // Manual sort level moves
  const sortLevelMoves = () => {
    const sortedLevelMoves = [...moveset.levelMoves].sort(
      (a, b) => a.level - b.level || a.moveId.localeCompare(b.moveId),
    );
    setMoveset((prev) => ({ ...prev, levelMoves: sortedLevelMoves }));
  };

  // Auto-scale level moves from level 5 to 60
  const autoScaleLevelMoves = (levelStart = 5, levelEnd = 60) => {
    if (moveset.levelMoves.length === 0) return;

    // Get move data with power information
    const movesWithData = moveset.levelMoves
      .map((levelMove) => {
        const moveData = allMoves.find((m) => m.id === levelMove.moveId);
        return {
          ...levelMove,
          moveData,
          power: moveData?.power || 0,
          category: moveData?.category || "Status",
        };
      })
      .filter((m) => m.moveData);

    // Separate moves by category
    const attackMoves = movesWithData.filter((m) => m.category !== "Status");
    const statusMoves = movesWithData.filter((m) => m.category === "Status");

    // Sort attack moves by power (descending)
    attackMoves.sort(
      (a, b) => a.power - b.power || a.moveId.localeCompare(b.moveId),
    );

    // Create scaled levels from 5 to 60
    const totalMoves = movesWithData.length;
    const levelStep = (levelEnd - levelStart) / (totalMoves - 1); // From level 5 to 60
    const scaledMoves: LevelMove[] = [];

    let statusIndex = 0;
    for (let i = 0; i < totalMoves; i++) {
      const targetLevel = Math.round(levelStart + i * levelStep);

      // Insert status moves occasionally (every 3-4 moves)
      const shouldInsertStatus =
        statusMoves.length > 0 &&
        statusIndex < statusMoves.length &&
        (i % 3 === 2 || i % 4 === 3) &&
        attackMoves.length > i - statusIndex;

      if (shouldInsertStatus) {
        scaledMoves.push({
          level: targetLevel,
          moveId: statusMoves[statusIndex].moveId,
        });
        statusIndex++;
      } else {
        const attackIndex = i - statusIndex;
        if (attackIndex < attackMoves.length) {
          scaledMoves.push({
            level: targetLevel,
            moveId: attackMoves[attackIndex].moveId,
          });
        }
      }
    }

    // Add remaining status moves at the end
    while (statusIndex < statusMoves.length) {
      scaledMoves.push({
        level: levelEnd,
        moveId: statusMoves[statusIndex].moveId,
      });
      statusIndex++;
    }

    setMoveset((prev) => ({ ...prev, levelMoves: scaledMoves }));
  };

  // Import function
  const handleImport = (data: string) => {
    try {
      const lines = data.trim().split("\n");
      const newMovesetData: MovesetData = {
        levelMoves: [],
        tutorMoves: [],
        eggMoves: [],
      };

      lines.forEach((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("Moves = ")) {
          const movesStr = trimmedLine.substring(8);
          const moves = movesStr.split(",");
          for (let i = 0; i < moves.length; i += 2) {
            if (i + 1 < moves.length) {
              newMovesetData.levelMoves.push({
                level: parseInt(moves[i]),
                moveId: moves[i + 1],
              });
            }
          }
        } else if (trimmedLine.startsWith("TutorMoves = ")) {
          const movesStr = trimmedLine.substring(13);
          newMovesetData.tutorMoves = movesStr.split(",");
        } else if (trimmedLine.startsWith("EggMoves = ")) {
          const movesStr = trimmedLine.substring(11);
          newMovesetData.eggMoves = movesStr.split(",");
        }
      });

      setMoveset(newMovesetData);
      setShowImportModal(false);
      setImportText("");
    } catch (error) {
      alert("Error parsing the imported data. Please check the format.");
      console.error("Import error:", error);
    }
  };

  // Export function (existing)
  const exportMoveset = () => {
    let exportText = "";

    // Level moves
    if (moveset.levelMoves.length > 0) {
      const levelMoveStrings = moveset.levelMoves.map(
        (lm) => `${lm.level},${lm.moveId}`,
      );
      exportText += `Moves = ${levelMoveStrings.join(",")}\n`;
    }

    // Tutor moves
    if (moveset.tutorMoves.length > 0) {
      exportText += `TutorMoves = ${moveset.tutorMoves.join(",")}\n`;
    }

    // Egg moves
    if (moveset.eggMoves.length > 0) {
      exportText += `EggMoves = ${moveset.eggMoves.join(",")}\n`;
    }

    // Create and download file
    const blob = new Blob([exportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "moveset_export.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Modal functions
  const openMoveModal = (move: Move) => {
    setSelectedMoveForModal(move);
    setShowMoveModal(true);
  };

  const closeMoveModal = () => {
    setSelectedMoveForModal(null);
    setShowMoveModal(false);
  };

  // Clear all moves
  const clearMoveset = () => {
    setMoveset({
      levelMoves: [],
      tutorMoves: [],
      eggMoves: [],
    });
  };

  const handleMoveClick = (move: Move) => {
    switch (activeTab) {
      case "level":
        addLevelMove(move.id);
        break;
      case "tutor":
        addTutorMove(move.id);
        break;
      case "egg":
        addEggMove(move.id);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                <Zap className="text-yellow-500" size={32} />
                Moveset Editor
              </h1>
              <p className="text-gray-600 mt-2">
                Create and manage Pokémon movesets with level-up, tutor, and egg
                moves
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <BarChart3 size={20} />
                {showStats ? "Hide" : "Show"} Stats
              </button>
              <button
                onClick={exportMoveset}
                disabled={stats.totalMoves === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Download size={20} />
                Export
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Upload size={20} />
                Import
              </button>
              <button
                onClick={clearMoveset}
                disabled={stats.totalMoves === 0}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 size={20} />
                Clear All
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-blue-600">
                {stats.levelMoves}
              </div>
              <div className="text-sm text-blue-800">Level Moves</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-purple-600">
                {stats.tutorMoves}
              </div>
              <div className="text-sm text-purple-800">Tutor Moves</div>
            </div>
            <div className="bg-pink-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-pink-600">
                {stats.eggMoves}
              </div>
              <div className="text-sm text-pink-800">Egg Moves</div>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <div className="text-2xl font-bold text-green-600">
                {stats.totalMoves}
              </div>
              <div className="text-sm text-green-800">Total Moves</div>
            </div>
          </div>
        </div>

        {/* Statistics Panel */}
        {showStats && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="text-blue-500" size={24} />
              Move Type Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTypes.map((type) => {
                const typeStat = stats.typeStats[type];
                if (typeStat.total === 0) return null;

                return (
                  <div key={type} className="border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded text-white text-sm font-medium ${getTypeColor(
                          type,
                        )}`}
                      >
                        {type}
                      </span>
                      <span className="font-semibold">
                        {typeStat.total} moves
                      </span>
                    </div>
                    <div className="text-sm space-y-1">
                      {typeStat.level > 0 && (
                        <div className="text-blue-600">
                          Level: {typeStat.level}
                        </div>
                      )}
                      {typeStat.tutor > 0 && (
                        <div className="text-purple-600">
                          Tutor: {typeStat.tutor}
                        </div>
                      )}
                      {typeStat.egg > 0 && (
                        <div className="text-pink-600">Egg: {typeStat.egg}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Move Pool */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Available Moves</h2>

            {/* Filters */}
            <div className="space-y-4 mb-6">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search moves..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  {availableTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-sm text-gray-600">
                Showing {filteredMoves.length} of {allMoves.length} moves
                {stats.totalMoves > 0 && (
                  <span className="ml-2 text-blue-600">
                    ({stats.totalMoves} already added)
                  </span>
                )}
              </div>
            </div>

            {/* Moves List */}
            <div className="overflow-y-auto space-y-2">
              {filteredMoves.map((move) => (
                <div
                  key={move.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div
                    className="flex items-center gap-3 flex-1 cursor-pointer"
                    onClick={() => handleMoveClick(move)}
                  >
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-medium ${getTypeColor(
                        move.type,
                      )}`}
                    >
                      {move.type}
                    </span>
                    <span
                      className={`px-2 py-1 rounded text-white text-xs font-medium ${
                        move.category === "Physical"
                          ? "bg-red-500"
                          : move.category === "Special"
                            ? "bg-blue-500"
                            : "bg-gray-500"
                      }`}
                    >
                      {move.category}
                    </span>
                    <span className="font-medium">{move.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-600">
                      {move.power && move.power > 0 && (
                        <span className="mr-2">PWR: {move.power}</span>
                      )}
                      {move.accuracy && move.accuracy > 0 && (
                        <span>ACC: {move.accuracy}%</span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openMoveModal(move);
                      }}
                      className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded transition-colors"
                      title="View move details"
                    >
                      <Info size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Moveset Management */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Current Moveset</h2>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-4">
              {[
                { id: "level", label: "Level Moves", count: stats.levelMoves },
                { id: "tutor", label: "Tutor Moves", count: stats.tutorMoves },
                { id: "egg", label: "Egg Moves", count: stats.eggMoves },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "level" | "tutor" | "egg")
                  }
                  className={`px-4 py-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {/* Level Move Controls */}
            {activeTab === "level" && (
              <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={autoSort}
                    onChange={(e) => setAutoSort(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  Auto-ordenar por nivel
                </label>
                <button
                  onClick={sortLevelMoves}
                  disabled={moveset.levelMoves.length === 0}
                  className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Ordenar Lista
                </button>

                {[
                  [1, 50],
                  [5, 50],
                  [5, 60],
                  [5, 70],
                ].map(([start, end]) => (
                  <button
                    onClick={() => autoScaleLevelMoves(start, end)}
                    disabled={moveset.levelMoves.length === 0}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Escalado {start}-{end} (Auto)
                  </button>
                ))}
              </div>
            )}

            {/* Tab Content */}
            <div className="overflow-y-auto">
              {activeTab === "level" && (
                <div className="space-y-2">
                  {moveset.levelMoves.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                      No level moves added. Click on moves from the left to add
                      them.
                    </div>
                  ) : (
                    moveset.levelMoves.map((levelMove, index) => {
                      const move = allMoves.find(
                        (m) => m.id === levelMove.moveId,
                      );
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <input
                              type="number"
                              min="1"
                              max="100"
                              value={levelMove.level}
                              onChange={(e) =>
                                updateLevelMoveLevel(
                                  index,
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-center"
                            />
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded text-white text-xs font-medium ${getTypeColor(
                                  move?.type || "Normal",
                                )}`}
                              >
                                {move?.type || "Unknown"}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-white text-xs font-medium ${
                                  move?.category === "Physical"
                                    ? "bg-red-500"
                                    : move?.category === "Special"
                                      ? "bg-blue-500"
                                      : "bg-gray-500"
                                }`}
                              >
                                {move?.category || "Unknown"}
                              </span>
                            </div>
                            <span className="font-medium">
                              {move?.name || levelMove.moveId}
                            </span>
                            <div className="text-sm text-gray-600 ml-auto">
                              {move?.power && move.power > 0 && (
                                <span className="mr-2">PWR: {move.power}</span>
                              )}
                              {move?.accuracy && move.accuracy > 0 && (
                                <span>ACC: {move.accuracy}%</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeLevelMove(index)}
                            className="text-red-500 hover:text-red-700 p-1 ml-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === "tutor" && (
                <div className="space-y-2">
                  {moveset.tutorMoves.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                      No tutor moves added. Click on moves from the left to add
                      them.
                    </div>
                  ) : (
                    moveset.tutorMoves.map((moveId) => {
                      const move = allMoves.find((m) => m.id === moveId);
                      return (
                        <div
                          key={moveId}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded text-white text-xs font-medium ${getTypeColor(
                                  move?.type || "Normal",
                                )}`}
                              >
                                {move?.type || "Unknown"}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-white text-xs font-medium ${
                                  move?.category === "Physical"
                                    ? "bg-red-500"
                                    : move?.category === "Special"
                                      ? "bg-blue-500"
                                      : "bg-gray-500"
                                }`}
                              >
                                {move?.category || "Unknown"}
                              </span>
                            </div>
                            <span className="font-medium">
                              {move?.name || moveId}
                            </span>
                            <div className="text-sm text-gray-600 ml-auto">
                              {move?.power && move.power > 0 && (
                                <span className="mr-2">PWR: {move.power}</span>
                              )}
                              {move?.accuracy && move.accuracy > 0 && (
                                <span>ACC: {move.accuracy}%</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeTutorMove(moveId)}
                            className="text-red-500 hover:text-red-700 p-1 ml-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === "egg" && (
                <div className="space-y-2">
                  {moveset.eggMoves.length === 0 ? (
                    <div className="text-gray-500 text-center py-8">
                      No egg moves added. Click on moves from the left to add
                      them.
                    </div>
                  ) : (
                    moveset.eggMoves.map((moveId) => {
                      const move = allMoves.find((m) => m.id === moveId);
                      return (
                        <div
                          key={moveId}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded text-white text-xs font-medium ${getTypeColor(
                                  move?.type || "Normal",
                                )}`}
                              >
                                {move?.type || "Unknown"}
                              </span>
                              <span
                                className={`px-2 py-1 rounded text-white text-xs font-medium ${
                                  move?.category === "Physical"
                                    ? "bg-red-500"
                                    : move?.category === "Special"
                                      ? "bg-blue-500"
                                      : "bg-gray-500"
                                }`}
                              >
                                {move?.category || "Unknown"}
                              </span>
                            </div>
                            <span className="font-medium">
                              {move?.name || moveId}
                            </span>
                            <div className="text-sm text-gray-600 ml-auto">
                              {move?.power && move.power > 0 && (
                                <span className="mr-2">PWR: {move.power}</span>
                              )}
                              {move?.accuracy && move.accuracy > 0 && (
                                <span>ACC: {move.accuracy}%</span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => removeEggMove(moveId)}
                            className="text-red-500 hover:text-red-700 p-1 ml-2"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Move Detail Modal */}
        <MoveDetailModal
          isOpen={showMoveModal}
          move={selectedMoveForModal}
          onClose={closeMoveModal}
        />

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full m-4 max-h-[80vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">
                  Import Moveset Data
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Paste your moveset data in the format: "Moves =
                  1,TACKLE,5,GROWL,..."
                </p>
              </div>

              <div className="p-6">
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  className="w-full h-64 border border-gray-300 rounded-lg p-3 font-mono text-sm"
                  placeholder={`Example format:
Moves = 1,TACKLE,5,GROWL,9,VINEWHIP
TutorMoves = BODYSLAM,DOUBLEEDGE,SEISMICTOSS
EggMoves = CURSE,AMNESIA,CHARM`}
                />
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportText("");
                  }}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleImport(importText)}
                  disabled={!importText.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Import Data
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovesetEditor;
