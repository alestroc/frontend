import type { TimeEntry } from "../../types";

interface EntryBadgeProp {
  view: string;
  entry: TimeEntry;
}

//Componente che mostra le commesse nella casella del calendario
export default function EntryBadge({ entry, view }: EntryBadgeProp) {
  function StringToNum(hour: string) {
    const numFromString = Number(hour);
    return numFromString;
  }

  return (
    <div
      className={[
        Styles.default,
        view === "Mensile"
          ? Styles.month
          : view === "Settimanale"
            ? Styles.week
            : Styles.day,
      ].join(" ")}
      title={`${entry.nomecommessa} — ${StringToNum(entry.ore)}h`}
    >
      {StringToNum(entry.ore)}h - {entry.nomecommessa} - {entry.idarticolo} -
      {entry.nota}
    </div>
  );
}

const Styles = {
  default:
    "bg-blue-100 text-blue-900 border border-blue-200 rounded mb-1 px-1.5 truncate ",
  month: "text-xs min-h-4 font-medium ",
  week: "text-sm min-h-6 max-h-10 font-medium",
  day: "text-md rounded font-medium",
};
