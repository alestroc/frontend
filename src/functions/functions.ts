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
