export const handleDownload = async () => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/download`);
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "PokemonAbsolution.zip";
  a.click();

  window.URL.revokeObjectURL(url);
};
