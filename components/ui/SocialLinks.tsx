import { Mail } from "lucide-react";
import type { SocialLink } from "@/types/content";

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.04 10.04 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zM8.5 8.5h3.8v2.1h.05c.53-1 1.84-2.1 3.79-2.1 4.05 0 4.8 2.67 4.8 6.14V24h-4v-7.7c0-1.84-.03-4.2-2.56-4.2-2.56 0-2.95 2-2.95 4.06V24h-4V8.5z" />
    </svg>
  );
}

export function SocialLinks({ links }: { links: SocialLink[] }) {
  const visible = links.filter((link) => link.href.trim().length > 0);
  if (visible.length === 0) return null;

  return (
    <ul className="flex items-center gap-2">
      {visible.map((link) => (
          <li key={link.id}>
            <a
              href={link.href}
              target={link.icon === "mail" ? undefined : "_blank"}
              rel={link.icon === "mail" ? undefined : "noreferrer"}
              aria-label={link.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 shadow-sm transition hover:-translate-y-0.5 hover:text-indigo-600"
            >
              {link.icon === "github" ? <GithubIcon /> : null}
              {link.icon === "linkedin" ? <LinkedinIcon /> : null}
              {link.icon === "mail" ? <Mail size={16} /> : null}
            </a>
          </li>
        ))}
    </ul>
  );
}
