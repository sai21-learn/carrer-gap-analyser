'use client';

interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  className?: string;
  color?: string;
}

export default function ProgressBar({
  value,
  label,
  showValue = true,
  className = '',
  color = 'bg-blue-600'
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(value, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between text-sm">
          {label && <span className="font-medium text-zinc-700 dark:text-zinc-300">{label}</span>}
          {showValue && <span className="text-zinc-500 font-mono">{percentage}%</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
        <div
          className={`h-full ${color} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
