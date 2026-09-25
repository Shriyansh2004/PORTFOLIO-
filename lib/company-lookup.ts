import { promises as fs } from "fs";
import path from "path";

export interface CompanyMatch {
  logo: string;
  logoAlt: string;
  website: string;
  linkedin: string;
}

export interface CompanySuggestion extends CompanyMatch {
  name: string;
  domain: string;
}

interface KnownCompany extends CompanySuggestion {
  keys: string[];
}

const KNOWN: KnownCompany[] = [
  {
    name: "KaroCharge",
    domain: "karocharge.com",
    keys: ["karocharge", "karo charge", "future motion", "future motion pvt ltd", "future motion private limited"],
    logo: "/company-logos/karocharge.png",
    logoAlt: "KaroCharge logo",
    website: "https://www.karocharge.com",
    linkedin: "https://www.linkedin.com/company/karocharge",
  },
  {
    name: "HireKarma",
    domain: "hirekarma.in",
    keys: ["hirekarma", "hire karma", "hirekarma pvt ltd", "hirekarma private limited"],
    logo: "/company-logos/hirekarma.png",
    logoAlt: "HireKarma logo",
    website: "https://www.hirekarma.in",
    linkedin: "https://www.linkedin.com/company/hirekarma-pvt-ltd",
  },
];

function keyOf(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/\b(pvt|private|ltd|limited|inc|llc|co)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function knownMatch(name: string): CompanyMatch | null {
  const key = keyOf(name);
  const found = KNOWN.find((company) => company.keys.some((item) => keyOf(item) === key || key.includes(keyOf(item))));
  if (!found) return null;
  return { logo: found.logo, logoAlt: found.logoAlt, website: found.website, linkedin: found.linkedin };
}

interface ClearbitCompany {
  name?: string;
  domain?: string;
}

async function suggestDomain(name: string): Promise<string> {
  const response = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(name)}`, {
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) return "";
  const rows = (await response.json()) as ClearbitCompany[];
  const domain = rows.find((row) => row.domain)?.domain ?? "";
  return domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
}

function absoluteUrl(href: string, base: string) {
  try {
    return new URL(href, base).toString();
  } catch {
    return "";
  }
}

async function readHomepage(website: string) {
  const response = await fetch(website, {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(6000),
    redirect: "follow",
  });
  if (!response.ok) return "";
  return response.text();
}

function linkedinFromHtml(html: string) {
  const match = html.match(/https?:\/\/(?:www\.)?linkedin\.com\/company\/[a-z0-9._%-]+/i);
  return match?.[0]?.replace(/[)\].,]+$/, "") ?? "";
}

function logoFromHtml(html: string, website: string) {
  const patterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<link[^>]+rel=["'][^"']*apple-touch-icon[^"']*["'][^>]+href=["']([^"']+)["']/i,
    /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'][^"']*apple-touch-icon[^"']*["']/i,
    /<link[^>]+rel=["'][^"']*icon[^"']*["'][^>]+href=["']([^"']+)["']/i,
  ];
  for (const pattern of patterns) {
    const href = html.match(pattern)?.[1];
    if (href) return absoluteUrl(href, website);
  }
  return "";
}

async function saveRemoteLogo(url: string, slug: string) {
  const response = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    signal: AbortSignal.timeout(6000),
  });
  if (!response.ok) return "";
  const type = response.headers.get("content-type") ?? "";
  const extension = type.includes("svg") ? "svg" : type.includes("webp") ? "webp" : type.includes("jpeg") ? "jpg" : "png";
  if (!type.startsWith("image/")) return "";
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 80 || bytes.length > 2_000_000) return "";
  const directory = path.join(process.cwd(), "public", "company-logos");
  await fs.mkdir(directory, { recursive: true });
  const fileName = `${slug}.${extension}`;
  await fs.writeFile(path.join(directory, fileName), bytes);
  return `/company-logos/${fileName}`;
}

function slugOf(name: string) {
  return keyOf(name).replace(/\s+/g, "-").slice(0, 48) || "company";
}

export async function suggestCompanies(query: string): Promise<CompanySuggestion[]> {
  const key = keyOf(query);
  if (key.length < 2) return [];

  const known = KNOWN.filter((company) => company.keys.some((item) => keyOf(item).includes(key) || key.includes(keyOf(item))) || keyOf(company.name).includes(key)).map(({ keys: _keys, ...company }) => company);

  let remote: CompanySuggestion[] = [];
  try {
    const response = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${encodeURIComponent(query)}`, {
      signal: AbortSignal.timeout(4000),
    });
    if (response.ok) {
      const rows = (await response.json()) as ClearbitCompany[];
      remote = rows
        .filter((row) => row.name && row.domain)
        .slice(0, 6)
        .map((row) => ({
          name: row.name ?? "",
          domain: row.domain ?? "",
          logo: "",
          logoAlt: "",
          website: `https://${row.domain}`,
          linkedin: "",
        }));
    }
  } catch {
    remote = [];
  }

  const seen = new Set(known.map((company) => company.domain));
  return [...known, ...remote.filter((company) => !seen.has(company.domain))].slice(0, 6);
}

export async function lookupCompany(name: string): Promise<CompanyMatch | null> {
  const known = knownMatch(name);
  if (known) return known;

  const domain = await suggestDomain(name).catch(() => "");
  if (!domain) return null;
  const website = `https://${domain}`;
  const html = await readHomepage(website).catch(() => "");
  const linkedin = linkedinFromHtml(html);
  const remoteLogo = logoFromHtml(html, website);
  const logo = remoteLogo ? await saveRemoteLogo(remoteLogo, slugOf(name)).catch(() => "") : "";

  return {
    logo,
    logoAlt: logo ? `${name} logo` : "",
    website,
    linkedin,
  };
}
