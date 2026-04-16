import type { ReactNode } from "react";
import { DAYS_OF_WEEK } from "../../functions/config";
import { dateToKey, getWeekStart } from "../../functions/functions";

interface WeekProp {
  cursor: Date;
  renderCell: (date: Date) => ReactNode;
}

export default function WeekView({ cursor, renderCell }: WeekProp) {
  const weekStart = getWeekStart(cursor);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });
  return (
    <>
      <div
        className="flex-1 max-h-[50%] grid grid-cols-7 min-h-0"
        style={{ gridTemplateRows: "auto 1fr" }}
      >
        {weekDays.map((d) => (
          <div
            key={dateToKey(d)}
            className="text-center text-xs font-semibold text-white py-1"
          >
            {DAYS_OF_WEEK[(d.getDay() + 6) % 7]} {d.getDate()}
          </div>
        ))}
        {weekDays.map((d) => renderCell(d))}
      </div>
    </>
  );
}
