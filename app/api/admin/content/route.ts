import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { isContentFile, readContent, writeContent } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(request: Request) {
  if (!(await getSession())) return unauthorized();
  const file = new URL(request.url).searchParams.get("file") ?? "";
  if (!isContentFile(file)) {
    return NextResponse.json({ error: "Unknown content file." }, { status: 400 });
  }
  const data = await readContent(file);
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  if (!(await getSession())) return unauthorized();
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("file" in body) || !("data" in body)) {
    return NextResponse.json({ error: "Expected file and data." }, { status: 400 });
  }
  const file = String((body as { file: unknown }).file);
  if (!isContentFile(file)) {
    return NextResponse.json({ error: "Unknown content file." }, { status: 400 });
  }
  try {
    await writeContent(file, (body as { data: unknown }).data);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message ?? "Invalid content." }, { status: 400 });
    }
    throw error;
  }
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
