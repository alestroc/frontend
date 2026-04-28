import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import SortableItem from "./SortableItem";
import { useEffect, useState } from "react";
import type { ProcessedFavorite } from "../../types";

interface FavoritesProps {
  favorite: ProcessedFavorite[];
}

export default function Favorites({ favorite }: FavoritesProps) {
  // all'inizio ordiniamo per order_no (valore che arriva dal backend)
  // lazy initializer: lo spread evita di mutare la prop
  const [favorites, setFavorites] = useState(() =>
    [...favorite].sort((a, b) => a.order_no - b.order_no),
  );
  useEffect(() => {
    const updatedId = favorites.map((e) => e.id);
    console.log(updatedId);
  }, [favorites]);
  return (
    <DragDropProvider
      onDragEnd={(event) => {
        setFavorites((prev) => move(prev, event));
      }}
    >
      {favorites.map((fav, index) => (
        <SortableItem key={fav.id} id={fav.id} index={index} favorite={fav} />
      ))}
    </DragDropProvider>
  );
}
