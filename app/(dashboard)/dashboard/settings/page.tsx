"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { LuBellRing, LuChevronRight, LuMail, LuShieldCheck } from "react-icons/lu";
import { accountEmail, notificationPreferences } from "@/lib/settings";
import Header from "@/components/layout/Header";
import ToggleSwitch from "@/components/settings/ToggleSwitch";
import ChangeEmailModal from "@/components/settings/ChangeEmailModal";
import ConfirmActionModal from "@/components/settings/ConfirmActionModal";
import { createClient } from "@/lib/supabase/client";
import { getPreferences, savePreferences } from "@/lib/services/preferences";

export default function SettingsPage() {
  const [toggles, setToggles] = useState([true, true, false]);
  const [userId, setUserId] = useState<string | null>(null);
  const [changeEmailOpen, setChangeEmailOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) return;
      setUserId(data.user.id);
      const prefs = await getPreferences(data.user.id);
      setToggles([prefs.notify_24h, prefs.notify_1h, prefs.notify_kickoff]);
    }
    load();
  }, []);

  const handleToggle = async (index: number) => {
    if (!userId) return;

    const next = [...toggles];
    next[index] = !next[index];
    setToggles(next);

    await savePreferences(userId, {
      notify_24h: next[0],
      notify_1h: next[1],
      notify_kickoff: next[2],
    });
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/auth/email";
  };

  const handleDelete = () => {
    window.location.href = "/auth/email";
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 pb-28 pt-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Settings</h1>

        <CardSection
          icon={<LuBellRing className="h-5 w-5" />}
          title="Notification Delivery"
        >
          <div className="space-y-3">
            {notificationPreferences.map((item, index) => (
              <div
                key={item.title}
                className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] p-4"
              >
                <div>
                  <div className="text-lg font-semibold text-white">{item.title}</div>
                  <p className="mt-1 text-sm text-zinc-300">{item.description}</p>
                </div>
                <ToggleSwitch
                  checked={toggles[index]}
                  onChange={() => handleToggle(index)}
                />
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Reminders are sent via email only.
          </p>
        </CardSection>

        <CardSection icon={<LuMail className="h-5 w-5" />} title="Email Address">
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.24em] text-zinc-400">
                Current Email
              </div>
              <div className="mt-2 text-lg font-semibold text-white">{accountEmail}</div>
            </div>

            <button
              onClick={() => setChangeEmailOpen(true)}
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 font-semibold text-white transition-colors hover:border-lime-400/40 hover:bg-lime-400/10"
            >
              Change Email
            </button>
          </div>
        </CardSection>

        <CardSection icon={<LuShieldCheck className="h-5 w-5" />} title="Account Management">
          <div className="space-y-3">
            <ActionRow label="Logout" onClick={() => setLogoutOpen(true)} />
            <ActionRow label="Delete Account" danger helper="" onClick={() => setDeleteOpen(true)} />
          </div>
        </CardSection>
      </main>

      <ChangeEmailModal open={changeEmailOpen} onClose={() => setChangeEmailOpen(false)} />

      <ConfirmActionModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        title="Logout"
        description="Are you sure you want to log out? You'll need to sign in again to access your teams and reminders."
        confirmLabel="Logout"
      />

      <ConfirmActionModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Account"
        description="This action is permanent. All your teams, reminders, and preferences will be removed."
        confirmLabel="Delete Account"
        variant="danger"
      />
    </div>
  );
}

function CardSection({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-zinc-900/75 p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:p-6">
      <div className="mb-5 flex items-center gap-3 text-2xl font-bold text-white">
        <span className="text-lime-400">{icon}</span>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ActionRow({
  label,
  danger,
  helper,
  onClick,
}: {
  label: string;
  danger?: boolean;
  helper?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex w-full items-center justify-between rounded-2xl border px-5 py-4 text-left transition-colors",
        danger
          ? "border-rose-400/20 bg-rose-400/5 text-rose-200 hover:bg-rose-400/10"
          : "border-white/10 bg-white/[0.03] text-white hover:border-lime-400/30 hover:bg-lime-400/5",
      ].join(" ")}
    >
      <span className="font-semibold">{label}</span>
      <span className="flex items-center gap-3 text-sm text-zinc-400">
        {helper ? <span>{helper}</span> : null}
        <LuChevronRight className="h-5 w-5" />
      </span>
    </button>
  );
}
