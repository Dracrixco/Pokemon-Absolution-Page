import { items as originalItems } from "@/data/items";
import { items as abolutionItems } from "@/data/items_absolution";
import type { Item } from "@/types/item";

export const getAllItems = (): Item[] => {
  return [...originalItems, ...abolutionItems];
};
