export type SocialIcon = "github" | "linkedin" | "mail";

export type CtaVariant = "primary" | "secondary" | "ghost";

export type CtaAction = "link" | "resume";

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: SocialIcon;
}

export interface Cta {
  id: string;
  label: string;
  variant: CtaVariant;
  action: CtaAction;
  href: string;
}

export interface Highlight {
  id: string;
  text: string;
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  year: string;
  detail: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  intro: string;
  photo: string;
  photoAlt: string;
  email: string;
  location: string;
  socials: SocialLink[];
  ctas: Cta[];
  about: {
    heading: string;
    subheading: string;
    bio: string;
    highlights: Highlight[];
    educationHeading: string;
    education: Education[];
  };
}

export interface Skill {
  id: string;
  name: string;
  icon: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: Skill[];
}

export interface SkillsContent {
  heading: string;
  subheading: string;
  categories: SkillCategory[];
}

export interface ExperienceEntry {
  id: string;
  company: string;
  logo: string;
  logoAlt: string;
  website: string;
  linkedin: string;
  role: string;
  duration: string;
  description: string;
  tech: string[];
  order: number;
}

export interface ExperienceContent {
  heading: string;
  subheading: string;
  entries: ExperienceEntry[];
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  detail: string;
  year: string;
  order: number;
}

export interface CertificationsContent {
  heading: string;
  subheading: string;
  entries: Certification[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  imageAlt: string;
  github: string;
  demo: string;
  featured: boolean;
  order: number;
}

export interface ProjectsContent {
  heading: string;
  subheading: string;
  items: Project[];
}

export interface ResumeContent {
  heading: string;
  subheading: string;
  buttonLabel: string;
  file: string;
  fileName: string;
  showPreview: boolean;
  emptyLabel: string;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
}

export interface SiteContent {
  seo: {
    title: string;
    description: string;
  };
  nav: NavLink[];
  footer: {
    copyright: string;
    note: string;
  };
  ui: {
    openMenu: string;
    closeMenu: string;
    featuredLabel: string;
    githubLabel: string;
    demoLabel: string;
  };
}

export interface ContactContent {
  heading: string;
  subheading: string;
  directLabel: string;
  successMessage: string;
  errorMessage: string;
  fields: {
    name: string;
    email: string;
    message: string;
    submit: string;
    sending: string;
  };
  validation: {
    name: string;
    email: string;
    message: string;
  };
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface MessagesFile {
  items: ContactMessage[];
}

export type ContentFile =
  | "profile"
  | "skills"
  | "experience"
  | "projects"
  | "certifications"
  | "resume"
  | "site"
  | "contact";
