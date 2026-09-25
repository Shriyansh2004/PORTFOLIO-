"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CertificationsEditor,
  ContactEditor,
  ExperienceEditor,
  MessagesPanel,
  ProfileEditor,
  ProjectsEditor,
  ResumeEditor,
  SiteEditor,
  SkillsEditor,
} from "@/components/admin/Editors";
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

const TABS = [
  { id: "Profile", hint: "Name, photo, about, and buttons on the home page" },
  { id: "Skills", hint: "Skill groups shown in the skills section" },
  { id: "Experience", hint: "Jobs, logos, and what you worked on" },
  { id: "Projects", hint: "Project cards, links, and cover images" },
  { id: "Certifications", hint: "Certificates and the year you earned them" },
  { id: "Resume", hint: "The PDF visitors can preview and download" },
  { id: "Site", hint: "Page title, menu, and footer text" },
  { id: "Contact", hint: "Contact form labels and the messages visitors see" },
  { id: "Messages", hint: "Notes people sent from the contact form" },
] as const;

type Tab = (typeof TABS)[number]["id"];

export function AdminDashboard({
  profile,
  skills,
  experience,
  projects,
  certifications,
  resume,
  site,
  contact,
  messages,
}: {
  profile: Profile;
  skills: SkillsContent;
  experience: ExperienceContent;
  projects: ProjectsContent;
  certifications: CertificationsContent;
  resume: ResumeContent;
  site: SiteContent;
  contact: ContactContent;
  messages: ContactMessage[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Profile");
  const current = TABS.find((item) => item.id === tab) ?? TABS[0];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[#f6f5f2] text-stone-950">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">Admin</p>
            <p className="text-sm font-semibold text-stone-950">Edit the portfolio</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <a
              href="/"
              className="rounded-full border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              View site
            </a>
            <button
              type="button"
              onClick={logout}
              className="rounded-full bg-stone-900 px-3 py-2 text-sm font-semibold text-white hover:bg-stone-800"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav aria-label="Admin sections" className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={tab === item.id ? "page" : undefined}
              onClick={() => setTab(item.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${
                tab === item.id ? "bg-indigo-600 text-white" : "border border-stone-300 bg-white text-stone-800"
              }`}
            >
              {item.id}
            </button>
          ))}
        </nav>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <nav aria-label="Admin sections" className="sticky top-24 space-y-1 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-current={tab === item.id ? "page" : undefined}
                onClick={() => setTab(item.id)}
                className={`block w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold ${
                  tab === item.id ? "bg-indigo-600 text-white" : "text-stone-800 hover:bg-stone-100"
                }`}
              >
                {item.id}
              </button>
            ))}
          </nav>
        </aside>

        <section className="min-w-0 rounded-3xl border border-stone-200 bg-white p-4 shadow-sm sm:p-6">
          <h1 className="font-serif text-3xl text-stone-950">{current.id}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">{current.hint}</p>
          <div className="mt-6">
            {tab === "Profile" ? <ProfileEditor initial={profile} /> : null}
            {tab === "Skills" ? <SkillsEditor initial={skills} /> : null}
            {tab === "Experience" ? <ExperienceEditor initial={experience} /> : null}
            {tab === "Projects" ? <ProjectsEditor initial={projects} /> : null}
            {tab === "Certifications" ? <CertificationsEditor initial={certifications} /> : null}
            {tab === "Resume" ? <ResumeEditor initial={resume} /> : null}
            {tab === "Site" ? <SiteEditor initial={site} /> : null}
            {tab === "Contact" ? <ContactEditor initial={contact} /> : null}
            {tab === "Messages" ? <MessagesPanel initial={messages} /> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
