import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { label: "Giorno",      icon: "▬" },
  { label: "Settimana",   icon: "⦀" },
  { label: "Mese",        icon: "📅" },
  { label: "Statistiche", icon: "📊" },
  { label: "Report",      icon: "📄" },
];

const DAYS = ["LUN", "MAR", "MER", "GIO", "VEN", "SAB", "DOM"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  // 0=Sun,1=Mon... → convert to Mon-based (0=Mon)
  return (new Date(year, month, 1).getDay() + 6) % 7;
}

const MONTH_NAMES = [
  "Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
  "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre",
];

export default function Dashboard() {
  const { auth } = useAuth();
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [activeNav, setActiveNav] = useState("Mese");

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  }

  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  }

  function goToday() {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Build grid: leading empty cells + day cells
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const isToday = (day: number) =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  return (
    <div className="flex h-screen w-full bg-[#f0f2f5] font-sans">

      {/* ── SIDEBAR ── */}
      <aside className="flex flex-col w-56 min-w-56 bg-white border-r border-gray-200 px-4 py-6 gap-6">

        {/* Logo */}
        <div className="text-[#1a2e6e] font-bold text-lg tracking-tight px-2">
          Studium Group
        </div>

        {/* Nuova Attività */}
        <button className="w-full py-2.5 rounded-xl bg-[#1a2e6e] text-white text-sm font-semibold hover:bg-[#162660] transition">
          Nuova Attività
        </button>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ label, icon }) => (
            <button
              key={label}
              onClick={() => setActiveNav(label)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition
                ${activeNav === label
                  ? "text-[#1a2e6e] border-l-4 border-[#1a2e6e] bg-blue-50"
                  : "text-gray-500 hover:bg-gray-100"}`}
            >
              <span className="text-base">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        {/* Sprint mensile */}
        <div className="mt-auto flex flex-col gap-3 px-2">
          <span className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
            Sprint Mensile
          </span>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-gray-500">Efficienza</span>
              <span className="text-[#1a2e6e]">92%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-200">
              <div className="h-2 rounded-full bg-[#1a2e6e]" style={{ width: "92%" }} />
            </div>
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-gray-500">Ore totali</span>
            <span className="text-[#1a2e6e]">164.5</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-200">
          <div className="w-32" /> {/* spacer */}

          <div className="flex items-center gap-3">
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition"
            >
              ‹
            </button>
            <h1 className="text-xl font-bold text-gray-800 min-w-48 text-center">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h1>
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition"
            >
              ›
            </button>
            <button
              onClick={goToday}
              className="px-4 py-1.5 rounded-full border-2 border-[#1a2e6e] text-[#1a2e6e] text-sm font-semibold hover:bg-blue-50 transition"
            >
              Oggi
            </button>
          </div>

          {/* Avatar */}
          <div className="w-32 flex justify-end">
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">
              {auth?.name?.charAt(0).toUpperCase() ?? "U"}
            </div>
          </div>
        </header>

        {/* Calendar */}
        <div className="flex-1 overflow-auto px-6 py-4">

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2 tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-xl overflow-hidden">
            {cells.map((day, idx) => (
              <div
                key={idx}
                className={`min-h-28 p-2 flex flex-col gap-1
                  ${day === null ? "bg-gray-50" : "bg-white"}
                  ${day && isToday(day) ? "ring-2 ring-inset ring-[#1a2e6e]" : ""}
                `}
              >
                {day !== null && (
                  <>
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-sm font-semibold
                          ${isToday(day) ? "text-[#1a2e6e]" : "text-gray-700"}`}
                      >
                        {day}
                        {isToday(day) && (
                          <span className="ml-1 text-[10px] font-bold uppercase text-[#1a2e6e]">
                            oggi
                          </span>
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
