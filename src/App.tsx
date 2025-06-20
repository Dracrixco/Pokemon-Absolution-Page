"use client";
import { Navbar } from "./components/absolution/navbar";
import { Home } from "./pages/home/page";
import { Routes, Route } from "react-router-dom";
import { FakemonsList } from "./pages/fakemons-list/page";
import { Maps } from "./pages/maps/page";
import { Characters } from "./pages/characters/page";

export default function PokemonAbsolutionWebsite() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fakemons-list" element={<FakemonsList />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/characters" element={<Characters />} />
      </Routes>
    </>
  );
}
