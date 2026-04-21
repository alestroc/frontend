import Combobox, { type ComboboxOption } from "./Combobox";
import ClearIcon from "@mui/icons-material/Clear";

export type EntryRow = {
  rowId: string;
  idcommessa: string | null;
  idarticolo: string | null;
  ore: string;
  nota: string;
};

function makeRowId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function createEmptyRow(): EntryRow {
  return {
    rowId: makeRowId(),
    idcommessa: null,
    idarticolo: null,
    ore: "",
    nota: "",
  };
}

interface EntryRowEditorProps {
  row: EntryRow;
  commesseOptions: ComboboxOption[];
  articoliOptions: ComboboxOption[];
  hoursConfig: { min: number; max: number; step: number };
  onUpdate: (patch: Partial<EntryRow>) => void;
  onRemove?: () => void;
}

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
      <div className="flex-5">
        <Combobox
          options={commesseOptions}
          value={row.idcommessa}
          onChange={(id) => onUpdate({ idcommessa: id })}
          placeholder="Seleziona commessa"
        />
      </div>
      <div className="flex-2">
        <Combobox
          options={articoliOptions}
          value={row.idarticolo}
          onChange={(id) => onUpdate({ idarticolo: id })}
          placeholder="Seleziona articolo"
        />
      </div>
      <div className="flex-1">
        <input
          type="number"
          step={hoursConfig.step}
          min={hoursConfig.min}
          max={hoursConfig.max}
          value={row.ore}
          onChange={(e) => onUpdate({ ore: e.target.value })}
          className="w-full rounded-md px-3 py-2 bg-white text-black border border-gray-300 focus:outline-none focus:border-orange-500"
        />
      </div>
      <div className="flex-2">
        <input
          type="text"
          value={row.nota}
          onChange={(e) => onUpdate({ nota: e.target.value })}
          className="w-full rounded-md px-3 py-2 bg-white text-black border border-gray-300 focus:outline-none focus:border-orange-500"
        />
      </div>
      <div className="w-8 flex items-center justify-center">
        {onRemove && (
          <button
            type="button"
            title="Rimuovi riga"
            onClick={onRemove}
            className="text-red-600 hover:text-red-800"
          >
            <ClearIcon />
          </button>
        )}
      </div>
    </div>
  );
}
