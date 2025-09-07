import { trainerTypes } from "@/data/trainer_types";

export const getAllTrainerTypes = () => {
  return trainerTypes;
};

export const getTrainerTypeById = (id: string) => {
  return trainerTypes.find((trainer) => trainer.id === id);
};
