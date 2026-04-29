import { useMemo } from "react";
import type { TimeEntry } from "../types";

// Dato l'array delle entries, ritorna un dizionario { "YYYY-MM-DD": TimeEntry[] }.
// Memoizzato: si ricalcola solo se cambia l'array entries.
export function useEntriesByDay(
  entries: TimeEntry[],
): Record<string, TimeEntry[]> {
  return useMemo(() => {
    return entries.reduce<Record<string, TimeEntry[]>>((acc, entry) => {
      if (!acc[entry.giorno]) acc[entry.giorno] = [];
      acc[entry.giorno].push(entry);
      return acc;
    }, {});
  }, [entries]);
}
