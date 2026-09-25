import { MovingBorderLink } from "@/components/ui/MovingBorderLink";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { Spotlight } from "@/components/ui/Spotlight";
import type { Cta, Profile, ResumeContent } from "@/types/content";

function ctaHref(cta: Cta, resume: ResumeContent): string | null {
  if (cta.action === "resume") return resume.file.trim() ? resume.file : null;
  return cta.href.trim() ? cta.href : null;
}

export function Hero({ profile, resume }: { profile: Profile; resume: ResumeContent }) {
  const initials = profile.name.slice(0, 1).toUpperCase();

  return (
    <Spotlight>
      <section id="top" className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-16 md:grid-cols-[1.4fr_0.8fr] md:pt-24">
        <div>
          <p className="text-sm font-medium text-indigo-600">{profile.title}</p>
          <h1 className="mt-3 font-serif text-5xl tracking-tight text-stone-900 sm:text-6xl">
            {profile.name}
          </h1>
          <p className="mt-4 max-w-xl text-lg text-stone-700">{profile.tagline}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-stone-500">{profile.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {profile.ctas.map((cta) => {
              const href = ctaHref(cta, resume);
              if (!href) return null;
              if (cta.variant === "primary") {
                return (
                  <MovingBorderLink key={cta.id} href={href} download={cta.action === "resume"}>
                    {cta.label}
                  </MovingBorderLink>
                );
              }
              const tone =
                cta.variant === "secondary"
                  ? "border border-stone-200 bg-white text-stone-800 shadow-sm hover:border-indigo-200"
                  : "text-stone-600 hover:text-stone-900";
              return (
                <a
                  key={cta.id}
                  href={href}
                  download={cta.action === "resume" || undefined}
                  className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium transition ${tone}`}
                >
                  {cta.label}
                </a>
              );
            })}
          </div>
          <div className="mt-8">
            <SocialLinks links={profile.socials} />
          </div>
        </div>
        <div className="justify-self-center">
          <div className="relative h-64 w-64 overflow-hidden rounded-[2rem] border border-white bg-white shadow-[0_20px_60px_-30px_rgba(79,70,229,0.45)] sm:h-72 sm:w-72">
            {profile.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photo} alt={profile.photoAlt} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-indigo-50 to-stone-100 font-serif text-7xl text-indigo-700">
                {initials}
              </div>
            )}
          </div>
          {profile.location ? (
            <p className="mt-4 text-center text-sm text-stone-500">{profile.location}</p>
          ) : null}
        </div>
      </section>
    </Spotlight>
  );
}
