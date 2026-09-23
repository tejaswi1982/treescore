export function StatusPill({
  status,
  className = "",
}: {
  status: string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-sm text-moss-deep ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-moss" aria-hidden />
      {status}
    </span>
  );
}
