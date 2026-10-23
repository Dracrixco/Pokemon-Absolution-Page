import React from "react";
import { Link } from "react-router-dom";
import type { Fakemon } from "@/types/fakemon";
import type { PokemonForm } from "@/types/pokemonform";
import { getAllFakemons } from "@/lib/fakemons";
import { getFormByNumber } from "@/lib/pokemon-forms";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EvolutionChainProps {
  pokemon: Fakemon | PokemonForm;
  className?: string;
}

interface EvolutionNode {
  pokemon: Fakemon;
  formNumber: number;
  evolutions: EvolutionNode[];
}

export const EvolutionChain: React.FC<EvolutionChainProps> = ({
  pokemon,
  className = "",
}) => {
  const allPokemon = getAllFakemons();

  // Get current form number
  const currentFormNumber = "formNumber" in pokemon ? pokemon.formNumber : 0;

  // Find the base pokemon (the one that doesn't evolve from anything)
  const findBasePokemon = (currentId: string, formNum: number = 0): Fakemon => {
    const current = allPokemon.find((p) => p.id === currentId);
    if (!current) return pokemon as Fakemon;

    // Check if any pokemon (base or form) evolves into this one
    const prevEvolution = allPokemon.find((p) => {
      // Check base pokemon evolution
      if (p.evolution.some((evo) => evo.to === currentId)) {
        return true;
      }

      // Check form evolution if formNum > 0
      if (formNum > 0) {
        const form = getFormByNumber(p.id, formNum);
        if (
          form &&
          form.evolution &&
          form.evolution.some((evo) => evo.to === currentId)
        ) {
          return true;
        }
      }

      return false;
    });

    if (prevEvolution) {
      return findBasePokemon(prevEvolution.id, formNum);
    }

    return current;
  };

  // Build evolution tree recursively - collect ALL evolutions, not just the first
  const buildEvolutionTree = (
    currentId: string,
    formNumber: number = 0,
  ): EvolutionNode | null => {
    const current = allPokemon.find((p) => p.id === currentId);
    if (!current) return null;

    const evolutions: EvolutionNode[] = [];

    // Check if there's a form with evolution data for the current pokemon
    const currentForm =
      formNumber > 0 ? getFormByNumber(currentId, formNumber) : null;

    // Use form evolution if it exists, otherwise use base pokemon evolution
    const evolutionData =
      currentForm && currentForm.evolution && currentForm.evolution.length > 0
        ? currentForm.evolution
        : current.evolution;

    // Find ALL pokemon that this one evolves into (not just one)
    if (evolutionData && evolutionData.length > 0) {
      evolutionData.forEach((evo) => {
        // Recursively build - at each stage, it will check if the evolved pokemon
        // also has the same form number and use that form's evolution data
        const evolutionNode = buildEvolutionTree(evo.to, formNumber);
        if (evolutionNode) {
          evolutions.push(evolutionNode);
        }
      });
    }

    return {
      pokemon: current,
      formNumber,
      evolutions,
    };
  };

  // Get the base pokemon ID (handle both Fakemon and PokemonForm)
  const baseId = "baseId" in pokemon ? pokemon.baseId : pokemon.id;
  const basePokemon = findBasePokemon(baseId, currentFormNumber);
  const evolutionTree = buildEvolutionTree(basePokemon.id, currentFormNumber);

  if (!evolutionTree) {
    return null;
  }

  // Check if there's actually an evolution chain (more than just the base)
  const hasEvolutions =
    evolutionTree.evolutions.length > 0 ||
    allPokemon.some((p) => {
      // Check base evolution
      if (p.evolution.some((evo) => evo.to === basePokemon.id)) {
        return true;
      }
      // Check form evolution
      if (currentFormNumber > 0) {
        const form = getFormByNumber(p.id, currentFormNumber);
        if (
          form &&
          form.evolution &&
          form.evolution.some((evo) => evo.to === basePokemon.id)
        ) {
          return true;
        }
      }
      return false;
    });

  if (!hasEvolutions) {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-purple-800/50 rounded-xl border border-purple-600 p-6",
        className,
      )}
    >
      <h3 className="text-xl font-bold text-white mb-6">Evolution Chain</h3>
      <div className="flex items-center justify-center">
        <EvolutionTreeNode
          node={evolutionTree}
          currentPokemonId={baseId}
          currentFormNumber={currentFormNumber}
        />
      </div>
    </div>
  );
};

interface EvolutionTreeNodeProps {
  node: EvolutionNode;
  currentPokemonId: string;
  currentFormNumber: number;
}

const EvolutionTreeNode: React.FC<EvolutionTreeNodeProps> = ({
  node,
  currentPokemonId,
  currentFormNumber,
}) => {
  const isCurrent = node.pokemon.id === currentPokemonId;
  const hasMultipleEvolutions = node.evolutions.length > 1;

  // Get the correct sprite based on form number
  const displayForm = getFormByNumber(node.pokemon.id, node.formNumber);
  const sprite = displayForm ? displayForm.sprite : node.pokemon.sprite;
  const displayName = displayForm ? displayForm.formName : node.pokemon.name;

  return (
    <div className="flex items-center">
      {/* Current Pokemon Card */}
      <Link
        to={`/fakemons/${node.pokemon.id}`}
        onClick={() => {
          // Force page refresh to update the form selection
          window.location.href = `/fakemons/${node.pokemon.id}`;
        }}
      >
        <div
          className={cn(
            "flex flex-col items-center p-4 rounded-lg transition-all hover:scale-105",
            isCurrent && node.formNumber === currentFormNumber
              ? "bg-purple-600/50 border-2 border-purple-400 shadow-lg shadow-purple-500/50"
              : "bg-purple-900/30 border border-purple-700 hover:border-purple-500",
          )}
        >
          <img
            src={sprite}
            alt={displayName}
            className="w-24 h-24 object-contain mb-2"
            onError={(e) => {
              e.currentTarget.src = "/Front/MISSINGNO.png";
            }}
          />
          <span className="text-white font-medium text-sm text-center">
            {displayName}
          </span>
        </div>
      </Link>

      {/* Evolution Arrow and Next Stage */}
      {node.evolutions.length > 0 && (
        <>
          {hasMultipleEvolutions ? (
            // Multiple evolutions - vertical layout
            <div className="flex items-center ml-4">
              <div className="flex flex-col gap-4">
                {node.evolutions.map((evo) => (
                  <div
                    key={`${evo.pokemon.id}-${evo.formNumber}`}
                    className="flex items-center"
                  >
                    <ArrowRight className="text-purple-400 mx-2" size={24} />
                    <EvolutionTreeNode
                      node={evo}
                      currentPokemonId={currentPokemonId}
                      currentFormNumber={currentFormNumber}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Single evolution - horizontal layout
            <>
              <ArrowRight className="text-purple-400 mx-4" size={32} />
              <EvolutionTreeNode
                node={node.evolutions[0]}
                currentPokemonId={currentPokemonId}
                currentFormNumber={currentFormNumber}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
