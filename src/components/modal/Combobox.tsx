import { useEffect, useMemo, useRef, useState } from "react";

const MAX_VISIBLE = 200;

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
  placeholder = "Cerca...",
  label,
}: ComboboxProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // chiude il dropdown quando si clicca fuori dal componente
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
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
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const visibleOptions = allOptions.slice(0, MAX_VISIBLE);
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
    <div ref={wrapperRef} className="relative flex flex-row w-full">
      {label && (
        <label className="block text-sm font-semibold mb-1 text-black">
          {label}
        </label>
      )}
      <input
        type="text"
        className="w-full rounded-md px-3 py-2 bg-white text-black border border-gray-300 focus:outline-none focus:border-orange-500"
        placeholder={placeholder}
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
          className="absolute flex flex-col z-10 mt-10 w-full max-h-48 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg"
        >
          {visibleOptions.length === 0 ? (
            <li className="px-3 py-2 text-sm text-gray-500">
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
                    "px-3 py-2 text-start text-sm text-black cursor-pointer",
                    i === highlightedIndex ? "bg-orange-100" : "",
                    option.id === value ? "font-semibold" : "",
                  ].join(" ")}
                >
                  {option.id} - {option.label}
                </li>
              ))}
              {hiddenCount > 0 && (
                <li className="px-3 py-2 text-xs text-gray-500 italic border-t border-gray-200">
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
