import { useSortable } from "@dnd-kit/react/sortable";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import type { ProcessedFavorite } from "../../types";

interface SortableItemProps {
  id: number;
  index: number;
  favorite: ProcessedFavorite;
}

export default function SortableItem({
  id,
  index,
  favorite,
}: SortableItemProps) {
  const { ref, handleRef, isDragging } = useSortable({ id, index });

  return (
    <div
      ref={ref}
      className={[
        "flex items-center justify-between border rounded-sm m-1 p-1 text-xs font-bold bg-blue-200 text-slate-900",
        isDragging ? "opacity-50" : "",
      ].join(" ")}
    >
      <p className="flex-5 truncate self-center">{favorite.nomecommessa}</p>
      <p className="flex-3">{favorite.idarticolo}</p>
      <button
        type="button"
        onPointerDown={(e) => e.stopPropagation()}
        className="w-8 shrink-0  border hover:bg-red-100"
      >
        X
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
