import type { Favorite } from "../types";
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
  console.log(data);
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
