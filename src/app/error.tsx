"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-16">
      <h1 className="font-serif text-3xl text-forest">
        This view could not load.
      </h1>
      <p className="my-5">No estimate is being inferred from missing data.</p>
      <button
        onClick={reset}
        className="rounded-full bg-forest px-5 py-3 text-cream"
      >
        Try again
      </button>
    </section>
  );
}
