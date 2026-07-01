import type { ApiSettings, TimeEntry } from "../../types";
import EntryBadge from "./EntryBadge";

interface CalendarCellProps {
  date: Date;
  entries: TimeEntry[];
  isToday: boolean;
  isSelected: boolean;
  disabled: boolean;
  isModal: boolean;
  // true nel MultiDayForm: chiarisce nel tooltip che il click aggiunge/rimuove
  isMultiSelect?: boolean;
  view: string;
  onClick: () => void;
  settings: ApiSettings | null;
}

export default function CalendarCell({
  date,
  entries,
  isToday,
  isSelected,
  disabled,
  isModal,
  isMultiSelect = false,
  view,
  settings,
  onClick,
}: CalendarCellProps) {
  const totalHours = entries.reduce(
    (sum, element) => sum + Number(element.ore),
    0,
  );

  const isComplete = isModal && totalHours === settings?.maxHours;
  const isPartial = isModal && totalHours > 0 && !isComplete;

  const tooltip = disabled
    ? undefined
    : isMultiSelect
      ? isSelected
        ? "Clicca di nuovo per rimuovere questo giorno"
        : "Clicca per aggiungere questo giorno"
      : "Clicca per selezionare questo giorno";

  return (
    <div
      onClick={() => !disabled && onClick()}
      title={tooltip}
      style={{ display: "grid", gridTemplateRows: "auto 1fr auto" }}
      className={[
        "p-1 border cursor-pointer border-divider transition-colors overflow-hidden",
        disabled
          ? "opacity-40 cursor-not-allowed bg-surface/60"
          : isComplete
            ? "bg-success/40 "
            : isPartial
              ? "bg-danger/40 "
              : " hover:border-accent-soft bg-surface",
        isSelected ? "ring-2 ring-accent-soft ring-inset" : "",
      ].join(" ")}
    >
      <div
        className={[
          "text-xs font-semibold text-primary text-center mb-1 justify-self-center",
          isToday
            ? "bg-accent-soft border-accent rounded-full w-5 h-5 flex items-center justify-center leading-none hover:bg-accent-hover"
            : "",
        ].join(" ")}
      >
        {date.getDate()}
      </div>

      {!isModal && (
        <>
          <div className="flex flex-col overflow-auto">
            {entries.map((entry, i) => (
              <EntryBadge key={i} entry={entry} view={view} />
            ))}
          </div>
          {totalHours !== 0 && (
            <div
              className={[
                "border-t text-center text-xs font-semibold",
                (settings ? totalHours === settings.maxHours : totalHours === 8)
                  ? "bg-success text-white border-success"
                  : "bg-danger-soft text-slate-900 border-danger",
              ].join(" ")}
            >
              {totalHours}h
            </div>
          )}
        </>
      )}
    </div>
  );
}
