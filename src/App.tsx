"use client";
import { SiteLayout } from "./components/absolution/site-layout";
import { Home } from "./pages/home/page";
import { Routes, Route } from "react-router-dom";
import { FakemonsList } from "./pages/fakemons/page";
import { NazanRegionMap } from "./pages/maps/page";
import { CharactersPage } from "./pages/characters/page";
import { CharacterDetailPage } from "./pages/characters/character-detail/page";
import { FakemonDetailPage } from "./pages/fakemons/fakemon-detail/page";
import MovesPage from "./pages/moves/page";
import { MoveDetailPage } from "./pages/moves/moves-detail/page";
import { UpdatesPage } from "./pages/updates/page";
import { CountryDownloads } from "./pages/countries/page";
import { ItemsPage } from "./pages/items/page";
import { ItemDetailPage } from "./pages/items/item-detail/page";

export default function PokemonAbsolutionWebsite() {
  return (
    <SiteLayout>
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
        <Route path="/items" element={<ItemsPage />} />
        <Route path="/items/:itemId" element={<ItemDetailPage />} />
      </Routes>
    </SiteLayout>
  );
}
