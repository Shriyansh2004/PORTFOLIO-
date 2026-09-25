"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Field, ItemActions, inputClass, saveContent, uploadFile } from "@/components/admin/admin-ui";
import { SkillIcon } from "@/components/ui/SkillIcon";
import { resolveSkillLogo } from "@/lib/skill-logos";
import { moveItem, newId, withSequentialOrder } from "@/lib/reorder";
import type {
  CertificationsContent,
  ContactContent,
  ContactMessage,
  ExperienceContent,
  Profile,
  ProjectsContent,
  ResumeContent,
  SiteContent,
  SkillsContent,
} from "@/types/content";

type CompanySuggestion = {
  name: string;
  domain: string;
  logo: string;
  logoAlt: string;
  website: string;
  linkedin: string;
};

function Notice({ error, saved }: { error: string; saved: boolean }) {
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (saved) return <p className="text-sm text-emerald-700">Saved.</p>;
  return null;
}

function SaveButton({ pending, onClick }: { pending: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} disabled={pending} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
      {pending ? "Saving" : "Save"}
    </button>
  );
}

export function ProfileEditor({ initial }: { initial: Profile }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    setSaved(false);
    const message = await saveContent("profile", draft);
    setError(message ?? "");
    setSaved(!message);
    setPending(false);
    if (!message) router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name"><input className={inputClass} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
        <Field label="Title"><input className={inputClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
        <Field label="Tagline"><input className={inputClass} value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} /></Field>
        <Field label="Location"><input className={inputClass} value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></Field>
        <Field label="Email"><input className={inputClass} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></Field>
        <Field label="Photo alt"><input className={inputClass} value={draft.photoAlt} onChange={(e) => setDraft({ ...draft, photoAlt: e.target.value })} /></Field>
      </div>
      <Field label="Intro"><textarea className={inputClass} rows={4} value={draft.intro} onChange={(e) => setDraft({ ...draft, intro: e.target.value })} /></Field>
      <Field label="Photo">
        <input type="file" accept="image/*" className="mt-1 block text-sm" onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const uploaded = await uploadFile(file);
          if ("error" in uploaded) setError(uploaded.error);
          else setDraft({ ...draft, photo: uploaded.path });
        }} />
      </Field>
      {draft.photo ? <p className="text-xs text-stone-500">{draft.photo}</p> : null}
      <Field label="About heading"><input className={inputClass} value={draft.about.heading} onChange={(e) => setDraft({ ...draft, about: { ...draft.about, heading: e.target.value } })} /></Field>
      <Field label="About subheading"><input className={inputClass} value={draft.about.subheading} onChange={(e) => setDraft({ ...draft, about: { ...draft.about, subheading: e.target.value } })} /></Field>
      <Field label="Bio"><textarea className={inputClass} rows={5} value={draft.about.bio} onChange={(e) => setDraft({ ...draft, about: { ...draft.about, bio: e.target.value } })} /></Field>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Highlights</h3>
          <button type="button" className="text-sm text-indigo-600" onClick={() => setDraft({ ...draft, about: { ...draft.about, highlights: [...draft.about.highlights, { id: newId("h"), text: "New highlight" }] } })}>Add</button>
        </div>
        {draft.about.highlights.map((item, index) => (
          <div key={item.id} className="flex items-start gap-3">
            <input className={inputClass} value={item.text} onChange={(e) => {
              const highlights = draft.about.highlights.slice();
              highlights[index] = { ...item, text: e.target.value };
              setDraft({ ...draft, about: { ...draft.about, highlights } });
            }} />
            <ItemActions
              onUp={() => setDraft({ ...draft, about: { ...draft.about, highlights: moveItem(draft.about.highlights, index, -1) } })}
              onDown={() => setDraft({ ...draft, about: { ...draft.about, highlights: moveItem(draft.about.highlights, index, 1) } })}
              onRemove={() => setDraft({ ...draft, about: { ...draft.about, highlights: draft.about.highlights.filter((row) => row.id !== item.id) } })}
            />
          </div>
        ))}
      </div>
      <Field label="Education heading"><input className={inputClass} value={draft.about.educationHeading} onChange={(e) => setDraft({ ...draft, about: { ...draft.about, educationHeading: e.target.value } })} /></Field>
      {draft.about.education.map((item, index) => (
        <div key={item.id} className="space-y-2 rounded-2xl border border-stone-200 p-4">
          <ItemActions
            onUp={() => setDraft({ ...draft, about: { ...draft.about, education: moveItem(draft.about.education, index, -1) } })}
            onDown={() => setDraft({ ...draft, about: { ...draft.about, education: moveItem(draft.about.education, index, 1) } })}
            onRemove={() => setDraft({ ...draft, about: { ...draft.about, education: draft.about.education.filter((row) => row.id !== item.id) } })}
          />
          <Field label="Degree"><input className={inputClass} value={item.degree} onChange={(e) => {
            const education = draft.about.education.slice();
            education[index] = { ...item, degree: e.target.value };
            setDraft({ ...draft, about: { ...draft.about, education } });
          }} /></Field>
          <Field label="School"><input className={inputClass} value={item.school} onChange={(e) => {
            const education = draft.about.education.slice();
            education[index] = { ...item, school: e.target.value };
            setDraft({ ...draft, about: { ...draft.about, education } });
          }} /></Field>
          <Field label="Year"><input className={inputClass} value={item.year} onChange={(e) => {
            const education = draft.about.education.slice();
            education[index] = { ...item, year: e.target.value };
            setDraft({ ...draft, about: { ...draft.about, education } });
          }} /></Field>
          <Field label="Detail"><input className={inputClass} value={item.detail} onChange={(e) => {
            const education = draft.about.education.slice();
            education[index] = { ...item, detail: e.target.value };
            setDraft({ ...draft, about: { ...draft.about, education } });
          }} /></Field>
        </div>
      ))}
      <button type="button" className="text-sm text-indigo-600" onClick={() => setDraft({ ...draft, about: { ...draft.about, education: [...draft.about.education, { id: newId("edu"), degree: "Degree", school: "School", year: "2026", detail: "" }] } })}>Add education</button>
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Social links</h3>
        {draft.socials.map((item, index) => (
          <div key={item.id} className="grid gap-2 rounded-2xl border border-stone-200 p-4 sm:grid-cols-3">
            <Field label="Label"><input className={inputClass} value={item.label} onChange={(e) => {
              const socials = draft.socials.slice();
              socials[index] = { ...item, label: e.target.value };
              setDraft({ ...draft, socials });
            }} /></Field>
            <Field label="URL"><input className={inputClass} value={item.href} onChange={(e) => {
              const socials = draft.socials.slice();
              socials[index] = { ...item, href: e.target.value };
              setDraft({ ...draft, socials });
            }} /></Field>
            <Field label="Icon">
              <select className={inputClass} value={item.icon} onChange={(e) => {
                const socials = draft.socials.slice();
                const icon = e.target.value;
                if (icon === "github" || icon === "linkedin" || icon === "mail") {
                  socials[index] = { ...item, icon };
                  setDraft({ ...draft, socials });
                }
              }}>
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
                <option value="mail">Email</option>
              </select>
            </Field>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Buttons</h3>
        {draft.ctas.map((item, index) => (
          <div key={item.id} className="grid gap-2 rounded-2xl border border-stone-200 p-4 sm:grid-cols-2">
            <Field label="Label"><input className={inputClass} value={item.label} onChange={(e) => {
              const ctas = draft.ctas.slice();
              ctas[index] = { ...item, label: e.target.value };
              setDraft({ ...draft, ctas });
            }} /></Field>
            <Field label="Href"><input className={inputClass} value={item.href} onChange={(e) => {
              const ctas = draft.ctas.slice();
              ctas[index] = { ...item, href: e.target.value };
              setDraft({ ...draft, ctas });
            }} /></Field>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4">
        <SaveButton pending={pending} onClick={save} />
        <Notice error={error} saved={saved} />
      </div>
    </div>
  );
}

export function SkillsEditor({ initial }: { initial: SkillsContent }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    const message = await saveContent("skills", draft);
    setError(message ?? "");
    setSaved(!message);
    setPending(false);
    if (!message) router.refresh();
  }

  return (
    <div className="space-y-4">
      <Field label="Heading"><input className={inputClass} value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} /></Field>
      <Field label="Subheading"><input className={inputClass} value={draft.subheading} onChange={(e) => setDraft({ ...draft, subheading: e.target.value })} /></Field>
      {draft.categories.map((category, categoryIndex) => (
        <div key={category.id} className="space-y-3 rounded-2xl border border-stone-200 p-4">
          <div className="flex items-center justify-between gap-3">
            <input className={inputClass} value={category.name} onChange={(e) => {
              const categories = draft.categories.slice();
              categories[categoryIndex] = { ...category, name: e.target.value };
              setDraft({ ...draft, categories });
            }} />
            <ItemActions
              onUp={() => setDraft({ ...draft, categories: moveItem(draft.categories, categoryIndex, -1) })}
              onDown={() => setDraft({ ...draft, categories: moveItem(draft.categories, categoryIndex, 1) })}
              onRemove={() => setDraft({ ...draft, categories: draft.categories.filter((row) => row.id !== category.id) })}
            />
          </div>
          {category.skills.map((skill, skillIndex) => (
            <div key={skill.id} className="flex items-center gap-2">
              <SkillIcon name={skill.name} icon={skill.icon} />
              <input className={`${inputClass} mt-0`} value={skill.name} placeholder="Python, Java, Docker…" onChange={(e) => {
                const name = e.target.value;
                const logo = resolveSkillLogo(name);
                const skills = category.skills.slice();
                skills[skillIndex] = { ...skill, name, icon: logo?.slug ?? skill.icon };
                const categories = draft.categories.slice();
                categories[categoryIndex] = { ...category, skills };
                setDraft({ ...draft, categories });
              }} />
              <button type="button" className="text-xs text-red-600" onClick={() => {
                const categories = draft.categories.slice();
                categories[categoryIndex] = { ...category, skills: category.skills.filter((row) => row.id !== skill.id) };
                setDraft({ ...draft, categories });
              }}>Delete</button>
            </div>
          ))}
          <button type="button" className="text-sm text-indigo-600" onClick={() => {
            const categories = draft.categories.slice();
            categories[categoryIndex] = { ...category, skills: [...category.skills, { id: newId("skill"), name: "New skill", icon: "code" }] };
            setDraft({ ...draft, categories });
          }}>Add skill</button>
        </div>
      ))}
      <button type="button" className="text-sm text-indigo-600" onClick={() => setDraft({ ...draft, categories: [...draft.categories, { id: newId("cat"), name: "New category", skills: [] }] })}>Add category</button>
      <div className="flex items-center gap-4"><SaveButton pending={pending} onClick={save} /><Notice error={error} saved={saved} /></div>
    </div>
  );
}

export function ExperienceEditor({ initial }: { initial: ExperienceContent }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [techText, setTechText] = useState<Record<string, string>>(() =>
    Object.fromEntries(initial.entries.map((entry) => [entry.id, entry.tech.join(", ")])),
  );
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [lookingUp, setLookingUp] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<{ id: string; items: CompanySuggestion[] } | null>(null);
  const suggestTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function queueSuggestions(entryId: string, value: string) {
    if (suggestTimer.current) clearTimeout(suggestTimer.current);
    const query = value.trim();
    if (query.length < 2) {
      setSuggestions(null);
      return;
    }
    suggestTimer.current = setTimeout(async () => {
      const response = await fetch(`/api/admin/company-lookup?suggest=1&name=${encodeURIComponent(query)}`);
      const body = (await response.json().catch(() => null)) as { suggestions?: CompanySuggestion[] } | null;
      setSuggestions({ id: entryId, items: body?.suggestions ?? [] });
    }, 250);
  }

  async function chooseSuggestion(index: number, entryId: string, item: CompanySuggestion) {
    setSuggestions(null);
    setDraft((current) => {
      const entries = current.entries.slice();
      const row = entries[index];
      if (!row || row.id !== entryId) return current;
      entries[index] = {
        ...row,
        company: item.name,
        logo: item.logo || row.logo,
        logoAlt: item.logoAlt || `${item.name} logo`,
        website: item.website || row.website,
        linkedin: item.linkedin || row.linkedin,
      };
      return { ...current, entries };
    });
    if (item.logo) return;
    setLookingUp(entryId);
    try {
      const response = await fetch(`/api/admin/company-lookup?name=${encodeURIComponent(item.name)}`);
      const body = (await response.json().catch(() => null)) as { found?: boolean; logo?: string; logoAlt?: string; website?: string; linkedin?: string } | null;
      if (!response.ok || !body?.found || !body.logo) return;
      setDraft((current) => {
        const entries = current.entries.slice();
        const row = entries[index];
        if (!row || row.id !== entryId) return current;
        entries[index] = {
          ...row,
          logo: body.logo || row.logo,
          logoAlt: body.logoAlt || row.logoAlt,
          website: body.website || row.website,
          linkedin: body.linkedin || row.linkedin,
        };
        return { ...current, entries };
      });
    } finally {
      setLookingUp(null);
    }
  }

  function update(index: number, patch: Partial<ExperienceContent["entries"][number]>) {
    setDraft((current) => {
      const entries = current.entries.slice();
      const entry = entries[index];
      if (!entry) return current;
      entries[index] = { ...entry, ...patch };
      return { ...current, entries };
    });
  }

  async function lookupCompany(index: number, name: string) {
    const query = name.trim();
    if (query.length < 2) return;
    const entry = draft.entries[index];
    if (!entry) return;
    setLookingUp(entry.id);
    setError("");
    try {
      const response = await fetch(`/api/admin/company-lookup?name=${encodeURIComponent(query)}`);
      const body = (await response.json().catch(() => null)) as
        | { found?: boolean; logo?: string; logoAlt?: string; website?: string; linkedin?: string; error?: string }
        | null;
      if (!response.ok) {
        setError(body?.error ?? "Could not look up that company.");
        return;
      }
      if (!body?.found) {
        setError(`No public site found for ${query}. You can fill the links in yourself.`);
        return;
      }
      setDraft((current) => {
        const entries = current.entries.slice();
        const row = entries[index];
        if (!row || row.company.trim() !== query) return current;
        entries[index] = {
          ...row,
          logo: body.logo || row.logo,
          logoAlt: body.logoAlt || row.logoAlt || `${query} logo`,
          website: body.website || row.website,
          linkedin: body.linkedin || row.linkedin,
        };
        return { ...current, entries };
      });
    } finally {
      setLookingUp(null);
    }
  }

  async function save() {
    setPending(true);
    const message = await saveContent("experience", { ...draft, entries: withSequentialOrder(draft.entries) });
    setError(message ?? "");
    setSaved(!message);
    setPending(false);
    if (!message) router.refresh();
  }

  return (
    <div className="space-y-4">
      <Field label="Heading"><input className={inputClass} value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} /></Field>
      <Field label="Subheading"><input className={inputClass} value={draft.subheading} onChange={(e) => setDraft({ ...draft, subheading: e.target.value })} /></Field>
      {draft.entries.map((entry, index) => (
        <div key={entry.id} className="space-y-2 rounded-2xl border border-stone-200 p-4">
          <ItemActions
            onUp={() => setDraft((current) => ({ ...current, entries: moveItem(current.entries, index, -1) }))}
            onDown={() => setDraft((current) => ({ ...current, entries: moveItem(current.entries, index, 1) }))}
            onRemove={() => setDraft((current) => ({ ...current, entries: current.entries.filter((row) => row.id !== entry.id) }))}
          />
          <Field label="Company">
            <div className="relative">
              <input
                className={inputClass}
                value={entry.company}
                autoComplete="off"
                onChange={(e) => {
                  update(index, { company: e.target.value });
                  queueSuggestions(entry.id, e.target.value);
                }}
                onBlur={(e) => {
                  window.setTimeout(() => setSuggestions((current) => (current?.id === entry.id ? null : current)), 120);
                  void lookupCompany(index, e.target.value);
                }}
                onFocus={() => queueSuggestions(entry.id, entry.company)}
              />
              {suggestions?.id === entry.id && suggestions.items.length > 0 ? (
                <ul className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-stone-200 bg-white py-1 shadow-lg">
                  {suggestions.items.map((item) => (
                    <li key={`${item.domain}-${item.name}`}>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-indigo-50"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={() => void chooseSuggestion(index, entry.id, item)}
                      >
                        {item.logo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.logo} alt="" className="h-8 w-14 object-contain" />
                        ) : (
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-xs font-semibold text-stone-600">{item.name.slice(0, 1)}</span>
                        )}
                        <span>
                          <span className="block text-sm font-medium text-stone-900">{item.name}</span>
                          <span className="block text-xs text-stone-500">{item.domain}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Field>
          <p className="text-xs text-stone-500">
            {lookingUp === entry.id ? "Adding the company logo…" : "Type a company name and choose a suggestion to add its logo."}
          </p>
          <Field label="Role"><input className={inputClass} value={entry.role} onChange={(e) => update(index, { role: e.target.value })} /></Field>
          <Field label="Duration"><input className={inputClass} value={entry.duration} onChange={(e) => update(index, { duration: e.target.value })} /></Field>
          <Field label="Description"><textarea className={inputClass} rows={5} value={entry.description} onChange={(e) => update(index, { description: e.target.value })} /></Field>
          <Field label="Tech (comma separated)">
            <input
              className={inputClass}
              value={techText[entry.id] ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setTechText((current) => ({ ...current, [entry.id]: value }));
                update(index, { tech: value.split(",").map((item) => item.trim()).filter(Boolean) });
              }}
            />
          </Field>
          <Field label="Website"><input className={inputClass} value={entry.website} onChange={(e) => update(index, { website: e.target.value })} placeholder="https://" /></Field>
          <Field label="LinkedIn"><input className={inputClass} value={entry.linkedin} onChange={(e) => update(index, { linkedin: e.target.value })} placeholder="https://www.linkedin.com/company/..." /></Field>
          <Field label="Logo">
            {entry.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={entry.logo} alt={entry.logoAlt || entry.company} className="mt-2 h-12 w-auto max-w-[180px] object-contain" />
            ) : (
              <p className="mt-1 text-xs text-stone-400">No logo yet.</p>
            )}
            <input type="file" accept="image/*" className="mt-2 block text-sm" onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const uploaded = await uploadFile(file);
              if ("error" in uploaded) setError(uploaded.error);
              else update(index, { logo: uploaded.path, logoAlt: entry.logoAlt || `${entry.company} logo` });
            }} />
          </Field>
        </div>
      ))}
      <button type="button" className="text-sm text-indigo-600" onClick={() => {
        const id = newId("exp");
        setTechText((current) => ({ ...current, [id]: "" }));
        setDraft((current) => ({ ...current, entries: [...current.entries, { id, company: "Company", logo: "", logoAlt: "", website: "", linkedin: "", role: "Role", duration: "Dates", description: "What you worked on.", tech: [], order: current.entries.length }] }));
      }}>Add experience</button>
      <div className="flex items-center gap-4"><SaveButton pending={pending} onClick={save} /><Notice error={error} saved={saved} /></div>
    </div>
  );
}

