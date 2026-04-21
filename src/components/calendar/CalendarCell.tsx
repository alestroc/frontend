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
        "p-1 border transition overflow-hidden ",
        disabled
          ? "opacity-40 cursor-not-allowed"
          : "cursor-pointer hover:border-orange-500",
        isToday
          ? "bg-[#4868a0] hover:bg-[#3d5989]"
          : "border-gray-200 dark:border-gray-700",
        isSelected ? "bg-red-500" : "",
      ].join(" ")}
    >
      <div
        className={[
          "text-xs font-semibold mb-1",
          isToday ? "text-black" : "text-white",
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
                "border-t text-center border-gray-200 dark:border-gray-600 text-xs font-semibold text-black dark:text-gray-300",
                totalHours === 8 ? "bg-green-500" : "bg-red-500",
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
