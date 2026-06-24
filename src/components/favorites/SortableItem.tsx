import { useSortable } from "@dnd-kit/react/sortable";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import type { Commessa, ProcessedFavorite } from "../../types";
import { removeFavorites } from "../../functions/favorites";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

interface SortableItemProps {
  id: number;
  index: number;
  favorite: ProcessedFavorite;
  commesse: Commessa[];
  reloadFavorites: () => void;
  autocompleteFavorite: (fav: ProcessedFavorite) => void;
}

export default function SortableItem({
  id,
  index,
  favorite,
  commesse,
  reloadFavorites,
  autocompleteFavorite,
}: SortableItemProps) {
  const { ref, handleRef, isDragging } = useSortable({ id, index });
  const [isButtonDisabled, setisButtonDisabled] = useState(false);

  // Lookup live del nome: quando `commesse` arriva dal backend,
  // questo si aggiorna automaticamente (vs il "?" cached in App.processedFavorites).
  const nomecommessa =
    commesse.find((c) => c.id === favorite.idcommessa)?.name ??
    favorite.nomecommessa;

  const handleDelete = async () => {
    try {
      await removeFavorites(id);
      await reloadFavorites();
    } catch (error) {
      console.error("Errore nella cancellazione:", error);
    } finally {
      setisButtonDisabled(false);
    }
  };

  return (
    <div
      ref={ref}
      className={[
        "flex items-center justify-start rounded-sm m-1 p-0.5 text-xs font-bold bg-blue-100 text-slate-900",
        isDragging ? "opacity-50" : "",
      ].join(" ")}
    >
      <p
        onClick={() => autocompleteFavorite(favorite)}
        className="flex-5 truncate text-start m-2 cursor-pointer"
      >
        {nomecommessa}
      </p>
      <p
        onClick={() => autocompleteFavorite(favorite)}
        className="flex-3 cursor-pointer"
      >
        {favorite.idarticolo}
      </p>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        className="w-5 shrink-0 hover:bg-red-100 rounded-full"
        disabled={isButtonDisabled}
        aria-label={`Elimina preferito ${nomecommessa}`}
        onClick={() => {
          setisButtonDisabled((prev) => !prev);
          handleDelete();
        }}
      >
        <DeleteIcon fontSize="small" aria-hidden="true" />
      </button>
      <span
        ref={handleRef}
        role="button"
        title="Trascina per riordinare"
        aria-label={`Riordina preferito ${nomecommessa}`}
        className={[
          "flex items-center justify-center px-1 text-slate-500 hover:text-slate-900 select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        ].join(" ")}
      >
        <DragIndicatorIcon fontSize="small" aria-hidden="true" />
      </span>
    </div>
  );
}
