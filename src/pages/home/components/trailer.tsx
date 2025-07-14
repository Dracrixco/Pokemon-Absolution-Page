const TRAILER_LINK = "https://www.youtube.com/embed/XkcEE-h3k9c";
export const TrailerSection = () => {
  return (
    <section className="py-16 px-4 bg-purple-900/20">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Watch the Trailer
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Get a glimpse of the adventure that awaits in the{" "}
            <b>Nazan Region</b>.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative bg-purple-800/50 rounded-xl border border-purple-600 p-4 shadow-2xl">
            <div className="aspect-video rounded-lg overflow-hidden bg-black">
              <iframe
                id="ytplayer"
                src={TRAILER_LINK}
                className="w-full h-full"
              ></iframe>
            </div>

            {/* Video overlay for styling */}
            <div className="absolute inset-4 rounded-lg pointer-events-none">
              <div className="absolute inset-0 rounded-lg ring-2 ring-purple-400/30"></div>
            </div>
          </div>

          {/* Video description */}
          <div className="text-center mt-6">
            <p className="text-purple-300 text-sm">
              Experience the world of Pokémon Absolution like never before
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
