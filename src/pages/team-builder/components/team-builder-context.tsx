import type { FakemonForTeam } from "@/types/fakemon";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface TeamBuilderContextType {
  team: FakemonForTeam[];
  addPokemon: (pokemon: FakemonForTeam) => void;
  removePokemon: (randomId: string) => void;
  updatePokemon: (index: number, pokemon: FakemonForTeam) => void;
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

  // Load team from localStorage on mount
  useEffect(() => {
    try {
      const savedTeam = localStorage.getItem("pokemon-team");
      console.log("Loading team from localStorage:", savedTeam);
      if (savedTeam) {
        const parsedTeam = JSON.parse(savedTeam);
        console.log("Parsed team:", parsedTeam);
        if (Array.isArray(parsedTeam)) {
          setTeam(parsedTeam);
          console.log(
            "Team loaded successfully:",
            parsedTeam.length,
            "pokemon"
          );
        }
      } else {
        console.log("No saved team found in localStorage");
      }
    } catch (error) {
      console.warn("Failed to load team from localStorage:", error);
    }
  }, []);

  // Save team to localStorage whenever it changes
  useEffect(() => {
    try {
      console.log("Saving team to localStorage:", team.length, "pokemon");
      localStorage.setItem("pokemon-team", JSON.stringify(team));
    } catch (error) {
      console.warn("Failed to save team to localStorage:", error);
    }
  }, [team]);

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
