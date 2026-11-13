import { db } from "@/db";
import { leads } from "@/db/schema";

export const dynamic = "force-dynamic";

const KINDS = ["quote", "callback", "visa", "token"];

function clean(v: unknown, max: number): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim().slice(0, max);
  return t.length ? t : null;
}

export async function POST(req: Request) {
  if (!db) {
    return Response.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const kind = clean(body.kind, 20);
    if (!kind || !KINDS.includes(kind)) {
      return Response.json({ ok: false, error: "Invalid kind" }, { status: 400 });
    }
    const total = typeof body.totalInr === "number" && Number.isFinite(body.totalInr) ? Math.round(body.totalInr) : null;
    const [row] = await db
      .insert(leads)
      .values({
        kind,
        name: clean(body.name, 120),
        phone: clean(body.phone, 30),
        destination: clean(body.destination, 160),
        message: clean(body.message, 1500),
        totalInr: total,
      })
      .returning({ id: leads.id });
    return Response.json({ ok: true, id: row.id });
  } catch {
    return Response.json({ ok: false, error: "Could not save" }, { status: 500 });
  }
}
