"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AddButton,
  CheckField,
  EditorSection,
  Field,
  FilePicker,
  ImagePreview,
  ItemActions,
  ItemCard,
  SaveBar,
  controlClass,
  inputClass,
  saveContent,
  uploadFile,
  useUpload,
} from "@/components/admin/admin-ui";
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

function TechListField({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
}) {
  const [text, setText] = useState(() => values.join(", "));
  return (
    <Field label={label} hint="Separate names with commas, for example Next.js, PostgreSQL.">
      <input
        className={inputClass}
        value={text}
        onChange={(event) => {
          const value = event.target.value;
          setText(value);
          onChange(value.split(",").map((part) => part.trim()).filter(Boolean));
        }}
      />
    </Field>
  );
}

function formatWhen(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export function ProfileEditor({ initial }: { initial: Profile }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const photo = useUpload(
    (uploaded) => {
      setError("");
      setDraft((current) => ({ ...current, photo: uploaded.path }));
    },
    setError,
  );

  async function save() {
    setPending(true);
    setSaved(false);
    setError("");
    const message = await saveContent("profile", draft);
    setError(message ?? "");
    setSaved(!message);
    setPending(false);
    if (!message) router.refresh();
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Intro" description="This is the first block visitors see at the top of the page.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name"><input className={inputClass} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></Field>
          <Field label="Title"><input className={inputClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
          <Field label="Tagline"><input className={inputClass} value={draft.tagline} onChange={(e) => setDraft({ ...draft, tagline: e.target.value })} /></Field>
          <Field label="Location"><input className={inputClass} value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></Field>
          <Field label="Email"><input className={inputClass} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></Field>
          <Field label="Photo description" hint="Read aloud for people who cannot see the photo.">
            <input className={inputClass} value={draft.photoAlt} onChange={(e) => setDraft({ ...draft, photoAlt: e.target.value })} />
          </Field>
        </div>
        <Field label="Short intro"><textarea className={inputClass} rows={4} value={draft.intro} onChange={(e) => setDraft({ ...draft, intro: e.target.value })} /></Field>
        <div className="grid gap-4 sm:grid-cols-[8rem_1fr] sm:items-start">
          <ImagePreview src={draft.photo} alt={draft.photoAlt || draft.name} />
          <FilePicker label="Portrait photo" hint="A square photo works best." accept="image/*" busy={photo.busy} onPick={photo.pick} />
        </div>
      </EditorSection>

      <EditorSection title="About" description="The longer biography and short points under it.">
        <Field label="Heading"><input className={inputClass} value={draft.about.heading} onChange={(e) => setDraft({ ...draft, about: { ...draft.about, heading: e.target.value } })} /></Field>
        <Field label="Subheading"><input className={inputClass} value={draft.about.subheading} onChange={(e) => setDraft({ ...draft, about: { ...draft.about, subheading: e.target.value } })} /></Field>
        <Field label="Biography"><textarea className={inputClass} rows={5} value={draft.about.bio} onChange={(e) => setDraft({ ...draft, about: { ...draft.about, bio: e.target.value } })} /></Field>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-stone-950">Highlights</h3>
          {draft.about.highlights.map((item, index) => (
            <ItemCard key={item.id} title={`Highlight ${index + 1}`} actions={
              <ItemActions
                disableUp={index === 0}
                disableDown={index === draft.about.highlights.length - 1}
                onUp={() => setDraft({ ...draft, about: { ...draft.about, highlights: moveItem(draft.about.highlights, index, -1) } })}
                onDown={() => setDraft({ ...draft, about: { ...draft.about, highlights: moveItem(draft.about.highlights, index, 1) } })}
                onRemove={() => setDraft({ ...draft, about: { ...draft.about, highlights: draft.about.highlights.filter((row) => row.id !== item.id) } })}
              />
            }>
              <Field label="Text">
                <input className={inputClass} value={item.text} onChange={(e) => {
                  const highlights = draft.about.highlights.slice();
                  highlights[index] = { ...item, text: e.target.value };
                  setDraft({ ...draft, about: { ...draft.about, highlights } });
                }} />
              </Field>
            </ItemCard>
          ))}
          <AddButton onClick={() => setDraft({ ...draft, about: { ...draft.about, highlights: [...draft.about.highlights, { id: newId("h"), text: "New highlight" }] } })}>
            Add highlight
          </AddButton>
        </div>
      </EditorSection>

      <EditorSection title="Education" description="Schools and degrees shown in the about section.">
        <Field label="Section heading"><input className={inputClass} value={draft.about.educationHeading} onChange={(e) => setDraft({ ...draft, about: { ...draft.about, educationHeading: e.target.value } })} /></Field>
        {draft.about.education.map((item, index) => (
          <ItemCard key={item.id} title={item.degree || "Education"} subtitle={item.school} actions={
            <ItemActions
              disableUp={index === 0}
              disableDown={index === draft.about.education.length - 1}
              onUp={() => setDraft({ ...draft, about: { ...draft.about, education: moveItem(draft.about.education, index, -1) } })}
              onDown={() => setDraft({ ...draft, about: { ...draft.about, education: moveItem(draft.about.education, index, 1) } })}
              onRemove={() => setDraft({ ...draft, about: { ...draft.about, education: draft.about.education.filter((row) => row.id !== item.id) } })}
            />
          }>
            <div className="grid gap-3 sm:grid-cols-2">
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
          </ItemCard>
        ))}
        <AddButton onClick={() => setDraft({ ...draft, about: { ...draft.about, education: [...draft.about.education, { id: newId("edu"), degree: "Degree", school: "School", year: "2026", detail: "" }] } })}>
          Add education
        </AddButton>
      </EditorSection>

      <EditorSection title="Social links" description="Icons in the header and footer. Leave a URL blank to hide that link.">
        {draft.socials.map((item, index) => (
          <ItemCard key={item.id} title={item.label || "Social link"} actions={
            <ItemActions
              disableUp={index === 0}
              disableDown={index === draft.socials.length - 1}
              onUp={() => setDraft({ ...draft, socials: moveItem(draft.socials, index, -1) })}
              onDown={() => setDraft({ ...draft, socials: moveItem(draft.socials, index, 1) })}
              onRemove={() => setDraft({ ...draft, socials: draft.socials.filter((row) => row.id !== item.id) })}
            />
          }>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Label"><input className={inputClass} value={item.label} onChange={(e) => {
                const socials = draft.socials.slice();
                socials[index] = { ...item, label: e.target.value };
                setDraft({ ...draft, socials });
              }} /></Field>
              <Field label="URL"><input className={inputClass} value={item.href} placeholder="https://" onChange={(e) => {
                const socials = draft.socials.slice();
                socials[index] = { ...item, href: e.target.value };
                setDraft({ ...draft, socials });
              }} /></Field>
              <Field label="Icon">
                <select className={inputClass} value={item.icon} onChange={(e) => {
                  const icon = e.target.value;
                  if (icon !== "github" && icon !== "linkedin" && icon !== "mail") return;
                  const socials = draft.socials.slice();
                  socials[index] = { ...item, icon };
                  setDraft({ ...draft, socials });
                }}>
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="mail">Email</option>
                </select>
              </Field>
            </div>
          </ItemCard>
        ))}
        <AddButton onClick={() => setDraft({ ...draft, socials: [...draft.socials, { id: newId("social"), label: "Link", href: "", icon: "github" }] })}>
          Add social link
        </AddButton>
      </EditorSection>

      <EditorSection title="Buttons" description="The actions under your name. Primary is the filled button. Resume downloads the PDF from the Resume page.">
        {draft.ctas.map((item, index) => (
          <ItemCard key={item.id} title={item.label || "Button"} actions={
            <ItemActions
              disableUp={index === 0}
              disableDown={index === draft.ctas.length - 1}
              onUp={() => setDraft({ ...draft, ctas: moveItem(draft.ctas, index, -1) })}
              onDown={() => setDraft({ ...draft, ctas: moveItem(draft.ctas, index, 1) })}
              onRemove={() => setDraft({ ...draft, ctas: draft.ctas.filter((row) => row.id !== item.id) })}
            />
          }>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Label"><input className={inputClass} value={item.label} onChange={(e) => {
                const ctas = draft.ctas.slice();
                ctas[index] = { ...item, label: e.target.value };
                setDraft({ ...draft, ctas });
              }} /></Field>
              <Field label="Link" hint="Use #projects or a full URL. Leave blank when this button downloads the resume.">
                <input className={inputClass} value={item.href} onChange={(e) => {
                  const ctas = draft.ctas.slice();
                  ctas[index] = { ...item, href: e.target.value };
                  setDraft({ ...draft, ctas });
                }} />
              </Field>
              <Field label="Style">
                <select className={inputClass} value={item.variant} onChange={(e) => {
                  const variant = e.target.value;
                  if (variant !== "primary" && variant !== "secondary" && variant !== "ghost") return;
                  const ctas = draft.ctas.slice();
                  ctas[index] = { ...item, variant };
                  setDraft({ ...draft, ctas });
                }}>
                  <option value="primary">Filled button</option>
                  <option value="secondary">Outlined button</option>
                  <option value="ghost">Text link</option>
                </select>
              </Field>
              <Field label="What it does">
                <select className={inputClass} value={item.action} onChange={(e) => {
                  const action = e.target.value;
                  if (action !== "link" && action !== "resume") return;
                  const ctas = draft.ctas.slice();
                  ctas[index] = { ...item, action };
                  setDraft({ ...draft, ctas });
                }}>
                  <option value="link">Open the link</option>
                  <option value="resume">Download the resume PDF</option>
                </select>
              </Field>
            </div>
          </ItemCard>
        ))}
        <AddButton onClick={() => setDraft({ ...draft, ctas: [...draft.ctas, { id: newId("cta"), label: "New button", variant: "secondary", action: "link", href: "#contact" }] })}>
          Add button
        </AddButton>
      </EditorSection>
      <SaveBar pending={pending} error={error} saved={saved} onSave={save} />
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
    setSaved(false);
    setError("");
    const message = await saveContent("skills", draft);
    setError(message ?? "");
    setSaved(!message);
    setPending(false);
    if (!message) router.refresh();
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Section text" description="The title above the skill grid on the public site.">
        <Field label="Heading"><input className={inputClass} value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} /></Field>
        <Field label="Subheading"><input className={inputClass} value={draft.subheading} onChange={(e) => setDraft({ ...draft, subheading: e.target.value })} /></Field>
      </EditorSection>
      {draft.categories.map((category, categoryIndex) => (
        <ItemCard
          key={category.id}
          title={category.name || "Category"}
          subtitle={`${category.skills.length} skill${category.skills.length === 1 ? "" : "s"}`}
          actions={
            <ItemActions
              disableUp={categoryIndex === 0}
              disableDown={categoryIndex === draft.categories.length - 1}
              onUp={() => setDraft({ ...draft, categories: moveItem(draft.categories, categoryIndex, -1) })}
              onDown={() => setDraft({ ...draft, categories: moveItem(draft.categories, categoryIndex, 1) })}
              onRemove={() => setDraft({ ...draft, categories: draft.categories.filter((row) => row.id !== category.id) })}
            />
          }
        >
          <Field label="Category name">
            <input className={inputClass} value={category.name} onChange={(e) => {
              const categories = draft.categories.slice();
              categories[categoryIndex] = { ...category, name: e.target.value };
              setDraft({ ...draft, categories });
            }} />
          </Field>
          <div className="space-y-2">
            {category.skills.map((skill, skillIndex) => (
              <div key={skill.id} className="flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 p-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                  <SkillIcon name={skill.name} icon={skill.icon} size={28} />
                </span>
                <input
                  className={controlClass}
                  value={skill.name}
                  placeholder="Python, Java, Docker…"
                  aria-label={`Skill ${skillIndex + 1} in ${category.name}`}
                  onChange={(e) => {
                    const name = e.target.value;
                    const logo = resolveSkillLogo(name);
                    const skills = category.skills.slice();
                    skills[skillIndex] = { ...skill, name, icon: logo?.slug ?? skill.icon };
                    const categories = draft.categories.slice();
                    categories[categoryIndex] = { ...category, skills };
                    setDraft({ ...draft, categories });
                  }}
                />
                <button
                  type="button"
                  className="shrink-0 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50"
                  onClick={() => {
                    const categories = draft.categories.slice();
                    categories[categoryIndex] = { ...category, skills: category.skills.filter((row) => row.id !== skill.id) };
                    setDraft({ ...draft, categories });
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <AddButton onClick={() => {
            const categories = draft.categories.slice();
            categories[categoryIndex] = { ...category, skills: [...category.skills, { id: newId("skill"), name: "New skill", icon: "code" }] };
            setDraft({ ...draft, categories });
          }}>
            Add skill
          </AddButton>
        </ItemCard>
      ))}
      <AddButton onClick={() => setDraft({ ...draft, categories: [...draft.categories, { id: newId("cat"), name: "New category", skills: [] }] })}>
        Add category
      </AddButton>
      <SaveBar pending={pending} error={error} saved={saved} onSave={save} />
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
  const [lookupNote, setLookupNote] = useState<Record<string, string>>({});
  const [suggestions, setSuggestions] = useState<{ id: string; items: CompanySuggestion[] } | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState<string | null>(null);
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
    setLookupNote((current) => ({ ...current, [entryId]: "" }));
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
    setLookupNote((current) => ({ ...current, [entry.id]: "" }));
    try {
      const response = await fetch(`/api/admin/company-lookup?name=${encodeURIComponent(query)}`);
      const body = (await response.json().catch(() => null)) as
        | { found?: boolean; logo?: string; logoAlt?: string; website?: string; linkedin?: string; error?: string }
        | null;
      if (!response.ok) {
        setLookupNote((current) => ({ ...current, [entry.id]: body?.error ?? "Could not look up that company." }));
        return;
      }
      if (!body?.found) {
        setLookupNote((current) => ({ ...current, [entry.id]: `No public logo found for ${query}. You can upload one below.` }));
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
    setSaved(false);
    setError("");
    const message = await saveContent("experience", { ...draft, entries: withSequentialOrder(draft.entries) });
    setError(message ?? "");
    setSaved(!message);
    setPending(false);
    if (!message) router.refresh();
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Section text" description="The heading above the experience list.">
        <Field label="Heading"><input className={inputClass} value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} /></Field>
        <Field label="Subheading"><input className={inputClass} value={draft.subheading} onChange={(e) => setDraft({ ...draft, subheading: e.target.value })} /></Field>
      </EditorSection>
      {draft.entries.map((entry, index) => (
        <ItemCard
          key={entry.id}
          title={entry.company || "Company"}
          subtitle={entry.role}
          actions={
            <ItemActions
              disableUp={index === 0}
              disableDown={index === draft.entries.length - 1}
              onUp={() => setDraft((current) => ({ ...current, entries: moveItem(current.entries, index, -1) }))}
              onDown={() => setDraft((current) => ({ ...current, entries: moveItem(current.entries, index, 1) }))}
              onRemove={() => setDraft((current) => ({ ...current, entries: current.entries.filter((row) => row.id !== entry.id) }))}
            />
          }
        >
          <Field label="Company" hint="Type a name and choose a suggestion to fill the logo and links.">
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
                          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-xs font-semibold text-stone-700">{item.name.slice(0, 1)}</span>
                        )}
                        <span>
                          <span className="block text-sm font-semibold text-stone-950">{item.name}</span>
                          <span className="block text-xs text-stone-600">{item.domain}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </Field>
          <p className="text-sm text-stone-700">
            {lookingUp === entry.id ? "Looking up the company logo…" : lookupNote[entry.id] || "The logo appears next to this job on the site."}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Role"><input className={inputClass} value={entry.role} onChange={(e) => update(index, { role: e.target.value })} /></Field>
            <Field label="Dates"><input className={inputClass} value={entry.duration} onChange={(e) => update(index, { duration: e.target.value })} /></Field>
          </div>
          <Field label="What you worked on"><textarea className={inputClass} rows={5} value={entry.description} onChange={(e) => update(index, { description: e.target.value })} /></Field>
          <Field label="Technologies" hint="Separate names with commas.">
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
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Website"><input className={inputClass} value={entry.website} onChange={(e) => update(index, { website: e.target.value })} placeholder="https://" /></Field>
            <Field label="LinkedIn"><input className={inputClass} value={entry.linkedin} onChange={(e) => update(index, { linkedin: e.target.value })} placeholder="https://www.linkedin.com/company/..." /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-[8rem_1fr] sm:items-start">
            <ImagePreview src={entry.logo} alt={entry.logoAlt || entry.company} />
            <FilePicker
              label="Logo file"
              hint="Use this when the automatic lookup has no logo."
              accept="image/*"
              busy={uploadingLogo === entry.id}
              onPick={async (file) => {
                setUploadingLogo(entry.id);
                const uploaded = await uploadFile(file);
                setUploadingLogo(null);
                if ("error" in uploaded) setError(uploaded.error);
                else {
                  setError("");
                  update(index, { logo: uploaded.path, logoAlt: entry.logoAlt || `${entry.company} logo` });
                }
              }}
            />
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={() => {
        const id = newId("exp");
        setTechText((current) => ({ ...current, [id]: "" }));
        setDraft((current) => ({ ...current, entries: [...current.entries, { id, company: "Company", logo: "", logoAlt: "", website: "", linkedin: "", role: "Role", duration: "Dates", description: "What you worked on.", tech: [], order: current.entries.length }] }));
      }}>
        Add experience
      </AddButton>
      <SaveBar pending={pending} error={error} saved={saved} onSave={save} />
    </div>
  );
}

export function ProjectsEditor({ initial }: { initial: ProjectsContent }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  function update(index: number, patch: Partial<ProjectsContent["items"][number]>) {
    setDraft((current) => {
      const items = current.items.slice();
      const row = items[index];
      if (!row) return current;
      items[index] = { ...row, ...patch };
      return { ...current, items };
    });
  }

  async function save() {
    setPending(true);
    setSaved(false);
    setError("");
    const message = await saveContent("projects", { ...draft, items: withSequentialOrder(draft.items) });
    setError(message ?? "");
    setSaved(!message);
    setPending(false);
    if (!message) router.refresh();
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Section text" description="The heading above the project grid.">
        <Field label="Heading"><input className={inputClass} value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} /></Field>
        <Field label="Subheading"><input className={inputClass} value={draft.subheading} onChange={(e) => setDraft({ ...draft, subheading: e.target.value })} /></Field>
      </EditorSection>
      {draft.items.map((item, index) => (
        <ItemCard
          key={item.id}
          title={item.title || "Project"}
          subtitle={item.featured ? "Shown with a featured badge" : "Standard project card"}
          actions={
            <ItemActions
              disableUp={index === 0}
              disableDown={index === draft.items.length - 1}
              onUp={() => setDraft({ ...draft, items: moveItem(draft.items, index, -1) })}
              onDown={() => setDraft({ ...draft, items: moveItem(draft.items, index, 1) })}
              onRemove={() => setDraft({ ...draft, items: draft.items.filter((row) => row.id !== item.id) })}
            />
          }
        >
          <CheckField
            label="Featured project"
            hint="Featured projects get a badge on the public site."
            checked={item.featured}
            onChange={(featured) => update(index, { featured })}
          />
          <Field label="Title"><input className={inputClass} value={item.title} onChange={(e) => update(index, { title: e.target.value })} /></Field>
          <Field label="Description"><textarea className={inputClass} rows={3} value={item.description} onChange={(e) => update(index, { description: e.target.value })} /></Field>
          <TechListField label="Technologies" values={item.tech} onChange={(tech) => update(index, { tech })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="GitHub URL"><input className={inputClass} value={item.github} placeholder="https://" onChange={(e) => update(index, { github: e.target.value })} /></Field>
            <Field label="Live demo URL"><input className={inputClass} value={item.demo} placeholder="https://" onChange={(e) => update(index, { demo: e.target.value })} /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-[8rem_1fr] sm:items-start">
            <ImagePreview src={item.image} alt={item.imageAlt || item.title} />
            <div className="space-y-3">
              <Field label="Image description"><input className={inputClass} value={item.imageAlt} onChange={(e) => update(index, { imageAlt: e.target.value })} /></Field>
              <FilePicker
                label="Cover image"
                accept="image/*"
                busy={uploadingId === item.id}
                onPick={async (file) => {
                  setUploadingId(item.id);
                  const uploaded = await uploadFile(file);
                  setUploadingId(null);
                  if ("error" in uploaded) setError(uploaded.error);
                  else {
                    setError("");
                    update(index, { image: uploaded.path, imageAlt: item.imageAlt || item.title });
                  }
                }}
              />
            </div>
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={() => setDraft({ ...draft, items: [...draft.items, { id: newId("project"), title: "New project", description: "Short description.", tech: [], image: "", imageAlt: "", github: "", demo: "", featured: false, order: draft.items.length }] })}>
        Add project
      </AddButton>
      <SaveBar pending={pending} error={error} saved={saved} onSave={save} />
    </div>
  );
}

const CERT_FIELDS = [
  { key: "title", label: "Title" },
  { key: "issuer", label: "Issuer" },
  { key: "detail", label: "Detail" },
  { key: "year", label: "Year" },
] as const;

export function CertificationsEditor({ initial }: { initial: CertificationsContent }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    setSaved(false);
    setError("");
    const message = await saveContent("certifications", { ...draft, entries: withSequentialOrder(draft.entries) });
    setError(message ?? "");
    setSaved(!message);
    setPending(false);
    if (!message) router.refresh();
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Section text" description="The heading above the certification list.">
        <Field label="Heading"><input className={inputClass} value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} /></Field>
        <Field label="Subheading"><input className={inputClass} value={draft.subheading} onChange={(e) => setDraft({ ...draft, subheading: e.target.value })} /></Field>
      </EditorSection>
      {draft.entries.map((entry, index) => (
        <ItemCard
          key={entry.id}
          title={entry.title || "Certification"}
          subtitle={entry.issuer}
          actions={
            <ItemActions
              disableUp={index === 0}
              disableDown={index === draft.entries.length - 1}
              onUp={() => setDraft({ ...draft, entries: moveItem(draft.entries, index, -1) })}
              onDown={() => setDraft({ ...draft, entries: moveItem(draft.entries, index, 1) })}
              onRemove={() => setDraft({ ...draft, entries: draft.entries.filter((row) => row.id !== entry.id) })}
            />
          }
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {CERT_FIELDS.map((field) => (
              <Field key={field.key} label={field.label}>
                <input className={inputClass} value={entry[field.key]} onChange={(e) => {
                  const entries = draft.entries.slice();
                  const current = entries[index];
                  if (!current) return;
                  entries[index] = { ...current, [field.key]: e.target.value };
                  setDraft({ ...draft, entries });
                }} />
              </Field>
            ))}
          </div>
        </ItemCard>
      ))}
      <AddButton onClick={() => setDraft({ ...draft, entries: [...draft.entries, { id: newId("cert"), title: "Certification", issuer: "Issuer", detail: "Detail", year: "", order: draft.entries.length }] })}>
        Add certification
      </AddButton>
      <SaveBar pending={pending} error={error} saved={saved} onSave={save} />
    </div>
  );
}

export function ResumeEditor({ initial }: { initial: ResumeContent }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);
  const pdf = useUpload(
    (uploaded) => {
      setError("");
      setDraft((current) => ({ ...current, file: uploaded.path, fileName: uploaded.fileName }));
    },
    setError,
  );

  async function save() {
    setPending(true);
    setSaved(false);
    setError("");
    const message = await saveContent("resume", draft);
    setError(message ?? "");
    setSaved(!message);
    setPending(false);
    if (!message) router.refresh();
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Section text" description="Copy around the resume block on the public site.">
        <Field label="Heading"><input className={inputClass} value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} /></Field>
        <Field label="Subheading"><input className={inputClass} value={draft.subheading} onChange={(e) => setDraft({ ...draft, subheading: e.target.value })} /></Field>
        <Field label="Download button label"><input className={inputClass} value={draft.buttonLabel} onChange={(e) => setDraft({ ...draft, buttonLabel: e.target.value })} /></Field>
        <Field label="Message when no PDF is uploaded"><input className={inputClass} value={draft.emptyLabel} onChange={(e) => setDraft({ ...draft, emptyLabel: e.target.value })} /></Field>
        <CheckField
          label="Show a PDF preview"
          hint="Visitors can read the resume on the page as well as download it."
          checked={draft.showPreview}
          onChange={(showPreview) => setDraft({ ...draft, showPreview })}
        />
      </EditorSection>
      <EditorSection title="PDF file" description="This is the file the download button and the hero resume button use.">
        <p className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm text-stone-800">
          {draft.file ? `Current file: ${draft.fileName || draft.file}` : "No PDF uploaded yet."}
        </p>
        <FilePicker label="Upload a PDF" accept="application/pdf" busy={pdf.busy} onPick={pdf.pick} />
      </EditorSection>
      <SaveBar pending={pending} error={error} saved={saved} onSave={save} />
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
    setSaved(false);
    setError("");
    const message = await saveContent("site", draft);
    setError(message ?? "");
    setSaved(!message);
    setPending(false);
    if (!message) router.refresh();
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Search result" description="The title and summary browsers and search engines show for this site.">
        <Field label="Page title"><input className={inputClass} value={draft.seo.title} onChange={(e) => setDraft({ ...draft, seo: { ...draft.seo, title: e.target.value } })} /></Field>
        <Field label="Description"><textarea className={inputClass} rows={3} value={draft.seo.description} onChange={(e) => setDraft({ ...draft, seo: { ...draft.seo, description: e.target.value } })} /></Field>
      </EditorSection>
      <EditorSection title="Footer" description="Text at the bottom of every page. {year} is replaced with the current year.">
        <Field label="Copyright line"><input className={inputClass} value={draft.footer.copyright} onChange={(e) => setDraft({ ...draft, footer: { ...draft.footer, copyright: e.target.value } })} /></Field>
        <Field label="Short note"><input className={inputClass} value={draft.footer.note} onChange={(e) => setDraft({ ...draft, footer: { ...draft.footer, note: e.target.value } })} /></Field>
      </EditorSection>
      <EditorSection title="Labels" description="Small bits of interface text used across the site.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Open menu"><input className={inputClass} value={draft.ui.openMenu} onChange={(e) => setDraft({ ...draft, ui: { ...draft.ui, openMenu: e.target.value } })} /></Field>
          <Field label="Close menu"><input className={inputClass} value={draft.ui.closeMenu} onChange={(e) => setDraft({ ...draft, ui: { ...draft.ui, closeMenu: e.target.value } })} /></Field>
          <Field label="Featured badge"><input className={inputClass} value={draft.ui.featuredLabel} onChange={(e) => setDraft({ ...draft, ui: { ...draft.ui, featuredLabel: e.target.value } })} /></Field>
          <Field label="GitHub link"><input className={inputClass} value={draft.ui.githubLabel} onChange={(e) => setDraft({ ...draft, ui: { ...draft.ui, githubLabel: e.target.value } })} /></Field>
          <Field label="Demo link"><input className={inputClass} value={draft.ui.demoLabel} onChange={(e) => setDraft({ ...draft, ui: { ...draft.ui, demoLabel: e.target.value } })} /></Field>
        </div>
      </EditorSection>
      <EditorSection title="Navigation" description="Links in the top menu. Use a hash such as #projects to scroll to a section.">
        {draft.nav.map((item, index) => (
          <ItemCard
            key={item.id}
            title={item.label || "Menu link"}
            subtitle={item.href}
            actions={
              <ItemActions
                disableUp={index === 0}
                disableDown={index === draft.nav.length - 1}
                onUp={() => setDraft({ ...draft, nav: moveItem(draft.nav, index, -1) })}
                onDown={() => setDraft({ ...draft, nav: moveItem(draft.nav, index, 1) })}
                onRemove={() => setDraft({ ...draft, nav: draft.nav.filter((row) => row.id !== item.id) })}
              />
            }
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Label"><input className={inputClass} value={item.label} onChange={(e) => {
                const nav = draft.nav.slice();
                nav[index] = { ...item, label: e.target.value };
                setDraft({ ...draft, nav });
              }} /></Field>
              <Field label="Link"><input className={inputClass} value={item.href} onChange={(e) => {
                const nav = draft.nav.slice();
                nav[index] = { ...item, href: e.target.value };
                setDraft({ ...draft, nav });
              }} /></Field>
            </div>
          </ItemCard>
        ))}
        <AddButton onClick={() => setDraft({ ...draft, nav: [...draft.nav, { id: newId("nav"), label: "New link", href: "#top" }] })}>
          Add menu link
        </AddButton>
      </EditorSection>
      <SaveBar pending={pending} error={error} saved={saved} onSave={save} />
    </div>
  );
}

const CONTACT_FIELDS: { key: keyof ContactContent["fields"]; label: string; hint: string }[] = [
  { key: "name", label: "Name field", hint: "Label above the name box." },
  { key: "email", label: "Email field", hint: "Label above the email box." },
  { key: "message", label: "Message field", hint: "Label above the message box." },
  { key: "submit", label: "Send button", hint: "Text on the button before it is clicked." },
  { key: "sending", label: "Sending label", hint: "Text on the button while the message is sending." },
];

const CONTACT_ERRORS: { key: keyof ContactContent["validation"]; label: string }[] = [
  { key: "name", label: "Missing name" },
  { key: "email", label: "Invalid email" },
  { key: "message", label: "Missing message" },
];

export function ContactEditor({ initial }: { initial: ContactContent }) {
  const router = useRouter();
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    setSaved(false);
    setError("");
    const message = await saveContent("contact", draft);
    setError(message ?? "");
    setSaved(!message);
    setPending(false);
    if (!message) router.refresh();
  }

  return (
    <div className="space-y-6">
      <EditorSection title="Section text" description="The heading and the note next to your email address.">
        <Field label="Heading"><input className={inputClass} value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} /></Field>
        <Field label="Subheading"><textarea className={inputClass} rows={3} value={draft.subheading} onChange={(e) => setDraft({ ...draft, subheading: e.target.value })} /></Field>
        <Field label="Direct contact label"><input className={inputClass} value={draft.directLabel} onChange={(e) => setDraft({ ...draft, directLabel: e.target.value })} /></Field>
      </EditorSection>
      <EditorSection title="After someone sends a message" description="These sentences replace the form for a moment after submit.">
        <Field label="Success message"><input className={inputClass} value={draft.successMessage} onChange={(e) => setDraft({ ...draft, successMessage: e.target.value })} /></Field>
        <Field label="Error message"><input className={inputClass} value={draft.errorMessage} onChange={(e) => setDraft({ ...draft, errorMessage: e.target.value })} /></Field>
      </EditorSection>
      <EditorSection title="Form labels" description="The words on the contact form itself.">
        {CONTACT_FIELDS.map((field) => (
          <Field key={field.key} label={field.label} hint={field.hint}>
            <input className={inputClass} value={draft.fields[field.key]} onChange={(e) => setDraft({ ...draft, fields: { ...draft.fields, [field.key]: e.target.value } })} />
          </Field>
        ))}
      </EditorSection>
      <EditorSection title="Validation messages" description="Shown under a field when the visitor leaves it incomplete.">
        {CONTACT_ERRORS.map((field) => (
          <Field key={field.key} label={field.label}>
            <input className={inputClass} value={draft.validation[field.key]} onChange={(e) => setDraft({ ...draft, validation: { ...draft.validation, [field.key]: e.target.value } })} />
          </Field>
        ))}
      </EditorSection>
      <SaveBar pending={pending} error={error} saved={saved} onSave={save} />
    </div>
  );
}

export function MessagesPanel({ initial }: { initial: ContactMessage[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [error, setError] = useState("");

  async function remove(id: string) {
    setError("");
    const response = await fetch(`/api/admin/messages?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (!response.ok) {
      setError("That message could not be deleted. Refresh the page and try again.");
      return;
    }
    setItems((current) => current.filter((item) => item.id !== id));
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-4 py-10 text-center">
        <p className="text-base font-semibold text-stone-950">No messages yet</p>
        <p className="mt-1 text-sm text-stone-600">Messages from the contact form will show up here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
          {error}
        </p>
      ) : null}
      <p className="text-sm text-stone-600">{items.length} message{items.length === 1 ? "" : "s"}</p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item.id} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-base font-semibold text-stone-950">{item.name}</p>
                <a href={`mailto:${item.email}`} className="text-sm font-medium text-indigo-700 underline-offset-2 hover:underline">
                  {item.email}
                </a>
              </div>
              <button
                type="button"
                onClick={() => remove(item.id)}
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
              >
                Delete
              </button>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-stone-800">{item.message}</p>
            <p className="mt-3 text-xs font-medium text-stone-600">{formatWhen(item.createdAt)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
