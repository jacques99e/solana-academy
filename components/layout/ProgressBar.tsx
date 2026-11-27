type ProgressBarProps = {
  completed: number;
  total: number;
};

export default function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.min((completed / total) * 100, 100) : 0;

  return (
    <div
      className="w-full"
      role="progressbar"
      aria-label="Progression des missions"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={completed}
    >
      <div className="mb-3 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-slate-200">
          {completed} / {total} missions terminées
        </span>
        <span className="font-mono text-xs text-slate-500">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-400 to-emerald-300 transition-[width] duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}