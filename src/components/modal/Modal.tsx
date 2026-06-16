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
  // true → x commesse per singolo giorno
  // false → x giorni per commessa singola
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
    setIsSingleDayMode,
    isSingleDayMode,
  };

  return (
    <>
      <div className="flex flex-col gap-3 align-middle z-99 absolute w-[60%] h-[90%] self-center mx-[25%] bg-surface rounded-lg shadow-2xl overflow-auto ">
        {isSingleDayMode ? (
          <SingleDayForm {...sharedProps} initialSelectedDay={selectedDay} />
        ) : (
          <MultiDayForm {...sharedProps} />
        )}
      </div>
      <div className=" bg-slate-600 opacity-50 w-full h-full absolute z-9"></div>
    </>
  );
}

export default Modal;
