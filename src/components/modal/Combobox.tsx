import { useEffect, useMemo, useRef, useState } from "react";
import { COMBOBOX_MAX_VISIBLE } from "../../config";

export interface ComboboxOption {
  id: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value: string | null;
  onChange: (id: string | null) => void;
  placeholder?: string;
  label?: string;
}
export default function Combobox({
  options,
  value,
  onChange,
  label,
}: ComboboxProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputArea = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // chiude il dropdown quando si clicca fuori dal componente
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (inputArea.current && !inputArea.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((o) => o.id === value) ?? null;

  const allOptions = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase();
    return options.filter(
      (o) =>
        o.label.toLowerCase().includes(q) || o.id.toLowerCase().includes(q),
    );
  }, [options, query]);

  const visibleOptions = allOptions.slice(0, COMBOBOX_MAX_VISIBLE);
  const hiddenCount = allOptions.length - visibleOptions.length;

  // scrolla l'elemento evidenziato dentro la vista quando ci muoviamo con le frecce
  useEffect(() => {
    if (!isOpen || !listRef.current) return;
    const li = listRef.current.children[highlightedIndex] as
      | HTMLElement
      | undefined;
    li?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, isOpen]);

  // quando il dropdown è aperto mostriamo la query che l'utente sta digitando,
  // altrimenti mostriamo il label dell'opzione selezionata
  const displayValue = isOpen ? query : (selectedOption?.label ?? "");

  function selectOption(option: ComboboxOption) {
    onChange(option.id);
    setQuery("");
    setIsOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      setHighlightedIndex((i) => Math.min(i + 1, visibleOptions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!isOpen) return;
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (!isOpen || visibleOptions.length === 0) return;
      e.preventDefault();
      const option = visibleOptions[highlightedIndex];
      if (option) selectOption(option);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div ref={inputArea} className="relative flex flex-row w-full">
      {label && (
        <label className="block text-sm font-semibold mb-1 text-slate-700">
          {label}
        </label>
      )}
      <input
        type="text"
        className="w-full rounded-md px-3 py-2 bg-white text-slate-900 border border-slate-300 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
        placeholder="Cerca"
        value={displayValue}
        onFocus={() => {
          setQuery(selectedOption?.label ?? "");
          setIsOpen(true);
        }}
        onChange={(e) => {
          setQuery(e.target.value);
          setHighlightedIndex(0);
          setIsOpen(true);
          if (e.target.value === "") onChange(null);
        }}
        onKeyDown={handleKeyDown}
      />
      {isOpen && (
        <ul
          ref={listRef}
          className="absolute flex flex-col z-10 mt-10 w-full max-h-48 overflow-auto bg-white border border-slate-200 rounded-md shadow-lg"
        >
          {visibleOptions.length === 0 ? (
            <li className="px-3 py-2 text-sm text-slate-500">
              Nessun risultato
            </li>
          ) : (
            <>
              {visibleOptions.map((option, i) => (
                <li
                  key={option.id}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  className={[
                    "px-3 py-2 text-start text-sm cursor-pointer transition-colors",
                    i === highlightedIndex
                      ? "bg-blue-50 text-blue-900"
                      : "text-slate-900",
                    option.id === value ? "font-semibold" : "",
                  ].join(" ")}
                >
                  {option.id} - {option.label}
                </li>
              ))}
              {hiddenCount > 0 && (
                <li className="px-3 py-2 text-xs text-slate-500 italic border-t border-slate-200 bg-slate-50">
                  +{hiddenCount} altri risultati — digita per ricercare la
                  commessa desiderata
                </li>
              )}
            </>
          )}
        </ul>
      )}
    </div>
  );
}
