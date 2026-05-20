import { useMemo } from "react";
import type { ApiSettings, TimeEntry } from "../../types";
import { DEFAULT_MAX_HOURS } from "../../config";
import { getWeekStart } from "../../functions/functions";
import ProgressGoal from "./ProgressGoal";
import ExploreCommessa from "./ExploreCommessa";
import DownloadReport from "./DownloadReport";

interface StatisticsProps {
  entries: TimeEntry[];
  settings: ApiSettings | null;
  showError?: (message: string) => void;
}

// Conta i giorni lavorativi (Lun–Ven + sab/dom in base alle settings) in un range
function workingDaysIn(
  from: Date,
  to: Date,
  allowSat: boolean,
  allowSun: boolean,
): number {
  let count = 0;
  const cur = new Date(from);
  while (cur <= to) {
    const dow = cur.getDay(); // 0=Dom .. 6=Sab
    const isWorkday =
      (dow >= 1 && dow <= 5) ||
      (dow === 6 && allowSat) ||
      (dow === 0 && allowSun);
    if (isWorkday) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

export default function Statistics({
  entries,
  settings,
  showError,
}: StatisticsProps) {
  const maxHours = settings?.maxHours ?? DEFAULT_MAX_HOURS;
  const allowSat = settings?.allowSaturday ?? false;
  const allowSun = settings?.allowSunday ?? false;

  const { weekHours, weekTarget, monthHours, monthTarget } = useMemo(() => {
    const now = new Date();

    const weekStart = getWeekStart(now);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    let wh = 0;
    let mh = 0;
    for (const e of entries) {
      const d = new Date(e.giorno);
      const ore = Number(e.ore);
      if (d >= weekStart && d <= weekEnd) wh += ore;
      if (d >= monthStart && d <= monthEnd) mh += ore;
    }

    return {
      weekHours: wh,
      weekTarget: workingDaysIn(weekStart, weekEnd, allowSat, allowSun) * maxHours,
      monthHours: mh,
      monthTarget:
        workingDaysIn(monthStart, monthEnd, allowSat, allowSun) * maxHours,
    };
  }, [entries, maxHours, allowSat, allowSun]);

  return (
    <div className="flex flex-col gap-4 p-4 w-full">
      <h1 className="text-2xl font-bold text-slate-100">Statistiche</h1>

      <section className="flex flex-wrap gap-4">
        <ProgressGoal
          label="Settimanale"
          current={weekHours}
          target={weekTarget}
        />
        <ProgressGoal
          label="Mensile"
          current={monthHours}
          target={monthTarget}
        />
      </section>

      <ExploreCommessa entries={entries} />

      <DownloadReport entries={entries} showError={showError} />
    </div>
  );
}
