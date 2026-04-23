import type { ApiSettings } from "../types";
import { BASE_URL } from "./config";

export async function getSettings(): Promise<ApiSettings> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/getSettings`);
  } catch {
    throw new Error(
      "Impossibile raggiungere il server. Controlla la connessione.",
    );
  }

  const text = await response.text();
  const json = text.replace(/^window\.appsettings=/, "").replace(/;$/, "");
  return JSON.parse(json) as ApiSettings;
}
