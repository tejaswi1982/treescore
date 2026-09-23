/** A single quiet metric: uppercase label over a confident value. */
export function MetricCard({
  label,
  value,
  detail,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  detail?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="kicker mb-2 text-mist">{label}</p>
      <p className="font-serif text-2xl text-ink md:text-[1.7rem]">{value}</p>
      {detail && <p className="mt-1 text-xs text-mist">{detail}</p>}
    </div>
  );
}