export function ProjectsEditor({ initial }: { initial: ProjectsContent }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  function update(index: number, patch: Partial<ProjectsContent["items"][number]>) {
    const items = draft.items.slice();
    const current = items[index];
    if (!current) return;
    items[index] = { ...current, ...patch };
    setDraft({ ...draft, items });
  }

  async function save() {
    setPending(true);
    const message = await saveContent("projects", { ...draft, items: withSequentialOrder(draft.items) });
    setError(message ?? "");
    setSaved(!message);
    setPending(false);
    if (!message) router.refresh();
  }

  return (
    <div className="space-y-4">
      <Field label="Heading"><input className={inputClass} value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} /></Field>
      <Field label="Subheading"><input className={inputClass} value={draft.subheading} onChange={(e) => setDraft({ ...draft, subheading: e.target.value })} /></Field>
      {draft.items.map((item, index) => (
        <div key={item.id} className="space-y-2 rounded-2xl border border-stone-200 p-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={item.featured} onChange={(e) => update(index, { featured: e.target.checked })} />
              Featured
            </label>
            <ItemActions
              onUp={() => setDraft({ ...draft, items: moveItem(draft.items, index, -1) })}
              onDown={() => setDraft({ ...draft, items: moveItem(draft.items, index, 1) })}
              onRemove={() => setDraft({ ...draft, items: draft.items.filter((row) => row.id !== item.id) })}
            />
          </div>
          <Field label="Title"><input className={inputClass} value={item.title} onChange={(e) => update(index, { title: e.target.value })} /></Field>
          <Field label="Description"><textarea className={inputClass} rows={3} value={item.description} onChange={(e) => update(index, { description: e.target.value })} /></Field>
          <Field label="Tech (comma separated)"><input className={inputClass} value={item.tech.join(", ")} onChange={(e) => update(index, { tech: e.target.value.split(",").map((part) => part.trim()).filter(Boolean) })} /></Field>
          <Field label="GitHub URL"><input className={inputClass} value={item.github} onChange={(e) => update(index, { github: e.target.value })} /></Field>
          <Field label="Demo URL"><input className={inputClass} value={item.demo} onChange={(e) => update(index, { demo: e.target.value })} /></Field>
          <Field label="Cover image">
            <input type="file" accept="image/*" className="mt-1 block text-sm" onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const uploaded = await uploadFile(file);
              if ("error" in uploaded) setError(uploaded.error);
              else update(index, { image: uploaded.path, imageAlt: item.imageAlt || item.title });
            }} />
          </Field>
        </div>
      ))}
      <button type="button" className="text-sm text-indigo-600" onClick={() => setDraft({ ...draft, items: [...draft.items, { id: newId("project"), title: "New project", description: "Short description.", tech: [], image: "", imageAlt: "", github: "", demo: "", featured: false, order: draft.items.length }] })}>Add project</button>
      <div className="flex items-center gap-4"><SaveButton pending={pending} onClick={save} /><Notice error={error} saved={saved} /></div>
    </div>
  );
}

