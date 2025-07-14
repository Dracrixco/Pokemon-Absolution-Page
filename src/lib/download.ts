const GOOGLE_DRIVE_URL =
  "https://drive.google.com/file/d/11Z3resNmp-O7ew4xtO4-S5dPLvJdhavs/view?usp=drive_link";

export const handleDownload = async () => {
  try {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/download`, {
      method: "GET",
      mode: "no-cors",
    });

    // Después de registrar, abrir Google Drive
    window.open(GOOGLE_DRIVE_URL, "_blank"); // ✅ Siempre abre en nueva pestaña
  } catch (err) {
    console.error("Error registrando descarga:", err);
  }
};
