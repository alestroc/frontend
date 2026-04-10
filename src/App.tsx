import LoginPage from "./components/Login";
import "./App.css";
import { useEffect, useState } from "react";
import Calendar from "./components/calendar/Calendar";
import type { AppSettings, TimeEntry } from "./types";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [entries, setEntries] = useState<TimeEntry[]>([]);

  async function getSettings(): Promise<AppSettings> {
    const response = await fetch("http://studium.backend/api/getSettings");
    const text = await response.text();
    const json = text.replace(/^window\.appsettings=/, "").replace(/;$/, "");
    return JSON.parse(json) as AppSettings;
  }

  function getLocalStorageData() {
    const isDataSaved = localStorage.getItem("dati");
    //Controllo se ho dati salvati
    if (!isDataSaved) {
      console.log("uscito con errore nella lettura di localstorage");
      return false;
    }
    //ritorno i valori da LocalStorage
    return JSON.parse(isDataSaved);
  }

  async function checkLogged() {
    //controllo se ho valori salvati in LocalStorage
    const localData = getLocalStorageData();
    if (!localData) {
      console.log("non ho nulla nel localstorage");
      return false;
    }
    //faccio una chiamata API per vedere se il token è ancora valido
    const response = await fetch("http://studium.backend/api/getNeededs", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + localData.token,
        "Content-type": "Application/json",
      },
      body: JSON.stringify({
        user: localData.user,
        localid: localData.localid,
      }),
    });

    const data = await response.json();
    //controllo la risposta
    if (data.result === true) {
      return true;
    } else {
      console.log("Token non più valido.");
      return false;
    }
  }

  //
  async function getEntries() {
    const localData = getLocalStorageData();
    try {
      const response = await fetch(
        "http://studium.backend/api/getTimeEntries",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer " + localData.token,
            "Content-type": "Application/json",
          },
          body: JSON.stringify({
            user: localData.user,
            localid: localData.localid,
            from: 1104534000,
            to: 3944678400,
          }),
        },
      );
      const data = await response.json();

      //controllo la risposta
      if (data.result == false) {
        throw new Error("errore nella chiamata Entries");
      }

      const body = data.data;
      const tempArray: TimeEntry[] = [
        {
          giorno: "", // "YYYY-MM-DD"
          idcommessa: "",
          nomecommessa: "",
          idarticolo: "",
          nomearticolo: "",
          ore: 0,
          nota: "",
        },
      ];

      if (body.length > 0) {
        for (let i = 0; i < body.length; i++) {
          const responseObj: TimeEntry = {
            giorno: body[i].giorno, // "YYYY-MM-DD"
            idcommessa: body[i].idcommessa,
            nomecommessa: body[i].nomecommessa,
            idarticolo: body[i].idarticolo,
            nomearticolo: body[i].nomearticolo,
            ore: body[i].ore,
            nota: body[i].nota,
          };
          tempArray.push(responseObj);
        }
        return tempArray;
      } else {
        return [];
      }
    } catch {
      console.log("errore nella chiamata API getEntries");
      return [];
    }
  }

  useEffect(() => {
    //questa funzione viene lanciata una volta quando la pagina viene caricata per la prima volta
    const performCheck = async () => {
      const [result, appSettings, apiEntriees] = await Promise.all([
        checkLogged(),
        getSettings(),
        getEntries(),
      ]);
      setIsLogged(result);
      setSettings(appSettings);
      setIsLoading(false);
      setEntries(apiEntriees ?? []);
    };
    performCheck();
  }, []);

  if (isLoading) return <div>Caricamento...</div>;

  return (
    <>
      {!isLogged ? (
        <LoginPage isLogged={setIsLogged} />
      ) : (
        <Calendar entries={entries} settings={settings} />
      )}
    </>
  );
}

export default App;