export function CertificationsEditor({ initial }: { initial: CertificationsContent }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    const message = await saveContent("certifications", { ...draft, entries: withSequentialOrder(draft.entries) });
    setError(message ?? "");
    setSaved(!message);
    setPending(false);
    if (!message) router.refresh();
  }

  return (
    <div className="space-y-4">
      <Field label="Heading"><input className={inputClass} value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} /></Field>
      <Field label="Subheading"><input className={inputClass} value={draft.subheading} onChange={(e) => setDraft({ ...draft, subheading: e.target.value })} /></Field>
      {draft.entries.map((entry, index) => (
        <div key={entry.id} className="space-y-2 rounded-2xl border border-stone-200 p-4">
          <ItemActions
            onUp={() => setDraft({ ...draft, entries: moveItem(draft.entries, index, -1) })}
            onDown={() => setDraft({ ...draft, entries: moveItem(draft.entries, index, 1) })}
            onRemove={() => setDraft({ ...draft, entries: draft.entries.filter((row) => row.id !== entry.id) })}
          />
          {(["title", "issuer", "detail", "year"] as const).map((key) => (
            <Field key={key} label={key}>
              <input className={inputClass} value={entry[key]} onChange={(e) => {
                const entries = draft.entries.slice();
                const current = entries[index];
                if (!current) return;
                entries[index] = { ...current, [key]: e.target.value };
                setDraft({ ...draft, entries });
              }} />
            </Field>
          ))}
        </div>
      ))}
      <button type="button" className="text-sm text-indigo-600" onClick={() => setDraft({ ...draft, entries: [...draft.entries, { id: newId("cert"), title: "Certification", issuer: "Issuer", detail: "Detail", year: "", order: draft.entries.length }] })}>Add certification</button>
      <div className="flex items-center gap-4"><SaveButton pending={pending} onClick={save} /><Notice error={error} saved={saved} /></div>
    </div>
  );
}

