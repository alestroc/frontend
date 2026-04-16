import type { ReactNode } from "react";
import { DAYS_OF_WEEK } from "./../../functions/config.ts";

interface Monthprop {
  cursor: Date;
  renderCell: (date: Date) => ReactNode;
}

export default function MonthView({ cursor, renderCell }: Monthprop) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // trasforma da 0 = Dom a 0 = Lun
  const startOffset = (firstDay.getDay() + 6) % 7;
  const monthCells: (Date | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from(
      { length: lastDay.getDate() },
      (_, i) => new Date(year, month, i + 1),
    ),
  ];
  while (monthCells.length % 7 !== 0) monthCells.push(null);

  return (
    <>
      <div
        className="flex-1 grid grid-cols-7 min-h-0"
        style={{
          gridTemplateRows: `auto repeat(${monthCells.length / 7}, 1fr)`,
        }}
      >
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold border border-gray-700 text-white py-1"
          >
            {d}
          </div>
        ))}
        {monthCells.map((date, i) =>
          date === null ? <div key={`empty-${i}`} /> : renderCell(date),
        )}
      </div>
    </>
  );
}
