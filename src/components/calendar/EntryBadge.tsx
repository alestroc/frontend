export default function EntryBadge({ entry, view }) {
  function StringToNum(hour) {
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
      {StringToNum(entry.ore)}h - {entry.nomecommessa} - {entry.idarticolo} -{" "}
      {entry.nota}
    </div>
  );
}
const Styles = {
  default: "bg-blue-200 rounded text-black mb-1 px-1 truncate ",
  month: "text-xs min-h-4 font-semibold ",
  week: " text-sm min-h-6 max-h-10  font-semibold",
  day: "text-md rounded  bg-blue-200 font-semibold",
};
