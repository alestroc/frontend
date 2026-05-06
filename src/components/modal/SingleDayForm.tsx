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
import EntryList from "./EntryList";
import EntryRowEditor from "./EntryRowEditor";
import ConfirmDialog from "./ConfirmDialog";
import { useEntriesByDay } from "../../hooks/useEntriesByDay";
import { useSingleDayEntryForm } from "../../hooks/useSingleDayEntryForm";
import {
  DEFAULT_HOURS_INTERVAL,
  DEFAULT_MAX_HOURS,
  DEFAULT_MIN_HOURS,
} from "../../config";
import { addFavorite } from "../../functions/favorites";

interface SingleDayFormProps {
  entries: TimeEntry[];
  settings: ApiSettings | null;
  initialSelectedDay: string | null;
  commesse: Commessa[];
  articoli: Articolo[];
  favorites: ProcessedFavorite[];
  reloadFavorites: () => void;
  onSaved?: () => void;
  onClose: () => void;
  showError?: (message: string) => void;
}

export default function SingleDayForm({
  entries,
  settings,
  initialSelectedDay,
  commesse,
  articoli,
  favorites,
  reloadFavorites,
  onSaved,
  onClose,
  showError,
}: SingleDayFormProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(
    initialSelectedDay,
  );
  const [showConfirm, setShowConfirm] = useState(false);

  const entriesByDay = useEntriesByDay(entries);
  const existingEntries = useMemo(
    () => (selectedDay ? (entriesByDay[selectedDay] ?? []) : []),
    [selectedDay, entriesByDay],
  );
  const existingHours = useMemo(
    () => existingEntries.reduce((sum, e) => sum + Number(e.ore), 0),
    [existingEntries],
  );
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

  const form = useSingleDayEntryForm({
    selectedDay,
    existingHours,
    commesse,
    articoli,
    maxHours,
    onSaved,
  });

  function handleConfirm() {
    form.setFormError(null);
    const err = form.validate();
    if (err) {
      form.setFormError(err);
      return;
    }
    setShowConfirm(true);
  }

  async function handleConfirmSave() {
    try {
      await form.save();
      onClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Errore nel salvataggio.";
      showError?.(msg);
      setShowConfirm(false);
    }
  }

  return (
    <>
      <h2 className="px-6 pt-5 text-xl font-semibold text-red-500">
        Multi Mansione su Singola Giornata
      </h2>
      <h4 className="sticky botttom-0 px-6 pb-4 text-sm font-medium text-white ">
        Giorno selezionato:{" "}
        <span className="text-white font-semibold">
          {selectedDay?.split("-").reverse().join("-") ?? "nessuno"}
        </span>
      </h4>
      <div className="flex justify-between gap-3 min-h-35 px-4">
        <div className="flex-1 rounded-md border border-slate-200 bg-slate-900 overflow-hidden">
          <Calendar
            entries={entries}
            settings={settings}
            view={"Settimanale"}
            isModal={true}
            selected={selectedDay}
            handleClickDay={(key) => setSelectedDay(key)}
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
      <div className="border-t border-slate-200 flex flex-col gap-3 px-4 py-4 mt-4">
        <div className="flex gap-2 text-xs font-semibold uppercase tracking-wide text-white">
          <div className="flex-4">Commessa</div>
          <div className="flex-2">Articolo</div>
          <div className="flex-2">Ore</div>
          <div className="flex-5">Nota</div>
          <div className="w-8" />
        </div>

        {form.rows.map((r, i) => (
          <EntryRowEditor
            key={r.rowId}
            row={r}
            commesseOptions={commesseOptions}
            articoliOptions={articoliOptions}
            hoursConfig={hoursConfig}
            onUpdate={(patch) => form.updateRow(r.rowId, patch)}
            onRemove={i > 0 ? () => form.removeRow(r.rowId) : undefined}
            isMultiDay={false}
          />
        ))}

        <button
          type="button"
          onClick={form.addRow}
          className="self-start px-3 py-1.5 rounded-md border border-slate-300 bg-slate-500 text-md font-bold  hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          +
        </button>

        {form.formError && (
          <p className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {form.formError}
          </p>
        )}
      </div>
      <div className="border-t border-slate-200 flex flex-col gap-2 px-4 py-4 bg-slate-400">
        <EntryList
          entries={existingEntries}
          onInsertFavorite={async (entry) => {
            try {
              await addFavorite(entry);
              reloadFavorites();
            } catch (e) {
              showError?.(
                e instanceof Error ? e.message : "Errore aggiunta preferito.",
              );
            }
          }}
        />
      </div>

      <div className="sticky bottom-0 flex bg-slate-600 border-t border-slate-200 justify-end w-full p-3 gap-2">
        <button
          onClick={handleConfirm}
          disabled={form.isSaving}
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

      {showConfirm && (
        <ConfirmDialog
          title="Confermi l'inserimento?"
          message={
            <>
              Confermi l'inserimento di <strong>{form.newTotalHours}h</strong>{" "}
              per il giorno <strong>{selectedDay}</strong>?
            </>
          }
          onConfirm={handleConfirmSave}
          onCancel={() => setShowConfirm(false)}
          isLoading={form.isSaving}
        />
      )}
    </>
  );
}
