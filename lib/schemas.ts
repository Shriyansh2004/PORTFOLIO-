import { z } from "zod";
import type {
  CertificationsContent,
  ContactContent,
  ExperienceContent,
  Profile,
  ProjectsContent,
  ResumeContent,
  SiteContent,
  SkillsContent,
} from "@/types/content";

const optionalUrl = z
  .string()
  .refine(
    (value) => value.trim() === "" || z.string().url().safeParse(value).success,
    "Enter a valid URL or leave this blank",
  );

const optionalEmail = z
  .string()
  .refine(
    (value) =>
      value.trim() === "" || z.string().email().safeParse(value).success,
    "Enter a valid email or leave this blank",
  );

export const profileSchema = z.object({
  name: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(120),
  tagline: z.string().trim().min(1).max(180),
  intro: z.string().trim().min(1).max(600),
  photo: z.string(),
  photoAlt: z.string().max(160),
  email: optionalEmail,
  location: z.string().max(120),
  socials: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().trim().min(1).max(40),
        href: optionalUrl,
        icon: z.enum(["github", "linkedin", "mail"]),
      }),
    )
    .max(8),
  ctas: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().trim().min(1).max(40),
        variant: z.enum(["primary", "secondary", "ghost"]),
        action: z.enum(["link", "resume"]),
        href: z.string().max(300),
      }),
    )
    .max(6),
  about: z.object({
    heading: z.string().trim().min(1).max(80),
    subheading: z.string().max(200),
    bio: z.string().trim().min(1).max(2000),
    highlights: z
      .array(
        z.object({
          id: z.string().min(1),
          text: z.string().trim().min(1).max(240),
        }),
      )
      .max(8),
    educationHeading: z.string().trim().min(1).max(80),
    education: z
      .array(
        z.object({
          id: z.string().min(1),
          degree: z.string().trim().min(1).max(160),
          school: z.string().trim().min(1).max(160),
          year: z.string().trim().min(1).max(40),
          detail: z.string().max(300),
        }),
      )
      .max(6),
  }),
}) satisfies z.ZodType<Profile>;

const skillSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(60),
  icon: z.string().trim().min(1).max(40),
});

export const skillsSchema = z.object({
  heading: z.string().trim().min(1).max(80),
  subheading: z.string().max(240),
  categories: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().trim().min(1).max(60),
        skills: z.array(skillSchema).max(24),
      }),
    )
    .max(12),
}) satisfies z.ZodType<SkillsContent>;

export const experienceSchema = z.object({
  heading: z.string().trim().min(1).max(80),
  subheading: z.string().max(240),
  entries: z
    .array(
      z.object({
        id: z.string().min(1),
        company: z.string().trim().min(1).max(120),
        logo: z.string(),
        logoAlt: z.string().max(160),
        website: z.string().max(300),
        linkedin: z.string().max(300),
        role: z.string().trim().min(1).max(120),
        duration: z.string().trim().min(1).max(80),
        description: z.string().trim().min(1).max(2400),
        tech: z.array(z.string().trim().min(1).max(80)).max(16),
        order: z.number().int(),
      }),
    )
    .max(20),
}) satisfies z.ZodType<ExperienceContent>;

export const certificationsSchema = z.object({
  heading: z.string().trim().min(1).max(80),
  subheading: z.string().max(240),
  entries: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().trim().min(1).max(120),
        issuer: z.string().trim().min(1).max(120),
        detail: z.string().trim().min(1).max(400),
        year: z.string().max(40),
        order: z.number().int(),
      }),
    )
    .max(12),
}) satisfies z.ZodType<CertificationsContent>;

export const projectsSchema = z.object({
  heading: z.string().trim().min(1).max(80),
  subheading: z.string().max(240),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        title: z.string().trim().min(1).max(80),
        description: z.string().trim().min(1).max(800),
        tech: z.array(z.string().trim().min(1).max(40)).max(16),
        image: z.string(),
        imageAlt: z.string().max(160),
        github: optionalUrl,
        demo: optionalUrl,
        featured: z.boolean(),
        order: z.number().int(),
      }),
    )
    .max(40),
}) satisfies z.ZodType<ProjectsContent>;

export const resumeSchema = z.object({
  heading: z.string().trim().min(1).max(80),
  subheading: z.string().max(300),
  buttonLabel: z.string().trim().min(1).max(60),
  file: z.string(),
  fileName: z.string().max(160),
  showPreview: z.boolean(),
  emptyLabel: z.string().max(200),
}) satisfies z.ZodType<ResumeContent>;

export const siteSchema = z.object({
  seo: z.object({
    title: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(300),
  }),
  nav: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string().trim().min(1).max(40),
        href: z.string().trim().min(1).max(120),
      }),
    )
    .max(12),
  footer: z.object({
    copyright: z.string().trim().min(1).max(160),
    note: z.string().max(200),
  }),
  ui: z.object({
    openMenu: z.string().trim().min(1).max(40),
    closeMenu: z.string().trim().min(1).max(40),
    featuredLabel: z.string().trim().min(1).max(40),
    githubLabel: z.string().trim().min(1).max(40),
    demoLabel: z.string().trim().min(1).max(40),
  }),
}) satisfies z.ZodType<SiteContent>;

export const contactSchema = z.object({
  heading: z.string().trim().min(1).max(80),
  subheading: z.string().max(300),
  directLabel: z.string().trim().min(1).max(80),
  successMessage: z.string().trim().min(1).max(240),
  errorMessage: z.string().trim().min(1).max(240),
  fields: z.object({
    name: z.string().trim().min(1).max(40),
    email: z.string().trim().min(1).max(40),
    message: z.string().trim().min(1).max(40),
    submit: z.string().trim().min(1).max(40),
    sending: z.string().trim().min(1).max(40),
  }),
  validation: z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().min(1).max(120),
    message: z.string().trim().min(1).max(120),
  }),
}) satisfies z.ZodType<ContactContent>;

export const contactSubmissionSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(1).max(4000),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1).max(200),
});

export const contentSchemas = {
  profile: profileSchema,
  skills: skillsSchema,
  experience: experienceSchema,
  projects: projectsSchema,
  certifications: certificationsSchema,
  resume: resumeSchema,
  site: siteSchema,
  contact: contactSchema,
} as const;
