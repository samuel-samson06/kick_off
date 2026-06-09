"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuLayoutGrid, LuUsers, LuSettings } from "react-icons/lu";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LuLayoutGrid,
  },
  {
    href: "/dashboard/teams",
    label: "Teams",
    icon: LuUsers,
  },
  {
    href: "/dashboard/settings",
    label: "Settings",
    icon: LuSettings,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-zinc-950/95 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-3 gap-2 px-4 py-3 sm:px-6 lg:px-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={[
                "flex flex-col items-center justify-center gap-1 rounded-2xl px-3 py-2 transition-colors",
                "text-zinc-300 hover:bg-white/5 hover:text-white",
                isActive ? "bg-lime-400 text-zinc-950 shadow-[0_0_0_1px_rgba(163,230,53,0.35)]" : "",
              ].join(" ")}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span className="hidden text-xs font-semibold tracking-wide sm:block">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
