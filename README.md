# Pokémon Absolution monorepo

This pnpm workspace contains the public website, its API, a local asset generator, and shared TypeScript contracts.

```text
apps/
  web/               React + Vite public website
  server/            Express API (downloads, game info, updates, countries)
  asset-generator/   Browser app for generating website data and assets
packages/
  shared-types/      Game data and API types used across the workspace
```

## Development

Use Node.js 24.x and the pnpm version pinned in `package.json`. All workspace packages require Node.js 24.x.

```sh
corepack enable
pnpm install
pnpm dev
```

`pnpm dev` runs the website on `http://localhost:5173` and API on port 4000. The website development server proxies `/api` to the API. Run apps separately with `pnpm dev:web`, `pnpm dev:server`, or `pnpm dev:generator`.

The website defaults to `/api`. For another backend URL, copy `apps/web/.env.example` to `apps/web/.env` and set `VITE_BACKEND_URL`, including the `/api` suffix. The pre-migration local `.env` was moved into `apps/web`; its existing URL still takes precedence. Use `VITE_BACKEND_URL=/api` to work against the local API.

## Generate website assets

```sh
pnpm dev:generator
```

Open `http://localhost:5174` in Chrome or Edge. Folder access requires localhost or HTTPS and browser support for `showDirectoryPicker`.

1. Select the **game project root**, which must contain:

   ```text
   PBS/
   Graphics/Pokemon/Front/
   Graphics/Pokemon/Back/
   Graphics/Items/
   Graphics/Trainers/
   Exported Maps/
   ```

2. Select this monorepo's **`apps/web`** folder as the output.
3. Review the counts and any warnings, then click **Generate assets**.
4. Review the generated changes and run `pnpm build`.

Missing output directories (including `src/data` and `public`) are recreated during generation. You can delete generated images and folders to start clean; keep `apps/web/package.json` so the generator can identify the website. Select both folders again if a selected directory itself was deleted and recreated.

The app reads the game project directly. No PBS copying, Ruby runtime, server upload, or `generate/` folder is needed. Select the project again to refresh the preview after changing game files.

The required PBS inputs are `pokemon.txt`, `moves.txt`, `items.txt`, and `abilities.txt`. Optional inputs include `pokemon_absolution.txt`, `pokemon_forms*.txt`, `moves_*.txt`, `items_*.txt`, `abilities_*.txt`, `encounters.txt`, and `map_metadata.txt`. The Absolution Pokémon, forms, and items have separate output modules. Missing optional datasets generate empty output to clear old entries. Maps require the `ForWebPage` flag and a `MapPosition`.

Generated data uses `@absolution/shared-types` and retains the filenames and export names consumed by the website. The generator writes ten modules in `src/data`, leaving manually maintained data such as characters, natures, and types alone.

| Game assets              | Website output         |
| ------------------------ | ---------------------- |
| `Graphics/Pokemon/Front` | `public/Pokemon/Front` |
| `Graphics/Pokemon/Back`  | `public/Pokemon/Back`  |
| `Graphics/Items`         | `public/Items`         |
| `Graphics/Trainers`      | `public/Trainers`      |
| `Exported Maps`          | `public/Exported Maps` |

Map filenames such as `map_12.png`, `Map012.png`, and `exported map12.png` are normalized to `map_12.png`. Flat maps are exported to both `Exported Maps` and `Exported Maps/base` for the two existing viewers. Nested `base`, `trainers`, `items`, and `pokemon` folders populate their corresponding map layers. Other images retain their relative path under `Exported Maps`. Conflicting normalized asset paths are reported before writing.

The full **`NOT_ABLE_TO_SHOW_FAKEMONS`** list lives in `apps/asset-generator/src/exclusions.ts`. It filters species, forms, encounters, evolution targets, and front/back sprites. An export also removes matching hidden sprites already present in the output. The game source is read only.

The output's `.asset-studio.json` records generated asset ownership. On later exports, assets from the previous export that are no longer present are removed; unrelated manually maintained assets remain. On the first export, existing public assets are retained except excluded Pokémon sprites. Writes replace generated data and images directly, so review them with Git. If a run is interrupted, reselect the folders and retry. Commit the manifest with generated assets to retain ownership across checkouts.

Older manifests with `public/Front`, `public/Back`, `public/IngameMaps`, or `public/maps` paths remain supported: the next export writes the new paths and removes the previously managed files at the old paths.

## Shared types

Import contracts from `@absolution/shared-types` in both browser apps. The JavaScript API uses checked JSDoc imports from the same package. Existing website `src/types/*` paths re-export the shared contracts for compatibility.

The package contains only types and has no runtime build dependency. Its `build` and `check-types` scripts verify the source with TypeScript.

## Validation

```sh
pnpm build
pnpm check-types
pnpm test
```

Tests cover PBS parsing, inherited forms, every excluded species, final map/encounter sections, a full disk-backed generation flow, stale asset cleanup, source preservation, and the server's public API contracts.

## Deployment

`apps/web/Dockerfile` builds and serves `apps/web/dist` on port 4173. Build from the monorepo root:

```sh
docker build -f apps/web/Dockerfile --build-arg VITE_BACKEND_URL=https://your-api.example/api -t absolution-web .
```

Without a build argument, `/api` is used; configure your reverse proxy to forward it to the API. The static container itself does not proxy API requests.

For Dokploy, create separate website and API applications pointing to this repository. Select the Dockerfile build type and keep the source build path at the repository root for both:

| Setting | Website | API |
| ------- | ------- | --- |
| Dockerfile path | `apps/web/Dockerfile` | `apps/server/Dockerfile` |
| Docker context path | `.` | `.` |
| Domain container port | `4173` | `4000` |

Both Dockerfiles need the repository root as their build context to access the workspace manifests and shared packages. Set the website's `VITE_BACKEND_URL` build argument to your public API URL including `/api`, or configure reverse-proxy routing for `/api`. Mount a persistent volume at `/data` for the API.

Build the API **from the monorepo root**:

```sh
docker build -f apps/server/Dockerfile -t absolution-server .
docker run -p 4000:4000 -v absolution-downloads:/data absolution-server
```

The API supports `PORT` (default 4000) and `DATA_DIR` (default `apps/server`). Download history is stored in `downloads.json`, which is ignored by Git and Docker. Existing local history was copied into `apps/server` during migration; copy it into the `/data` volume when migrating production. `updates.json` remains part of the server source. The original sibling server folder was left unchanged.

The generator is a separate static Vite app: `pnpm --filter @absolution/asset-generator build` produces `apps/asset-generator/dist`. Keep it separate from the public website. It does not need an API server.

## Migration notes

The former `generate/` directory, including its original PBS files and Ruby script, is preserved locally at `.local/legacy-pbs/` and is ignored by Git. It is no longer used by any build or generation command. Website source, public assets, config, and the local environment file now live under `apps/web`. CI and hosting setups should use workspace commands from the root and the new output path `apps/web/dist`.
