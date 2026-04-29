import { useState } from "react";
import type { ApiSettings, TimeEntry } from "../../types";
import { dateToKey, getWeekStart } from "../../functions/functions";
import { DAYS_OF_WEEK, MONTHS } from "../../functions/config";
import { DEFAULT_DAYS_BEFORE } from "../../config";
import { useEntriesByDay } from "../../hooks/useEntriesByDay";
import MonthView from "./MonthView";
import WeekView from "./WeekView";
import DayView from "./DayView";
import CalendarCell from "./CalendarCell";
import CalendarNav from "./CalendarNav";

interface CalendarProps {
  entries: TimeEntry[];
  settings: ApiSettings | null;
  view: string;
  selected?: string | null;
  isModal?: boolean;
  handleClickDay?: (key: string) => void;
}

export default function Calendar({
  entries,
  settings,
  view,
  isModal = false,
  handleClickDay,
  selected = null,
}: CalendarProps) {
  const today = new Date();
  const [cursor, setCursor] = useState(() => {
    if (selected) {
      const d = new Date(selected);
      if (!isNaN(d.getTime())) return d;
    }
    return today;
  });

  const entriesByDay = useEntriesByDay(entries);

  const daysBefore = new Date(today);
  daysBefore.setDate(today.getDate() - (settings?.daysBefore ?? DEFAULT_DAYS_BEFORE));

  const todayKey = dateToKey(today);
  const daysBeforeKey = dateToKey(daysBefore);

  function isDisabled(date: Date): boolean {
    const key = dateToKey(date);
    const col = (date.getDay() + 6) % 7; // 0=Lun … 6=Dom
    return (
      key < daysBeforeKey ||
      key > todayKey ||
      (col === 5 && !settings?.allowSaturday) ||
      (col === 6 && !settings?.allowSunday)
    );
  }

  function renderCell(date: Date) {
    const key = dateToKey(date);
    return (
      <CalendarCell
        key={key}
        date={date}
        entries={entriesByDay[key] ?? []}
        isToday={key === todayKey}
        isSelected={key === selected}
        disabled={isDisabled(date)}
        isModal={isModal}
        view={view}
        onClick={() => handleClickDay?.(key)}
      />
    );
  }

  function prev() {
    setCursor((d) => {
      const n = new Date(d);
      if (view === "Settimanale") n.setDate(n.getDate() - 7);
      else if (view === "Giornata") n.setDate(n.getDate() - 1);
      else n.setMonth(n.getMonth() - 1);
      return n;
    });
  }

  function next() {
    setCursor((d) => {
      const n = new Date(d);
      if (view === "Settimanale") n.setDate(n.getDate() + 7);
      else if (view === "Giornata") n.setDate(n.getDate() + 1);
      else n.setMonth(n.getMonth() + 1);
      return n;
    });
  }

  function navLabel(): string {
    if (view === "Settimanale") {
      const ws = getWeekStart(cursor);
      const we = new Date(ws);
      we.setDate(ws.getDate() + 6);
      if (ws.getMonth() === we.getMonth()) {
        return `${ws.getDate()} – ${we.getDate()} ${MONTHS[ws.getMonth()]} ${ws.getFullYear()}`;
      }
      return `${ws.getDate()} ${MONTHS[ws.getMonth()]} – ${we.getDate()} ${MONTHS[we.getMonth()]} ${we.getFullYear()}`;
    }
    if (view === "Giornata") {
      return `${DAYS_OF_WEEK[(cursor.getDay() + 6) % 7]} ${cursor.getDate()} ${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`;
    }
    return `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`;
  }

  return (
    <div className="flex flex-col w-full h-full select-none p-2">
      <CalendarNav
        label={navLabel()}
        onPrev={prev}
        onNext={next}
        onToday={() => setCursor(new Date(today))}
      />
      {view === "Mensile" && (
        <MonthView cursor={cursor} renderCell={renderCell} />
      )}
      {view === "Settimanale" && (
        <WeekView cursor={cursor} renderCell={renderCell} />
      )}
      {view === "Giornata" && (
        <DayView cursor={cursor} renderCell={renderCell} />
      )}
    </div>
  );
}
