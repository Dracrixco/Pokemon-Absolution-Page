import assert from "node:assert/strict";
import { test } from "node:test";
import { generateData } from "../src/generate.ts";
import {
  parsePokemon,
  parseForms,
  parseEncounters,
  parseMaps,
  parseLevelUpMoves,
} from "../src/parsers.ts";
import {
  NOT_ABLE_TO_SHOW_FAKEMONS,
  isHiddenSprite,
} from "../src/exclusions.ts";
import { mapDestinations, isManagedAsset } from "../src/filesystem.ts";

const pokemon = `[PIKACHU]\nName = Pikachu\nTypes = ELECTRIC\nBaseStats = 35,55,40,90,50,50\nMoves = 1,THUNDERSHOCK,5,GROWL\nEvolutions = RAICHU,Item,THUNDERSTONE,BUSHIERA,Level,10`;
const pbs = {
  "pokemon.txt": pokemon,
  "moves.txt":
    "[THUNDERSHOCK]\nName = Thunder Shock\nCategory = Special\nPower = 40\nAccuracy = 100\nTotalPP = 30",
  "items.txt": "[POTION]\nName = Potion\nPrice = 200",
  "abilities.txt":
    "[STATIC]\nName = Static\nDescription = May paralyze = on contact.",
};

test("PBS parsing preserves stat order, move levels, values with equals and form inheritance", () => {
  const base = parsePokemon("\uFEFF" + pokemon, "normal");
  assert.equal(base[0].stats.speed, 90);
  assert.equal(base[0].stats.spAttack, 50);
  assert.deepEqual(base[0].evolution, [
    { to: "RAICHU", method: "Item", value: "THUNDERSTONE" },
  ]);
  const forms = parseForms(
    "[PIKACHU,1]\nFormName = Test\nTypes = WATER",
    "normal",
    base,
  );
  assert.equal(forms[0].name, "Pikachu");
  assert.equal(forms[0].sprite, "/Front/PIKACHU_1.png");
  assert.deepEqual(forms[0].types, ["WATER"]);
  assert.deepEqual(base[0].types, ["ELECTRIC"]);
  assert.deepEqual(parseLevelUpMoves("1,TACKLE,bad,GROWL,8,QUICKATTACK,9"), [
    { level: 1, move: "TACKLE" },
    { level: 8, move: "QUICKATTACK" },
  ]);
  assert.match(
    generateData(pbs).files["src/data/abilities.ts"],
    /May paralyze = on contact/,
  );
});

test("every unrevealed species is excluded from base records, forms, encounters and sprites", () => {
  for (const id of NOT_ABLE_TO_SHOW_FAKEMONS) {
    assert.deepEqual(parsePokemon(`[${id}]\nName = Secret`, "absolution"), []);
    assert.deepEqual(
      parseForms(`[${id},1]\nFormName = Secret`, "absolution", []),
      [],
    );
    assert.deepEqual(parseEncounters(`[001]\nLand,20\n100,${id},2,4`), {
      "1": { Land: [] },
    });
    assert.equal(isHiddenSprite(`Female/${id.toLowerCase()}_1.png`), true);
  }
  assert.equal(isHiddenSprite("PIKACHU.png"), false);
});

test("the final map and encounter method are saved, including x=0 and y=0", () => {
  const maps = parseMaps(
    "[001] # Town\nName = Route 1\nMapPosition = 0,0,0\nMapSize = 2,1111\nFlags = ForWebPage\nOutdoor = true",
  );
  assert.equal(maps["0-0"].mapHeight, 2);
  assert.equal(maps["0-0"].outdoor, true);
  assert.deepEqual(
    parseEncounters(
      "[002]\nLandMorning,20\n50,PIKACHU,3,5\nWater,10\n100,RAICHU,8",
    ),
    {
      "2": {
        LandMorning: [
          { rate: 50, species: "PIKACHU", minLevel: 3, maxLevel: 5 },
        ],
        Water: [{ rate: 100, species: "RAICHU", minLevel: 8, maxLevel: 8 }],
      },
    },
  );
});

test("export contracts include all ten datasets and clear missing expansions", () => {
  const result = generateData(pbs);
  assert.equal(Object.keys(result.files).length, 10);
  assert.equal(result.counts.Pokémon, 1);
  assert.equal(result.warnings.length, 2);
  assert.match(
    result.files["src/data/pokemon_absolution.ts"],
    /fakemons: Fakemon\[\] = \[\]/,
  );
  assert.match(
    result.files["src/data/encounters.ts"],
    /export type \{ EncounterEntry \}/,
  );
  assert.throws(() => generateData({}), /pokemon.txt/);
  assert.throws(
    () => generateData({ ...pbs, "moves.txt": "[BAD]\nCategory = Wrong" }),
    /Invalid move category/,
  );
});

test("map exports match both website map viewers and respect layers", () => {
  assert.deepEqual(mapDestinations("Map001.png"), [
    "public/IngameMaps/map_1.png",
    "public/maps/base/map_1.png",
  ]);
  assert.deepEqual(mapDestinations("trainers/map_002.png"), [
    "public/maps/trainers/map_2.png",
  ]);
  assert.deepEqual(mapDestinations("base/map_2.png"), [
    "public/maps/base/map_2.png",
    "public/IngameMaps/map_2.png",
  ]);
  assert.equal(isManagedAsset("public/Front/PIKACHU.png"), true);
  for (const path of [
    "public/Front/../../secret.png",
    "public/Front/..\\secret.png",
    "src/data/pokemon.ts",
    "public/Characters/Hero.png",
  ])
    assert.equal(isManagedAsset(path), false);
});
