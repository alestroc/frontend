import type { AppSettings, TimeEntry } from "../../types";
import Calendar from "../calendar/Calendar";
import ConfirmDialog from "./ConfirmDialog";
import EntryList from "./EntryList";
import EntryRowEditor, {
  type EntryRow,
  createEmptyRow,
} from "./EntryRowEditor";
import { useState } from "react";
import { addTimeEntries } from "../../functions/entries";
import { useNeededs } from "../../hooks/useNeededs";

interface ModalProp {
  entries: TimeEntry[];
  settings: AppSettings | null;
  isModalActive: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDay?: string | null;
  onSaved?: () => void;
}

function Modal({
  entries,
  settings,
  isModalActive,
  selectedDay: initialDay = null,
  onSaved,
}: ModalProp) {
  const [selectedDay, setSelectedDay] = useState<string | null>(initialDay);
  const [rows, setRows] = useState<EntryRow[]>([createEmptyRow()]);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const { commesse, articoli, error: neededsError } = useNeededs();

  const entriesByDay = entries.reduce<Record<string, TimeEntry[]>>(
    (acc, entry) => {
      if (!acc[entry.giorno]) acc[entry.giorno] = [];
      acc[entry.giorno].push(entry);
      return acc;
    },
    {},
  );

  const newTotalHours = rows.reduce((sum, r) => sum + (Number(r.ore) || 0), 0);
  const existingEntries = selectedDay ? (entriesByDay[selectedDay] ?? []) : [];
  const existingHours = existingEntries.reduce(
    (sum, e) => sum + Number(e.ore),
    0,
  );
  const maxHours = settings?.maxHours ?? 8;

  const commesseOptions = commesse.map((c) => ({ id: c.id, label: c.name }));
  const articoliOptions = articoli.map((a) => ({ id: a.id, label: a.name }));
  const hoursConfig = {
    min: settings?.minHours ?? 0,
    max: maxHours,
    step: settings?.hoursInterval ?? 0.5,
  };

  function updateRow(rowId: string, patch: Partial<EntryRow>) {
    setRows((prev) =>
      prev.map((r) => (r.rowId === rowId ? { ...r, ...patch } : r)),
    );
  }

  function addRow() {
    setRows((prev) => [...prev, createEmptyRow()]);
  }

  function removeRow(rowId: string) {
    setRows((prev) => prev.filter((r) => r.rowId !== rowId));
  }

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

  function handleConferma() {
    setFormError(null);
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }
    setShowConfirm(true);
  }

  async function handleConfirmSave() {
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
      isModalActive(false);
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Errore nel salvataggio.");
      setShowConfirm(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <div className="flex flex-col justify-between z-99 absolute w-[80%] h-[80%] self-center mx-[10%] bg-slate-400 overflow-auto">
        <h2>Registra Nuova Attività</h2>
        <h4 className="sticky botttom-0">
          Giorno selezionato:{" "}
          {selectedDay?.split("-").reverse().join("-") ?? "nessuno"}
        </h4>
        <div className="flex justify-between h-60">
          <div className="flex-1 border">
            <Calendar
              entries={entries}
              settings={settings}
              view={"Mensile"}
              isModal={true}
              selected={selectedDay}
              handleClickDay={(key) => setSelectedDay(key)}
            />
          </div>
          <div className="flex-1 border">SLAVATAGGIO PREFERITI/PRESET</div>
        </div>
        <div className="border flex flex-col gap-2 p-3">
          <div className="flex gap-2 text-sm font-semibold text-black">
            <div className="flex-5">Commessa</div>
            <div className="flex-2">Articolo</div>
            <div className="flex-1">Ore</div>
            <div className="flex-2">Nota</div>
            <div className="w-8" />
          </div>

          {rows.map((r, i) => (
            <EntryRowEditor
              key={r.rowId}
              row={r}
              commesseOptions={commesseOptions}
              articoliOptions={articoliOptions}
              hoursConfig={hoursConfig}
              onUpdate={(patch) => updateRow(r.rowId, patch)}
              onRemove={i > 0 ? () => removeRow(r.rowId) : undefined}
            />
          ))}

          <button
            type="button"
            onClick={addRow}
            className="self-start px-3 py-1 rounded-md border font-bold border-black text-sm text-black hover:bg-gray-200"
          >
            +
          </button>

          {(formError || neededsError) && (
            <p className="text-sm text-red-700 font-semibold">
              {formError ?? neededsError}
            </p>
          )}
        </div>
        <div className="border flex flex-col gap-1 p-2">
          <EntryList
            entries={existingEntries}
            onDelete={(entry) => {
              // TODO: eliminare entry
              console.log("elimina entry:", entry);
            }}
          />
        </div>
        <div className="sticky flex bg-slate-400 justify-end w-full bottom-0 p-2 gap-3">
          <button
            onClick={handleConferma}
            disabled={isSaving}
            className="px-4 py-2 rounded-md bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-50"
          >
            Conferma
          </button>
          <button
            onClick={() => isModalActive(false)}
            disabled={isSaving}
            className="px-4 py-2 rounded-md border border-gray-600 text-black hover:bg-gray-200 disabled:opacity-50"
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
              Confermi l'inserimento di <strong>{newTotalHours}h</strong> per il
              giorno <strong>{selectedDay}</strong>?
            </>
          }
          onConfirm={handleConfirmSave}
          onCancel={() => setShowConfirm(false)}
          isLoading={isSaving}
        />
      )}
    </>
  );
}

export default Modal;
