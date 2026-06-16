interface ProgressGoalProps {
  label: string;
  current: number;
  target: number;
}

export default function ProgressGoal({
  label,
  current,
  target,
}: ProgressGoalProps) {
  const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;

  const barColor =
    pct < 50 ? "bg-danger" : pct < 90 ? "bg-warning" : "bg-success";

  return (
    <div className="flex-1 rounded-md border border-divider bg-surface p-4">
      <div className="flex justify-between items-baseline mb-2 ">
        <h3 className="text-sm font-semibold text-primary">{label}</h3>
        <span className="text-xs text-primary">{Math.round(pct)}%</span>
      </div>

      <div className="text-lg font-bold text-primary mb-2">
        {current}h{" "}
        <span className="text-sm font-normal text-primary">/ {target}h</span>
      </div>
      <div className="h-2 w-full rounded-full bg-surface-raised overflow-hidden">
        <div
          className={["h-full transition-all", barColor].join(" ")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
