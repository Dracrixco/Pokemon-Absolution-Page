import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import {
  inspectProject,
  exportProject,
  REQUIRED_FOLDERS,
  OUTPUT_FOLDERS,
  validateOutput,
} from "../src/filesystem.ts";
import type { Directory } from "../src/filesystem.ts";

// Real disk-backed adapter for the browser handle contract. This exercises the
// complete read/plan/write flow without requiring interactive picker grants.
function domError(error: unknown): never {
  if ((error as NodeJS.ErrnoException).code === "ENOENT")
    throw new DOMException("Missing entry", "NotFoundError");
  throw error;
}
class DiskFile {
  kind = "file" as const;
  name: string;
  location: string;
  constructor(location: string) {
    this.location = location;
    this.name = path.basename(location);
  }
  async getFile() {
    return new File([await fs.readFile(this.location)], this.name);
  }
  async createWritable() {
    let content: string | Uint8Array = "";
    return {
      write: async (data: string | File) => {
        content =
          typeof data === "string"
            ? data
            : new Uint8Array(await data.arrayBuffer());
      },
      close: async () => {
        await fs.writeFile(this.location, content);
      },
      abort: async () => {},
    };
  }
}
class DiskDirectory {
  kind = "directory" as const;
  name: string;
  location: string;
  constructor(location: string) {
    this.location = location;
    this.name = path.basename(location);
  }
  async getDirectoryHandle(name: string, options?: { create?: boolean }) {
    const location = path.join(this.location, name);
    try {
      if (options?.create) await fs.mkdir(location, { recursive: true });
      if (!(await fs.stat(location)).isDirectory())
        throw new Error("Expected directory");
      return new DiskDirectory(location);
    } catch (error) {
      return domError(error);
    }
  }
  async getFileHandle(name: string, options?: { create?: boolean }) {
    const location = path.join(this.location, name);
    try {
      if (options?.create) await fs.writeFile(location, "", { flag: "a" });
      else await fs.stat(location);
      return new DiskFile(location);
    } catch (error) {
      return domError(error);
    }
  }
  async *values() {
    for (const entry of await fs.readdir(this.location, {
      withFileTypes: true,
    })) {
      yield entry.isDirectory()
        ? new DiskDirectory(path.join(this.location, entry.name))
        : new DiskFile(path.join(this.location, entry.name));
    }
  }
  async isSameEntry(other: DiskDirectory) {
    return this.location === other.location;
  }
  async resolve(other: DiskDirectory) {
    const relative = path.relative(this.location, other.location);
    return relative.startsWith("..") || path.isAbsolute(relative)
      ? null
      : relative
        ? relative.split(path.sep)
        : [];
  }
  async removeEntry(name: string) {
    try {
      await fs.unlink(path.join(this.location, name));
    } catch (error) {
      domError(error);
    }
  }
  handle() {
    return this as unknown as Directory;
  }
}

