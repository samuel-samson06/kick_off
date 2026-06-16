import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensurePreferences } from "@/lib/services/preferences";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await supabase.from("profiles").upsert(
        {
          id: data.user.id,
          email: data.user.email,
          created_at: new Date().toISOString(),
        },
        { onConflict: "id" },
      );
      await ensurePreferences(data.user.id);

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/email?error=auth`);
}
