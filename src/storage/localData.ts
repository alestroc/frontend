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