test("complete project export writes data/assets, removes only managed stale assets, and preserves game files", async () => {
  const temporary = await fs.mkdtemp(
    path.join(os.tmpdir(), "absolution-export-"),
  );
  try {
    const sourcePath = path.join(temporary, "game");
    const outputPath = path.join(temporary, "web");
    for (const folder of REQUIRED_FOLDERS)
      await fs.mkdir(path.join(sourcePath, folder), { recursive: true });
    for (const folder of [
      "public/Pokemon/Front",
      "public/Front",
      "public/Characters",
    ])
      await fs.mkdir(path.join(outputPath, folder), { recursive: true });
    await fs.writeFile(
      path.join(outputPath, "package.json"),
      JSON.stringify({ name: "@absolution/web" }),
    );
    const inputs = {
      "pokemon.txt":
        "[PIKACHU]\nName = Pikachu\nBaseStats = 35,55,40,90,50,50\n[BUSHIERA]\nName = Secret",
      "moves.txt": "[TACKLE]\nCategory = Physical",
      "items.txt": "[POTION]\nName = Potion",
      "abilities.txt": "[STATIC]\nName = Static",
    };
    for (const [name, content] of Object.entries(inputs))
      await fs.writeFile(path.join(sourcePath, "PBS", name), content);
    await fs.writeFile(
      path.join(sourcePath, "Graphics/Pokemon/Front/PIKACHU.png"),
      "visible",
    );
    await fs.writeFile(
      path.join(sourcePath, "Graphics/Pokemon/Front/BUSHIERA_1.png"),
      "hidden",
    );
    await fs.writeFile(
      path.join(sourcePath, "Exported Maps/Map001.png"),
      "map",
    );
    await fs.writeFile(
      path.join(outputPath, "public/Pokemon/Front/BUSHIERA.png"),
      "old secret",
    );
    await fs.writeFile(
      path.join(outputPath, "public/Characters/Hero.png"),
      "hand edited",
    );
    const source = new DiskDirectory(sourcePath).handle();
    await fs.writeFile(
      path.join(outputPath, "public/Front/PIKACHU.png"),
      "old path",
    );
    await fs.writeFile(
      path.join(outputPath, ".asset-studio.json"),
      JSON.stringify({ assets: ["public/Front/PIKACHU.png"] }),
    );
    const output = new DiskDirectory(outputPath).handle();
    await validateOutput(output, source);
    await assert.rejects(fs.stat(path.join(outputPath, "src/data")));
    const plan = await inspectProject(source);
    assert.equal(plan.counts.Pokémon, 1);
    assert.equal(plan.assets.length, 3);
    await exportProject(plan, output, () => {});
    await assert.rejects(
      fs.stat(path.join(outputPath, "public/Front/PIKACHU.png")),
    );
    for (const folder of OUTPUT_FOLDERS)
      assert.equal(
        (await fs.stat(path.join(outputPath, folder))).isDirectory(),
        true,
      );
    assert.equal(
      await fs.readFile(
        path.join(outputPath, "public/Pokemon/Front/PIKACHU.png"),
        "utf8",
      ),
      "visible",
    );
    assert.match(
      await fs.readFile(path.join(outputPath, "src/data/pokemon.ts"), "utf8"),
      /\/Pokemon\/Front\/PIKACHU.png/,
    );
    assert.match(
      await fs.readFile(path.join(outputPath, "src/data/pokemon.ts"), "utf8"),
      /Pikachu/,
    );
    assert.equal(
      await fs.readFile(
        path.join(outputPath, "public/Exported Maps/map_1.png"),
        "utf8",
      ),
      "map",
    );
    await assert.rejects(
      fs.stat(path.join(outputPath, "public/Pokemon/Front/BUSHIERA.png")),
    );
    await assert.rejects(
      fs.stat(path.join(outputPath, "public/Pokemon/Front/BUSHIERA_1.png")),
    );
    assert.equal(
      await fs.readFile(
        path.join(sourcePath, "Graphics/Pokemon/Front/BUSHIERA_1.png"),
        "utf8",
      ),
      "hidden",
    );
    await fs.unlink(
      path.join(sourcePath, "Graphics/Pokemon/Front/PIKACHU.png"),
    );
    // Deleting generated directories after an export must not block regeneration.
    const generatedPokemon = path.resolve(outputPath, "public/Pokemon");
    assert.ok(generatedPokemon.startsWith(path.resolve(temporary) + path.sep));
    await fs.rm(generatedPokemon, { recursive: true });
    await exportProject(await inspectProject(source), output, () => {});
    await assert.rejects(
      fs.stat(path.join(outputPath, "public/Pokemon/Front/PIKACHU.png")),
    );
    assert.equal(
      await fs.readFile(
        path.join(outputPath, "public/Characters/Hero.png"),
        "utf8",
      ),
      "hand edited",
    );
    // A manifest cannot claim arbitrary user files for deletion.
    await fs.writeFile(
      path.join(outputPath, ".asset-studio.json"),
      JSON.stringify({ assets: ["public/Characters/Hero.png"] }),
    );
    await assert.rejects(
      exportProject(plan, output, () => {}),
      /manifest|invalid/,
    );
    assert.equal(
      await fs.readFile(path.join(sourcePath, "PBS/pokemon.txt"), "utf8"),
      inputs["pokemon.txt"],
    );
    await assert.rejects(
      exportProject(plan, source, () => {}),
      /separate/,
    );
    await assert.rejects(inspectProject(output), /Missing folders/);
  } finally {
    assert.equal(
      path.dirname(path.resolve(temporary)),
      path.resolve(os.tmpdir()),
    );
    assert.ok(path.basename(temporary).startsWith("absolution-export-"));
    await fs.rm(temporary, { recursive: true, force: true });
  }
});

