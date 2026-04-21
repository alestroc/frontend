import { useEffect, useState } from "react";
import type { Articolo, Commessa } from "../types";
import { getNeededs } from "../functions/neededs";

export function useNeededs() {
  const [commesse, setCommesse] = useState<Commessa[]>([]);
  const [articoli, setArticoli] = useState<Articolo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getNeededs()
      .then(({ commesse, articoli }) => {
        setCommesse(commesse);
        setArticoli(articoli);
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : "Errore nel caricamento.");
      });
  }, []);

  return { commesse, articoli, error };
}
