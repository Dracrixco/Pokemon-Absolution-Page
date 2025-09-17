/* eslint-disable react-refresh/only-export-components */
import type { FakemonForTeam } from "@/types/fakemon";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface TrainerData {
  trainerID: string;
  name: string;
  loseText: string;
  startText: string;
}

interface TeamBuilderContextType {
  team: FakemonForTeam[];
  trainer: TrainerData;
  addPokemon: (pokemon: FakemonForTeam) => void;
  removePokemon: (randomId: string) => void;
  updatePokemon: (index: number, pokemon: FakemonForTeam) => void;
  updateTrainer: (trainer: TrainerData) => void;
  clearTeam: () => void;
}

export const TeamBuilderContext = createContext<
  TeamBuilderContextType | undefined
>(undefined);

// Provider component
export const TeamBuilderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [team, setTeam] = useState<FakemonForTeam[]>([]);
  const [trainer, setTrainer] = useState<TrainerData>({
    trainerID: "YOUNGSTER",
    name: "New Trainer",
    loseText: "I lost!",
    startText: "Let's battle!",
  });

  // Load trainer from localStorage on mount
  // useEffect(() => {
  //   try {
  //     const savedTrainer = localStorage.getItem("pokemon-trainer");
  //     console.log("Loading trainer from localStorage:", savedTrainer);
  //     if (savedTrainer) {
  //       const parsedTrainer = JSON.parse(savedTrainer);
  //       console.log("Parsed trainer:", parsedTrainer);
  //       setTrainer(parsedTrainer);
  //       console.log("Trainer loaded successfully:", parsedTrainer.name);
  //     } else {
  //       console.log("No saved trainer found in localStorage");
  //     }
  //   } catch (error) {
  //     console.warn("Failed to load trainer from localStorage:", error);
  //   }
  // }, []);

  // Save team to localStorage whenever it changes
  useEffect(() => {
    try {
      console.log("Saving team to localStorage:", team.length, "pokemon");
      localStorage.setItem("pokemon-team", JSON.stringify(team));
    } catch (error) {
      console.warn("Failed to save team to localStorage:", error);
    }
  }, [team]);

  // Save trainer to localStorage whenever it changes
  useEffect(() => {
    try {
      console.log("Saving trainer to localStorage:", trainer.name);
      localStorage.setItem("pokemon-trainer", JSON.stringify(trainer));
    } catch (error) {
      console.warn("Failed to save trainer to localStorage:", error);
    }
  }, [trainer]);

  const addPokemon = (pokemon: FakemonForTeam) => {
    if (team.length < 6) {
      setTeam((prev) => [...prev, pokemon]);
    }
  };

  const removePokemon = (randomId: string) => {
    setTeam((prev) => prev.filter((p) => p.randomId !== randomId));
  };

  const updatePokemon = (index: number, pokemon: FakemonForTeam) => {
    setTeam((prev) => {
      const newTeam = [...prev];
      if (index >= 0 && index < newTeam.length) {
        newTeam[index] = pokemon;
      }
      return newTeam;
    });
  };

  const updateTrainer = (newTrainer: TrainerData) => {
    setTrainer(newTrainer);
  };

  const clearTeam = () => {
    setTeam([]);
  };

  return (
    <TeamBuilderContext.Provider
      value={{
        team,
        trainer,
        addPokemon,
        removePokemon,
        updatePokemon,
        updateTrainer,
        clearTeam,
      }}
    >
      {children}
    </TeamBuilderContext.Provider>
  );
};

// Hook to use the context
export const useTeamBuilder = () => {
  const context = useContext(TeamBuilderContext);
  if (!context) {
    throw new Error("useTeamBuilder must be used within a TeamBuilderProvider");
  }
  return context;
};
