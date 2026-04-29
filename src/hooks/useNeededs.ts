import { useEffect, useState } from "react";
import type { Articolo, Commessa } from "../types";
import { getNeededs } from "../functions/neededs";

export function useNeededs(
  isLogged: boolean,
  showError?: (message: string) => void,
) {
  const [commesse, setCommesse] = useState<Commessa[]>([]);
  const [articoli, setArticoli] = useState<Articolo[]>([]);

  useEffect(() => {
    if (!isLogged) {
      return;
    }
    getNeededs()
      .then(({ commesse, articoli }) => {
        setCommesse(commesse);
        setArticoli(articoli);
      })
      .catch((e: unknown) => {
        const msg =
          e instanceof Error
            ? e.message
            : "Errore nel caricamento di commesse e articoli.";
        showError?.(msg);
      });
  }, [isLogged, showError]);

  return { commesse, articoli };
}
