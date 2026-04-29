import type { TimeEntry } from "../types";
import { readLocalData } from "../storage/localData";
import { BASE_URL } from "./config";

interface ApiResponse<T> {
  result: boolean;
  data: T;
}

export async function getEntries(): Promise<TimeEntry[]> {
  const localData = readLocalData();
  if (!localData) {
    throw new Error("Sessione non trovata. Effettua il login.");
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/getTimeEntries`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localData.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: localData.user,
        localid: localData.localid,
        from: 1104534000,
        to: 3944678400,
      }),
    });
  } catch (e) {
    console.error("getEntries: fetch fallita", e);
    throw new Error(
      "Impossibile raggiungere il server. Controlla la connessione.",
    );
  }

  const data: ApiResponse<TimeEntry[]> = await response.json();
  if (!data.result) {
    throw new Error("La sessione è scaduta. Effettua nuovamente il login.");
  }

  if (!data.data || data.data.length === 0) return [];

  return data.data.map((entry) => ({
    giorno: entry.giorno,
    idcommessa: entry.idcommessa,
    nomecommessa: entry.nomecommessa,
    idarticolo: entry.idarticolo,
    nomearticolo: entry.nomearticolo,
    ore: entry.ore,
    nota: entry.nota,
  }));
}

// "YYYY-MM-DD" -> Unix timestamp (secondi) — il backend si aspetta un timestamp
function dayToTimestamp(day: string): number {
  return Math.floor(new Date(day).getTime() / 1000);
}

export type NewEntry = Omit<TimeEntry, "giorno">;

export async function addTimeEntries(
  giorno: string,
  entries: NewEntry[],
): Promise<void> {
  const localData = readLocalData();
  if (!localData) {
    throw new Error("Sessione non trovata. Effettua il login.");
  }

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/addTimeEntries`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localData.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: localData.user,
        localid: localData.localid,
        idpersonale: localData.idpersonale,
        giorno: dayToTimestamp(giorno),
        entries,
      }),
    });
  } catch (e) {
    console.error("addTimeEntries: fetch fallita", e);
    throw new Error(
      "Impossibile raggiungere il server. Controlla la connessione.",
    );
  }

  const data: ApiResponse<unknown> = await response.json();
  if (!data.result) {
    throw new Error("Errore nel salvataggio dell'attività.");
  }
}
