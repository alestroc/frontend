import { useState } from "react";
import type { Articolo, Commessa, ProcessedFavorite } from "../types";
import { type EntryRow } from "../components/modal/EntryRowEditor";
import { addTimeEntries } from "../functions/entries";

interface UseMultiDayEntryFormOpts {
  selectedDays: string[] | null;
  existingHours: number;
  commesse: Commessa[];
  articoli: Articolo[];
  maxHours: number;
  onSaved?: () => void;
}
//Contiene la logica di gestione del form di input nel modale
export function useMultiDayEntryForm(opts: UseMultiDayEntryFormOpts) {
  const { selectedDays, existingHours, commesse, articoli, maxHours, onSaved } =
    opts;

  const [row, setRow] = useState<EntryRow>({
    rowId: "",
    idcommessa: "",
    idarticolo: "",
    ore: "",
    nota: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function updateRow(patch: EntryRow) {
    setRow((prev) => ({
      ...prev,
      ...patch,
    }));
  }

  function pickFavorite(fav: ProcessedFavorite) {
    updateRow({
      rowId: "",
      idarticolo: fav.idarticolo,
      idcommessa: fav.idcommessa,
      ore: "",
      nota: "",
    });
  }
  const newTotalHours = Number(row.ore);

  // Ritorna un messaggio di errore se le righe non sono valide, altrimenti null.
  function validate(): string | null {
    if (!selectedDays) return "Seleziona un giorno.";
    if (!row.idcommessa || !row.idarticolo) {
      return "Seleziona commessa e articolo per ogni riga.";
    }
    if (!row.ore || Number(row.ore) <= 0 || Number(row.ore) > maxHours) {
      return "Inserisci ore valide per ogni riga.";
    }
    if (!row.nota.trim()) {
      return "Inserisci una nota per ogni riga.";
    }
    if (existingHours + newTotalHours > maxHours) {
      return `Superato il limite giornaliero di ${maxHours} ore (${existingHours}h già registrate + ${newTotalHours}h nuove).`;
    }
    return null;
  }

  // Trasforma le righe del form in NewEntry e chiama l'API.
  // Assume che validate() sia stata chiamata con successo.

  async function save(): Promise<void> {
    const c = commesse.find((x) => x.id === row.idcommessa);
    const a = articoli.find((x) => x.id === row.idarticolo);
    const temp = {
      idcommessa: row.idcommessa!,
      nomecommessa: c?.name ?? "",
      idarticolo: row.idarticolo!,
      nomearticolo: a?.name ?? "",
      ore: row.ore,
      nota: row.nota,
    };
    if (!selectedDays) return;
    setIsSaving(true);

    try {
      for (let i = 0; i < selectedDays.length; i++) {
        await addTimeEntries(selectedDays[i], temp);
      }
      onSaved?.();
    } finally {
      setIsSaving(false);
    }
  }

  return {
    row,
    isSaving,
    formError,
    newTotalHours,
    updateRow,
    pickFavorite,
    validate,
    save,
    setFormError,
  };
}
