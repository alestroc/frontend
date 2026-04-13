import { useState } from "react";
import type { AppSettings, TimeEntry } from "../../types";
import EntryBadge from "./EntryBadge";

interface CalendarProps {
  entries: TimeEntry[];
  settings: AppSettings | null;
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

export default function Calendar({ entries, settings }: CalendarProps) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0=Gennaio  11=Dicembre

  // Dizionario per raggruppare le entries per giorni -- "YYYY-MM-DD"
  const entriesByDay = entries.reduce<Record<string, TimeEntry[]>>(
    (acc, entry) => {
      if (!acc[entry.giorno]) acc[entry.giorno] = [];
      acc[entry.giorno].push(entry);
      return acc;
    },
    {},
  );

  // dati per la creazione del calendario
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // ricavato da getSettings - giorni, rispetto a oggi, in cui è possibile timbrare
  const daysBefore = new Date();
  daysBefore.setDate(today.getDate() - 120);

  // trasforma da 0 = Dom a 0 = Lun
  const startOffset = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const cells: (number | null)[] = [
    //inserimento delle caselle vuote prima del 1° del mese
    ...Array(startOffset).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  // Inserimento delle caselle vuote dopo la fine del mese
  while (cells.length % 7 !== 0) cells.push(null);

  function prevMonth() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }

  function nextMonth() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }
  // WIP -- COMPONENTE : MODALE - API : /addTimeEntries
  function handleDayClick(day: number) {
    console.log("Giorno selezionato:", toDayKey(day));
  }
  //ritorna il formato YYYY-MM-DD dato un giorno (YYYY-MM si basano su quale mese e anno stiamo attualmente visualizzando sul calendario)
  function toDayKey(day: number): string {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div className="flex flex-col w-full h-full select-none">
      <div className="shrink-0 flex items-center gap-2 mb-2">
        <button
          onClick={prevMonth}
          className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-lg"
        >
          ‹
        </button>
        <span className="font-semibold text-lg text-center w-40">
          {MONTHS[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-lg"
        >
          ›
        </button>
        <button
          onClick={() => {
            setYear(today.getFullYear());
            setMonth(today.getMonth());
          }}
          className="px-3 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-sm"
        >
          Oggi
        </button>
      </div>

      <div
        className="flex-1 grid grid-cols-7 min-h-0"
        style={{ gridTemplateRows: `auto repeat(${cells.length / 7}, 1fr)` }}
      >
        {/* Intestazione giorni */}
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-gray-500 py-1"
          >
            {d}
          </div>
        ))}

        {/* Celle */}
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;

          const key = toDayKey(day);
          const dayEntries = entriesByDay[key] ?? [];
          const isToday = key === todayKey;
          const dayFormatDate = new Date(year, month, day);
          // i % 7: 0=Lun … 5=Sab, 6=Dom
          const colIndex = i % 7;
          const isSaturday = colIndex === 5;
          const isSunday = colIndex === 6;
          const isDisabled =
            dayFormatDate < daysBefore ||
            dayFormatDate > today ||
            (isSaturday && !settings?.allowSaturday) ||
            (isSunday && !settings?.allowSunday);

          const totalHours = dayEntries.reduce(
            (sum, e) => sum + Number(e.ore),
            0,
          );

          return (
            <div
              key={key}
              onClick={() => !isDisabled && handleDayClick(day)}
              style={{ display: "grid", gridTemplateRows: "auto 1fr auto" }}
              className={[
                "p-1 border transition overflow-hidden",
                isDisabled
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer hover:border-orange-500",
                isToday
                  ? "bg-orange-500 hover:bg-orange-500"
                  : "border-gray-200 dark:border-gray-700",
              ].join(" ")}
            >
              {/* numero del giorno */}
              <div
                className={[
                  "text-xs font-semibold",
                  isToday
                    ? "text-orange-600"
                    : "text-gray-700 dark:text-gray-300",
                ].join(" ")}
              >
                {day}
              </div>

              {/* entries registrate */}
              <div className="overflow-y-auto">
                {dayEntries.map((entry) => (
                  <EntryBadge key={entry.idcommessa + entry.idarticolo} entry={entry} />
                ))}
              </div>
              {/* mostra il badge delle ore registrate in quel giorno, se presenti */}
              {totalHours != 0 && (
                <div
                  className={[
                    "border-t w-100 text-center border-gray-200 dark:border-gray-600 text-xs font-semibold text-black dark:text-gray-300",
                    totalHours == 8 ? "bg-green-500" : "bg-red-500",
                  ].join(" ")}
                >
                  {totalHours}h
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
