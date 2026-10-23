import { generateData } from "./generate.ts";
import type { GeneratedData } from "./generate.ts";
import { isHiddenSprite } from "./exclusions.ts";

export type Directory = FileSystemDirectoryHandle;
export const REQUIRED_FOLDERS = [
  "PBS",
  "Graphics/Pokemon/Front",
  "Graphics/Pokemon/Back",
  "Graphics/Items",
  "Graphics/Trainers",
  "Exported Maps",
] as const;

export async function directory(
  root: FileSystemDirectoryHandle,
  path: string,
  create = false,
): Promise<Directory> {
  let current = root;
  for (const part of path.split("/")) {
    if (!part || part === "." || part === "..")
      throw new Error(`Invalid folder path: ${path}`);
    current = await current.getDirectoryHandle(part, { create });
  }
  return current as Directory;
}

export async function* walk(
  root: Directory,
  prefix = "",
): AsyncGenerator<{ path: string; handle: FileSystemFileHandle }> {
  for await (const entry of root.values()) {
    const path = prefix + entry.name;
    if (entry.kind === "directory") yield* walk(entry as Directory, path + "/");
    else yield { path, handle: entry };
  }
}

export interface Asset {
  path: string;
  source: FileSystemFileHandle;
}
export interface Plan extends GeneratedData {
  assets: Asset[];
  source: Directory;
}

export function mapDestinations(path: string): string[] {
  const parts = path.split("/");
  const name = parts.pop()!;
  const match = name.match(/^(?:map[_ -]?|exported map)(\d+)\.png$/i);
  if (!match) return [`public/IngameMaps/${path}`];
  const normalized = `map_${Number(match[1])}.png`;
  const layer = parts.at(-1)?.toLowerCase();
  if (["base", "trainers", "items", "pokemon"].includes(layer || "")) {
    return layer === "base"
      ? [`public/maps/base/${normalized}`, `public/IngameMaps/${normalized}`]
      : [`public/maps/${layer}/${normalized}`];
  }
  return [`public/IngameMaps/${normalized}`, `public/maps/base/${normalized}`];
}

export async function inspectProject(source: Directory): Promise<Plan> {
  const folders: Directory[] = [];
  const missing: string[] = [];
  for (const path of REQUIRED_FOLDERS) {
    try {
      folders.push(await directory(source, path));
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotFoundError")
        missing.push(path);
      else throw error;
    }
  }
  if (missing.length)
    throw new Error(
      `Select the game project root. Missing folders: ${missing.join(", ")}`,
    );
  const pbs: Record<string, string> = {};
  for await (const entry of folders[0].values()) {
    if (entry.kind === "file" && entry.name.toLowerCase().endsWith(".txt")) {
      pbs[entry.name.toLowerCase()] = await (await entry.getFile()).text();
    }
  }
  const data = generateData(pbs);
  const assets = new Map<string, Asset>();
  for (const [index, output] of [
    "Front",
    "Back",
    "Items",
    "Trainers",
    "IngameMaps",
  ].entries()) {
    for await (const entry of walk(folders[index + 1])) {
      if (!/\.(png|gif|webp|jpe?g)$/i.test(entry.path)) continue;
      if (index < 2 && isHiddenSprite(entry.path)) continue;
      const targets =
        index === 4
          ? mapDestinations(entry.path)
          : [`public/${output}/${entry.path}`];
      for (const target of targets) {
        if (assets.has(target))
          throw new Error(
            `Two source assets map to ${target}. Rename or remove the duplicate in the selected project.`,
          );
        assets.set(target, { path: target, source: entry.handle });
      }
    }
  }
  return { ...data, assets: [...assets.values()], source };
}

