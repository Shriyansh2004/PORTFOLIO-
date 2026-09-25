import {
  Box,
  Braces,
  Cable,
  Cloud,
  Code2,
  Database,
  GitBranch,
  Layers,
  Server,
  Terminal,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  server: Server,
  zap: Zap,
  braces: Braces,
  terminal: Terminal,
  cable: Cable,
  workflow: Workflow,
  layers: Layers,
  code: Code2,
  database: Database,
  cloud: Cloud,
  box: Box,
  git: GitBranch,
};

export const SKILL_ICON_KEYS = Object.keys(ICONS);

export function SkillIcon({ icon, name }: { icon: string; name: string }) {
  const Icon = ICONS[icon] ?? Code2;
  return (
    <span aria-label={name} className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
      <Icon size={16} aria-hidden />
    </span>
  );
}
