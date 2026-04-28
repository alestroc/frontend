import { useState } from "react";
import type { ApiSettings, TimeEntry } from "../../types";
import EntryBadge from "./EntryBadge";
import { dateToKey, getWeekStart } from "../../functions/functions";
import MonthView from "./MonthView";

interface CalendarProps {
  entries: TimeEntry[];
  settings: ApiSettings | null;
  view: string;
  selected?: Date | null;
}

const DAYS_OF_WEEK = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const MONTHS = [
  "Gennaio",
  "Febbraio",
  "Marzo",
  "Aprile",
  "Maggio",
  "Giugno",
  "Luglio",
  "Agosto",
  "Settembre",
  "Ottobre",
  "Novembre",
  "Dicembre",
];

export default function OldCalendar({
  entries,
  settings,
  view,
  // selected = new Date(),
}: CalendarProps) {
  const today = new Date();
  const [cursor, setCursor] = useState(today);

  //crea un dizionario raggruppando le entries in base al giorno
  const entriesByDay = entries.reduce<Record<string, TimeEntry[]>>(
    (acc, entry) => {
      if (!acc[entry.giorno]) acc[entry.giorno] = [];
      acc[entry.giorno].push(entry);
      return acc;
    },
    {},
  );

  const daysBefore = new Date(today);
  daysBefore.setDate(today.getDate() - (settings?.daysBefore ?? 0));

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

  function handleDayClick(key: string) {
    // setSelectedDay(key);
    console.log("Giorno selezionato:", key);
  }

  //funzione di creazione della casella
  function renderCell(date: Date) {
    const key = dateToKey(date);
    const dayEntries = entriesByDay[key] ?? [];
    const isToday = key === todayKey;
    const disabled = isDisabled(date);
    const totalHours = dayEntries.reduce(
      (sum, element) => sum + Number(element.ore),
      0,
    );

    return (
      <div
        key={key}
        onClick={() => !disabled && handleDayClick(key)}
        style={{ display: "grid", gridTemplateRows: "auto 1fr auto" }}
        className={[
          "p-1 border transition overflow-hidden ",
          disabled
            ? "opacity-40 cursor-not-allowed"
            : "cursor-pointer hover:border-orange-500",
          isToday
            ? "bg-[#4868a0] hover:bg-[#3d5989]"
            : "border-gray-200 dark:border-gray-700",
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
        <div className="flex flex-col overflow-auto">
          {dayEntries.map((entry, i) => (
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
      </div>
    );
  }

  // --- Navigazione ---
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

  // --- Dati per vista mensile ---

  // ---- Dati per vista settimanale ----
  const weekStart = getWeekStart(cursor);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  return (
    <div className="flex flex-col w-full h-full select-none p-2">
      {/* Header navigazione */}
      <div className="shrink-0 flex items-center gap-2 mb-2">
        <button
          onClick={prev}
          className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-lg"
        >
          ‹
        </button>
        <span className="font-semibold text-lg text-center w-72">
          {navLabel()}
        </span>
        <button
          onClick={next}
          className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-lg"
        >
          ›
        </button>
        <button
          onClick={() => setCursor(new Date(today))}
          className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
        >
          Oggi
        </button>
      </div>

      {/* Vista mensile */}
      {view === "Mensile" && (
        <MonthView cursor={cursor} renderCell={renderCell} />
      )}

      {/* Vista settimanale */}
      {view === "Settimanale" && (
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
      )}

      {/* Vista giornaliera */}
      {view === "Giornata" && (
        <div className="flex-1 min-h-0">{renderCell(cursor)}</div>
      )}
    </div>
  );
}