test("data-only export needs only PBS and preserves existing images and their manifest", async () => {
  const temporary = await fs.mkdtemp(
    path.join(os.tmpdir(), "absolution-export-"),
  );
  try {
    const sourcePath = path.join(temporary, "game");
    const outputPath = path.join(temporary, "web");
    await fs.mkdir(path.join(sourcePath, "PBS"), { recursive: true });
    await fs.mkdir(outputPath);
    for (const [name, content] of Object.entries({
      "pokemon.txt": "[PIKACHU]\nName = Pikachu",
      "moves.txt": "[TACKLE]\nCategory = Physical",
      "items.txt": "[POTION]\nName = Potion",
      "abilities.txt": "[STATIC]\nName = Static",
    }))
      await fs.writeFile(path.join(sourcePath, "PBS", name), content);
    await fs.writeFile(
      path.join(outputPath, "package.json"),
      JSON.stringify({ name: "@absolution/web" }),
    );
    const source = new DiskDirectory(sourcePath).handle();
    const output = new DiskDirectory(outputPath).handle();
    await assert.rejects(inspectProject(source), /Missing folders/);
    const plan = await inspectProject(source, "data-only");
    assert.deepEqual(plan.assets, []);
    const messages: string[] = [];
    await exportProject(plan, output, (message) => messages.push(message));
    assert.deepEqual((await fs.readdir(outputPath)).sort(), [
      "package.json",
      "src",
    ]);
    for (const [file, content] of Object.entries(plan.files))
      assert.equal(
        await fs.readFile(path.join(outputPath, file), "utf8"),
        content,
      );
    assert.match(messages.at(-1)!, /10 data files/);

    const imageFolder = path.join(outputPath, "public/Pokemon/Front");
    await fs.mkdir(imageFolder, { recursive: true });
    // Include a stale managed image and a hidden sprite: data-only must not
    // sync, delete, or rewrite either one.
    for (const name of ["OLD.png", "BUSHIERA.png"])
      await fs.writeFile(path.join(imageFolder, name), "existing image");
    const manifest = JSON.stringify({
      assets: ["public/Pokemon/Front/OLD.png"],
    });
    await fs.writeFile(path.join(outputPath, ".asset-studio.json"), manifest);
    await fs.writeFile(
      path.join(outputPath, "src/data/pokemon.ts"),
      "old data",
    );
    await exportProject(plan, output, () => {});
    for (const name of ["OLD.png", "BUSHIERA.png"])
      assert.equal(
        await fs.readFile(path.join(imageFolder, name), "utf8"),
        "existing image",
      );
    assert.equal(
      await fs.readFile(path.join(outputPath, ".asset-studio.json"), "utf8"),
      manifest,
    );
    assert.equal(
      await fs.readFile(path.join(outputPath, "src/data/pokemon.ts"), "utf8"),
      plan.files["src/data/pokemon.ts"],
    );
    assert.deepEqual(await fs.readdir(path.join(outputPath, "public")), [
      "Pokemon",
    ]);
  } finally {
    assert.equal(
      path.dirname(path.resolve(temporary)),
      path.resolve(os.tmpdir()),
    );
    assert.ok(path.basename(temporary).startsWith("absolution-export-"));
    await fs.rm(temporary, { recursive: true, force: true });
  }
});

test("clean output needs only the website package and rejects unrelated folders without writing", async () => {
  const temporary = await fs.mkdtemp(
    path.join(os.tmpdir(), "absolution-export-"),
  );
  try {
    const output = new DiskDirectory(temporary).handle();
    await assert.rejects(validateOutput(output), /package.json is missing/);
    await fs.writeFile(
      path.join(temporary, "package.json"),
      JSON.stringify({ name: "other" }),
    );
    await assert.rejects(validateOutput(output), /Select apps\/web/);
    await fs.writeFile(
      path.join(temporary, "package.json"),
      JSON.stringify({ name: "@absolution/web" }),
    );
    await validateOutput(output);
    assert.deepEqual(await fs.readdir(temporary), ["package.json"]);
  } finally {
    assert.equal(
      path.dirname(path.resolve(temporary)),
      path.resolve(os.tmpdir()),
    );
    assert.ok(path.basename(temporary).startsWith("absolution-export-"));
    await fs.rm(temporary, { recursive: true, force: true });
  }
});
