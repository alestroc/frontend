interface ProgressGoalProps {
  label: string;
  current: number;
  target: number;
}

// Card riusabile per mostrare ore_fatte / ore_obiettivo con barra di progresso.
export default function ProgressGoal({
  label,
  current,
  target,
}: ProgressGoalProps) {
  const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
  const reached = current >= target && target > 0;

  return (
    <div className="flex-1 rounded-md border border-slate-700 bg-slate-800 p-4">
      <div className="flex justify-between items-baseline mb-2">
        <h3 className="text-sm font-semibold text-slate-200">{label}</h3>
        <span className="text-xs text-slate-400">{Math.round(pct)}%</span>
      </div>
      <div className="text-lg font-bold text-white mb-2">
        {current}h <span className="text-sm font-normal text-slate-400">/ {target}h</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-700 overflow-hidden">
        <div
          className={[
            "h-full transition-all",
            reached ? "bg-emerald-500" : "bg-blue-500",
          ].join(" ")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
