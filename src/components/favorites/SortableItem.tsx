import { useSortable } from "@dnd-kit/react/sortable";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import type { ProcessedFavorite } from "../../types";
import { removeFavorites } from "../../functions/favorites";
import DeleteIcon from "@mui/icons-material/Delete";

interface SortableItemProps {
  id: number;
  index: number;
  favorite: ProcessedFavorite;
  reloadFavorites: () => void;
}

export default function SortableItem({
  id,
  index,
  favorite,
  reloadFavorites,
}: SortableItemProps) {
  const { ref, handleRef, isDragging } = useSortable({ id, index });

  return (
    <div
      ref={ref}
      onClick={() => {
        console.log("premuto " + favorite.nomecommessa);
      }}
      className={[
        "flex items-center justify-between rounded-sm m-1 p-1 text-xs font-bold bg-blue-200 text-slate-900",
        isDragging ? "opacity-50" : "",
      ].join(" ")}
    >
      <p className="flex-5 truncate self-center">{favorite.nomecommessa}</p>
      <p className="flex-3">{favorite.idarticolo}</p>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        className="w-5 shrink-0 hover:bg-red-100 rounded-full"
        onClick={() => {
          removeFavorites(id);
          setTimeout(() => {
            reloadFavorites();
          }, 250);
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
