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
import DownloadIcon from "@mui/icons-material/Download";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AddTaskIcon from "@mui/icons-material/AddTask";
import type { SvgIconComponent } from "@mui/icons-material";
import Modal from "./components/modal/Modal";
import { useNeededs } from "./hooks/useNeededs";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("Mensile");
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const { commesse, articoli, error: neededsError } = useNeededs();

  type SidebarItem = { label: string; Icon: SvgIconComponent };

  const sideBarItems: SidebarItem[] = [
    { label: "Registra Oggi", Icon: AddTaskIcon },
    { label: "Mensile", Icon: CalendarMonthIcon },
    { label: "Settimanale", Icon: CalendarViewWeekIcon },
    { label: "Giornata", Icon: CalendarTodayIcon },
    { label: "Statistiche", Icon: AssessmentIcon },
    { label: "Scarica Report", Icon: DownloadIcon },
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

  async function reloadEntries() {
    try {
      const apiEntries = await getEntries();
      setEntries(apiEntries);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore imprevisto.");
    }
  }

  function handleSidebar(buttonValue: string) {
    if (
      buttonValue === "Mensile" ||
      buttonValue === "Settimanale" ||
      buttonValue === "Giornata"
    ) {
      setView(buttonValue);
    }

    switch (buttonValue) {
      case "Registra Oggi":
        setSelectedDay(dateToKey(new Date()));
        setIsModalActive(true);
        break;
      case "Scarica Report":
        console.log("Bottone Scarica Report Premuto");
        break;
      case "Statistiche":
        console.log("Bottone Statistiche premuto.");
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
        <div className="flex flex-row bg-slate-900 w-full h-full overflow-auto">
          {isModalActive && (
            <Modal
              entries={entries}
              settings={settings}
              isModalActive={setIsModalActive}
              selectedDay={selectedDay}
              onSaved={reloadEntries}
              commesse={commesse}
              articoli={articoli}
              neededsError={neededsError}
            />
          )}
          <Sidebar
            setIsLogged={setIsLogged}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          >
            <div
              className={[
                "flex flex-col gap-5 justify-between mt-5",
                collapsed ? "p-1 items-center" : "p-2",
              ].join(" ")}
            >
              {sideBarItems.map(({ label, Icon }) => (
                <button
                  key={label}
                  title={label}
                  className={[
                    sideBarStyle.button.default,
                    label === sideBarItems[0].label
                      ? sideBarStyle.button.addAttivita
                      : "",
                    view === label ? "bg-blue-700" : "",
                    collapsed ? "flex items-center justify-center" : "",
                  ].join(" ")}
                  onClick={() => handleSidebar(label)}
                >
                  <Icon className={!collapsed ? sideBarStyle.icon : ""} />
                  {!collapsed && label}
                </button>
              ))}
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
        <div className="absolute top-4 right-4 z-50 min-w-64">
          <div className="p-4 rounded-lg border border-red-200 bg-red-50 shadow-lg">
            <p className="text-sm font-medium text-red-900">{error}</p>
          </div>
        </div>
      )}
    </>
  );
}

export default App;

const sideBarStyle = {
  button: {
    default:
      "flex items-center rounded-md px-3 py-2 w-full text-left text-slate-100 hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900",
    addAttivita: " bg-blue-600 hover:bg-blue-700 text-white font-medium ",
  },
  icon: "mr-2",
};
