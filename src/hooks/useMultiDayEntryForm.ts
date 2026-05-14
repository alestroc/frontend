import { useState } from "react";
import type {
  Articolo,
  Commessa,
  ProcessedFavorite,
  TimeEntry,
} from "../types";
import { type EntryRow } from "../components/modal/EntryRowEditor";
import { addTimeEntriesByDays } from "../functions/entries";

interface UseMultiDayEntryFormOpts {
  selectedDays: string[] | null;
  entriesByDay: Record<string, TimeEntry[]>;
  commesse: Commessa[];
  articoli: Articolo[];
  maxHours: number;
  onSaved?: () => void;
}

type DayInput = { ore: string; nota: string };

export function useMultiDayEntryForm(opts: UseMultiDayEntryFormOpts) {
  const { selectedDays, entriesByDay, commesse, articoli, maxHours, onSaved } =
    opts;

  const [row, setRow] = useState<EntryRow>({
    rowId: "",
    idcommessa: null,
    idarticolo: null,
    ore: "",
    nota: "",
  });
  const [dayInputs, setDayInputs] = useState<Record<string, DayInput>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function updateRow(patch: Partial<EntryRow>) {
    setRow((prev) => ({ ...prev, ...patch }));
  }

  function updateDayInput(day: string, patch: Partial<DayInput>) {
    setDayInputs((prev) => ({ ...prev, [day]: { ...prev[day], ...patch } }));
  }

  function pickFavorite(fav: ProcessedFavorite) {
    setRow((prev) => ({
      ...prev,
      idcommessa: fav.idcommessa,
      idarticolo: fav.idarticolo,
    }));
  }

  function existingHoursFor(day: string): number {
    return (entriesByDay[day] ?? []).reduce((sum, e) => sum + Number(e.ore), 0);
  }

  function validate(): string | null {
    if (!selectedDays || selectedDays.length === 0) {
      return "Seleziona almeno un giorno.";
    }
    if (!row.idcommessa || !row.idarticolo) {
      return "Seleziona commessa e articolo.";
    }
    for (const day of selectedDays) {
      const input = dayInputs[day];
      if (!input || !input.ore || Number(input.ore) <= 0) {
        return `Inserisci le ore per il giorno ${day}.`;
      }
      if (Number(input.ore) > maxHours) {
        return `Le ore per il ${day} superano il massimo (${maxHours}h).`;
      }
      const existing = existingHoursFor(day);
      if (existing + Number(input.ore) > maxHours) {
        return `Il giorno ${day.slice(5).split("-").reverse().join("-")} supera il limite di ${maxHours}h (già ${existing}h registrate).`;
      }
      if (!input.nota || !input.nota.trim()) {
        return `Inserisci una nota per il giorno ${day}.`;
      }
    }
    return null;
  }

  // Trasforma lo state interno in payload e chiama l'API.
  // Assume che validate() sia già stata chiamata con successo.
  async function save(): Promise<void> {
    if (!selectedDays || !row.idcommessa || !row.idarticolo) return;
    setIsSaving(true);
    try {
      const c = commesse.find((x) => x.id === row.idcommessa);
      const a = articoli.find((x) => x.id === row.idarticolo);
      const commessa = {
        idcommessa: row.idcommessa,
        nomecommessa: c?.name ?? null,
        idarticolo: row.idarticolo,
        nomearticolo: a?.name ?? null,
      };
      const giornate = selectedDays.map((day) => ({
        giorno: day,
        ore: dayInputs[day].ore,
        nota: dayInputs[day].nota,
      }));
      await addTimeEntriesByDays({ commessa, giornate });
      onSaved?.();
    } finally {
      setIsSaving(false);
    }
  }

  return {
    row,
    dayInputs,
    isSaving,
    formError,
    updateRow,
    updateDayInput,
    pickFavorite,
    validate,
    save,
    setFormError,
  };
}
