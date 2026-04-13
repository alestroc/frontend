// utils/auth.ts
import {BASE_URL} from "./api/entries"
export interface LocalData {
  idpersonale: string,
localid: string,
name: string,
sector:string
token: string,
user: number
}


// Recupera dati dal LocalStorage
export function getLocalStorageData(): LocalData | false {
  //ritorna false se non trova niente oppure un json
  const isDataSaved = localStorage.getItem("dati");
  
  if (!isDataSaved) {
    console.log("Dati non presenti");
    return false;
  }

  try {
    const parsedData: LocalData = JSON.parse(isDataSaved);
    return parsedData;
  } catch (error) {
    console.error("Errore nel parsing dei dati: ", error);
    return false;
  }
}

// Logout - Rimuove dati dal LocalStorage
export function deleteLocalStorageData(): void {
  const isDataSaved = localStorage.getItem("dati");
  if (isDataSaved) {
    localStorage.removeItem("dati");
    console.log("Logout effettuato.");
  }
}

// Controlla se l'utente è loggato
export async function checkIsLogged(): Promise<boolean> {
  const localData = getLocalStorageData();

  if (!localData) {
    return false;
  }

  try {
    //provo una chiamata api per controllare la validità del token in memoria
    const response = await fetch(`${BASE_URL}/getNeededs`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localData.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: localData.user,
        localid: localData.localid,
      }),
    });

    const data: { result: boolean } = await response.json();

    if (data.result) {
      return true;
    } else {
      console.log("Token non più valido.");
      return false;
    }
  } catch (error) {
    console.error("Errore durante il controllo login:", error);
    return false;
  }
}