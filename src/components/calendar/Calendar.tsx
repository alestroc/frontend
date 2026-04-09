import { useState } from "react";

export interface TimeEntry {
  giorno: string; // "YYYY-MM-DD"
  idcommessa: string;
  nomecommessa: string;
  idarticolo: string;
  nomearticolo: string;
  ore: number;
  nota: string;
}

interface CalendarProps {
  entries: TimeEntry[];
}

const DAYS_OF_WEEK = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
const MONTHS = [
  "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
  "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
];

export default function Calendar({ entries }: CalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-based

  // Group entries by day string "YYYY-MM-DD"
  const entriesByDay = entries.reduce<Record<string, TimeEntry[]>>((acc, entry) => {
    if (!acc[entry.giorno]) acc[entry.giorno] = [];
    acc[entry.giorno].push(entry);
    return acc;
  }, {});

  // Build the grid: Monday-first week
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // 0=Sun…6=Sat → convert to 0=Mon…6=Sun
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function handleDayClick(day: number) {
    const date = new Date(year, month, day);
    console.log("Giorno selezionato:", date.toISOString().slice(0, 10));
  }

  function toDayKey(day: number): string {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="w-full max-w-2xl mx-auto select-none">
      {/* Header navigazione */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-lg"
        >
          ‹
        </button>
        <span className="font-semibold text-lg">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-lg"
        >
          ›
        </button>
      </div>

      {/* Griglia */}
      <div className="grid grid-cols-7 gap-1">
        {/* Intestazione giorni */}
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-500 py-1">
            {d}
          </div>
        ))}

        {/* Celle */}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;

          const key = toDayKey(day);
          const dayEntries = entriesByDay[key] ?? [];
          const isToday = key === todayKey;

          return (
            <div
              key={key}
              onClick={() => handleDayClick(day)}
              className={[
                "min-h-16 p-1 rounded-md border cursor-pointer transition",
                "hover:border-orange-400",
                isToday
                  ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                  : "border-gray-200 dark:border-gray-700",
              ].join(" ")}
            >
              <div className={[
                "text-xs font-semibold mb-1",
                isToday ? "text-orange-600" : "text-gray-700 dark:text-gray-300",
              ].join(" ")}>
                {day}
              </div>
              {dayEntries.map((entry, j) => (
                <div
                  key={j}
                  className="text-xs truncate rounded px-1 bg-orange-100 dark:bg-orange-800/40 text-orange-800 dark:text-orange-200 mb-0.5"
                  title={`${entry.nomecommessa} — ${entry.ore}h`}
                >
                  {entry.ore}h {entry.nomecommessa}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
