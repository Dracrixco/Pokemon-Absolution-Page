export const DEFAULT_DOWNLOAD_LINK =
  "https://drive.google.com/file/d/19E1EovzWUB6OU4ydaUBqaHY0nYrOQjjx/view?usp=drive_link";

export const getGameInfo = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/game-info`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error obteniendo información del juego:", err);
    throw err;
  }
};

export const handleDownload = async () => {
  try {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/download`, {
      method: "GET",
      mode: "no-cors",
    });

    const gameInfo = await getGameInfo();
    window.open(gameInfo.downloadLink, "_blank");
  } catch (err) {
    window.open(DEFAULT_DOWNLOAD_LINK, "_blank");
    console.error("Error registrando descarga:", err);
  }
};
