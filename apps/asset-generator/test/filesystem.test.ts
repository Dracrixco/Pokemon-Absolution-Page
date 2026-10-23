import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import {
  inspectProject,
  exportProject,
  REQUIRED_FOLDERS,
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
    for (const folder of ["src/data", "public/Front", "public/Characters"])
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
      path.join(outputPath, "public/Front/BUSHIERA.png"),
      "old secret",
    );
    await fs.writeFile(
      path.join(outputPath, "public/Characters/Hero.png"),
      "hand edited",
    );
    const source = new DiskDirectory(sourcePath).handle();
    const output = new DiskDirectory(outputPath).handle();
    const plan = await inspectProject(source);
    assert.equal(plan.counts.Pokémon, 1);
    assert.equal(plan.assets.length, 3);
    await exportProject(plan, output, () => {});
    assert.match(
      await fs.readFile(path.join(outputPath, "src/data/pokemon.ts"), "utf8"),
      /Pikachu/,
    );
    assert.equal(
      await fs.readFile(
        path.join(outputPath, "public/IngameMaps/map_1.png"),
        "utf8",
      ),
      "map",
    );
    await assert.rejects(
      fs.stat(path.join(outputPath, "public/Front/BUSHIERA.png")),
    );
    await assert.rejects(
      fs.stat(path.join(outputPath, "public/Front/BUSHIERA_1.png")),
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
    await exportProject(await inspectProject(source), output, () => {});
    await assert.rejects(
      fs.stat(path.join(outputPath, "public/Front/PIKACHU.png")),
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
