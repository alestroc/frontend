import Calendar from "./calendar/Calendar";

export default function Modal({ entries, settings }) {
  return (
    <>
      <div className="flex flex-col z-99 absolute w-[80%] h-[80%] self-center mx-[10%] bg-gray-500 overflow-auto">
        <h2>Registra Nuova Attività</h2>
        <div className="flex justify-between h-50">
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
          <button>Annulla</button>
        </div>
      </div>
    </>
  );
}
const WIP = {
  border: "border",
};
