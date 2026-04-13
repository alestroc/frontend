import type { AppSettings } from "../types";
import { BASE_URL } from "./entries";

  export async function getSettings(): Promise<AppSettings> {
    const response = await fetch(`${BASE_URL}/getSettings`);
    const text = await response.text();
    const json = text.replace(/^window\.appsettings=/, "").replace(/;$/, "");
    return JSON.parse(json) as AppSettings;
  }