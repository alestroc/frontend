import type { LocalData } from "../types";

const KEY = "dati";

// Legge i dati di sessione dal localStorage. Ritorna null se non presenti o corrotti.
export function readLocalData(): LocalData | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LocalData;
  } catch {
    return null;
  }
}

// Salva i dati di sessione nel localStorage.
export function writeLocalData(data: LocalData): void {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// Rimuove i dati di sessione dal localStorage (logout).
export function clearLocalData(): void {
  localStorage.removeItem(KEY);
}

// Variante "richiedente" di readLocalData: lancia un errore se non c'è una sessione.
// Usata dalle funzioni API per evitare di duplicare 4 righe di guard ovunque.
// Ritorna LocalData (non nullable) così TS non si lamenta del token più sotto.
export function requireLocalData(): LocalData {
  const localData = readLocalData();
  if (!localData) {
    throw new Error("Sessione non trovata. Effettua il login.");
  }
  return localData;
}