export function ResumeEditor({ initial }: { initial: ResumeContent }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    const message = await saveContent("resume", draft);
    setError(message ?? "");
    setSaved(!message);
    setPending(false);
    if (!message) router.refresh();
  }

  return (
    <div className="space-y-4">
      <Field label="Heading"><input className={inputClass} value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} /></Field>
      <Field label="Subheading"><input className={inputClass} value={draft.subheading} onChange={(e) => setDraft({ ...draft, subheading: e.target.value })} /></Field>
      <Field label="Button label"><input className={inputClass} value={draft.buttonLabel} onChange={(e) => setDraft({ ...draft, buttonLabel: e.target.value })} /></Field>
      <Field label="Empty state"><input className={inputClass} value={draft.emptyLabel} onChange={(e) => setDraft({ ...draft, emptyLabel: e.target.value })} /></Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.showPreview} onChange={(e) => setDraft({ ...draft, showPreview: e.target.checked })} />Show PDF preview</label>
      <Field label="PDF">
        <input type="file" accept="application/pdf" className="mt-1 block text-sm" onChange={async (event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          const uploaded = await uploadFile(file);
          if ("error" in uploaded) setError(uploaded.error);
          else setDraft({ ...draft, file: uploaded.path, fileName: uploaded.fileName });
        }} />
      </Field>
      {draft.file ? <p className="text-xs text-stone-500">{draft.fileName || draft.file}</p> : null}
      <div className="flex items-center gap-4"><SaveButton pending={pending} onClick={save} /><Notice error={error} saved={saved} /></div>
    </div>
  );
}

