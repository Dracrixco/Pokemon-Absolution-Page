"use client";
import FakemonCardPokemon from "@/components/absolution/fakemon-card";
import { getAllFakemons } from "@/lib/fakemons";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";

export const FakemonsList = () => {
  const allFakemons = getAllFakemons();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(50);
  const [selectedSuffix, setSelectedSuffix] = useState<string>("absolution");

  // Filtrar fakemons por suffix
  const filteredFakemons = allFakemons.filter((fakemon) => {
    if (fakemon.dateToShow && fakemon.dateToShow >= new Date()) {
      return false;
    }

    if (selectedSuffix === "all") {
      return true;
    } else {
      return fakemon.suffix === selectedSuffix;
    }
  });

  // Calcular valores de paginación
  const totalItems = filteredFakemons.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFakemons = filteredFakemons.slice(startIndex, endIndex);

  // Obtener sufijos únicos disponibles
  const availableSuffixes = Array.from(
    new Set(allFakemons.map((f) => f.suffix))
  );

  // Funciones de navegación
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    // Scroll suave al inicio de la sección
    document.getElementById("fakemons-grid")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const goToPrevious = () => goToPage(currentPage - 1);
  const goToNext = () => goToPage(currentPage + 1);

  // Manejar cambio de filtro
  const handleSuffixChange = (newSuffix: string) => {
    setSelectedSuffix(newSuffix);
    setCurrentPage(1); // Reset a la primera página
  };

  // Generar números de página para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  // Función para formatear el nombre del suffix
  const formatSuffixName = (suffix: string) => {
    switch (suffix) {
      case "absolution":
        return "Absolution";
      case "normal":
        return "Normal";
      default:
        return suffix.charAt(0).toUpperCase() + suffix.slice(1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text">
            Discover Fakemons
          </h1>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Explore our collection of original Pokémon with unique abilities and
            designs
          </p>
          <div className="text-purple-300 text-sm">
            Hover over cards to see detailed stats
          </div>

          {/* Filtros */}
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-purple-300">
              <Filter size={20} />
              <span className="font-medium">Filter by version:</span>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => handleSuffixChange("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSuffix === "all"
                    ? "bg-purple-500 text-white ring-2 ring-purple-300"
                    : "bg-purple-700 text-white hover:bg-purple-600"
                }`}
              >
                All ({allFakemons.length})
              </button>

              {availableSuffixes.map((suffix) => {
                const count = allFakemons.filter(
                  (f) =>
                    f.suffix === suffix &&
                    (!f.dateToShow || f.dateToShow < new Date())
                ).length;
                return (
                  <button
                    key={suffix}
                    onClick={() => handleSuffixChange(suffix)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedSuffix === suffix
                        ? "bg-purple-500 text-white ring-2 ring-purple-300"
                        : "bg-purple-700 text-white hover:bg-purple-600"
                    }`}
                  >
                    {formatSuffixName(suffix)} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stats de paginación */}
          <div className="mt-6 text-purple-300 text-sm">
            Showing {totalItems > 0 ? startIndex + 1 : 0}-
            {Math.min(endIndex, totalItems)} of {totalItems} Fakemons
            {selectedSuffix !== "all" && (
              <span className="ml-2">
                (filtered by {formatSuffixName(selectedSuffix)})
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Fakemons Grid */}
      <section id="fakemons-grid" className="py-8 px-4">
        <div className="container mx-auto">
          {totalItems === 0 ? (
            <div className="text-center py-16">
              <div className="text-purple-300 text-xl mb-4">
                No Fakemons found for the selected filter
              </div>
              <button
                onClick={() => handleSuffixChange("all")}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors"
              >
                View all Fakemons
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {currentFakemons.map((fakemon) => (
                  <FakemonCardPokemon key={fakemon.id} fakemon={fakemon} />
                ))}
              </div>

              {/* Paginación */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-12 space-x-2">
                  {/* Botón Anterior */}
                  <button
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === 1
                        ? "bg-purple-800 text-purple-400 cursor-not-allowed"
                        : "bg-purple-700 text-white hover:bg-purple-600"
                    }`}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                  </button>

                  {/* Números de página */}
                  <div className="flex space-x-1">
                    {/* Primera página si no está visible */}
                    {getPageNumbers()[0] > 1 && (
                      <>
                        <button
                          onClick={() => goToPage(1)}
                          className="px-3 py-2 rounded-lg text-sm font-medium bg-purple-700 text-white hover:bg-purple-600 transition-colors"
                        >
                          1
                        </button>
                        {getPageNumbers()[0] > 2 && (
                          <span className="px-2 py-2 text-purple-300">...</span>
                        )}
                      </>
                    )}

                    {/* Páginas visibles */}
                    {getPageNumbers().map((page) => (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === page
                            ? "bg-purple-500 text-white ring-2 ring-purple-300"
                            : "bg-purple-700 text-white hover:bg-purple-600"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Última página si no está visible */}
                    {getPageNumbers()[getPageNumbers().length - 1] <
                      totalPages && (
                      <>
                        {getPageNumbers()[getPageNumbers().length - 1] <
                          totalPages - 1 && (
                          <span className="px-2 py-2 text-purple-300">...</span>
                        )}
                        <button
                          onClick={() => goToPage(totalPages)}
                          className="px-3 py-2 rounded-lg text-sm font-medium bg-purple-700 text-white hover:bg-purple-600 transition-colors"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Botón Siguiente */}
                  <button
                    onClick={goToNext}
                    disabled={currentPage === totalPages}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === totalPages
                        ? "bg-purple-800 text-purple-400 cursor-not-allowed"
                        : "bg-purple-700 text-white hover:bg-purple-600"
                    }`}
                  >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </button>
                </div>
              )}

              {/* Selector de elementos por página */}
              <div className="flex justify-center items-center mt-6 space-x-4">
                <label className="text-purple-300 text-sm">
                  Items per page:
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    const newItemsPerPage = parseInt(e.target.value);
                    setCurrentPage(1);
                    setItemsPerPage(newItemsPerPage);
                  }}
                  className="px-3 py-1 rounded bg-purple-700 text-white border border-purple-600 text-sm focus:ring-2 focus:ring-purple-400"
                >
                  {[10, 25, 50, 100].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Jump to page */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-4 space-x-2">
                  <span className="text-purple-300 text-sm">Go to page:</span>
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        goToPage(page);
                      }
                    }}
                    className="w-16 px-2 py-1 rounded bg-purple-700 text-white border border-purple-600 text-sm text-center focus:ring-2 focus:ring-purple-400"
                  />
                  <span className="text-purple-300 text-sm">
                    of {totalPages}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};
