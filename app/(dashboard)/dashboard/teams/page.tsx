import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscriptionsServer } from "@/lib/services/subscriptions";
import { getDashboardTeams } from "@/lib/data/dashboard";
import TeamsPageClient from "@/components/dashboard/TeamsPageClient";

export default async function TeamsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/email");
  }

  const [subscribedTeamIds, teams] = await Promise.all([
    getSubscriptionsServer(user.id),
    getDashboardTeams(),
  ]);

  return (
    <TeamsPageClient
      initialTeams={teams}
      initialSubscribedTeamIds={subscribedTeamIds}
      userId={user.id}
    />
  );
}

