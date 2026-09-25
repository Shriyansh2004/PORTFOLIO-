import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Resume } from "@/components/sections/Resume";
import { Skills } from "@/components/sections/Skills";
import { readContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, skills, experience, certifications, projects, resume, site, contact] = await Promise.all([
    readContent("profile"),
    readContent("skills"),
    readContent("experience"),
    readContent("certifications"),
    readContent("projects"),
    readContent("resume"),
    readContent("site"),
    readContent("contact"),
  ]);

  return (
    <>
      <Navbar site={site} name={profile.name} />
      <main>
        <Hero profile={profile} resume={resume} />
        <About profile={profile} />
        <Skills skills={skills} />
        <Experience experience={experience} certifications={certifications} />
        <Projects projects={projects} site={site} />
        <Resume resume={resume} />
        <Contact contact={contact} profile={profile} />
      </main>
      <Footer site={site} profile={profile} />
    </>
  );
}
