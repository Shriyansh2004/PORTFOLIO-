export interface SkillLogo {
  slug: string;
  src: string;
}

const FILES: Record<string, string> = {
  java: "/skill-logos/java.svg",
  python: "/skill-logos/python.svg",
  spring: "/skill-logos/spring.svg",
  springboot: "/skill-logos/spring.svg",
  fastapi: "/skill-logos/fastapi.svg",
  rest: "/skill-logos/rest.svg",
  restapi: "/skill-logos/rest.svg",
  restapis: "/skill-logos/rest.svg",
  websocket: "/skill-logos/websockets.svg",
  websockets: "/skill-logos/websockets.svg",
  nextjs: "/skill-logos/nextjs.svg",
  next: "/skill-logos/nextjs.svg",
  typescript: "/skill-logos/typescript.svg",
  ts: "/skill-logos/typescript.svg",
  postgresql: "/skill-logos/postgresql.svg",
  postgres: "/skill-logos/postgresql.svg",
  pg: "/skill-logos/postgresql.svg",
  aws: "/skill-logos/aws.svg",
  amazonwebservices: "/skill-logos/aws.svg",
  amazonaws: "/skill-logos/aws.svg",
  docker: "/skill-logos/docker.svg",
  git: "/skill-logos/git.svg",
  github: "/skill-logos/github.svg",
  javascript: "/skill-logos/javascript.svg",
  js: "/skill-logos/javascript.svg",
  mysql: "/skill-logos/mysql.svg",
};

function keyOf(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

export function resolveSkillLogo(name: string): SkillLogo | null {
  const key = keyOf(name);
  const src = FILES[key];
  if (!src) return null;
  return { slug: key, src };
}
