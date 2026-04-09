import LoginPage from "./components/Login";
import "./App.css";
import { useEffect, useState } from "react";
import Calendar from "./components/calendar/Calendar";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  async function getSettings() {
    const response = await fetch("http://studium.backend/api/getSettings", {
      method: "GET",
    });
    console.log(response);
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
      return false;
    }
  }

  useEffect(() => {
    //questa funzione viene lanciata una volta quando la pagina viene caricata per la prima volta
    const performCheck = async () => {
      const result = await checkLogged();
      setIsLogged(result);
      setIsLoading(false);
    };
    performCheck();
    getSettings();
  }, []);

  //DA FINIRE

  //
  async function getEntries() {
    const localData = getLocalStorageData();

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
  }

  if (isLoading) return <div>Caricamento...</div>;

  return (
    <>
      {!isLogged ? (
        <LoginPage isLogged={setIsLogged} />
      ) : (
        <Calendar entries={[]} />
      )}
    </>
  );
}

export default App;
