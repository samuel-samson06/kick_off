import { createClient } from "@/lib/supabase/client";

export async function getSubscriptions(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("team_api_id")
    .eq("user_id", userId);

  if (error) {
    console.error("Failed to fetch subscriptions:", error);
    return [];
  }

  return data.map((row) => String(row.team_api_id));
}

export async function addSubscription(userId: string, teamId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("subscriptions")
    .insert({ user_id: userId, team_api_id: Number(teamId) });

  if (error) {
    console.error("Failed to add subscription:", error);
    throw error;
  }
}

export async function removeSubscription(userId: string, teamId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("subscriptions")
    .delete()
    .eq("user_id", userId)
    .eq("team_api_id", Number(teamId));

  if (error) {
    console.error("Failed to remove subscription:", error);
    throw error;
  }
}
