import type { ReactNode } from "react";

interface DayViewProps {
  cursor: Date;
  renderCell: (date: Date) => ReactNode;
}

export default function DayView({ cursor, renderCell }: DayViewProps) {
  return (
    <div className="text-center font-semibold text-primary py-1 whitespace-nowrap overflow-hidden">
      {renderCell(cursor)}
    </div>
  );
}
