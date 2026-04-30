import { useSortable } from "@dnd-kit/react/sortable";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import type { ProcessedFavorite } from "../../types";
import { removeFavorites } from "../../functions/favorites";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";

interface SortableItemProps {
  id: number;
  index: number;
  favorite: ProcessedFavorite;
  reloadFavorites: () => void;
  autocompleteFavorite: (fav: ProcessedFavorite) => void;
}

export default function SortableItem({
  id,
  index,
  favorite,
  reloadFavorites,
  autocompleteFavorite,
}: SortableItemProps) {
  const { ref, handleRef, isDragging } = useSortable({ id, index });
  const [isButtonDisabled, setisButtonDisabled] = useState(false);

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
        "flex items-center justify-between rounded-sm m-1 p-1 text-xs font-bold bg-blue-200 text-slate-900",
        isDragging ? "opacity-50" : "",
      ].join(" ")}
    >
      {/* <div className="flex" > */}
      <p
        onClick={() => autocompleteFavorite(favorite)}
        className="flex-5 truncate self-center m-2 cursor-pointer"
      >
        {favorite.nomecommessa}
      </p>
      <p
        onClick={() => autocompleteFavorite(favorite)}
        className="flex-3 cursor-pointer"
      >
        {favorite.idarticolo}
      </p>
      {/* </div> */}
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        className="w-5 shrink-0 hover:bg-red-100 rounded-full"
        disabled={isButtonDisabled}
        onClick={() => {
          setisButtonDisabled((prev) => !prev);
          handleDelete();
        }}
      >
        <DeleteIcon fontSize="small" />
      </button>
      <span
        ref={handleRef}
        title="Trascina per riordinare"
        className={[
          "flex items-center justify-center px-1 text-slate-500 hover:text-slate-900 select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        ].join(" ")}
      >
        <DragIndicatorIcon fontSize="small" />
      </span>
    </div>
  );
}
