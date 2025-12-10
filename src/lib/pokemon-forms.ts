import type { PokemonForm } from "@/types/pokemonform";
import { pokemonForms as normalForms } from "@/data/pokemon_forms";
import { pokemonForms as absolutionForms } from "@/data/pokemon_forms_absolution";

// Combine all forms
export const allPokemonForms: PokemonForm[] = [
  ...normalForms,
  ...absolutionForms,
];

/**
 * Get all forms for a specific base Pokemon
 */
export function getFormsByBaseId(baseId: string): PokemonForm[] {
  return allPokemonForms.filter(
    (form) => form.baseId.toUpperCase() === baseId.toUpperCase(),
  );
}

/**
 * Get a specific form by base ID and form number
 */
export function getFormByNumber(
  baseId: string,
  formNumber: number,
): PokemonForm | undefined {
  return allPokemonForms.find(
    (form) =>
      form.baseId.toUpperCase() === baseId.toUpperCase() &&
      form.formNumber === formNumber,
  );
}

/**
 * Get all forms by suffix (normal, absolution)
 */
export function getFormsBySuffix(suffix: string): PokemonForm[] {
  return allPokemonForms.filter((form) => form.suffix === suffix);
}

/**
 * Get all Mega forms
 */
export function getMegaForms(): PokemonForm[] {
  return allPokemonForms.filter((form) => form.megaStone);
}

/**
 * Get all Gigantamax forms
 */
export function getGigantamaxForms(): PokemonForm[] {
  return allPokemonForms.filter((form) =>
    form.formName.toLowerCase().includes("gigantamax"),
  );
}

/**
 * Get all regional forms (Nazanian, Alolan, Galarian, etc)
 */
export function getRegionalForms(): PokemonForm[] {
  return allPokemonForms.filter(
    (form) =>
      form.formName.toLowerCase().includes("nazanian") ||
      form.formName.toLowerCase().includes("alolan") ||
      form.formName.toLowerCase().includes("galarian") ||
      form.formName.toLowerCase().includes("hisuian") ||
      form.formName.toLowerCase().includes("paldean"),
  );
}

/**
 * Group forms by base Pokemon
 */
export function groupFormsByBase(): Map<string, PokemonForm[]> {
  const grouped = new Map<string, PokemonForm[]>();

  allPokemonForms.forEach((form) => {
    const baseId = form.baseId;
    if (!grouped.has(baseId)) {
      grouped.set(baseId, []);
    }
    grouped.get(baseId)!.push(form);
  });

  return grouped;
}

/**
 * Search forms by name or base ID
 */
export function searchForms(query: string): PokemonForm[] {
  const lowerQuery = query.toLowerCase();
  return allPokemonForms.filter(
    (form) =>
      form.name.toLowerCase().includes(lowerQuery) ||
      form.baseId.toLowerCase().includes(lowerQuery) ||
      form.formName.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get form statistics
 */
export function getFormsStats() {
  const byType = new Map<string, number>();
  const bySuffix = new Map<string, number>();
  let megaCount = 0;
  let gigantamaxCount = 0;
  let regionalCount = 0;

  allPokemonForms.forEach((form) => {
    // Count by suffix
    bySuffix.set(form.suffix, (bySuffix.get(form.suffix) || 0) + 1);

    // Count by types
    form.types.forEach((type) => {
      byType.set(type, (byType.get(type) || 0) + 1);
    });

    // Count special forms
    if (form.megaStone) megaCount++;
    if (form.formName.toLowerCase().includes("gigantamax")) gigantamaxCount++;
    if (
      form.formName.toLowerCase().includes("nazanian") ||
      form.formName.toLowerCase().includes("alolan") ||
      form.formName.toLowerCase().includes("galarian") ||
      form.formName.toLowerCase().includes("hisuian") ||
      form.formName.toLowerCase().includes("paldean")
    ) {
      regionalCount++;
    }
  });

  return {
    total: allPokemonForms.length,
    byType: Object.fromEntries(byType),
    bySuffix: Object.fromEntries(bySuffix),
    megaForms: megaCount,
    gigantamaxForms: gigantamaxCount,
    regionalForms: regionalCount,
    uniqueBasePokemon: new Set(allPokemonForms.map((f) => f.baseId)).size,
  };
}
