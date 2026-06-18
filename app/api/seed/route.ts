import { NextResponse } from "next/server";
import { syncMatches } from "@/lib/services/football-api";

export async function GET(req: Request) {
  const key =
    new URL(req.url).searchParams.get("key") ||
    req.headers.get("x-cron-secret");
  if (key !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const count = await syncMatches();
  return NextResponse.json({
    synced: true,
    matches: count,
    timestamp: new Date().toISOString(),
  });
}
