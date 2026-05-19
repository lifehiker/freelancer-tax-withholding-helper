import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().email(), source: z.string().optional() });

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
  const row = await prisma.waitlistEmail.upsert({
    where: { email: parsed.data.email.toLowerCase() },
    update: { source: parsed.data.source },
    create: { email: parsed.data.email.toLowerCase(), source: parsed.data.source },
  });
  return NextResponse.json({ ok: true, id: row.id });
}
