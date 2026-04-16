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
  return (
    <>
      <div className="flex flex-col justify-between z-99 absolute w-[80%] h-[80%] self-center mx-[10%] bg-slate-400 overflow-auto">
        <h2>Registra Nuova Attività</h2>
        <h4>Giorno selezionato: {selectedDay ?? "nessuno"}</h4>
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
            SEZIONE PER LE CARD DEI PREFERITI/PRESET
          </div>
        </div>
        <div className={WIP.border}>
          FORM DI RACCOLTA DATI PER L'INSERIMENTO DI UNA ENTRIES
        </div>
        <div className={WIP.border}>VISUALIZZAZIONE TASK GIA SALVATE</div>
        <div className="flex w-10 h-10 self-center">
          <button>Conferma</button>
          <button
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
