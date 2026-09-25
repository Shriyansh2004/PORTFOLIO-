export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle ? <p className="mt-3 text-base leading-relaxed text-stone-500">{subtitle}</p> : null}
    </div>
  );
}
