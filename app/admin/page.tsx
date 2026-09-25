import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { readContent, readMessages } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [profile, skills, experience, projects, certifications, resume, site, contact, messages] = await Promise.all([
    readContent("profile"),
    readContent("skills"),
    readContent("experience"),
    readContent("projects"),
    readContent("certifications"),
    readContent("resume"),
    readContent("site"),
    readContent("contact"),
    readMessages(),
  ]);

  return (
    <main className="min-h-screen">
      <AdminDashboard
        profile={profile}
        skills={skills}
        experience={experience}
        projects={projects}
        certifications={certifications}
        resume={resume}
        site={site}
        contact={contact}
        messages={messages.items}
      />
    </main>
  );
}
