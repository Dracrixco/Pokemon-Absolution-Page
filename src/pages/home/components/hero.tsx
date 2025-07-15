import DownloadButton from "@/components/absolution/download-button";

export const HeroSection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-purple-200 to-purple-400 bg-clip-text">
          Welcome to Pokémon Absolution
        </h1>
        <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-4xl mx-auto">
          Pokémon Absolution invites you to explore the Nazan region, a vast
          world full of secrets, wonders, and unique challenges. This fan game
          seeks to take the Pokémon experience beyond the familiar, introducing
          innovative mechanics, new ways to play, and a simple yet engaging
          narrative.
        </p>
        <DownloadButton />
      </div>
    </section>
  );
};
