import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Backend & API documentation — Zorvyn",
  description:
    "Zorvyn backend architecture: RBAC, REST APIs by role, PostgreSQL schema, and authentication.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 antialiased">
      {children}
    </div>
  );
}
