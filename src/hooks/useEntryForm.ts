import { useState } from "react";
import type { Articolo, Commessa, ProcessedFavorite } from "../types";
import { type EntryRow } from "../components/modal/EntryRowEditor";
import { addTimeEntries } from "../functions/entries";
import { createEmptyRow } from "../functions/functions";

interface UseEntryFormOpts {
  selectedDay: string | null;
  existingHours: number;
  commesse: Commessa[];
  articoli: Articolo[];
  maxHours: number;
  onSaved?: () => void;
}
//Contiene la logica di gestione del form di input nel modale
export function useEntryForm(opts: UseEntryFormOpts) {
  const { selectedDay, existingHours, commesse, articoli, maxHours, onSaved } =
    opts;
  const [rows, setRows] = useState<EntryRow[]>([createEmptyRow()]);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const newTotalHours = rows.reduce((sum, r) => sum + (Number(r.ore) || 0), 0);

  function addRow() {
    setRows((prev) => [...prev, createEmptyRow()]);
  }

  function removeRow(rowId: string) {
    setRows((prev) => prev.filter((r) => r.rowId !== rowId));
  }

  function updateRow(rowId: string, patch: Partial<EntryRow>) {
    setRows((prev) =>
      prev.map((r) => (r.rowId === rowId ? { ...r, ...patch } : r)),
    );
  }

  function pickFavorite(fav: ProcessedFavorite) {
    //cerco se c'è una riga vuota
    const empty = rows.find((r) => !r.idcommessa && !r.idarticolo);
    if (empty) {
      // se l'ho trovata, popolo l'input coi valori
      updateRow(empty.rowId, {
        idcommessa: fav.idcommessa,
        idarticolo: fav.idarticolo,
      });
    } else {
      setRows((prev) => [
        ...prev,
        {
          // aggiungo una riga
          ...createEmptyRow(),
          idcommessa: fav.idcommessa,
          idarticolo: fav.idarticolo,
        },
      ]);
    }
  }

  // Ritorna un messaggio di errore se le righe non sono valide, altrimenti null.
  function validate(): string | null {
    if (!selectedDay) return "Seleziona un giorno.";
    for (const r of rows) {
      if (!r.idcommessa || !r.idarticolo) {
        return "Seleziona commessa e articolo per ogni riga.";
      }
      if (!r.ore || Number(r.ore) <= 0 || Number(r.ore) > maxHours) {
        return "Inserisci ore valide per ogni riga.";
      }
      if (!r.nota.trim()) {
        return "Inserisci una nota per ogni riga.";
      }
    }
    if (existingHours + newTotalHours > maxHours) {
      return `Superato il limite giornaliero di ${maxHours} ore (${existingHours}h già registrate + ${newTotalHours}h nuove).`;
    }
    return null;
  }

  // Trasforma le righe del form in NewEntry e chiama l'API.
  // Assume che validate() sia già stata chiamata con successo.
  async function save(): Promise<void> {
    if (!selectedDay) return;
    setIsSaving(true);
    try {
      const newEntries = rows.map((r) => {
        const c = commesse.find((x) => x.id === r.idcommessa);
        const a = articoli.find((x) => x.id === r.idarticolo);
        return {
          idcommessa: r.idcommessa!,
          nomecommessa: c?.name ?? "",
          idarticolo: r.idarticolo!,
          nomearticolo: a?.name ?? "",
          ore: r.ore,
          nota: r.nota,
        };
      });
      await addTimeEntries(selectedDay, newEntries);
      onSaved?.();
    } finally {
      setIsSaving(false);
    }
  }

  return {
    rows,
    isSaving,
    formError,
    newTotalHours,
    addRow,
    removeRow,
    updateRow,
    pickFavorite,
    validate,
    save,
    setFormError,
  };
}
