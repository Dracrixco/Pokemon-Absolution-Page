"use client";
import { Navbar } from "./components/absolution/navbar";
import { Home } from "./pages/home/page";
import { Routes, Route } from "react-router-dom";
import { FakemonsList } from "./pages/fakemons/page";
import { NazanRegionMap } from "./pages/maps/page";
import { CharactersPage } from "./pages/characters/page";
import { CharacterDetailPage } from "./pages/characters/character-detail/page";
import { FakemonDetailPage } from "./pages/fakemons/fakemon-detail/page";
import { MoveDetailPage } from "./pages/moves/moves-detail/page";

export default function PokemonAbsolutionWebsite() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/maps" element={<NazanRegionMap />} />
        <Route path="/characters" element={<CharactersPage />} />
        <Route path="/characters/:name" element={<CharacterDetailPage />} />
        <Route path="/fakemons" element={<FakemonsList />} />
        <Route path="/fakemons/:id" element={<FakemonDetailPage />} />
        <Route path="/moves/:id" element={<MoveDetailPage />} />
      </Routes>
    </>
  );
}
