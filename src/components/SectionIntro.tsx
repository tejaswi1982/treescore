import Link from "next/link";

/**
 * Editorial section opener: numbered kicker, serif title, optional
 * copy, optional quiet link on the right.
 */
export function SectionIntro({
  number,
  label,
  title,
  copy,
  link,
}: {
  number?: string;
  label: string;
  title: React.ReactNode;
  copy?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="mb-10 md:mb-14">
      <p className="kicker mb-5 text-moss">
        {number && <span>{number} · </span>}
        {label}
      </p>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="max-w-2xl font-serif text-3xl leading-tight tracking-tight text-forest md:text-[2.6rem]">
          {title}
        </h2>
        {link && (
          <Link
            href={link.href}
            className="pb-1 text-sm text-moss-deep underline-offset-4 transition-colors hover:text-forest hover:underline"
          >
            {link.label} →
          </Link>
        )}
      </div>
      {copy && (
        <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink/70">
          {copy}
        </p>
      )}
    </div>
  );
}
