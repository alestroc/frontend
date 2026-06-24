import type { ReactNode } from "react";
import { DAYS_OF_WEEK } from "../../functions/config";
import { dateToKey, getWeekStart } from "../../functions/functions";

interface WeekViewProps {
  cursor: Date;
  renderCell: (date: Date) => ReactNode;
  isModal?: boolean;
}

export default function WeekView({
  cursor,
  renderCell,
  isModal = false,
}: WeekViewProps) {
  const weekStart = getWeekStart(cursor);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });
  return (
    <div
      className={[
        "grid grid-cols-7 min-h-0",
        isModal ? "flex-1 max-h-[40%]" : "flex-1 min-h-105",
      ].join(" ")}
      style={{ gridTemplateRows: "auto 1fr" }}
    >
      {weekDays.map((d) => (
        <div
          key={dateToKey(d)}
          className={[
            "text-center font-semibold text-primary py-1 whitespace-nowrap overflow-hidden",
            isModal ? "text-[11px]" : "text-sm",
          ].join(" ")}
        >
          {DAYS_OF_WEEK[(d.getDay() + 6) % 7]}
          {!isModal && ` ${d.getDate()}`}
        </div>
      ))}
      {weekDays.map((d) => renderCell(d))}
    </div>
  );
}