export function SiteEditor({ initial }: { initial: SiteContent }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    const message = await saveContent("site", draft);
    setError(message ?? "");
    setSaved(!message);
    setPending(false);
    if (!message) router.refresh();
  }

  return (
    <div className="space-y-4">
      <Field label="SEO title"><input className={inputClass} value={draft.seo.title} onChange={(e) => setDraft({ ...draft, seo: { ...draft.seo, title: e.target.value } })} /></Field>
      <Field label="SEO description"><textarea className={inputClass} rows={3} value={draft.seo.description} onChange={(e) => setDraft({ ...draft, seo: { ...draft.seo, description: e.target.value } })} /></Field>
      <Field label="Footer copyright"><input className={inputClass} value={draft.footer.copyright} onChange={(e) => setDraft({ ...draft, footer: { ...draft.footer, copyright: e.target.value } })} /></Field>
      <Field label="Footer note"><input className={inputClass} value={draft.footer.note} onChange={(e) => setDraft({ ...draft, footer: { ...draft.footer, note: e.target.value } })} /></Field>
      <Field label="Featured label"><input className={inputClass} value={draft.ui.featuredLabel} onChange={(e) => setDraft({ ...draft, ui: { ...draft.ui, featuredLabel: e.target.value } })} /></Field>
      <Field label="GitHub label"><input className={inputClass} value={draft.ui.githubLabel} onChange={(e) => setDraft({ ...draft, ui: { ...draft.ui, githubLabel: e.target.value } })} /></Field>
      <Field label="Demo label"><input className={inputClass} value={draft.ui.demoLabel} onChange={(e) => setDraft({ ...draft, ui: { ...draft.ui, demoLabel: e.target.value } })} /></Field>
      {draft.nav.map((item, index) => (
        <div key={item.id} className="grid gap-2 sm:grid-cols-2">
          <input className={inputClass} value={item.label} onChange={(e) => {
            const nav = draft.nav.slice();
            nav[index] = { ...item, label: e.target.value };
            setDraft({ ...draft, nav });
          }} />
          <input className={inputClass} value={item.href} onChange={(e) => {
            const nav = draft.nav.slice();
            nav[index] = { ...item, href: e.target.value };
            setDraft({ ...draft, nav });
          }} />
        </div>
      ))}
      <div className="flex items-center gap-4"><SaveButton pending={pending} onClick={save} /><Notice error={error} saved={saved} /></div>
    </div>
  );
}

