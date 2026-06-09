import Header from "@/components/layout/Header";
import MainMatch from "@/components/dashboard/MainMatch";
import Teams from "@/components/dashboard/Teams";
import UpcomingMatches from "@/components/dashboard/UpcomingMatches";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <main className="mx-auto space-y-4 flex w-full max-w-7xl flex-col gap-5 px-4 pb-28 pt-4 sm:px-6 lg:px-8">
        <section>
          <MainMatch />
        </section>

        <section>
          <Teams />
        </section>

        <section>
          <UpcomingMatches />
        </section>
      </main>
    </div>
  );
}
