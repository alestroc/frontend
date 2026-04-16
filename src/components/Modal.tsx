import type { AppSettings, TimeEntry } from "../types";
import Calendar from "./calendar/Calendar";

interface ModalProp {
  entries: TimeEntry[];
  settings: AppSettings | null;
  isModalActive: React.Dispatch<React.SetStateAction<boolean>>;
}

function Modal({ entries, settings, isModalActive }: ModalProp) {
  return (
    <>
      <div className="flex flex-col z-99 absolute w-[80%] h-[80%] self-center mx-[10%] bg-slate-400 overflow-auto">
        <h2>Registra Nuova Attività</h2>
        <div className="flex justify-between h-60">
          <div className={["flex-1", WIP.border].join(" ")}>
            <Calendar entries={entries} settings={settings} view={"Mensile"} />
          </div>
          <div className={["flex-1", WIP.border].join(" ")}>
            SEZIONE PREFERITI
          </div>
        </div>
        <div className={WIP.border}>FORM DI INSERIMENTO</div>
        <div className={WIP.border}>VISUALIZZAZIONE TASK GIA SALVATE</div>
        <div className="w-10 h-10">
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
