export function ProgressBar({ value, total }: { value: number; total: number }) {
  return <div className="progress" role="progressbar" aria-label="풀이 진행률" aria-valuemin={0} aria-valuemax={total} aria-valuenow={value}>
    <span style={{ width: `${value / total * 100}%` }} />
  </div>;
}
