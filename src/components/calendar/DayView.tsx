import type { ReactNode } from "react";

interface DayProp {
  cursor: Date;
  renderCell: (date: Date) => ReactNode;
}

export default function DayView({ cursor, renderCell }: DayProp) {
  return (
    <div className="text-center font-semibold text-primary py-1 whitespace-nowrap overflow-hidden">
      {renderCell(cursor)}
    </div>
  );
}
