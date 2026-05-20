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
import { useEntriesByDay } from "../../hooks/useEntriesByDay";
import { useMultiDayEntryForm } from "../../hooks/useMultiDayEntryForm";
import {
  DEFAULT_HOURS_INTERVAL,
  DEFAULT_MAX_HOURS,
  DEFAULT_MIN_HOURS,
} from "../../config";
import { inputClass } from "../../functions/config";
import ConfirmDialog from "./ConfirmDialog";
import SwitchButton from "./SwitchButton";

export interface MultiDayFormProps {
  entries: TimeEntry[];
  settings: ApiSettings | null;
  commesse: Commessa[];
  articoli: Articolo[];
  favorites: ProcessedFavorite[];
  reloadFavorites: () => void;
  onSaved?: () => void;
  onClose: () => void;
  showError?: (message: string) => void;
  setIsSingleDayMode: React.Dispatch<React.SetStateAction<boolean>>;
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
  setIsSingleDayMode,
}: MultiDayFormProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const entriesByDay = useEntriesByDay(entries);

  // Toggle: rimuove il giorno se già presente, altrimenti lo aggiunge
  function toggleDay(key: string) {
    setSelectedDays((prev) =>
      prev.includes(key)
        ? prev.filter((d) => d !== key)
        : [...prev, key].sort(),
    );
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
    entriesByDay,
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
      <h2 className="px-6 pt-5 text-xl font-semibold ">Inserimento Multiplo</h2>

      <div className="flex flex-col p-2 ">
        <EntryRowEditor
          row={form.row}
          commesseOptions={commesseOptions}
          articoliOptions={articoliOptions}
          hoursConfig={hoursConfig}
          onUpdate={form.updateRow}
          isSingleDay={false}
        />
      </div>

      <div className="flex gap-3 p-3 max-h-60">
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

      <div className="border-t border-slate-200 px-4 py-4 text-white text-sm">
        {form.formError && (
          <p
            role="alert"
            className="mx-4 mb-10 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2"
          >
            {form.formError}
          </p>
        )}

        {selectedDays.map((day) => {
          const registeredHours = (entriesByDay[day] ?? []).reduce(
            (sum, e) => sum + Number(e.ore),
            0,
          );
          const availableHours = maxHours - registeredHours;
          const dayLabel = day.slice(5).split("-").reverse().join("-");
          return (
            <>
              <div key={day} className="flex justify-between items-center">
                <p> {dayLabel}</p>
                <div className="flex flex-1 gap-2 m-2 align">
                  <input
                    type="number"
                    placeholder="Ore"
                    aria-label={`Ore per il ${dayLabel}`}
                    step={hoursConfig.step}
                    min={hoursConfig.min}
                    max={availableHours}
                    value={form.dayInputs[day]?.ore ?? ""}
                    onChange={(e) => {
                      form.updateDayInput(day, { ore: e.currentTarget.value });
                    }}
                    className={[inputClass, "appearance-textfield"].join(" ")}
                  />
                </div>
                <div className="flex flex-4">
                  <input
                    type="text"
                    placeholder="Nota"
                    aria-label={`Nota per il ${dayLabel}`}
                    value={form.dayInputs[day]?.nota ?? ""}
                    onChange={(e) => {
                      form.updateDayInput(day, { nota: e.currentTarget.value });
                    }}
                    className={[inputClass, "overflow-hidden m-2"].join(" ")}
                  />
                </div>
                <p className="flex flex-1 text-xs text-slate-300 align-center">
                  {availableHours}h disponibili
                </p>
              </div>
            </>
          );
        })}
      </div>

      {showConfirm && (
        <ConfirmDialog
          title="Confermi l'inserimento?"
          message={
            <>
              Confermi l'inserimento di
              <strong> {selectedDays.length} commesse</strong> ?
            </>
          }
          onConfirm={handleConfirmSave}
          onCancel={() => setShowConfirm(false)}
          isLoading={form.isSaving}
        />
      )}

      <div className="mt-auto sticky bottom-0 flex p-2 bg-slate-600 border-t border-slate-200 justify-between w-full">
        <SwitchButton setIsSingleDayMode={setIsSingleDayMode} />
        <div className="flex gap-3">
          <button
            onClick={() => {
              handleConfirm();
            }}
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
      </div>
    </>
  );
}
