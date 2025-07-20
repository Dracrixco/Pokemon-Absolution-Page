"use client";

import { useState, useEffect } from "react";
import { getUpdatesPaginated, type Update } from "@/api/download";
import {
  Calendar,
  Tag,
  List,
  Sparkles,
  ChevronDown,
  Loader2,
} from "lucide-react";
import DownloadButton from "@/components/absolution/download-button";

export function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar actualizaciones iniciales
  useEffect(() => {
    loadInitialUpdates();
  }, []);

  const loadInitialUpdates = async () => {
    try {
      setInitialLoading(true);
      setError(null);
      const { updates: newUpdates, hasMore: moreAvailable } =
        await getUpdatesPaginated(1, 5);
      setUpdates(newUpdates);
      setHasMore(moreAvailable);
      setCurrentPage(1);
    } catch (err) {
      setError("Error cargando las actualizaciones. Inténtalo de nuevo.");
      console.error("Error loading updates:", err);
    } finally {
      setInitialLoading(false);
    }
  };

  const loadMoreUpdates = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const nextPage = currentPage + 1;
      const { updates: newUpdates, hasMore: moreAvailable } =
        await getUpdatesPaginated(nextPage, 5);

      setUpdates((prev) => [...prev, ...newUpdates]);
      setHasMore(moreAvailable);
      setCurrentPage(nextPage);
    } catch (err) {
      setError("Error cargando más actualizaciones.");
      console.error("Error loading more updates:", err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-purple-200 text-lg">Loading updates...</p>
        </div>
      </div>
    );
  }

  if (error && updates.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={loadInitialUpdates}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const latestUpdate = updates[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text text-transparent">
            Game Updates
          </h1>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Stay up to date with the latest features, improvements, and content
            additions to Pokémon Absolution
          </p>

          {/* Latest Version Banner */}
          {latestUpdate && (
            <div className="bg-purple-800/50 rounded-xl border border-purple-600 p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-purple-200 font-medium">
                  Latest Version
                </span>
                {latestUpdate.isNew && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                    NEW
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                {latestUpdate.version}
              </h2>
              <p className="text-purple-200 mb-4">{latestUpdate.name}</p>
              <DownloadButton showVersion={false} />
            </div>
          )}
        </div>
      </section>

      {/* Updates List */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Error message if exists */}
          {error && (
            <div className="bg-red-900/50 border border-red-600 rounded-lg p-4 mb-6 text-center">
              <p className="text-red-200">{error}</p>
            </div>
          )}

          <div className="space-y-8">
            {updates.map((update, index) => (
              <div
                key={update.id}
                className="text-white bg-purple-800/50 rounded-xl border border-purple-600 p-6 hover:bg-purple-800/60 transition-all duration-300"
              >
                {/* Update Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center gap-3 mb-2 md:mb-0">
                    <span className="bg-purple-600 text-white px-3 py-1 rounded-full font-mono text-sm">
                      {update.version}
                    </span>
                    {update.isNew && (
                      <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse flex items-center gap-1">
                        <Sparkles className="h-3 w-3" />
                        NEW
                      </span>
                    )}
                    {index === 0 && (
                      <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                        LATEST
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-purple-300 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{update.formattedDate}</span>
                  </div>
                </div>

                {/* Update Title and Description */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-purple-400" />
                    {update.name}
                  </h3>
                  {update.description && (
                    <p className="text-purple-200 leading-relaxed">
                      {update.description}
                    </p>
                  )}
                </div>

                {/* Changes List */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <List className="h-5 w-5 text-purple-400" />
                    What's New
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {update.changes.map((change, changeIndex) => (
                      <div
                        key={changeIndex}
                        className="flex items-start gap-2 text-purple-200 text-sm bg-purple-900/30 rounded-lg p-3"
                      >
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span>{change}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center mt-8">
              <button
                onClick={loadMoreUpdates}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg transition-colors flex items-center gap-2 mx-auto"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    Load more updates
                  </>
                )}
              </button>
            </div>
          )}

          {/* No more updates message */}
          {!hasMore && updates.length > 0 && (
            <div className="text-center mt-8">
              <p className="text-purple-400 text-sm">
                ✨ Well, you already see all updates over the time... Good, I
                guess.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
