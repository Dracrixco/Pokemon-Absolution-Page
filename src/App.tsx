"use client";
import { Navbar } from "./components/absolution/navbar";
import { Home } from "./pages/home/page";
import { Routes, Route } from "react-router-dom";
import { FakemonsList } from "./pages/fakemons/page";
import { NazanRegionMap } from "./pages/maps/page";
import { CharactersPage } from "./pages/characters/page";
import { CharacterDetailPage } from "./pages/characters/character-detail/page";
import { FakemonDetailPage } from "./pages/fakemons/fakemon-detail/page";
import MovesPage from "./pages/moves/page";
import { MoveDetailPage } from "./pages/moves/moves-detail/page";
import { Footer } from "./components/absolution/footer";
import { UpdatesPage } from "./pages/updates/page";
import { CountryDownloads } from "./pages/countries/page";
import { TeamBuilder } from "./pages/team-builder/page";
import { TeamBuilderProvider } from "./pages/team-builder/components/team-builder-context";
import PokemonEditPage from "./pages/team-builder/edit/page";
import { ItemsPage } from "./pages/items/page";
import { ItemDetailPage } from "./pages/items/item-detail/page";
import { MovesetEditor } from "./pages/moveset-editor/page";

export default function PokemonAbsolutionWebsite() {
  return (
    <>
      <TeamBuilderProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/maps" element={<NazanRegionMap />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/characters/:name" element={<CharacterDetailPage />} />
          <Route path="/fakemons" element={<FakemonsList />} />
          <Route path="/fakemons/:id" element={<FakemonDetailPage />} />
          <Route path="/moves" element={<MovesPage />} />
          <Route path="/moves/:id" element={<MoveDetailPage />} />
          <Route path="/updates" element={<UpdatesPage />} />
          <Route path="/downloads-list" element={<CountryDownloads />} />
          <Route path="/team-builder" element={<TeamBuilder />} />
          <Route
            path="/team-builder/edit/:pokemonIndex"
            element={<PokemonEditPage />}
          />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/items/:itemId" element={<ItemDetailPage />} />
          <Route path="/moveset-editor" element={<MovesetEditor />} />
        </Routes>
        <Footer />
      </TeamBuilderProvider>
    </>
  );
}
