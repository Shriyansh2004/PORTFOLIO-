import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { lookupCompany, suggestCompanies } from "@/lib/company-lookup";

export async function GET(request: Request) {
  if (!(await getSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const name = new URL(request.url).searchParams.get("name")?.trim() ?? "";
  if (name.length < 2) {
    return NextResponse.json({ error: "Enter a company name." }, { status: 400 });
  }

  if (new URL(request.url).searchParams.get("suggest") === "1") {
    const suggestions = await suggestCompanies(name);
    return NextResponse.json({ suggestions });
  }

  const match = await lookupCompany(name);
  if (!match) return NextResponse.json({ found: false });
  return NextResponse.json({ found: true, ...match });
}
