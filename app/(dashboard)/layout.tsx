"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  User,
  X,
} from "lucide-react";
import { logout } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [profile, setProfile] = useState<{ name: string; role: string, email: string } | null>(
    null,
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    apiFetch("/auth/me")
      .then((user) => {
        setProfile(user);
      })
      .catch((err) => {
        console.log(err.message || "Could not load profile");
      });
  }, []);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/records", label: "Records", icon: Receipt },
  ];

  return (
    <div className="flex min-h-screen min-w-0 bg-slate-900">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`max-sm:fixed max-sm:inset-y-0 left-0 z-40 flex h-screen w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900/95 backdrop-blur-md transition-transform duration-200 ease-out lg:translate-x-0 sticky top-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between gap-2 p-4 sm:p-6">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 shrink-0 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold leading-none">Z</span>
            </div>
            <span className="truncate text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
              Zorvyn
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close navigation"
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 mt-2 sm:mt-6">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href}>
                <div
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-3 border-t border-slate-800 p-3 sm:p-4">
          <div className="flex min-w-0 items-start justify-between gap-2">
            <div className="min-w-0 flex items-center gap-4">
              <div className="shrink-0 rounded-full border p-1">
                <User className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-sm sm:text-base">
                  {profile?.name ?? "Profile"}{" "}[{profile?.role ?? "NA"}]
                </p>
                <p className="text-xs text-slate-500">
                  {profile?.email ?? "NA"}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-left text-sm text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-800 bg-slate-900/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <button
            type="button"
            aria-label="Open menu"
            className="rounded-lg p-2 text-slate-200 hover:bg-slate-800"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-semibold text-slate-100">Menu</span>
        </header>
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
