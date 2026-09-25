import { NextResponse } from "next/server";
import { readMessages, writeMessages } from "@/lib/data";
import { contactSubmissionSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = contactSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid message." }, { status: 400 });
  }

  const current = await readMessages();
  current.items.unshift({
    id: crypto.randomUUID(),
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
    createdAt: new Date().toISOString(),
  });
  await writeMessages(current);
  return NextResponse.json({ ok: true });
}
