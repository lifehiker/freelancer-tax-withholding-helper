import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

const schema = z.object({ transferred: z.boolean() });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const resolved = await params;
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  const entry = await prisma.incomeEntry.update({
    where: { id: resolved.id, userId: user.id },
    data: { transferred: parsed.data.transferred },
  });
  return NextResponse.json({ entry });
}
