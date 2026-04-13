import type { TimeEntry } from "../../types";

interface EntryBadgeProps {
  entry: TimeEntry;
}

export default function EntryBadge({ entry }: EntryBadgeProps) {
  return (
    <div
      className="text-xs truncate rounded px-1 bg-red-500 dark:bg-orange-800/40 text-orange-800 dark:text-orange-200 mb-0.5"
      title={`${entry.nomecommessa} — ${entry.ore}h`}
    >
      {entry.ore}h {entry.nomecommessa}
    </div>
  );
}
