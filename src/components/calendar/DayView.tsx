import type { ReactNode } from "react";

interface DayProp {
  cursor: Date;
  renderCell: (date: Date) => ReactNode;
}

export default function DayView({ cursor, renderCell }: DayProp) {
  return (
    <>
      <div className="flex-1 min-h-0">{renderCell(cursor)}</div>
    </>
  );
}
