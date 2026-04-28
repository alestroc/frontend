import { useEffect, useState } from "react";
import type { Articolo, Commessa } from "../types";
import { getNeededs } from "../functions/neededs";

export function useNeededs(isLogged: boolean) {
  const [commesse, setCommesse] = useState<Commessa[]>([]);
  const [articoli, setArticoli] = useState<Articolo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLogged) {
      return;
    }
    getNeededs()
      .then(({ commesse, articoli }) => {
        setCommesse(commesse);
        setArticoli(articoli);
        setError(null);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Errore nel caricamento.");
      });
  }, [isLogged]);

  return { commesse, articoli, error };
}
