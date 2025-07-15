export interface Update {
  id: string;
  name: string;
  description: string;
  version: string;
  date: string;
  changes: string[];
}

export const updates: Update[] = [
  {
    id: "1",
    name: "Misspelling",
    description: "",
    version: "v0.1.2",
    date: "2025-07-15",
    changes: [
      "Fixed various spelling errors in dialogues and menus.",
      "Fixed a transition bug when starting a battle against a rival trainer.",
    ],
  },
  {
    id: "2",
    name: "Multiplayer error fix",
    description: "",
    version: "v0.1.1",
    date: "2025-07-14",
    changes: [
      "Fixed an issue in multiplayer when both players had the same gender.",
      "Improved several Pokédex descriptions.",
    ],
  },
];

export function getUpdateById(id: string): Update | undefined {
  return updates.find((update) => update.id === id);
}

export function isUpdateNew(dateString: string): boolean {
  const updateDate = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - updateDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 3;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
