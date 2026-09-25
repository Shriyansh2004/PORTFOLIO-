import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import { contentSchemas } from "@/lib/schemas";
import type { ContentFile, MessagesFile } from "@/types/content";

const dataDir = path.join(process.cwd(), "data");

export const CONTENT_FILES: ContentFile[] = [
  "profile",
  "skills",
  "experience",
  "projects",
  "certifications",
  "resume",
  "site",
  "contact",
];

export function isContentFile(value: string): value is ContentFile {
  return CONTENT_FILES.includes(value as ContentFile);
}

async function readJsonFile<T>(filename: string): Promise<T> {
  const raw = await fs.readFile(path.join(dataDir, filename), "utf8");
  return JSON.parse(raw) as T;
}

export async function readContent<K extends ContentFile>(
  file: K,
): Promise<z.output<(typeof contentSchemas)[K]>> {
  const json = await readJsonFile<unknown>(`${file}.json`);
  return contentSchemas[file].parse(json) as z.output<(typeof contentSchemas)[K]>;
}

export async function writeContent(file: ContentFile, data: unknown): Promise<void> {
  const parsed = contentSchemas[file].parse(data);
  const target = path.join(dataDir, `${file}.json`);
  const temp = `${target}.${process.pid}.tmp`;
  await fs.writeFile(temp, `${JSON.stringify(parsed, null, 2)}\n`, "utf8");
  await fs.rename(temp, target);
}

export async function readMessages(): Promise<MessagesFile> {
  try {
    return await readJsonFile<MessagesFile>("messages.json");
  } catch {
    return { items: [] };
  }
}

export async function writeMessages(data: MessagesFile): Promise<void> {
  const target = path.join(dataDir, "messages.json");
  const temp = `${target}.${process.pid}.tmp`;
  await fs.writeFile(temp, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await fs.rename(temp, target);
}

export function uploadsDir(): string {
  return path.join(process.cwd(), "public", "uploads");
}
