import React, { useState } from "react";
import { X, User, Search } from "lucide-react";
import { getAllTrainerTypes } from "@/lib/trainer-types";

interface TrainerTypeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrainer: (trainerId: string) => void;
  currentTrainerId?: string;
}

export const TrainerTypeSelectorModal: React.FC<
  TrainerTypeSelectorModalProps
> = ({ isOpen, onClose, onSelectTrainer, currentTrainerId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGender, setSelectedGender] = useState<string>("all");
  const trainerTypes = getAllTrainerTypes();

  const filteredTrainers = trainerTypes.filter((trainer) => {
    const matchesSearch =
      trainer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender =
      selectedGender === "all" ||
      trainer.gender.toLowerCase() === selectedGender.toLowerCase();

    return matchesSearch && matchesGender;
  });

  const handleSelectTrainer = (trainerId: string) => {
    onSelectTrainer(trainerId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <User className="text-blue-500" />
            Select Trainer Type
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search trainers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Gender Filter */}
            <div className="flex gap-2">
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            Showing {filteredTrainers.length} of {trainerTypes.length} trainers
          </div>
        </div>

        {/* Trainer Grid */}
        <div className="overflow-y-auto max-h-96">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 p-4">
            {filteredTrainers.map((trainer) => (
              <div
                key={trainer.id}
                className={`bg-white border-2 rounded-lg p-3 cursor-pointer transition-all hover:shadow-md ${
                  currentTrainerId === trainer.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => handleSelectTrainer(trainer.id)}
              >
                <div className="text-center">
                  {/* Trainer Sprite */}
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                    <img
                      src={trainer.sprite}
                      alt={trainer.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        target.nextElementSibling?.classList.remove("hidden");
                      }}
                    />
                    <div className="hidden text-gray-400 text-xs">No Image</div>
                  </div>

                  {/* Trainer Info */}
                  <h3 className="font-semibold text-sm text-gray-800 mb-1">
                    {trainer.name}
                  </h3>
                  <div className="text-xs text-gray-500 space-y-1">
                    <div
                      className={`inline-block px-2 py-0.5 rounded text-white ${
                        trainer.gender.toLowerCase() === "male"
                          ? "bg-blue-500"
                          : "bg-pink-500"
                      }`}
                    >
                      {trainer.gender}
                    </div>
                    <div className="text-gray-600">
                      ${trainer.baseMoney} base money
                    </div>
                    <div className="font-mono text-gray-400 text-xs truncate">
                      {trainer.id}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTrainers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <User size={48} className="mx-auto mb-3 opacity-50" />
              <p>No trainers found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
