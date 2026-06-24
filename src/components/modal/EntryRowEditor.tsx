import { inputClass } from "../../functions/config";
import Combobox, { type ComboboxOption } from "./Combobox";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";

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
  onAdd?: () => void;
  // true -> mostra anche ore + nota (usata in SingleDayForm).
  isSingleDay: boolean;
}

export default function EntryRowEditor({
  row,
  commesseOptions,
  articoliOptions,
  hoursConfig,
  onUpdate,
  onRemove,
  onAdd,
  isSingleDay,
}: EntryRowEditorProps) {
  return (
    <div className="flex flex-1 gap-2 items-center ">
      <div className="flex-5">
        <Combobox
          options={commesseOptions}
          value={row.idcommessa}
          onChange={(id) => onUpdate({ idcommessa: id })}
          placeholder="Seleziona commessa"
        />
      </div>
      <div className="flex-3">
        <Combobox
          options={articoliOptions}
          value={row.idarticolo}
          onChange={(id) => onUpdate({ idarticolo: id })}
          placeholder="Seleziona articolo"
        />
      </div>
      {isSingleDay && (
        <>
          <div className="flex-1 ">
            <input
              type="number"
              placeholder="Ore"
              step={hoursConfig.step}
              min={hoursConfig.min}
              max={hoursConfig.max}
              value={row.ore}
              onChange={(e) => onUpdate({ ore: e.target.value })}
              className={[inputClass, " appearance-textfield"].join(" ")}
            />
          </div>
          <div className=" flex-4  overflow-auto">
            <input
              type="text"
              placeholder="Nota"
              value={row.nota}
              onChange={(e) => onUpdate({ nota: e.target.value })}
              className={[inputClass, "overflow-hidden"].join(" ")}
            />
          </div>
          {onRemove ? (
            <div className="w-6 flex text-center bg-surface-raised rounded-full items-center justify-center">
              <button
                type="button"
                title="Rimuovi riga"
                aria-label="Rimuovi riga"
                onClick={onRemove}
                className="text-muted hover:text-danger transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-2 rounded"
              >
                <ClearIcon />
              </button>
            </div>
          ) : onAdd ? (
            <div className="w-6 flex text-center items-center rounded-full bg-surface-raised justify-center">
              <button
                type="button"
                title="Aggiungi nuova riga"
                aria-label="Aggiungi nuova riga"
                onClick={onAdd}
                className="text-muted hover:text-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded"
              >
                <AddIcon />
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
