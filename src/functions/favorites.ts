import type { Favorite, TimeEntry } from "../types";
import { checkLocalStorageData } from "./functions";
import { BASE_URL } from "./config";

export async function getFavorites(): Promise<Favorite[]> {
  const localData = checkLocalStorageData();
  if (!localData) {
    throw new Error("Sessione non trovata. Effettua il login. getFavorites");
  }

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

  return data.map((favorite: Favorite) => ({
    id: favorite.id,
    idcommessa: favorite.idcommessa,
    idarticolo: favorite.idarticolo,
    order_no: favorite.order_no,
  }));
}

export async function addFavorite(favorite: TimeEntry): Promise<boolean> {
  const localData = checkLocalStorageData();
  if (!localData) {
    throw new Error("Sessione non trovata. Effettua il login. (addFavorites)");
  }
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/addFavorite`, {
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
  const localData = checkLocalStorageData();
  if (!localData) {
    throw new Error("Sessione non trovata. Effettua il login. removeFavorites");
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/removeFavorite/${id}`, {
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

  const data = await response.json();
  console.log(data);
  if (!data.message) {
    throw new Error(
      "La sessione è scaduta. Effettua nuovamente il login. removeFavorites",
    );
  }
  return console.log("eliminato");
}
