import LoginPage from "./components/Login";
import "./App.css";
import { useEffect, useState } from "react";
import Calendar from "./components/calendar/Calendar";
import Sidebar from "./components/Sidebar";
import type { AppSettings, TimeEntry } from "./types";
import { checkIsLogged } from "./functions";
import { getEntries } from "./api/entries";
import { getSettings } from "./api/settings";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const loggedIn = await checkIsLogged();
      if (!loggedIn) {
        setError("Token Scaduto.");
        setTimeout(() => {
          setError(null);
        }, 1500);
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

  if (isLoading) return <div>Caricamento...</div>;

  return (
    <>
      {!isLogged ? (
        <LoginPage isLogged={setIsLogged} />
      ) : (
        <div className="flex flex-row w-full h-full">
          <Sidebar>
            <div className="flex flex-col gap-1 p-2">
              <button>Mensile</button>
              <button>Settimanale</button>
              <button>Giornata</button>
            </div>
          </Sidebar>
          <Calendar entries={entries} settings={settings} />
        </div>
      )}
      {error && (
        <div className=" absolute top-2 right-2 justify-center w-15 h-15">
          <div className="flex flex-col">
            {" "}
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
