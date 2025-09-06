import type { FakemonForTeam } from "@/types/fakemon";
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface TeamBuilderContextType {
  team: FakemonForTeam[];
  addPokemon: (pokemon: FakemonForTeam) => void;
  removePokemon: (id: string) => void;
  updatePokemon: (index: number, pokemon: FakemonForTeam) => void;
  clearTeam: () => void;
}

const TeamBuilderContext = createContext<TeamBuilderContextType | undefined>(
  undefined
);

// Provider component
export const TeamBuilderProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [team, setTeam] = useState<FakemonForTeam[]>([]);

  const addPokemon = (pokemon: FakemonForTeam) => {
    if (team.length < 6) {
      setTeam((prev) => [...prev, pokemon]);
    }
  };

  const removePokemon = (id: string) => {
    setTeam((prev) => prev.filter((p) => p.id !== id));
  };

  const updatePokemon = (index: number, pokemon: FakemonForTeam) => {
    setTeam((prev) => {
      const newTeam = [...prev];
      newTeam[index] = pokemon;
      return newTeam;
    });
  };

  const clearTeam = () => {
    setTeam([]);
  };

  return (
    <TeamBuilderContext.Provider
      value={{ team, addPokemon, removePokemon, updatePokemon, clearTeam }}
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
