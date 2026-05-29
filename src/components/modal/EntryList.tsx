import type { ProcessedFavorite, TimeEntry } from "../../types";
import StarIcon from "@mui/icons-material/Star";

interface EntryListProps {
  entries: TimeEntry[];
  favorites: ProcessedFavorite[];
  onInsertFavorite: (entry: TimeEntry) => void;
  onRemoveFavorite: (favoriteId: number) => void;
}
// Visualizza le entries/commesse già salvate in quel giorno.
// Mostra la stella gialla se la commessa+articolo è già nei preferiti.
export default function EntryList({
  entries,
  favorites,
  onInsertFavorite,
  onRemoveFavorite,
}: EntryListProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-700">
        Nessuna attività registrata per questo giorno.
      </p>
    );
  }

  return (
    <>
      {entries.map((entry, i) => {
        const existingFavorite = favorites.find(
          (f) =>
            f.idcommessa === entry.idcommessa &&
            f.idarticolo === entry.idarticolo,
        );
        const isFavorite = !!existingFavorite;
        return (
          <div
            key={i}
            className="flex items-center align-center justify-between gap-2 bg-white rounded border  border-gray-300"
          >
            <div className="flex flex-row justify-between w-full p-2 text-sm text-black truncate">
              <span className="flex-4 font-semibold truncate">
                {entry.nomecommessa}
              </span>
              <span className="flex-2 text-xs text-gray-600 mx-5">
                {entry.idarticolo} · {entry.ore}h
              </span>
              <span className="flex-4 text-xs text-gray-500 italic">
                {entry.nota}
              </span>
            </div>
            <button
              type="button"
              aria-label={
                isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"
              }
              title={
                isFavorite ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"
              }
              className={[
                "text-xs font-semibold shrink-0 m-2 transition-colors",
                isFavorite
                  ? "text-yellow-400 hover:text-red-500"
                  : "text-slate-300 hover:text-yellow-400",
              ].join(" ")}
              onClick={() =>
                isFavorite
                  ? onRemoveFavorite(existingFavorite.id)
                  : onInsertFavorite(entry)
              }
            >
              <StarIcon />
            </button>
          </div>
        );
      })}
    </>
  );
}
