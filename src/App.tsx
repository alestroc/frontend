import LoginPage from "./components/Login";
import "./App.css";
import { useEffect, useState } from "react";
import Calendar from "./components/calendar/Calendar";
import Sidebar from "./components/Sidebar";
import type { AppSettings, TimeEntry } from "./types";
import { checkIsLogged, deleteLocalStorageData } from "./functions/functions";
import { getEntries } from "./functions/entries";
import { getSettings } from "./functions/settings";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState("");
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const sideBarButton = [
    "Aggiungi attività",
    "Mensile",
    "Settimanale",
    "Giornata",
    "Statistiche",
    "Scarica Report",
    "Logout",
  ];

  useEffect(() => {
    const init = async () => {
      const loggedIn = await checkIsLogged();
      if (!loggedIn) {
        setError("Effettuare il login");
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

  function handleSidebar(e) {
    const buttonValue = e.currentTarget.textContent;
    if (
      buttonValue === "Mensile" ||
      buttonValue === "Settimanale" ||
      buttonValue === "Giornata"
    ) {
      setSelected(buttonValue);
    }

    switch (buttonValue) {
      case "Aggiungi attività":
        //CREA E CAMBIA STATO PER MOSTRARE MODALE DI INSERIMENTO
        break;
      case "Mensile":
        console.log("visione mensile");
        break;
      case "Settimanale":
        console.log("visione settimanale");

        break;
      case "Giornata":
        console.log("visione giornaliera");

        break;
      case "Logout":
        deleteLocalStorageData();
        setIsLogged(false);
        break;

      default:
      // console.log("handlesidebar");
    }
  }

  if (isLoading) return <div>Caricamento...</div>;

  return (
    <>
      {!isLogged ? (
        <LoginPage isLogged={setIsLogged} />
      ) : (
        <div className="flex flex-row w-full h-full">
          <Sidebar>
            {/* sideBarButton */}
            <div className="flex flex-col p-2 gap-5 justify-start h-full mt-5">
              {sideBarButton.map((element) => {
                return (
                  <button
                    className={[
                      element == "Aggiungi attività"
                        ? sideBarButtonStyle.addAttivita
                        : element == "Logout"
                          ? sideBarButtonStyle.logout
                          : sideBarButtonStyle.default,
                      selected === element ? "bg-blue-500" : "",
                    ].join(" ")}
                    onClick={(event) => {
                      console.log(event.currentTarget.textContent);
                      handleSidebar(event);
                    }}
                  >
                    {element}
                  </button>
                );
              })}
            </div>
          </Sidebar>
          <Calendar entries={entries} settings={settings} />
        </div>
      )}
      {error && (
        <div className=" absolute top-2 right-2 justify-center w-15 h-15">
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

const sideBarButtonStyle = {
  default: "border-l rounded-md p-2 w-full ",
  addAttivita: " border-l rounded-md p-2 w-full ",
  logout: " border-l rounded-md p-2 w-full bg-red-500",
};
