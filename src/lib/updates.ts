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
    id: "3",
    name: "I don't know, some changes",
    description:
      "This update brings key bug fixes, gameplay adjustments, and quality-of-life improvements. Major highlights include evolution fixes for Yuntter and Weamoth, proper tracking for the Floatzel mission, and the ability to earn EXP and money in Simulated Universe battles. Several trainers and their teams have been adjusted, item and encounter rates have been rebalanced, and various text, music, and UI improvements have been made — including a small surprise at the end of the beta.",
    version: "v0.1.3",
    date: "2025-07-18",
    changes: [
      "Fixed skip scene error in the farm.",
      "Fixed skip scene error in the forest.",
      "Floatzel mission is now correctly recorded on the cellphone.",
      "Yuntter can now evolve by level and Water Stone, not just by Twilight Stone.",
      "Weamoth can now evolve via trade.",
      "Some trainer teams have been changed.",
      "Unnecessary trainers have been removed.",
      "Some Pokémon have been removed from trainer teams.",
      "Trainer Pokémon levels adjusted.",
      "Minor text edits.",
      "You now gain EXP and money in Simulated Universe battles.",
      "Simulated Universe items are now received after winning — player storage is no longer required.",
      "Some music tracks have been changed.",
      "Reduced the amount of Yuntter Rocks on Route 4 (sorry, too many Yuntters).",
      "Some item locations have been changed.",
      "Encounter chance per step reduced.",
      "The team sort option in the pause menu now only appears if you have more than one Pokémon in your party.",
      "Fixed some missing Spanish translations.",
      "A tiny message now appears at the end of the beta.",
      "Some Pokémon tutor moves have been changed.",
      "Gumstter cry added.",
      "Orthographic errors in Ditto's calls fixed — because apparently no one got the joke :/",
      "Cellphone UI updated for calls.",
      "Some shadows on tiles added,",
      "Small improvement to Kaoba lab event when changing maps.",
      "Outfit prices reduced.",
      "Some PLACEHOLDER items added in dungeons (dungeons are a feature I'll be expanding in the next beta).",
      "Encounter Finder updated.",
      "Lillipud mission changed — it can no longer call for help.",
      "Fixed corrupted animation.",
    ],
  },
  {
    id: "2",
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
    id: "1",
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
