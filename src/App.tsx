import LoginPage from "./components/Login";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Calendar from "./components/calendar/Calendar";
import Sidebar from "./components/Sidebar";
import type { ApiSettings, Favorite, TimeEntry } from "./types";
import type { ProcessedFavorite } from "./types";
import {
  checkIsLogged,
  deleteLocalStorageData,
  dateToKey,
} from "./functions/functions";
import { getEntries } from "./functions/entries";
import { getSettings } from "./functions/settings";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AddTaskIcon from "@mui/icons-material/AddTask";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import type { SvgIconComponent } from "@mui/icons-material";
import Modal from "./components/modal/Modal";
import Statistics from "./components/statistics/Statistics";
import { useNeededs } from "./hooks/useNeededs";
import { getFavorites } from "./functions/favorites";
import { LOGIN_HINT_TTL_MS, TOAST_TTL_MS } from "./config";
import { readLocalData } from "./storage/localData";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [currentPage, setCurrentPage] = useState("calendar");
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState("Mensile");
  const [settings, setSettings] = useState<ApiSettings | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalActive, setIsModalActive] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState(false);
  // i favorites che arrivano dal backend non hanno nomecommessa e idarticolo
  // ProcessedFavorites è il preferito con il nome commessa per la visualizzazione UI
  const [rawFavorites, setRawFavorites] = useState<Favorite[]>([]);

  // Timer per estinguere il toast
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showError = useCallback((message: string, ttl = TOAST_TTL_MS) => {
    setError(message);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => {
      setError(null);
      errorTimerRef.current = null;
    }, ttl);
  }, []);

  function dismissError() {
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = null;
    setError(null);
  }
  // funzione che chiama le API per ricevere commesse e articoli
  const { commesse, articoli } = useNeededs(isLogged, showError);

  type SidebarItem = { label: string; Icon: SvgIconComponent };

  const sideBarItems: SidebarItem[] =
    currentPage === "stats"
      ? [
          { label: "Calendario", Icon: CalendarMonthIcon },
          { label: "Statistiche", Icon: AssessmentIcon },
        ]
      : [
          { label: "Aggiungi Attività", Icon: AddTaskIcon },
          { label: "Statistiche", Icon: AssessmentIcon },
        ];

  useEffect(() => {
    const init = async () => {
      const hasPrevSession = readLocalData() !== null;
      const loggedIn = await checkIsLogged();
      if (!loggedIn && hasPrevSession) {
        showError("Sessione scaduta.", LOGIN_HINT_TTL_MS);
      }
      setIsLogged(loggedIn);
      setIsLoading(false);
    };
    init();
  }, [showError]);

  useEffect(() => {
    if (!isLogged) return;
    const loadData = async () => {
      try {
        const [apiSettings, apiEntries, favorites] = await Promise.all([
          getSettings(),
          getEntries(),
          getFavorites(),
        ]);
        setSettings(apiSettings);
        setEntries(apiEntries);
        setRawFavorites(favorites);
      } catch (e) {
        showError(
          e instanceof Error
            ? e.message
            : "Errore imprevisto. Controlla la connessione",
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [isLogged, showError]);

  // valore che viene salvato in memoria per evitare che venga calcolato ad ogni re-render
  // se le dipendenze (rawFavorites,commesse) cambiano, la funzione viene rieseguita per salvare il valore
  const processedFavorites = useMemo<ProcessedFavorite[]>(() => {
    return rawFavorites.map((fav) => {
      const c = commesse.find((x) => x.id === fav.idcommessa);
      return {
        id: fav.id,
        idcommessa: fav.idcommessa,
        nomecommessa: c?.name ?? "?",
        idarticolo: fav.idarticolo,
        order_no: fav.order_no,
      };
    });
  }, [rawFavorites, commesse]);

  async function reloadEntries() {
    try {
      const apiEntries = await getEntries();
      setEntries(apiEntries);
    } catch (e) {
      showError(e instanceof Error ? e.message : "Errore imprevisto.");
    }
  }

  async function reloadFavorites() {
    try {
      const favorite = await getFavorites();
      setRawFavorites(favorite);
    } catch (e) {
      showError(e instanceof Error ? e.message : "Errore imprevisto.");
    }
  }

  function handleSidebar(buttonValue: string) {
    if (
      buttonValue === "Mensile" ||
      buttonValue === "Settimanale" ||
      buttonValue === "Giornata"
    ) {
      setView(buttonValue);
      setCurrentPage("calendar");
    }

    switch (buttonValue) {
      case "Aggiungi Attività":
        setSelectedDay(dateToKey(new Date()));
        setIsModalActive(true);
        break;
      case "Calendario":
        setCurrentPage("calendar");
        break;
      case "Statistiche":
        setCurrentPage("stats");
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
        <div className="flex flex-row bg-base w-full h-full justify-center align-center overflow-auto">
          {isModalActive && (
            <Modal
              entries={entries}
              settings={settings}
              isModalActive={setIsModalActive}
              selectedDay={selectedDay}
              onSaved={reloadEntries}
              commesse={commesse}
              articoli={articoli}
              favorites={processedFavorites}
              showError={showError}
              reloadFavorites={reloadFavorites}
            />
          )}
          <Sidebar
            setIsLogged={setIsLogged}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          >
            <div
              className={[
                "flex flex-col gap-1.75 justify-between mt-5",
                collapsed ? "p-1 items-center" : "p-2",
              ].join(" ")}
            >
              {sideBarItems.map(({ label, Icon }) => {
                return (
                  <button
                    key={label}
                    type="button"
                    aria-label={collapsed ? label : undefined}
                    title={collapsed ? label : undefined}
                    aria-current={"page"}
                    className={[
                      sideBarStyle.button.default,
                      collapsed ? "flex items-center justify-center" : "",
                    ].join(" ")}
                    onClick={() => handleSidebar(label)}
                  >
                    <Icon
                      aria-hidden="true"
                      className={!collapsed ? sideBarStyle.icon : ""}
                    />
                    {!collapsed && label}
                  </button>
                );
              })}
            </div>
          </Sidebar>
          <main className="flex-1 min-w-0 overflow-auto">
            {currentPage === "calendar" && (
              <Calendar
                entries={entries}
                settings={settings}
                view={view}
                onViewChange={setView}
                handleClickDay={(e) => {
                  setSelectedDay(e);
                  setIsModalActive(true);
                }}
              />
            )}
            {currentPage === "stats" && (
              <Statistics
                entries={entries}
                settings={settings}
                showError={showError}
              />
            )}
          </main>
        </div>
      )}
      {error && (
        <div
          role="alert"
          className="absolute top-4 right-4 z-50 min-w-64 flex items-start gap-2 p-4 rounded-lg border border-red-200 bg-red-50 shadow-lg"
        >
          <p className="flex-1 text-sm font-medium text-red-900">{error}</p>
          <button
            onClick={dismissError}
            aria-label="Chiudi"
            className="text-red-900 opacity-60 hover:opacity-100 leading-none"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}

export default App;

const sideBarStyle = {
  button: {
    default:
      "flex items-center rounded-md px-3 py-1 w-full text-sm text-left text-primary hover:bg-surface transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base",
    addAttivita: " bg-accent hover:bg-accent-hover text-white font-medium ",
  },
  icon: "mr-2",
};
