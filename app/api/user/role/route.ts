import { getContext } from "@/lib/context";
import { NextResponse } from "next/server";

export async function GET() {
  const context = await getContext();
  if (!context || !context.companyId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  return NextResponse.json({ role: context.role });
}
