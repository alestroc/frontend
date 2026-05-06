import { useMemo, useState } from "react";
import type {
  ApiSettings,
  Articolo,
  Commessa,
  ProcessedFavorite,
  TimeEntry,
} from "../../types";
import Calendar from "../calendar/Calendar";
import Favorites from "../favorites/Favorites";
import EntryRowEditor from "./EntryRowEditor";
import { useMultiDayEntryForm } from "../../hooks/useMultiDayEntryForm";
import {
  DEFAULT_HOURS_INTERVAL,
  DEFAULT_MAX_HOURS,
  DEFAULT_MIN_HOURS,
} from "../../config";

interface MultiDayFormProps {
  entries: TimeEntry[];
  settings: ApiSettings | null;
  commesse: Commessa[];
  articoli: Articolo[];
  favorites: ProcessedFavorite[];
  reloadFavorites: () => void;
  onSaved?: () => void;
  onClose: () => void;
  showError?: (message: string) => void;
}

export default function MultiDayForm({
  entries,
  settings,
  commesse,
  articoli,
  favorites,
  reloadFavorites,
  onSaved,
  onClose,
  showError,
}: MultiDayFormProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  // Toggle: rimuove il giorno se già presente, altrimenti lo aggiunge
  function toggleDay(key: string) {
    setSelectedDays((prev) =>
      prev.includes(key)
        ? prev.filter((d) => d !== key)
        : [...prev, key].sort(),
    );
    console.log(selectedDays);
  }

  const maxHours = settings?.maxHours ?? DEFAULT_MAX_HOURS;
  const commesseOptions = useMemo(
    () => commesse.map((c) => ({ id: c.id, label: c.name })),
    [commesse],
  );
  const articoliOptions = useMemo(
    () => articoli.map((a) => ({ id: a.id, label: a.name })),
    [articoli],
  );
  const hoursConfig = {
    min: settings?.minHours ?? DEFAULT_MIN_HOURS,
    max: maxHours,
    step: settings?.hoursInterval ?? DEFAULT_HOURS_INTERVAL,
  };

  const form = useMultiDayEntryForm({
    selectedDays: selectedDays.length ? selectedDays : null,
    existingHours: 0,
    commesse,
    articoli,
    maxHours,
    onSaved,
  });

  async function handleConfirm() {
    form.setFormError(null);
    const err = form.validate();
    if (err) {
      form.setFormError(err);
      return;
    }
    try {
      await form.save();
      onClose();
    } catch (e) {
      showError?.(e instanceof Error ? e.message : "Errore nel salvataggio.");
    }
  }

  return (
    <>
      <h2 className="px-6 pt-5 text-xl font-semibold text-red-500">
        Singola Mansione su Multi Giornata
      </h2>

      <div className="flex flex-col gap-3 px-4 py-4">
        <div className="flex gap-2 text-xs font-semibold uppercase tracking-wide text-white">
          <div className="flex-4">Commessa</div>
          <div className="flex-2">Articolo</div>
          <div className="w-8" />
        </div>
        <EntryRowEditor
          row={form.row}
          commesseOptions={commesseOptions}
          articoliOptions={articoliOptions}
          hoursConfig={hoursConfig}
          onUpdate={(patch) => form.updateRow({ ...form.row, ...patch })}
          isMultiDay={true}
        />
      </div>

      <div className="flex gap-3 px-4 max-h-65">
        <div className="flex-1 rounded-md border border-slate-200 bg-slate-900 overflow-hidden">
          <Calendar
            entries={entries}
            settings={settings}
            view="Mensile"
            isModal={true}
            selectedDays={selectedDays}
            handleClickDay={toggleDay}
          />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-500">
          <Favorites
            favorites={favorites}
            reloadFavorites={reloadFavorites}
            autocompleteFavorite={form.pickFavorite}
          />
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-4 text-white text-sm italic">
        Recap inserimento per ciascun giorno selezionato — TODO
      </div>

      {form.formError && (
        <p className="mx-4 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {form.formError}
        </p>
      )}

      <div className="sticky bottom-0 flex bg-slate-600 border-t border-slate-200 justify-end w-full p-3 gap-2">
        <button
          onClick={handleConfirm}
          disabled={form.isSaving || selectedDays.length === 0}
          className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Conferma
        </button>
        <button
          onClick={onClose}
          disabled={form.isSaving}
          className="px-4 py-2 rounded-md border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 transition-colors"
        >
          Annulla
        </button>
      </div>
    </>
  );
}
