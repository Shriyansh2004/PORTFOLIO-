import { ContactForm } from "@/components/sections/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SocialLinks } from "@/components/ui/SocialLinks";
import type { ContactContent, Profile } from "@/types/content";

export function Contact({ contact, profile }: { contact: ContactContent; profile: Profile }) {
  return (
    <section id="contact" className="scroll-mt-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <SectionHeading title={contact.heading} subtitle={contact.subheading} />
          <p className="mt-8 text-sm font-medium text-stone-500">{contact.directLabel}</p>
          {profile.email ? (
            <a href={`mailto:${profile.email}`} className="mt-2 block text-sm text-indigo-600">
              {profile.email}
            </a>
          ) : null}
          <div className="mt-4">
            <SocialLinks links={profile.socials} />
          </div>
        </Reveal>
        <Reveal>
          <ContactForm contact={contact} />
        </Reveal>
      </div>
    </section>
  );
}
