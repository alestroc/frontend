import Combobox, { type ComboboxOption } from "./Combobox";
import ClearIcon from "@mui/icons-material/Clear";

export type EntryRow = {
  rowId: string;
  idcommessa: string | null;
  idarticolo: string | null;
  ore: string;
  nota: string;
};

interface EntryRowEditorProps {
  row: EntryRow;
  commesseOptions: ComboboxOption[];
  articoliOptions: ComboboxOption[];
  hoursConfig: { min: number; max: number; step: number };
  onUpdate: (patch: Partial<EntryRow>) => void;
  onRemove?: () => void;
}

const inputClass =
  "w-full rounded-md px-3 py-2 bg-white text-slate-900 border border-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors";

export default function EntryRowEditor({
  row,
  commesseOptions,
  articoliOptions,
  hoursConfig,
  onUpdate,
  onRemove,
}: EntryRowEditorProps) {
  return (
    <div className="flex gap-2 items-start">
      <div className="flex-4">
        <Combobox
          options={commesseOptions}
          value={row.idcommessa}
          onChange={(id) => onUpdate({ idcommessa: id })}
          placeholder="Seleziona commessa"
        />
      </div>
      <div className="flex-1">
        <Combobox
          options={articoliOptions}
          value={row.idarticolo}
          onChange={(id) => onUpdate({ idarticolo: id })}
          placeholder="Seleziona articolo"
        />
      </div>
      <div className="flex-1 ">
        <input
          type="number"
          step={hoursConfig.step}
          min={hoursConfig.min}
          max={hoursConfig.max}
          value={row.ore}
          onChange={(e) => onUpdate({ ore: e.target.value })}
          className={inputClass}
        />
      </div>
      <div className="flex-5 overflow-auto">
        <input
          type="text"
          value={row.nota}
          onChange={(e) => onUpdate({ nota: e.target.value })}
          className={[inputClass, "overflow-hidden"].join(" ")}
        />
      </div>
      <div className="w-8 flex items-center justify-center">
        {onRemove && (
          <button
            type="button"
            title="Rimuovi riga"
            onClick={onRemove}
            className="text-slate-400 hover:text-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 rounded"
          >
            <ClearIcon />
          </button>
        )}
      </div>
    </div>
  );
}
