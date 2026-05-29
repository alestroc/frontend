import ThemeToggle from "../ThemeToggle";

interface CalendarNavProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  view: string;
  onViewChange: (view: string) => void;
  isModal?: boolean;
}

const navBtn =
  "px-3 py-1 rounded-md text-primary hover:bg-surface hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base";

const VIEW_OPTIONS = ["Mensile", "Settimanale", "Giornata"];

export default function CalendarNav({
  label,
  onPrev,
  onNext,
  onToday,
  view,
  onViewChange,
  isModal = false,
}: CalendarNavProps) {
  return (
    <div className="shrink-0 flex items-center gap-2 mb-2">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Periodo precedente"
        className={`${navBtn} text-lg`}
      >
        <span aria-hidden="true" className="text-primary">
          ‹
        </span>
      </button>
      <span className="font-semibold text-md text-center w-72 truncate text-primary">
        {label}
      </span>
      <button
        type="button"
        onClick={onNext}
        aria-label="Periodo successivo"
        className={`${navBtn} text-lg`}
      >
        <span aria-hidden="true" className="text-primary">
          ›
        </span>
      </button>
      <button type="button" onClick={onToday} className={`${navBtn} text-sm`}>
        Oggi
      </button>

      {!isModal && (
        <div className=" flex justify-between w-full mx-5">
          <select
            aria-label="Vista calendario"
            value={view}
            onChange={(e) => onViewChange(e.target.value)}
            className="mx-2 px-2 py-1 rounded-full bg-surface text-primary border border-divider text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            {VIEW_OPTIONS.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
          <ThemeToggle />
        </div>
      )}
    </div>
  );
}
