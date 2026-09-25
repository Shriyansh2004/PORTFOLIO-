import { TiltCard } from "@/components/ui/TiltCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { sortByOrder } from "@/lib/reorder";
import type { Project, ProjectsContent, SiteContent } from "@/types/content";

function Cover({ project }: { project: Project }) {
  if (project.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={project.image} alt={project.imageAlt} className="h-40 w-full object-cover" />
    );
  }
  return (
    <div className="flex h-40 items-end bg-gradient-to-br from-indigo-100 via-white to-stone-100 p-5">
      <span className="font-serif text-2xl text-stone-800">{project.title}</span>
    </div>
  );
}

function ProjectCard({
  project,
  site,
  featured,
}: {
  project: Project;
  site: SiteContent;
  featured?: boolean;
}) {
  return (
    <TiltCard className="h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        <Cover project={project} />
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className={`font-medium text-stone-900 ${featured ? "text-xl" : "text-lg"}`}>{project.title}</h3>
            {project.featured ? (
              <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
                {site.ui.featuredLabel}
              </span>
            ) : null}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">{project.description}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.tech.map((item) => (
              <li key={item} className="rounded-full bg-stone-100 px-2.5 py-1 text-xs text-stone-600">
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex gap-4 text-sm">
            {project.github ? (
              <a href={project.github} className="font-medium text-indigo-600 hover:text-indigo-500" target="_blank" rel="noreferrer">
                {site.ui.githubLabel}
              </a>
            ) : null}
            {project.demo ? (
              <a href={project.demo} className="font-medium text-indigo-600 hover:text-indigo-500" target="_blank" rel="noreferrer">
                {site.ui.demoLabel}
              </a>
            ) : null}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}

export function Projects({ projects, site }: { projects: ProjectsContent; site: SiteContent }) {
  const items = sortByOrder(projects.items);
  const featured = items.filter((item) => item.featured);
  const rest = items.filter((item) => !item.featured);

  return (
    <section id="projects" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <SectionHeading title={projects.heading} subtitle={projects.subheading} />
          {featured.length > 0 ? (
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} site={site} featured />
              ))}
            </div>
          ) : null}
          {rest.length > 0 ? (
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {rest.map((project) => (
                <ProjectCard key={project.id} project={project} site={site} />
              ))}
            </div>
          ) : null}
        </Reveal>
      </div>
    </section>
  );
}
