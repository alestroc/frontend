import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import SortableItem from "./SortableItem";
import { useEffect, useState } from "react";
import type { ProcessedFavorite } from "../../types";
import { reorderFavorite } from "../../functions/favorites";

interface FavoritesProps {
  favorites: ProcessedFavorite[];
  reloadFavorites: () => void;
  autocompleteFavorite: (fav: ProcessedFavorite) => void;
}

export default function Favorites({
  favorites: initialFavorites,
  reloadFavorites,
  autocompleteFavorite,
}: FavoritesProps) {
  const [favorites, setFavorites] = useState<ProcessedFavorite[]>(() =>
    [...initialFavorites].sort((a, b) => a.order_no - b.order_no),
  );
  const [prevInitial, setPrevInitial] = useState(initialFavorites);
  if (initialFavorites !== prevInitial) {
    setPrevInitial(initialFavorites);
    setFavorites([...initialFavorites].sort((a, b) => a.order_no - b.order_no));
  }
  useEffect(() => {
    reorderFavorite(favorites);
  }, [favorites]);

  return (
    <DragDropProvider
      onDragEnd={(event) => {
        setFavorites((prev) => move(prev, event));
      }}
    >
      {favorites.map((fav, index) => (
        <SortableItem
          key={fav.id}
          id={fav.id}
          index={index}
          favorite={fav}
          reloadFavorites={reloadFavorites}
          autocompleteFavorite={autocompleteFavorite}
        />
      ))}
    </DragDropProvider>
  );
}
