import { items } from "@/data/items";
import type { Item } from "@/types/item";

export const getCombatItems = (): Item[] => {
  return items.filter((item) => item.pocket == 1);
};
