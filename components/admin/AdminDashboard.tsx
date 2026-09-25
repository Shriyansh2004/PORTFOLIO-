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
  "Profile",
  "Skills",
  "Experience",
  "Projects",
  "Certifications",
  "Resume",
  "Site",
  "Contact",
  "Messages",
] as const;

type Tab = (typeof TABS)[number];

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

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[200px_1fr]">
      <aside className="space-y-2">
        <p className="px-3 text-xs font-semibold uppercase tracking-wide text-stone-400">Content</p>
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`block w-full rounded-xl px-3 py-2 text-left text-sm ${tab === item ? "bg-indigo-600 text-white" : "text-stone-600 hover:bg-white"}`}
          >
            {item}
          </button>
        ))}
        <button type="button" onClick={logout} className="mt-4 block px-3 text-sm text-stone-500">
          Sign out
        </button>
        <a href="/" className="block px-3 text-sm text-indigo-600">View site</a>
      </aside>
      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="font-serif text-3xl text-stone-900">{tab}</h1>
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
  );
}
