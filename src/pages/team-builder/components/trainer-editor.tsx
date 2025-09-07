import React, { useState } from "react";
import { User, Edit2, Save, X } from "lucide-react";
import { getTrainerTypeById } from "@/lib/trainer-types";
import { TrainerTypeSelectorModal } from "./trainer-type-selector-modal";

interface TrainerData {
  trainerID: string;
  name: string;
  loseText: string;
  startText: string;
}

interface TrainerEditorProps {
  trainer: TrainerData;
  onUpdate: (trainer: TrainerData) => void;
}

export const TrainerEditor: React.FC<TrainerEditorProps> = ({
  trainer,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(true);
  const [showTrainerSelector, setShowTrainerSelector] = useState(false);
  const [editedTrainer, setEditedTrainer] = useState<TrainerData>(trainer);

  const trainerType = getTrainerTypeById(trainer.trainerID);

  const handleEdit = () => {
    setEditedTrainer(trainer);
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(editedTrainer);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTrainer(trainer);
    setIsEditing(false);
  };

  const handleTrainerTypeSelect = (trainerId: string) => {
    setEditedTrainer((prev) => ({
      ...prev,
      trainerID: trainerId,
    }));
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <User size={20} className="text-blue-500" />
          Trainer Information
        </h2>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-3 py-1.5 text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Edit2 size={16} />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <Save size={16} />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X size={16} />
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trainer Type & Sprite */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trainer Type
            </label>
            {isEditing ? (
              <div className="space-y-2">
                <button
                  onClick={() => setShowTrainerSelector(true)}
                  className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    {trainerType && (
                      <div className="w-full h-72 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                        <img
                          src={
                            getTrainerTypeById(editedTrainer.trainerID)?.sprite
                          }
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
                        {getTrainerTypeById(editedTrainer.trainerID)?.name ||
                          "Select Trainer Type"}
                      </p>
                      <p className="text-xs text-gray-500">Click to change</p>
                    </div>
                  </div>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                {trainerType && (
                  <>
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={trainerType.sprite}
                        alt={trainerType.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">{trainerType.name}</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div
                          className={`inline-block px-2 py-0.5 rounded text-white text-xs ${
                            trainerType.gender.toLowerCase() === "male"
                              ? "bg-blue-500"
                              : "bg-pink-500"
                          }`}
                        >
                          {trainerType.gender}
                        </div>
                        <p>${trainerType.baseMoney} base money</p>
                        <p className="font-mono text-xs text-gray-400">
                          {trainerType.id}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Trainer Details */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trainer Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedTrainer.name}
                onChange={(e) =>
                  setEditedTrainer((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter trainer name..."
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-lg font-medium">
                {trainer.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Battle Text
            </label>
            {isEditing ? (
              <textarea
                value={editedTrainer.startText}
                onChange={(e) =>
                  setEditedTrainer((prev) => ({
                    ...prev,
                    startText: e.target.value,
                  }))
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Enter start battle text..."
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-lg min-h-[3rem] flex items-center">
                {trainer.startText}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lose Battle Text
            </label>
            {isEditing ? (
              <textarea
                value={editedTrainer.loseText}
                onChange={(e) =>
                  setEditedTrainer((prev) => ({
                    ...prev,
                    loseText: e.target.value,
                  }))
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Enter lose battle text..."
              />
            ) : (
              <p className="px-3 py-2 bg-gray-50 rounded-lg min-h-[3rem] flex items-center">
                {trainer.loseText}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Trainer Type Selector Modal */}
      <TrainerTypeSelectorModal
        isOpen={showTrainerSelector}
        onClose={() => setShowTrainerSelector(false)}
        onSelectTrainer={handleTrainerTypeSelect}
        currentTrainerId={editedTrainer.trainerID}
      />
    </div>
  );
};
