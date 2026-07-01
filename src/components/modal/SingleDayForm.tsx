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
import { addFavorite, removeFavorites } from "../../functions/favorites";
import SwitchButton from "./SwitchButton";
import ClearIcon from "@mui/icons-material/Clear";

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
  setIsSingleDayMode: React.Dispatch<React.SetStateAction<boolean>>;
  isSingleDayMode: boolean;
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
  setIsSingleDayMode,
  isSingleDayMode,
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
      <div className="flex  px-5">
        <div className="flex justify-between w-full">
          <h2 className="pt-5 text-xl font-semibold text-primary ">
            Inserimento Singolo
          </h2>
          <SwitchButton
            setIsSingleDayMode={setIsSingleDayMode}
            isSingleDayMode={isSingleDayMode}
          />
        </div>
        <ClearIcon
          onClick={onClose}
          className="relative top-2 left-2 rounded-full hover:bg-danger/30 "
        />
      </div>

      <div className="flex justify-between h-55 shrink-0 gap-2 min-h-35 px-4">
        <div className="flex-1 rounded-md border border-divider-soft bg-base overflow-hidden">
          <h4 className="px-6 my-2 text-sm font-medium text-primary">
            Giorno selezionato:{" "}
            <span className="text-primary font-semibold">
              {selectedDay?.split("-").reverse().join("-") ?? "nessuno"}
            </span>
          </h4>
          <Calendar
            entries={entries}
            settings={settings}
            view={"Settimanale"}
            isModal={true}
            selected={selectedDay}
            handleClickDay={(key) => setSelectedDay(key)}
          />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto rounded-md border border-divider-soft bg-slate-50 p-3 text-sm text-slate-500">
          <Favorites
            favorites={favorites}
            commesse={commesse}
            reloadFavorites={reloadFavorites}
            autocompleteFavorite={form.pickFavorite}
          />
        </div>
      </div>
      <div className="border-t border-divider-soft flex flex-col gap-3 px-4 py-4 mt-4">
        {form.formError && (
          <p className="text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
            {form.formError}
          </p>
        )}

        {form.rows.map((r, i) => (
          <EntryRowEditor
            key={r.rowId}
            row={r}
            commesseOptions={commesseOptions}
            articoliOptions={articoliOptions}
            hoursConfig={hoursConfig}
            onUpdate={(patch) => form.updateRow(r.rowId, patch)}
            onRemove={i > 0 ? () => form.removeRow(r.rowId) : undefined}
            onAdd={i === 0 ? form.addRow : undefined}
            isSingleDay={true}
          />
        ))}
      </div>
      <div className="border-t border-divider-soft flex flex-col gap-2 px-4 py-4 bg-surface-raised">
        <EntryList
          entries={existingEntries}
          favorites={favorites}
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
          onRemoveFavorite={async (favoriteId) => {
            try {
              await removeFavorites(favoriteId);
              reloadFavorites();
            } catch (e) {
              showError?.(
                e instanceof Error ? e.message : "Errore rimozione preferito.",
              );
            }
          }}
        />
      </div>

      <div className="mt-auto sticky bottom-0 flex p-2 bg-surface-raised border-t border-divider-soft justify-between w-full">
        <div className="flex gap-3">
          <button
            onClick={handleConfirm}
            disabled={form.isSaving}
            className="px-4 py-2 rounded-md bg-accent text-white font-medium hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Conferma
          </button>
          <button
            onClick={onClose}
            disabled={form.isSaving}
            className="px-4 py-2 rounded-md border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            Annulla
          </button>
        </div>
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
