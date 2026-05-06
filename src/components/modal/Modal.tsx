import { useState } from "react";
import type {
  ApiSettings,
  Articolo,
  Commessa,
  ProcessedFavorite,
  TimeEntry,
} from "../../types";
import SingleDayForm from "./SingleDayForm";
import MultiDayForm from "./MultiDayForm";

interface ModalProp {
  entries: TimeEntry[];
  settings: ApiSettings | null;
  isModalActive: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDay?: string | null;
  onSaved?: () => void;
  commesse: Commessa[];
  articoli: Articolo[];
  favorites: ProcessedFavorite[];
  showError?: (message: string) => void;
  reloadFavorites: () => void;
}

function Modal({
  entries,
  settings,
  isModalActive,
  selectedDay = null,
  onSaved,
  commesse,
  articoli,
  favorites,
  showError,
  reloadFavorites,
}: ModalProp) {
  // true → multi-mansione su singolo giorno
  // false → singola mansione su più giorni
  const [isSingleDayMode, setIsSingleDayMode] = useState(true);

  const onClose = () => isModalActive(false);

  const sharedProps = {
    entries,
    settings,
    commesse,
    articoli,
    favorites,
    reloadFavorites,
    onSaved,
    onClose,
    showError,
  };

  return (
    <div className="flex flex-col justify-between align-middle z-99 absolute w-[80%] h-[80%] self-center mx-[10%] bg-slate-700 rounded-lg shadow-2xl overflow-auto">
      <div className="flex justify-end px-4 pt-3">
        <button
          type="button"
          onClick={() => setIsSingleDayMode((prev) => !prev)}
          className="px-3 py-1.5 rounded-md border border-slate-300 bg-slate-500 text-sm font-medium text-white hover:bg-slate-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Cambia modalità
        </button>
      </div>

      {isSingleDayMode ? (
        <SingleDayForm {...sharedProps} initialSelectedDay={selectedDay} />
      ) : (
        <MultiDayForm {...sharedProps} />
      )}
    </div>
  );
}

export default Modal;
