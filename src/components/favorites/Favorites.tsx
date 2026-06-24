import { DragDropProvider } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import SortableItem from "./SortableItem";
import { useState } from "react";
import type { Commessa, ProcessedFavorite } from "../../types";
import { reorderFavorite } from "../../functions/favorites";

interface FavoritesProps {
  favorites: ProcessedFavorite[];
  commesse: Commessa[];
  reloadFavorites: () => void;
  autocompleteFavorite: (fav: ProcessedFavorite) => void;
}

export default function Favorites({
  favorites: initialFavorites,
  commesse,
  reloadFavorites,
  autocompleteFavorite,
}: FavoritesProps) {
  const [favorites, setFavorites] = useState<ProcessedFavorite[]>(() =>
    [...initialFavorites].sort((a, b) => a.order_no - b.order_no),
  );

  return (
    <DragDropProvider
      onDragEnd={async (event) => {
        const next = move(favorites, event);
        setFavorites(next);
        await reorderFavorite(next);
        reloadFavorites();
      }}
    >
      Preferiti
      {favorites.map((fav, index) => (
        <SortableItem
          key={fav.id}
          id={fav.id}
          index={index}
          favorite={fav}
          commesse={commesse}
          reloadFavorites={reloadFavorites}
          autocompleteFavorite={autocompleteFavorite}
        />
      ))}
    </DragDropProvider>
  );
}
