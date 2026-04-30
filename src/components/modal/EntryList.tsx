import type { TimeEntry } from "../../types";
import StarIcon from "@mui/icons-material/Star";

interface EntryListProps {
  entries: TimeEntry[];
  onInsertFavorite: (entry: TimeEntry) => void;
}
// Visualizza le entries già salvate in quel giorno.
export default function EntryList({
  entries,
  onInsertFavorite,
}: EntryListProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        Nessuna attività registrata per questo giorno.
      </p>
    );
  }

  return (
    <>
      {entries.map((entry, i) => (
        <div
          key={i}
          className="flex items-center align-center justify-between gap-2 bg-white rounded border  border-gray-300"
        >
          <div className="flex flex-row justify-between w-full p-2 text-sm text-black truncate">
            <span className="flex-4 font-semibold truncate">
              {entry.nomecommessa}
            </span>
            <span className="flex-2 text-xs text-gray-600 mx-5 ">
              {entry.idarticolo} · {entry.ore}h
            </span>
            {entry.nota && (
              <span className="flex-4 text-xs text-gray-500 italic">
                {entry.nota}
              </span>
            )}
          </div>
          <button
            className="text-slate-300 hover:text-yellow-400 text-xs font-semibold shrink-0 m-2"
            onClick={() => onInsertFavorite(entry)}
          >
            <StarIcon />
          </button>
        </div>
      ))}
    </>
  );
}
