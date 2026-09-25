import { SocialLinks } from "@/components/ui/SocialLinks";
import type { Profile, SiteContent } from "@/types/content";

export function Footer({ site, profile }: { site: SiteContent; profile: Profile }) {
  const year = String(new Date().getFullYear());
  return (
    <footer className="border-t border-stone-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-stone-700">{site.footer.copyright.replace("{year}", year)}</p>
          <p className="mt-1 text-sm text-stone-400">{site.footer.note}</p>
        </div>
        <div className="flex flex-col items-start gap-4 sm:items-end">
          <nav className="flex flex-wrap gap-4">
            {site.nav.map((item) => (
              <a key={item.id} href={item.href} className="text-sm text-stone-500 hover:text-stone-900">
                {item.label}
              </a>
            ))}
          </nav>
          <SocialLinks links={profile.socials} />
        </div>
      </div>
    </footer>
  );
}
