import { NextResponse } from "next/server";
import { singers } from "../../_data/singers";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const singer = singers.find(s => s.id === parseInt(params.id));
  if (!singer) {
    return NextResponse.json({ error: "Singer not found" }, { status: 404 });
  }
  return NextResponse.json(singer);
}
