import type { TimeEntry } from "../../types";

interface EntryBadgeProp {
  view: string;
  entry: TimeEntry;
}

export default function EntryBadge({ entry, view }: EntryBadgeProp) {
  const hours = Number(entry.ore);

  if (view === "Giornata") {
    return (
      <div
        className={[Styles.default, Styles.day].join(" ")}
        title={`${entry.nomecommessa} — ${hours}h`}
      >
        <div className="flex flex-row items-baseline gap-2 wrap-break-word whitespace-normal p-0.5">
          <span className="font-bold">{hours}h</span>
          <span className="font-semibold">{entry.nomecommessa}-</span>
          <span className="text-sm opacity-80">{entry.idarticolo} </span>
          {entry.nota && (
            <span className="text-sm italic opacity-90">- {entry.nota}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={[
        Styles.default,
        view === "Mensile" ? Styles.month : Styles.week,
      ].join(" ")}
      title={`${hours}h - ${entry.nomecommessa}`}
    >
      {hours}h - {entry.nomecommessa} - {entry.idarticolo} -{entry.nota}
    </div>
  );
}

const Styles = {
  default:
    "bg-blue-100 text-blue-900 border border-blue-200 rounded mb-1 px-1.5 ",
  month: "text-xs min-h-4 font-medium truncate",
  week: "text-sm min-h-6 font-medium whitespace-normal wrap-break-word",
  day: "text-md rounded font-medium whitespace-normal wrap-break-word",
};
