import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-start px-5 py-28 md:px-8 md:py-40">
      <p className="kicker mb-5 text-moss">Not found</p>
      <h1 className="max-w-2xl font-serif text-4xl leading-tight tracking-tight text-forest md:text-5xl">
        This page isn&rsquo;t on the map yet.
      </h1>
      <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink/70">
        The locality or page you&rsquo;re looking for doesn&rsquo;t exist in
        this beta. TreeScore currently has a small set of Mumbai analysis areas,
        with measurements published after review.
      </p>
      <Link
        href="/"
        className="mt-9 rounded-full bg-forest px-6 py-3 text-sm text-cream transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </section>
  );
}
