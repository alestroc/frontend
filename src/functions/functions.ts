import { BASE_URL } from "./config";
import type { LocalData } from "../types";

export type { LocalData };

// Recupera dati dal LocalStorage
export function checkLocalStorageData(): LocalData | false {
  const isDataSaved = localStorage.getItem("dati");
  if (!isDataSaved) return false;

  try {
    return JSON.parse(isDataSaved) as LocalData;
  } catch {
    return false;
  }
}

// Logout — rimuove dati dal LocalStorage
export function deleteLocalStorageData(): void {
  localStorage.removeItem("dati");
}

// Controlla se l'utente è loggato verificando il token sul server
export async function checkIsLogged(): Promise<boolean> {
  
  const localData = checkLocalStorageData();
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

// trova il lunedì della settimana di cui viene passato il giorno
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d;
}