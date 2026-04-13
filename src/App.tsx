import LoginPage from "./components/Login";
import "./App.css";
import { useEffect, useState } from "react";
import Calendar from "./components/calendar/Calendar";
import type { AppSettings, TimeEntry } from "./types";
import { checkIsLogged } from "./functions";
import { getEntries, API_ERRORS } from "./api/entries";
import { getSettings } from "./api/settings";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performCheck = async () => {
      try {
        const [result, appSettings, apiEntries] = await Promise.all([
          checkIsLogged(),
          getSettings(),
          getEntries(),
        ]);
        setIsLogged(result);
        setSettings(appSettings);
        setEntries(apiEntries);
      } catch (e) {
        setError(e instanceof Error ? e.message : API_ERRORS.NETWORK);
      } finally {
        setIsLoading(false);
      }
    };
    performCheck();
  }, []);

  if (isLoading) return <div>Caricamento...</div>;

  if (error) return (
    <div className="flex items-center justify-center w-full h-full">
      <div className="text-center p-6 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
        <p className="text-sm font-semibold text-red-700 dark:text-red-400">{error}</p>
      </div>
    </div>
  );

  return (
    <>
      {!isLogged ? (
        <LoginPage isLogged={setIsLogged} />
      ) : (
        <>
          <div className="flex flex-row w-full h-full">
            {/* <Sidebar /> */}
            <div className="flex bg-red-500 w-[50%] h-full"></div>
            <Calendar entries={entries} settings={settings} />
          </div>
        </>
      )}
    </>
  );
}

export default App;
