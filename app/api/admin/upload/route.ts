import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { uploadsDir } from "@/lib/data";

const ALLOWED = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["application/pdf", "pdf"],
]);

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Choose a file to upload." }, { status: 400 });
  }
  const extension = ALLOWED.get(file.type);
  if (!extension) {
    return NextResponse.json({ error: "Upload a PNG, JPG, WEBP, GIF, or PDF." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File must be 5 MB or smaller." }, { status: 400 });
  }

  const name = `${Date.now()}-${randomBytes(4).toString("hex")}.${extension}`;
  const directory = uploadsDir();
  await fs.mkdir(directory, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(directory, name), bytes);
  return NextResponse.json({ path: `/uploads/${name}`, fileName: file.name });
}
