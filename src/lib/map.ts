export interface TileData {
  id: string;
  mapIngameID: number;
  x: number;
  y: number;
  mapWidth: number;
  mapHeight: number;
  mapName: string;
  color?: string;
  encounters: {
    type: string;
    pokes: string[];
  }[];
}

export const tilesData: Record<string, TileData> = {
  "5_4": {
    id: "5_4",
    mapIngameID: 2,
    x: 5,
    y: 4,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Mapa de Pruebas",
    color: "purple",

    encounters: [
      {
        type: "Land",
        pokes: ["AZURILL", "BUDEW", "CLEFFA", "HAPPINY", "PICHU"],
      },
      {
        type: "Raid",
        pokes: ["AZURILL", "BUDEW", "CLEFFA", "HAPPINY", "PICHU"],
      },
    ],
  },
  "7_15": {
    id: "7_15",
    mapIngameID: 3,
    x: 7,
    y: 15,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Sunrise City",
    color: "purple",

    encounters: [
      { type: "Tree", pokes: ["STARLY", "SKWOVET"] },
      {
        type: "Water",
        pokes: ["GOLDEEN", "LOTAD", "POLIWAG", "WOOPER", "BARBOACH", "SEAKING"],
      },
      { type: "OldRod", pokes: ["AXISH", "GOLDEEN", "MAGIKARP"] },
      { type: "GoodRod", pokes: ["AXISH", "GOLDEEN", "MAGIKARP"] },
      { type: "SuperRod", pokes: ["AXISH", "GOLDEEN", "MAGIKARP", "POLIWAG"] },
    ],
  },
  "7_10": {
    id: "7_10",
    mapIngameID: 4,
    x: 7,
    y: 10,
    mapWidth: 1,
    mapHeight: 5,
    mapName: "Route 1",
    color: "purple",

    encounters: [
      {
        type: "Land",
        pokes: [
          "SKITTY_1",
          "WOOLARVA",
          "ODDISH",
          "PAWMI",
          "SEEDOT",
          "SENTRET",
          "SIZZLIPEDE",
        ],
      },
      {
        type: "LandNight",
        pokes: ["CRYOWL", "SKITTY_1", "RATTATA_1", "WOOBAT", "SIZZLIPEDE"],
      },
      { type: "Tree", pokes: ["STARLY", "CONDLING", "SKWOVET", "WOOLARVA"] },
      { type: "RockSmash", pokes: ["SIZZLIPEDE"] },
      { type: "Special", pokes: ["SKITTY_1"] },
    ],
  },
  "7_9": {
    id: "7_9",
    mapIngameID: 7,
    x: 7,
    y: 9,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Sunset City",
    color: "purple",

    encounters: [
      { type: "Tree", pokes: ["STARLY", "CONDLING", "SKWOVET", "WOOLARVA"] },
    ],
  },
  "8_15": {
    id: "8_15",
    mapIngameID: 8,
    x: 8,
    y: 15,
    mapWidth: 4,
    mapHeight: 1,
    mapName: "Route 2",
    color: "purple",

    encounters: [
      {
        type: "Land",
        pokes: [
          "MINCCINO",
          "RALTS",
          "BUDEW",
          "BUNEARY",
          "BUNNELBY",
          "SORROWOOF",
          "STARLY",
          "TRUBBISH",
          "WOOPER",
        ],
      },
      {
        type: "LandNight",
        pokes: [
          "CLEFAIRY",
          "POOCHYENA",
          "NYMBLE",
          "TRUBBISH",
          "SKITTY_1",
          "SORROWOOF",
        ],
      },
      { type: "Tree", pokes: ["CONDLING", "LEDYBA", "WOOLARVA"] },
      { type: "Water", pokes: ["GOLDEEN", "WOOPER", "AXISH"] },
      {
        type: "OldRod",
        pokes: ["AXISH", "GOLDEEN", "MAGIKARP", "POLIWAG", "WOOPER"],
      },
      {
        type: "GoodRod",
        pokes: ["AXISH", "GOLDEEN", "MAGIKARP", "POLIWAG", "WOOPER"],
      },
      {
        type: "SuperRod",
        pokes: ["AXISH", "GOLDEEN", "MAGIKARP", "POLIWAG", "WOOPER"],
      },
      { type: "Special", pokes: ["SORROWOOF"] },
      {
        type: "Raid",
        pokes: ["CENTISKORCH", "CRYOCROWN", "DELCATTY", "VILEPLUME"],
      },
    ],
  },
  "12_15": {
    id: "12_15",
    mapIngameID: 11,
    x: 12,
    y: 15,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Parhelion City",
    color: "purple",

    encounters: [{ type: "Tree", pokes: ["STARLY", "SPINARAK", "WOOLARVA"] }],
  },
  "9_13": {
    id: "9_13",
    mapIngameID: 12,
    x: 9,
    y: 13,
    mapWidth: 2,
    mapHeight: 2,
    mapName: "Big Zone 1",
    color: "purple",

    encounters: [
      {
        type: "Land",
        pokes: [
          "PAWMO",
          "COMBEE",
          "SORROWOOF",
          "STARAVIA",
          "HOPPIP",
          "SKITTY_1",
          "QUAGSIRE",
        ],
      },
      {
        type: "LandNight",
        pokes: ["NICKIT", "SPINARAK", "NYMBLE", "LOKIX", "SORROWOOF"],
      },
      { type: "Tree", pokes: ["STARLY", "SPINARAK"] },
      { type: "Water", pokes: ["QUAGSIRE", "WINGULL", "PELIPPER"] },
      { type: "OldRod", pokes: ["GOLDEEN", "MAGIKARP", "AXISH", "WOOPER"] },
      { type: "GoodRod", pokes: ["GOLDEEN", "MAGIKARP", "AXISH", "WOOPER"] },
      { type: "SuperRod", pokes: ["QUAGSIRE", "GOLDEEN", "GYARADOS"] },
      { type: "Raid", pokes: ["ARIADOS", "LOKIX", "PAWMOT", "WOOFIGHTER"] },
    ],
  },
  "13_15": {
    id: "13_15",
    mapIngameID: 14,
    x: 13,
    y: 15,
    mapWidth: 2,
    mapHeight: 1,
    mapName: "Route 3",
    color: "purple",

    encounters: [
      {
        type: "Land",
        pokes: [
          "MACHOP",
          "ROCKRUFF",
          "WOOLOO",
          "BUDEW",
          "EKANS",
          "STARLY",
          "VULPIX",
          "WOOPER",
          "GROWRAGE",
          "NICKIT",
        ],
      },
      {
        type: "LandNight",
        pokes: ["CLEFAIRY", "EKANS", "NYMBLE", "WOOBAT", "DUSKULL"],
      },
      { type: "Tree", pokes: ["STARLY", "SPINARAK", "CONDLING"] },
      { type: "Raid", pokes: ["LYCANROC", "ARBOK", "STARAPTOR", "LYCANROC_2"] },
    ],
  },
  "15_15": {
    id: "15_15",
    mapIngameID: 15,
    x: 15,
    y: 15,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Cave",
    color: "purple",

    encounters: [
      {
        type: "Cave",
        pokes: [
          "DRILBUR",
          "ROGGENROLA",
          "ABRA",
          "ZUBAT",
          "CUBONE",
          "MAKUHITA",
          "SPIBBY",
        ],
      },
      { type: "RockSmash", pokes: ["SPIBBY"] },
      { type: "Special", pokes: ["SPIBBY"] },
      { type: "Raid", pokes: ["CROBAT", "MAROWAK"] },
    ],
  },
  "15_14": {
    id: "15_14",
    mapIngameID: 16,
    x: 15,
    y: 14,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Cave",
    color: "purple",

    encounters: [
      {
        type: "Cave",
        pokes: ["SPIBBY", "CUBONE", "ROGGENROLA", "ZUBAT", "DRILBUR"],
      },
      { type: "RockSmash", pokes: ["SPIBBY"] },
      { type: "Special", pokes: ["SPIBBY"] },
    ],
  },
  "12_16": {
    id: "12_16",
    mapIngameID: 17,
    x: 12,
    y: 16,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Beach",
    color: "purple",

    encounters: [
      {
        type: "Land",
        pokes: ["SHINX", "STARLY", "SENTRET", "WINGULL", "PIKACHU", "WOOLARVA"],
      },
      {
        type: "LandNight",
        pokes: [
          "CRYOWL",
          "SKITTY_1",
          "SORROWOOF",
          "WINGULL",
          "PIKACHU",
          "WOOLARVA",
        ],
      },
      { type: "Tree", pokes: ["CRABRAWLER", "WOOLARVA"] },
      { type: "Water", pokes: ["AXISH", "MAGIKARP", "WINGULL", "PELIPPER"] },
      { type: "OldRod", pokes: ["GOLDEEN", "AXISH", "MAGIKARP"] },
      { type: "GoodRod", pokes: ["MAGIKARP", "AXISH", "GOLDEEN"] },
      { type: "SuperRod", pokes: ["MAGIKARP", "AXISH", "GOLDEEN"] },
    ],
  },
  "12_11": {
    id: "12_11",
    mapIngameID: 18,
    x: 12,
    y: 11,
    mapWidth: 1,
    mapHeight: 4,
    mapName: "Route 4",
    color: "purple",

    encounters: [
      {
        type: "Land",
        pokes: [
          "BIDOOF",
          "WATTREL",
          "YUNTTER",
          "LILLIPUP",
          "LOTAD",
          "STARLY",
          "ONIX",
          "YANMA",
        ],
      },
      {
        type: "LandNight",
        pokes: [
          "BIDOOF",
          "SPINARAK",
          "YUNTTER",
          "CRYOWL",
          "NICKIT",
          "POOCHYENA",
          "YANMA",
        ],
      },
      {
        type: "OldRod",
        pokes: ["AXISH", "GOLDEEN", "MAGIKARP", "YUNTTER", "CARVANHA"],
      },
      {
        type: "GoodRod",
        pokes: ["AXISH", "GOLDEEN", "MAGIKARP", "YUNTTER", "CARVANHA"],
      },
      {
        type: "SuperRod",
        pokes: ["GOLDEEN", "MAGIKARP", "YUNTTER", "CARVANHA"],
      },
      { type: "Water", pokes: ["MARILL", "CARVANHA", "LOTAD"] },
      { type: "WaterNight", pokes: ["CARVANHA", "DEWPIDER"] },
      { type: "Tree", pokes: ["SPINARAK", "STARLY", "WATTREL"] },
      { type: "HeadbuttHigh", pokes: ["SPINARAK", "CHERUBI", "FOMANTIS"] },
      { type: "RockSmash", pokes: ["DWEBBLE", "GEODUDE_1"] },
      { type: "Sky", pokes: ["STARLY"] },
      { type: "Special", pokes: ["YUNTTER"] },
      {
        type: "Raid",
        pokes: ["CHERRIM", "CRUSTLE", "GOLEM_1", "KILOWATTREL", "STEELIX"],
      },
    ],
  },
  "11_7": {
    id: "11_7",
    mapIngameID: 19,
    x: 11,
    y: 7,
    mapWidth: 3,
    mapHeight: 4,
    mapName: "Nightfall Forest",
    color: "purple",

    encounters: [
      {
        type: "Land",
        pokes: [
          "WOOLARVA",
          "BUIZEL",
          "SEWADDLE",
          "STARLY",
          "VENIPEDE",
          "WURMPLE",
          "CASCOON",
          "PACHIRISU",
          "SILCOON",
          "SLAKOTH",
        ],
      },
      { type: "Tree", pokes: ["MANKEY", "SLAKOTH", "STARLY", "WOOLARVA"] },
      {
        type: "LandDay",
        pokes: [
          "SEWADDLE",
          "WOOLARVA",
          "BUIZEL",
          "SILCOON",
          "STARLY",
          "WURMPLE",
          "PACHIRISU",
          "SLAKOTH",
        ],
      },
      {
        type: "LandNight",
        pokes: [
          "VENIPEDE",
          "BUIZEL",
          "STARLY",
          "WURMPLE",
          "CASCOON",
          "PACHIRISU",
          "SLAKOTH",
          "WOOLARVA",
        ],
      },
      {
        type: "LandMorning",
        pokes: [
          "STARLY",
          "WOOPER",
          "WURMPLE",
          "ODDISH",
          "SILCOON",
          "WOOLARVA",
          "CATERPIE",
          "SLAKOTH",
          "WEEDLE",
        ],
      },
      { type: "Water", pokes: ["AXISH", "BUIZEL", "WOOPER"] },
      { type: "OldRod", pokes: ["CARVANHA", "GOLDEEN", "MAGIKARP"] },
      { type: "GoodRod", pokes: ["CARVANHA", "GOLDEEN", "MAGIKARP"] },
      { type: "SuperRod", pokes: ["CARVANHA", "GOLDEEN", "MAGIKARP"] },
      {
        type: "Raid",
        pokes: [
          "BEEDRILL",
          "BUTTERFREE",
          "PACHIRISU",
          "QUAGSIRE",
          "STARAVIA",
          "PRIMEAPE",
          "VILEPLUME",
          "CARNIVINE",
        ],
      },
    ],
  },
  "10_8": {
    id: "10_8",
    mapIngameID: 20,
    x: 10,
    y: 8,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Forest - History",
    color: "purple",

    encounters: [
      {
        type: "Land",
        pokes: [
          "CASCOON",
          "MANKEY",
          "PARAS",
          "PETILIL",
          "SEWADDLE",
          "SILCOON",
          "VENIPEDE",
          "VENONAT",
          "WOOLARVA",
        ],
      },
      {
        type: "LandDay",
        pokes: [
          "SEWADDLE",
          "WOOLARVA",
          "BUIZEL",
          "SILCOON",
          "STARLY",
          "WURMPLE",
          "PACHIRISU",
          "SLAKOTH",
        ],
      },
      {
        type: "LandNight",
        pokes: [
          "VENIPEDE",
          "BUIZEL",
          "STARLY",
          "WURMPLE",
          "CASCOON",
          "PACHIRISU",
          "SLAKOTH",
          "WOOLARVA",
        ],
      },
      {
        type: "LandMorning",
        pokes: [
          "ODDISH",
          "STARLY",
          "WOOPER",
          "WURMPLE",
          "SILCOON",
          "WOOLARVA",
          "SLAKOTH",
        ],
      },
      { type: "Water", pokes: ["AXISH", "BUIZEL", "CARVANHA", "WOOPER"] },
      { type: "OldRod", pokes: ["GOLDEEN", "MAGIKARP", "AXISH", "CARVANHA"] },
      { type: "GoodRod", pokes: ["CARVANHA", "GOLDEEN", "MAGIKARP"] },
      { type: "SuperRod", pokes: ["AXISH", "GOLDEEN", "MAGIKARP"] },
      { type: "Tree", pokes: ["MANKEY", "SLAKOTH", "STARLY", "WOOLARVA"] },
    ],
  },
  "12_6": {
    id: "12_6",
    mapIngameID: 21,
    x: 12,
    y: 6,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Twilight City",
    color: "purple",

    encounters: [
      { type: "Water", pokes: ["CARVANHA", "BUIZEL", "WOOPER"] },
      {
        type: "OldRod",
        pokes: ["CARVANHA", "GOLDEEN", "BARBOACH", "MAGIKARP"],
      },
      {
        type: "GoodRod",
        pokes: ["CARVANHA", "GOLDEEN", "BARBOACH", "MAGIKARP"],
      },
      {
        type: "SuperRod",
        pokes: ["GOLDEEN", "SHARPEDO", "GYARADOS", "WHISCASH"],
      },
    ],
  },
  "6_9": {
    id: "6_9",
    mapIngameID: 22,
    x: 6,
    y: 9,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Risco",
    color: "purple",

    encounters: [
      {
        type: "Land",
        pokes: [
          "CONDLING",
          "YUNTTER",
          "LOTAD",
          "SEEDOT",
          "SKITTY_1",
          "KRICKETOT",
          "SIZZLIPEDE",
          "STARLY",
        ],
      },
      { type: "Sky", pokes: ["CONDLING", "STARLY"] },
      { type: "OldRod", pokes: ["MAGIKARP"] },
      { type: "GoodRod", pokes: ["MAGIKARP"] },
      { type: "SuperRod", pokes: ["MAGIKARP"] },
    ],
  },
  "7_8": {
    id: "7_8",
    mapIngameID: 23,
    x: 7,
    y: 8,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "East",
    color: "purple",

    encounters: [
      {
        type: "Land",
        pokes: ["CONDLING", "SEEDOT", "SIZZLIPEDE", "SKITTY_1", "STARLY"],
      },
      { type: "Tree", pokes: ["STARLY", "SKWOVET"] },
      { type: "Raid", pokes: ["CONDEMNA", "STARAVIA", "SKARMORY"] },
    ],
  },
  "0_0": {
    id: "0_0",
    mapIngameID: 33,
    x: 0,
    y: 0,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Profesor Intro",
    color: "purple",

    encounters: [],
  },
  "13_14": {
    id: "13_14",
    mapIngameID: 34,
    x: 13,
    y: 14,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Farm",
    color: "purple",

    encounters: [
      {
        type: "Land",
        pokes: [
          "GROWRAGE",
          "LECHONK",
          "MACHOP",
          "MAREEP",
          "WOOLOO",
          "MUDBRAY",
          "PONYTA",
          "SKWOVET",
        ],
      },
    ],
  },
  "12_4": {
    id: "12_4",
    mapIngameID: 36,
    x: 12,
    y: 4,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Gym - Level 1",
    color: "purple",

    encounters: [],
  },
  "12_3": {
    id: "12_3",
    mapIngameID: 37,
    x: 12,
    y: 3,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Gym - Level 2",
    color: "purple",

    encounters: [],
  },
  "13_5": {
    id: "13_5",
    mapIngameID: 38,
    x: 13,
    y: 5,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Gym - Caves",
    color: "purple",

    encounters: [],
  },
  "12_2": {
    id: "12_2",
    mapIngameID: 39,
    x: 12,
    y: 2,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Gym - Leader",
    color: "purple",

    encounters: [],
  },
  "14_9": {
    id: "14_9",
    mapIngameID: 43,
    x: 14,
    y: 9,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Forest - Water Zone",
    color: "purple",

    encounters: [
      {
        type: "Land",
        pokes: [
          "WOOLARVA",
          "STARLY",
          "SURSKIT",
          "VENIPEDE",
          "WURMPLE",
          "YANMA",
          "CASCOON",
          "PACHIRISU",
          "SILCOON",
          "SLAKOTH",
        ],
      },
      { type: "OldRod", pokes: ["DEWPIDER", "AXISH", "MAGIKARP"] },
      { type: "GoodRod", pokes: ["DEWPIDER", "AXISH", "MAGIKARP"] },
      { type: "SuperRod", pokes: ["DEWPIDER", "AXISH", "MAGIKARP"] },
      { type: "Tree", pokes: ["MANKEY", "SLAKOTH", "STARLY", "WOOLARVA"] },
      { type: "Water", pokes: ["DEWPIDER", "SURSKIT", "ARAQUANID"] },
    ],
  },
  "10_9": {
    id: "10_9",
    mapIngameID: 45,
    x: 10,
    y: 9,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Fores - Spider Zone",
    color: "purple",

    encounters: [
      {
        type: "Land",
        pokes: [
          "ARIADOS",
          "KINGDER",
          "NUZLEAF",
          "SCYTHER",
          "STARAVIA",
          "YANMEGA",
        ],
      },
      { type: "Special", pokes: ["SPIBBY"] },
    ],
  },
  "11_5": {
    id: "11_5",
    mapIngameID: 60,
    x: 11,
    y: 5,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Twilight Forest",
    color: "purple",

    encounters: [
      {
        type: "Land",
        pokes: [
          "TWIXIE",
          "TWYLICAN",
          "DRIFLOON",
          "MURKROW",
          "PHANTUMP",
          "PUMPKABOO",
          "SHROOMISH",
          "THIEVUL",
        ],
      },
      {
        type: "LandDay",
        pokes: [
          "TWIXIE",
          "BONEVEIL",
          "KADABRA",
          "LEDIAN",
          "MURKROW",
          "PUMPKABOO",
          "SHROOMISH",
          "VENOMOTH",
          "WOOBACOON",
        ],
      },
      {
        type: "Tree",
        pokes: ["CORVISQUIRE", "MANKEY", "VIGOROTH", "WOOBACOON"],
      },
      { type: "Water", pokes: ["CARVANHA", "AXISH", "WOOPER"] },
      { type: "OldRod", pokes: ["CARVANHA", "AXISH", "MAGIKARP"] },
      { type: "GoodRod", pokes: ["CARVANHA", "AXISH", "MAGIKARP"] },
      { type: "SuperRod", pokes: ["CARVANHA", "GYARADOS", "JAXEWS"] },
      {
        type: "Raid",
        pokes: [
          "BRELOOM",
          "BUTTERFREE",
          "CORVIKNIGHT",
          "MORPEKO",
          "TWINCESS",
          "VILEPLUME",
          "TREVENANT",
        ],
      },
    ],
  },
  "10_5": {
    id: "10_5",
    mapIngameID: 62,
    x: 10,
    y: 5,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Twilight Forest - Boss Zone",
    color: "purple",

    encounters: [
      {
        type: "Land",
        pokes: [
          "CORVISQUIRE",
          "DRIFLOON",
          "MURKROW",
          "PHANTUMP",
          "PUMPKABOO",
          "SHROOMISH",
          "THIEVUL",
          "TWIXIE",
          "VENOMOTH",
          "WOOBACOON",
        ],
      },
      {
        type: "LandDay",
        pokes: [
          "BONEVEIL",
          "DROWZEE",
          "GLOOM",
          "KADABRA",
          "LEDIAN",
          "MURKROW",
          "PUMPKABOO",
          "SHROOMISH",
          "VENOMOTH",
          "WOOBACOON",
        ],
      },
      {
        type: "Tree",
        pokes: ["CORVISQUIRE", "MANKEY", "VIGOROTH", "WOOBACOON"],
      },
    ],
  },
  "10_4": {
    id: "10_4",
    mapIngameID: 64,
    x: 10,
    y: 4,
    mapWidth: 1,
    mapHeight: 1,
    mapName: "Twilight Forest",
    color: "purple",

    encounters: [
      {
        type: "Tree",
        pokes: ["CORVISQUIRE", "MANKEY", "VIGOROTH", "WOOBACOON"],
      },
    ],
  },
};

