interface CalendarNavProps {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

const navBtn =
  "px-3 py-1 rounded-md text-slate-200 hover:bg-slate-800 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900";

export default function CalendarNav({
  label,
  onPrev,
  onNext,
  onToday,
}: CalendarNavProps) {
  return (
    <div className="shrink-0 flex items-center gap-2 mb-2">
      <button onClick={onPrev} className={`${navBtn} text-lg`}>
        ‹
      </button>
      <span className="font-semibold text-lg text-center w-72 text-slate-100">
        {label}
      </span>
      <button onClick={onNext} className={`${navBtn} text-lg`}>
        ›
      </button>
      <button onClick={onToday} className={`${navBtn} text-sm`}>
        Oggi
      </button>
    </div>
  );
}
