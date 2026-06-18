import { createClient } from "@/lib/supabase/client";
import { createAdminClient } from "@/lib/supabase/admin";

type Preferences = {
  notify_24h: boolean;
  notify_1h: boolean;
  notify_kickoff: boolean;
};

const defaults: Preferences = {
  notify_24h: true,
  notify_1h: true,
  notify_kickoff: true,
};

export function getDefaultPreferences(): Preferences {
  return { ...defaults };
}

export async function getPreferences(userId: string): Promise<Preferences> {
  const supabase = createClient();
  const { data } = await supabase
    .from("notification_preferences")
    .select("notify_24h, notify_1h, notify_kickoff")
    .eq("user_id", userId)
    .maybeSingle();

  if (!data) return defaults;

  return {
    notify_24h: data.notify_24h,
    notify_1h: data.notify_1h,
    notify_kickoff: data.notify_kickoff,
  };
}

export async function savePreferences(userId: string, prefs: Preferences) {
  const supabase = createClient();
  const { error } = await supabase.from("notification_preferences").upsert(
    {
      user_id: userId,
      notify_24h: prefs.notify_24h,
      notify_1h: prefs.notify_1h,
      notify_kickoff: prefs.notify_kickoff,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (error) {
    console.error("Failed to save preferences:", error);
  }
}

export async function ensurePreferences(userId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("notification_preferences")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (data) return;

  const { error } = await supabase.from("notification_preferences").insert({
    user_id: userId,
    ...defaults,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Failed to create default preferences:", error);
  }
}

export async function ensurePreferencesServer(userId: string) {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("notification_preferences")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (data) return;

  const { error } = await supabase.from("notification_preferences").insert({
    user_id: userId,
    ...defaults,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Failed to create default preferences:", error);
  }
}
