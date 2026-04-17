import { DeveloperBoardOffRounded } from "@mui/icons-material";
import { groupEntries } from "../functions/functions";
import type { AppSettings, TimeEntry } from "../types";
import Calendar from "./calendar/Calendar";
import { useState } from "react";

interface ModalProp {
  entries: TimeEntry[];
  settings: AppSettings | null;
  isModalActive: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDay?: string | null;
}

function Modal({
  entries,
  settings,
  isModalActive,
  selectedDay: initialDay = null,
}: ModalProp) {
  const [selectedDay, setSelectedDay] = useState<string | null>(initialDay);

  const entriesByDay = entries.reduce<Record<string, TimeEntry[]>>(
    (acc, entry) => {
      if (!acc[entry.giorno]) acc[entry.giorno] = [];
      acc[entry.giorno].push(entry);
      return acc;
    },
    {},
  );

  function renderEntries() {
    const dayEntries = selectedDay ? (entriesByDay[selectedDay] ?? []) : [];

    if (dayEntries.length === 0) {
      return (
        <p className="text-sm text-gray-500">
          Nessuna attività registrata per questo giorno.
        </p>
      );
    }

    return dayEntries.map((entry, i) => (
      <div
        key={i}
        className="flex items-center justify-between gap-2 p-2 bg-white rounded border border-gray-300"
      >
        <div className="flex flex-row text-sm text-black">
          <span className="font-semibold mx-5">{entry.nomecommessa}</span>
          <span className="text-xs text-gray-600 mx-5">
            {entry.nomearticolo} · {entry.ore}h
          </span>
          {entry.nota && (
            <span className="text-xs text-gray-500 italic mx-5">
              {entry.nota}
            </span>
          )}
        </div>
        <button
          className="text-red-500 hover:text-red-700 text-xs font-semibold shrink-0"
          onClick={() => {
            // TODO: eliminare entry
            console.log("elimina entry:", entry);
          }}
        >
          Elimina
        </button>
      </div>
    ));
  }
  return (
    <>
      <div className="flex flex-col justify-between z-99 absolute w-[80%] h-[80%] self-center mx-[10%] bg-slate-400 overflow-auto ">
        <h2>Registra Nuova Attività</h2>
        <h4 className="sticky botttom-0">
          Giorno selezionato: {selectedDay ?? "nessuno"}
        </h4>
        <div className="flex justify-between h-60">
          <div className={["flex-1", WIP.border].join(" ")}>
            <Calendar
              entries={entries}
              settings={settings}
              view={"Mensile"}
              isModal={true}
              selected={selectedDay}
              handleClickDay={(key) => setSelectedDay(key)}
            />
          </div>
          <div className={["flex-1", WIP.border].join(" ")}>
            SLAVATAGGIO PREFERITI/PRESET
          </div>
        </div>
        <div className={WIP.border}>
          creo uno stato che è un array di oggetti con la struttura che vuole
          l'api per inviare la richiesta e poi ci attacco l'array in coda alla
          richiesta API
        </div>
        <div className={[WIP.border, "flex flex-col gap-1 p-2"].join(" ")}>
          {renderEntries()}
        </div>
        <div className=" flex w-10 h-10 self-center ">
          <button className={WIP.border}>Conferma</button>
          <button
            className={WIP.border}
            onClick={() => {
              isModalActive(false);
            }}
          >
            Annulla
          </button>
        </div>
      </div>
    </>
  );
}
const WIP = {
  border: "border",
};

export default Modal;
