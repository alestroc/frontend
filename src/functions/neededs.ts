import type { Commessa, Articolo } from "../types";
import { checkLocalStorageData } from "./functions";
import { BASE_URL } from "./config";

interface ApiResponse {
  result: boolean;
  message?: string;
  data: {
    commesse: Commessa[];
    articoli: Articolo[];
  };
}

export async function getNeededs(): Promise<{
  commesse: Commessa[];
  articoli: Articolo[];
}> {
  const localData = checkLocalStorageData();
  if (!localData) {
    throw new Error("Sessione non trovata. Effettua il login. Neededs");
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/getNeededs`, {
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

  const data: ApiResponse = await response.json();
  if (!data.result) {
    throw new Error("La sessione è scaduta. Effettua nuovamente il login.");
  }

  return {
    commesse: data.data?.commesse ?? [],
    articoli: data.data?.articoli ?? [],
  };
}
