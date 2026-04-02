"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, LogOut, User } from "lucide-react";
import { logout } from "@/lib/auth";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [profile, setProfile] = useState<{ name: string; role: string } | null>(
    null,
  );
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileError, setProfileError] = useState("");

  useEffect(() => {
    apiFetch("/auth/me")
      .then((user) => {
        setProfile(user);
      })
      .catch((err) => {
        setProfileError(err.message || "Could not load profile");
      });
  }, []);

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/records", label: "Records", icon: Receipt },
  ];

  return (
    <div className="flex bg-slate-900 min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 backdrop-blur flex flex-col fixed inset-y-0 left-0 z-10">
        <div className="p-6">
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold leading-none">Z</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
              Zorvyn
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
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

        <div className="flex justify-between items-center p-4 border-t border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1 border rounded-full">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold">{profile?.name ?? "Profile"}</h1>
                <h1 className="text-xs">[{profile?.role ?? "NA"}]</h1>
              </div>
            </div>
          </div>
          <button
            onClick={logout}
            className="border flex items-center gap-2 px-2 py-1 text-left text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <div className="mx-auto">{children}</div>
      </main>
    </div>
  );
}
