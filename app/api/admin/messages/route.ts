import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readMessages, writeMessages } from "@/lib/data";

export async function GET() {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(await readMessages());
}

export async function DELETE(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  const current = await readMessages();
  await writeMessages({ items: current.items.filter((item) => item.id !== id) });
  return NextResponse.json({ ok: true });
}