export async function validateOutput(output: Directory, source?: Directory) {
  if (
    source &&
    ((await output.isSameEntry(source)) ||
      (await source.resolve(output)) !== null ||
      (await output.resolve(source)) !== null)
  ) {
    throw new Error("Choose a website folder separate from the game project.");
  }
  await directory(output, "src/data");
  await directory(output, "public");
  const pkg = await (await output.getFileHandle("package.json")).getFile();
  const json = JSON.parse(await pkg.text());
  if (json.name !== "@absolution/web")
    throw new Error("Select apps/web from this monorepo as the output folder.");
}

async function write(output: Directory, path: string, content: string | File) {
  const parts = path.split("/");
  const filename = parts.pop()!;
  const folder = await directory(output, parts.join("/"), true);
  const writable = await (
    await folder.getFileHandle(filename, { create: true })
  ).createWritable();
  try {
    await writable.write(content);
    await writable.close();
  } catch (error) {
    await writable.abort();
    throw error;
  }
}

const MANIFEST = ".asset-studio.json";
// Only delete files previously owned by the generator, under its asset folders.
export const isManagedAsset = (path: string) =>
  /^public\/(Front|Back|Items|Trainers|IngameMaps|maps)\/.+\.(png|gif|webp|jpe?g)$/i.test(
    path,
  ) &&
  !path
    .split("/")
    .some(
      (part) => !part || part === "." || part === ".." || part.includes("\\"),
    );

async function remove(output: Directory, path: string) {
  const parts = path.split("/");
  const filename = parts.pop()!;
  try {
    await (await directory(output, parts.join("/"))).removeEntry(filename);
  } catch (error) {
    if (!(error instanceof DOMException && error.name === "NotFoundError"))
      throw error;
  }
}

export async function exportProject(
  plan: Plan,
  output: Directory,
  progress: (message: string) => void,
) {
  await validateOutput(output, plan.source);
  let previous: string[] = [];
  try {
    const json: unknown = JSON.parse(
      await (await (await output.getFileHandle(MANIFEST)).getFile()).text(),
    );
    if (
      typeof json !== "object" ||
      json === null ||
      !("assets" in json) ||
      !Array.isArray(json.assets) ||
      !json.assets.every((p) => typeof p === "string" && isManagedAsset(p))
    ) {
      throw new Error(
        "The output .asset-studio.json is invalid. Restore or remove it before generating.",
      );
    }
    previous = json.assets;
  } catch (error) {
    if (!(error instanceof DOMException && error.name === "NotFoundError"))
      throw error;
  }
  let done = 0;
  const total = Object.keys(plan.files).length + plan.assets.length;
  // Persist ownership before writes so an interrupted run can be cleaned up on retry.
  const manifest = await output.getFileHandle(MANIFEST, { create: true });
  const saveManifest = async (assets: string[]) => {
    const stream = await manifest.createWritable();
    await stream.write(JSON.stringify({ version: 1, assets }, null, 2) + "\n");
    await stream.close();
  };
  await saveManifest([
    ...new Set([...previous, ...plan.assets.map((a) => a.path)]),
  ]);
  for (const [path, content] of Object.entries(plan.files)) {
    await write(output, path, content);
    progress(`Writing ${++done} / ${total} · ${path}`);
  }
  for (const asset of plan.assets) {
    await write(output, asset.path, await asset.source.getFile());
    progress(`Writing ${++done} / ${total} · ${asset.path}`);
  }
  const current = new Set(plan.assets.map((a) => a.path));
  for (const path of previous)
    if (!current.has(path)) await remove(output, path);
  // Remove unrevealed sprites already present before the first managed export.
  for (const name of ["Front", "Back"]) {
    let folder: Directory;
    try {
      folder = await directory(output, `public/${name}`);
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotFoundError")
        continue;
      throw error;
    }
    for await (const entry of walk(folder)) {
      if (isHiddenSprite(entry.path))
        await remove(output, `public/${name}/${entry.path}`);
    }
  }
  await saveManifest([...current]);
  progress(`Complete · ${total} files generated in ${output.name}`);
}