// Helper function to check if a coordinate belongs to a map area
export function getMapAtCoordinate(x: number, y: number): TileData | null {
  for (const tile of Object.values(tilesData)) {
    if (
      x >= tile.x &&
      x < tile.x + tile.mapWidth &&
      y >= tile.y &&
      y < tile.y + tile.mapHeight
    ) {
      return tile;
    }
  }
  return null;
}

// Helper function to get all coordinates covered by a map
export function getMapCoordinates(tile: TileData): { x: number; y: number }[] {
  const coordinates: { x: number; y: number }[] = [];
  for (let x = tile.x; x < tile.x + tile.mapWidth; x++) {
    for (let y = tile.y; y < tile.y + tile.mapHeight; y++) {
      coordinates.push({ x, y });
    }
  }
  return coordinates;
}

// Color mapping for different map colors
export const colorClasses = {
  purple: "bg-purple-400 border-purple-500",
  yellow: "bg-yellow-400 border-yellow-500",
  green: "bg-green-400 border-green-500",
  orange: "bg-orange-400 border-orange-500",
  blue: "bg-blue-400 border-blue-500",
  pink: "bg-pink-400 border-pink-500",
  red: "bg-red-400 border-red-500",
  teal: "bg-teal-400 border-teal-500",
  cyan: "bg-cyan-400 border-cyan-500",
  indigo: "bg-indigo-400 border-indigo-500",
  emerald: "bg-emerald-400 border-emerald-500",
  lime: "bg-lime-400 border-lime-500",
  violet: "bg-violet-400 border-violet-500",
  stone: "bg-stone-400 border-stone-500",
  amber: "bg-amber-400 border-amber-500",
  sky: "bg-sky-400 border-sky-500",
  slate: "bg-slate-400 border-slate-500",
} as const;
