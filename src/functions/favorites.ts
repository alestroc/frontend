import type { Favorite, ProcessedFavorite, TimeEntry } from "../types";
import { requireLocalData } from "../storage/localData";
import { BASE_URL } from "./config";

export async function getFavorites(): Promise<Favorite[]> {
  const localData = requireLocalData();

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/getFavorites`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localData.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: localData.user,
        localid: localData.localid,
      }),
    });
  } catch {
    throw new Error(
      "Impossibile raggiungere il server. Controlla la connessione.",
    );
  }

  const data: Favorite[] = await response.json();
  if (!data) {
    throw new Error(
      "La sessione è scaduta. Effettua nuovamente il login. getFavorites",
    );
  }

  if (data.length === 0) return [];

  const output = data.map((favorite: Favorite) => ({
    id: favorite.id,
    idcommessa: favorite.idcommessa,
    idarticolo: favorite.idarticolo,
    order_no: favorite.order_no,
  }));

  return output;
}

export async function addFavorite(favorite: TimeEntry): Promise<boolean> {
  const localData = requireLocalData();
  try {
    await fetch(`${BASE_URL}/addFavorite`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localData.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: localData.user,
        localid: localData.localid,
        idcommessa: favorite.idcommessa,
        idarticolo: favorite.idarticolo,
      }),
    });
  } catch {
    throw new Error("Favorito già salvato.");
  }

  return true;
}

export async function removeFavorites(id: number): Promise<void> {
  const localData = requireLocalData();

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/removeFavorite/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localData.token}`,
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        user: localData.user,
        localid: localData.localid,
      }),
    });
  } catch {
    throw new Error(
      "Impossibile raggiungere il server. Controlla la connessione.",
    );
  }

  const data = await response.json();
  if (!data.message) {
    throw new Error(
      "La sessione è scaduta. Effettua nuovamente il login. removeFavorites",
    );
  }
  return console.log("eliminato");
}

export async function reorderFavorite(
  arrFavorites: Array<ProcessedFavorite>,
): Promise<void> {
  // Early-return se la lista è vuota
  if (arrFavorites.length === 0) return;

  const localData = requireLocalData();
  const arrIdFavorites = arrFavorites.map((element) => {
    return element.id;
  });

  try {
    await fetch(`${BASE_URL}/reorderFavorites`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localData.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: localData.user,
        localid: localData.localid,
        favoriteIds: arrIdFavorites,
      }),
    });
  } catch {
    throw new Error("Errore nella chiamata al server.");
  }
}
