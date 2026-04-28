import type { TimeEntry } from "../../types";
import EntryBadge from "./EntryBadge";

interface CalendarCellProps {
  date: Date;
  entries: TimeEntry[];
  isToday: boolean;
  isSelected: boolean;
  disabled: boolean;
  isModal: boolean;
  view: string;
  onClick: () => void;
}

export default function CalendarCell({
  date,
  entries,
  isToday,
  isSelected,
  disabled,
  isModal,
  view,
  onClick,
}: CalendarCellProps) {
  const totalHours = entries.reduce(
    (sum, element) => sum + Number(element.ore),
    0,
  );

  return (
    <div
      onClick={() => !disabled && onClick()}
      style={{ display: "grid", gridTemplateRows: "auto 1fr auto" }}
      className={[
        "p-1 border transition-colors overflow-hidden",
        disabled
          ? "opacity-40 cursor-not-allowed border-slate-700 bg-slate-800/60"
          : "cursor-pointer hover:border-blue-400",
        isToday
          ? "bg-blue-400 border-blue-600 hover:bg-blue-700"
          : !disabled
            ? "bg-slate-800 border-slate-700"
            : "",
        isSelected ? "ring-2 ring-blue-400 ring-inset" : "",
      ].join(" ")}
    >
      <div
        className={[
          "text-xs font-semibold mb-1",
          isToday ? "text-white" : "text-slate-100",
        ].join(" ")}
      >
        {date.getDate()}
      </div>
      {!isModal && (
        <>
          <div className="flex flex-col overflow-auto">
            {entries.map((entry, i) => (
              <EntryBadge key={i} entry={entry} view={view} />
            ))}
          </div>
          {totalHours !== 0 && (
            <div
              className={[
                "border-t text-center text-xs font-semibold",
                totalHours === 8
                  ? "bg-emerald-600 text-white border-emerald-700"
                  : "bg-red-400 text-slate-900 border-red-500",
              ].join(" ")}
            >
              {totalHours}h
            </div>
          )}
        </>
      )}
    </div>
  );
}