export function ContactEditor({ initial }: { initial: ContactContent }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    const message = await saveContent("contact", draft);
    setError(message ?? "");
    setSaved(!message);
    setPending(false);
    if (!message) router.refresh();
  }

  return (
    <div className="space-y-4">
      <Field label="Heading"><input className={inputClass} value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} /></Field>
      <Field label="Subheading"><textarea className={inputClass} rows={3} value={draft.subheading} onChange={(e) => setDraft({ ...draft, subheading: e.target.value })} /></Field>
      <Field label="Direct label"><input className={inputClass} value={draft.directLabel} onChange={(e) => setDraft({ ...draft, directLabel: e.target.value })} /></Field>
      <Field label="Success message"><input className={inputClass} value={draft.successMessage} onChange={(e) => setDraft({ ...draft, successMessage: e.target.value })} /></Field>
      <Field label="Error message"><input className={inputClass} value={draft.errorMessage} onChange={(e) => setDraft({ ...draft, errorMessage: e.target.value })} /></Field>
      {(Object.keys(draft.fields) as (keyof ContactContent["fields"])[]).map((key) => (
        <Field key={key} label={`Field: ${key}`}>
          <input className={inputClass} value={draft.fields[key]} onChange={(e) => setDraft({ ...draft, fields: { ...draft.fields, [key]: e.target.value } })} />
        </Field>
      ))}
      {(Object.keys(draft.validation) as (keyof ContactContent["validation"])[]).map((key) => (
        <Field key={key} label={`Validation: ${key}`}>
          <input className={inputClass} value={draft.validation[key]} onChange={(e) => setDraft({ ...draft, validation: { ...draft.validation, [key]: e.target.value } })} />
        </Field>
      ))}
      <div className="flex items-center gap-4"><SaveButton pending={pending} onClick={save} /><Notice error={error} saved={saved} /></div>
    </div>
  );
}

export function MessagesPanel({ initial }: { initial: ContactMessage[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);

  async function remove(id: string) {
    const response = await fetch(`/api/admin/messages?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) return;
    setItems((current) => current.filter((item) => item.id !== id));
    router.refresh();
  }

  if (items.length === 0) return <p className="text-sm text-stone-500">No messages yet.</p>;

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.id} className="rounded-2xl border border-stone-200 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-stone-900">{item.name}</p>
              <p className="text-xs text-stone-500">{item.email}</p>
            </div>
            <button type="button" onClick={() => remove(item.id)} className="text-xs text-red-600">Delete</button>
          </div>
          <p className="mt-2 text-sm text-stone-700">{item.message}</p>
          <p className="mt-2 text-xs text-stone-400">{item.createdAt}</p>
        </li>
      ))}
    </ul>
  );
}
