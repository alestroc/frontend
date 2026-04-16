import LoginPage from "./components/Login";
import "./App.css";
import { useEffect, useState } from "react";
import Calendar from "./components/calendar/Calendar";
import Sidebar from "./components/Sidebar";
import type { AppSettings, TimeEntry } from "./types";
import {
  checkIsLogged,
  deleteLocalStorageData,
  dateToKey,
} from "./functions/functions";
import { getEntries } from "./functions/entries";
import { getSettings } from "./functions/settings";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarViewWeekIcon from "@mui/icons-material/CalendarViewWeek";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Modal from "./components/Modal";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("Mensile");
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const sideBarButton = [
    "Aggiungi attività",
    "Mensile",
    "Settimanale",
    "Giornata",
    "Statistiche - WIP",
    "Scarica Report - WIP",
  ];

  useEffect(() => {
    const init = async () => {
      const loggedIn = await checkIsLogged();
      if (!loggedIn) {
        setError("Effettuare il login");
        setTimeout(() => {
          setError(null);
        }, 2000);
      }
      setIsLogged(loggedIn);
      setIsLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (!isLogged) return;
    const loadData = async () => {
      try {
        const [appSettings, apiEntries] = await Promise.all([
          getSettings(),
          getEntries(),
        ]);
        setSettings(appSettings);
        setEntries(apiEntries);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Errore imprevisto.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [isLogged]);

  function handleSidebar(e) {
    if (!e) {
      return false;
    }
    //Selezione del filtro sul calendario
    const buttonValue = e.currentTarget.textContent;
    if (
      buttonValue === "Mensile" ||
      buttonValue === "Settimanale" ||
      buttonValue === "Giornata"
    ) {
      setView(buttonValue);
    }

    switch (buttonValue) {
      case "Aggiungi attività":
        setSelectedDay(dateToKey(new Date()));
        setIsModalActive(true);
        break;
      case "Scarica Report - WIP":
        console.log("Bottone Cliccato Scarica Report Premuto");
        break;
      case "Logout":
        deleteLocalStorageData();
        setIsLogged(false);
        break;
    }
  }

  if (isLoading) return <div>Caricamento...</div>;

  return (
    <>
      {!isLogged ? (
        <LoginPage isLogged={setIsLogged} />
      ) : (
        <div className="flex flex-row bg-slate-800 w-full h-full overflow-auto">
          {isModalActive && (
            <Modal
              entries={entries}
              settings={settings}
              isModalActive={setIsModalActive}
              selectedDay={selectedDay}
            />
          )}
          <Sidebar setIsLogged={setIsLogged}>
            <div className="flex flex-col p-2 gap-5 justify-start mt-5">
              {sideBarButton.map((element) => {
                return (
                  <button
                    key={element}
                    className={[
                      sideBarStyle.button.default,
                      element == sideBarButton[0]
                        ? sideBarStyle.button.addAttivita
                        : "",
                      view === element ? "bg-blue-500" : "",
                    ].join(" ")}
                    onClick={(event) => {
                      handleSidebar(event);
                    }}
                  >
                    {element === "Mensile" ? (
                      <CalendarMonthIcon className={sideBarStyle.icon} />
                    ) : element === "Settimanale" ? (
                      <CalendarViewWeekIcon className={sideBarStyle.icon} />
                    ) : element === "Giornata" ? (
                      <CalendarTodayIcon className={sideBarStyle.icon} />
                    ) : (
                      ""
                    )}
                    {element}
                  </button>
                );
              })}
            </div>
          </Sidebar>
          <Calendar
            entries={entries}
            settings={settings}
            view={view}
            handleClickDay={(e) => {
              setSelectedDay(e);
              setIsModalActive(true);
            }}
          />
        </div>
      )}
      {error && (
        <div className=" absolute top-2 right-2 justify-center w-[20%] h-15">
          <div className="flex flex-col">
            <div className="text-center items-center p-6 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;

const sideBarStyle = {
  button: {
    default: "border-l rounded-md p-2 w-full hover:cursor-pointer",
    addAttivita: " bg-blue-500 ",
  },
  icon: "relative mr-2",
};
