export interface Update {
  id: string;
  name: string;
  description: string;
  version: string;
  date: string;
  changes: string[];
  isNew: boolean;
  formattedDate: string;
}

export const GOOGLE_DRIVE_URL =
  "https://drive.google.com/file/d/1XOG8pmJ-UYl7a_9T4buF7d3TX0s-LF9m/view?usp=sharing";

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
    console.log(data);
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
    window.open(GOOGLE_DRIVE_URL, "_blank");
    console.error("Error registrando descarga:", err);
  }
};

export const getDownloadsData = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/countries`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error getting the data:", err);
  }
};

// Nuevos métodos para actualizaciones
export const getUpdates = async (): Promise<Update[]> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/updates`,
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
    console.error("Error obteniendo actualizaciones:", err);
    throw err;
  }
};

export const getUpdateById = async (id: string): Promise<Update> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/updates/${id}`,
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
    console.error("Error obteniendo actualización:", err);
    throw err;
  }
};

// Función para obtener actualizaciones con paginación (usando backend)
export const getUpdatesPaginated = async (
  page: number = 1,
  limit: number = 5
): Promise<{
  updates: Update[];
  hasMore: boolean;
  totalPages: number;
  totalUpdates: number;
}> => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/updates?page=${page}&limit=${limit}`,
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
    return {
      updates: data.updates,
      hasMore: data.pagination.hasMore,
      totalPages: data.pagination.totalPages,
      totalUpdates: data.pagination.totalUpdates,
    };
  } catch (err) {
    console.error("Error obteniendo actualizaciones paginadas:", err);
    throw err;
  }
};
