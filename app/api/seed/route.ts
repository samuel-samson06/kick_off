import { NextResponse } from "next/server";
import { syncMatches } from "@/lib/services/football-api";

export async function GET() {
  const count = await syncMatches();
  return NextResponse.json({
    synced: true,
    matches: count,
    timestamp: new Date().toISOString(),
  });
}
