// api/entries.ts
import type { TimeEntry } from "../types";
import { getLocalStorageData } from "../functions";
import type { LocalData } from "../functions"

export const BASE_URL = "http://studium.backend/api";

export const API_ERRORS = {
  NO_AUTH: "Sessione non trovata. Effettua il login.",
  TOKEN_EXPIRED: "La sessione è scaduta. Effettua nuovamente il login.",
  NETWORK: "Impossibile raggiungere il server. Controlla la connessione.",
  ENTRIES_FAILED: "Errore nel caricamento delle registrazioni.",
  SETTINGS_FAILED: "Errore nel caricamento delle impostazioni.",
} as const;

export type ApiError = (typeof API_ERRORS)[keyof typeof API_ERRORS];

interface ApiResponse<T> {
  result: boolean;
  data: T;
}

// Recupera le entries dell'utente
export async function getEntries(): Promise<TimeEntry[]> {
  const localData: LocalData | false = getLocalStorageData();
  if (!localData) {
    throw new Error(API_ERRORS.NO_AUTH);
  }

  try {
    const response = await fetch(`${BASE_URL}/getTimeEntries`, {
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

    const data: ApiResponse<TimeEntry[]> = await response.json();

    if (!data.result) {
      throw new Error(API_ERRORS.TOKEN_EXPIRED);
    }

    if (!data.data || data.data.length === 0) {
      return [];
    }

    return data.data.map((entry) => ({
      giorno: entry.giorno,
      idcommessa: entry.idcommessa,
      nomecommessa: entry.nomecommessa,
      idarticolo: entry.idarticolo,
      nomearticolo: entry.nomearticolo,
      ore: entry.ore,
      nota: entry.nota,
    }));
  } catch (error) {
    if (error instanceof Error && Object.values(API_ERRORS).includes(error.message as ApiError)) {
      throw error;
    }
    throw new Error(API_ERRORS.NETWORK);
  }
}