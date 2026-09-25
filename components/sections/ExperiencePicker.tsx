"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import type { ExperienceEntry } from "@/types/content";

const ACCENTS = [
  "from-emerald-400/80 via-lime-300/40 to-transparent",
  "from-sky-400/80 via-indigo-300/40 to-transparent",
  "from-amber-400/80 via-orange-300/40 to-transparent",
];

function CompanyMark({ entry, large = false }: { entry: ExperienceEntry; large?: boolean }) {
  if (entry.logo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={entry.logo}
        alt={entry.logoAlt || entry.company}
        className={large ? "h-16 w-auto max-w-[220px] object-contain" : "h-14 w-auto max-w-[170px] object-contain"}
      />
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-stone-900 font-serif text-white ${large ? "h-16 w-16 text-3xl" : "h-14 w-14 text-2xl"}`}
      aria-hidden
    >
      {entry.company.trim().slice(0, 1).toUpperCase()}
    </div>
  );
}

function ExternalLinks({ entry }: { entry: ExperienceEntry }) {
  if (!entry.website && !entry.linkedin) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {entry.website ? (
        <a href={entry.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm font-medium text-stone-800 hover:border-indigo-200 hover:text-indigo-700">
          <Globe className="h-4 w-4" aria-hidden />
          Website
        </a>
      ) : null}
      {entry.linkedin ? (
        <a href={entry.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-sm font-medium text-stone-800 hover:border-indigo-200 hover:text-indigo-700">
          LinkedIn
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
      ) : null}
    </div>
  );
}

export function ExperiencePicker({ entries }: { entries: ExperienceEntry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = entries.find((entry) => entry.id === activeId) ?? null;

  useEffect(() => {
    if (!active) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveId(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <div className="mt-12">
      <AnimatePresence mode="wait" initial={false}>
        {active ? (
          <motion.article
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm"
          >
            <div className={`h-1.5 bg-gradient-to-r ${ACCENTS[Math.max(0, entries.findIndex((entry) => entry.id === active.id)) % ACCENTS.length]}`} />
            <div className="p-6 sm:p-8">
              <button
                type="button"
                onClick={() => setActiveId(null)}
                className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                All roles
              </button>
              <div className="mt-6 flex flex-wrap items-center gap-5">
                <div className="flex h-24 min-w-40 items-center justify-center rounded-3xl bg-stone-50 px-5">
                  <CompanyMark entry={active} large />
                </div>
                <div>
                  <p className="text-sm font-medium text-stone-500">{active.company}</p>
                  <h3 className="mt-1 font-serif text-3xl text-stone-900">{active.role}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-indigo-600">{active.duration}</p>
                </div>
              </div>
              <p className="mt-6 max-w-3xl text-base leading-relaxed text-stone-600">{active.description}</p>
              {active.tech.length > 0 ? (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {active.tech.map((item) => (
                    <li key={item} className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-800">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
              <ExternalLinks entry={active} />
            </div>
          </motion.article>
        ) : (
          <motion.ul
            key="roles"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {entries.map((entry, index) => (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(entry.id)}
                  className="group relative flex h-full w-full flex-col overflow-hidden rounded-[2rem] border border-stone-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                  <span className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${ACCENTS[index % ACCENTS.length]} opacity-80`} />
                  <span className="relative flex h-28 items-center justify-center rounded-2xl bg-white/90 px-4 shadow-sm ring-1 ring-white">
                    <CompanyMark entry={entry} />
                  </span>
                  <span className="relative mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">{entry.company}</span>
                  <span className="relative mt-1 font-serif text-2xl text-stone-900">{entry.role}</span>
                  <span className="relative mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
                    View role
                    <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                  </span>
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
