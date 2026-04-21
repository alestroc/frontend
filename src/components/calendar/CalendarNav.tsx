interface CalendarNavProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export default function CalendarNav({
  label,
  onPrev,
  onNext,
  onToday,
}: CalendarNavProps) {
  return (
    <div className="shrink-0 flex items-center gap-2 mb-2">
      <button
        onClick={onPrev}
        className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-lg"
      >
        ‹
      </button>
      <span className="font-semibold text-lg text-center w-72">{label}</span>
      <button
        onClick={onNext}
        className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-lg"
      >
        ›
      </button>
      <button
        onClick={onToday}
        className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
      >
        Oggi
      </button>
    </div>
  );
}
