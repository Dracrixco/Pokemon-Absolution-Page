import React, { useState } from "react";
import { User } from "lucide-react";
import { getTrainerTypeById } from "@/lib/trainer-types";
import { TrainerTypeSelectorModal } from "./trainer-type-selector-modal";

interface TrainerData {
  trainerID: string;
  name: string;
  loseText: string;
  startText: string;
  defaultTeamLevel: number;
}

interface TrainerEditorProps {
  trainer: TrainerData;
  onUpdate: (trainer: TrainerData) => void;
}

export const TrainerEditor: React.FC<TrainerEditorProps> = ({
  trainer,
  onUpdate,
}) => {
  const [showTrainerSelector, setShowTrainerSelector] = useState(false);

  const trainerType = getTrainerTypeById(trainer.trainerID);

  const handleTrainerTypeSelect = (trainerId: string) => {
    onUpdate({
      ...trainer,
      trainerID: trainerId,
    });
  };

  const handleNameChange = (name: string) => {
    onUpdate({
      ...trainer,
      name,
    });
  };

  const handleStartTextChange = (startText: string) => {
    onUpdate({
      ...trainer,
      startText,
    });
  };

  const handleLoseTextChange = (loseText: string) => {
    onUpdate({
      ...trainer,
      loseText,
    });
  };

  const handleDefaultTeamLevelChange = (value: string) => {
    const parsed = Number(value);
    const defaultTeamLevel = Number.isFinite(parsed)
      ? Math.max(1, Math.min(100, Math.floor(parsed)))
      : 1;

    onUpdate({
      ...trainer,
      defaultTeamLevel,
    });
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <User size={20} className="text-blue-500" />
          Trainer Information
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trainer Type & Sprite */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trainer Type
            </label>
            <div className="space-y-2">
              <button
                onClick={() => setShowTrainerSelector(true)}
                className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  {trainerType && (
                    <div className="w-full h-72 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      <img
                        src={getTrainerTypeById(trainer.trainerID)?.sprite}
                        alt="Trainer"
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                  <div className="text-center">
                    <p className="font-medium">
                      {getTrainerTypeById(trainer.trainerID)?.name ||
                        "Select Trainer Type"}
                    </p>
                    <p className="text-xs text-gray-500">Click to change</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Trainer Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Team Level
            </label>
            <input
              type="number"
              value={trainer.defaultTeamLevel}
              min={1}
              max={100}
              onChange={(e) => handleDefaultTeamLevelChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trainer Name
            </label>
            <input
              type="text"
              value={trainer.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter trainer name..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Battle Text
            </label>
            <textarea
              value={trainer.startText}
              onChange={(e) => handleStartTextChange(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter start battle text..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lose Battle Text
            </label>
            <textarea
              value={trainer.loseText}
              onChange={(e) => handleLoseTextChange(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Enter lose battle text..."
            />
          </div>
        </div>
      </div>

      {/* Trainer Type Selector Modal */}
      <TrainerTypeSelectorModal
        isOpen={showTrainerSelector}
        onClose={() => setShowTrainerSelector(false)}
        onSelectTrainer={handleTrainerTypeSelect}
        currentTrainerId={trainer.trainerID}
      />
    </div>
  );
};
