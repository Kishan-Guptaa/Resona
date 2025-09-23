import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, plan } = await req.json();
    if (!email || !plan) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const updated = await prisma.user.update({
      where: { email },
      data: {
        plan,
        membershipExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // +30 days
      },
    });

    return NextResponse.json({ success: true, plan: updated.plan, membershipExpiry: updated.membershipExpiry });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
