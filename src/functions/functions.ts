import { BASE_URL } from "./config";
import type { LocalData, TimeEntry } from "../types";
import { readLocalData, clearLocalData } from "../storage/localData";
import type { EntryRow } from "../components/modal/EntryRowEditor";

export const checkLocalStorageData = (): LocalData | false =>
  readLocalData() ?? false;
export const deleteLocalStorageData = clearLocalData;
export type { LocalData };

// Controlla se l'utente è loggato verificando il token sul server
export async function checkIsLogged(): Promise<boolean> {
  const localData = readLocalData();
  if (!localData) return false;

  try {
    const response = await fetch(`${BASE_URL}/getNeededs`, {
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

    const data: { result: boolean } = await response.json();
    return data.result === true;
  } catch {
    return false;
  }
}

//  ---------------------- FUNCTIONS USATE IN CALENDAR -----------------------------

//passato un giorno, ritorna una stringa YYYY-MM-DD
export function dateToKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
//crea un dizionario raggruppando le entries in base al giorno
export function groupEntries(entries: TimeEntry[]) {
  entries.reduce<Record<string, TimeEntry[]>>((acc, entry) => {
    if (!acc[entry.giorno]) acc[entry.giorno] = [];
    acc[entry.giorno].push(entry);
    return acc;
  }, {});
}

// trova il lunedì della settimana di cui viene passato il giorno
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}

function makeRowId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function createEmptyRow(): EntryRow {
  return {
    rowId: makeRowId(),
    idcommessa: null,
    idarticolo: null,
    ore: "",
    nota: "",
  };
}
