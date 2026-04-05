import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Database,
  KeyRound,
  Layers,
  Server,
  Shield,
  Zap,
} from "lucide-react";

function Method({
  m,
}: {
  m: "GET" | "POST" | "PATCH";
}) {
  const styles = {
    GET: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    POST: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    PATCH: "bg-violet-500/15 text-violet-300 border-violet-500/30",
  }[m];
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 font-mono text-xs font-semibold ${styles}`}
    >
      {m}
    </span>
  );
}

function Role({ children }: { children: React.ReactNode }) {
  return (
    <span className="mr-1 mb-1 inline-flex rounded-md border border-slate-600 bg-slate-800/80 px-2 py-0.5 font-mono text-xs text-slate-300">
      {children}
    </span>
  );
}

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-xs leading-relaxed text-slate-300 shadow-inner sm:text-sm">
      <code>{children}</code>
    </pre>
  );
}

function H2({
  id,
  icon: Icon,
  children,
}: {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <h2
      id={id}
      className="group scroll-mt-28 border-b border-slate-800 pb-3 text-2xl font-bold tracking-tight text-white"
    >
      <a href={`#${id}`} className="inline-flex items-center gap-3 hover:text-indigo-200">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-400">
          <Icon className="h-5 w-5" />
        </span>
        {children}
      </a>
    </h2>
  );
}

function H3({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <h3
      id={id}
      className="mt-10 scroll-mt-28 text-lg font-semibold text-slate-100"
    >
      {children}
    </h3>
  );
}

const toc = [
  { href: "#overview", label: "Overview" },
  { href: "#rbac", label: "RBAC & auth" },
  { href: "#apis-public", label: "Public APIs" },
  { href: "#apis-viewer", label: "Viewer APIs" },
  { href: "#apis-analyst", label: "Analyst APIs" },
  { href: "#apis-admin", label: "Admin APIs" },
  { href: "#apis-other", label: "Other endpoints" },
  { href: "#realtime", label: "Realtime" },
  { href: "#database", label: "Database" },
  { href: "#errors", label: "Errors & security" },
];

export default function DocsPage() {
  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-4 min-w-0">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-2 text-slate-400 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Home</span>
            </Link>
            <div className="h-6 w-px bg-slate-800 hidden sm:block" />
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500 to-purple-600">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">
                  Backend documentation
                </p>
                <p className="truncate text-xs text-slate-500">Zorvyn API &amp; data model</p>
              </div>
            </div>
          </div>
          <Link
            href="/login"
            className="shrink-0 rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-indigo-500/40 hover:bg-slate-800"
          >
            Sign in
          </Link>
        </div>
      </header>

      <div className="border-b border-slate-800/80 bg-slate-950 xl:hidden">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
            Jump to
          </p>
          <nav
            className="flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]"
            aria-label="Documentation sections"
          >
            {toc.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-indigo-500/40 hover:text-indigo-200"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:py-14">
        <aside className="hidden w-52 shrink-0 xl:block">
          <nav
            className="sticky top-28 space-y-1 border-l border-slate-800 pl-4 text-sm"
            aria-label="On this page"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              On this page
            </p>
            {toc.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block border-l-2 border-transparent py-1.5 pl-3 -ml-[2px] text-slate-400 transition-colors hover:border-indigo-500/60 hover:text-indigo-200"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </aside>

        <article className="min-w-0 flex-1 max-w-3xl">
          <p className="text-sm font-medium text-indigo-400">Engineering reference</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Zorvyn backend &amp; APIs
          </h1>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            This document describes how the Zorvyn server is structured: role-based access
            control, every HTTP route under <code className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">/api</code>, the PostgreSQL data model via Prisma, and how clients should authenticate.
          </p>

          <section className="mt-14 space-y-6" aria-labelledby="overview">
            <H2 id="overview" icon={Layers}>
              Stack &amp; overview
            </H2>
            <ul className="list-inside list-disc space-y-2 text-slate-400">
              <li>
                <strong className="text-slate-200">Runtime:</strong> Next.js App Router route
                handlers (<code className="text-slate-300">app/api/**/route.ts</code>)
              </li>
              <li>
                <strong className="text-slate-200">Database:</strong> PostgreSQL with{" "}
                <a
                  href="https://www.prisma.io"
                  className="text-indigo-400 underline-offset-2 hover:underline"
                >
                  Prisma ORM
                </a>{" "}
                (client generated to <code className="text-slate-300">lib/generated/prisma</code>)
              </li>
              <li>
                <strong className="text-slate-200">Auth:</strong> JWT (HS256) issued on login;
                payload includes <code className="text-slate-300">id</code> and{" "}
                <code className="text-slate-300">role</code>
              </li>
              <li>
                <strong className="text-slate-200">Authorization:</strong>{" "}
                <code className="text-slate-300">requireRole</code> in{" "}
                <code className="text-slate-300">middleware/roleGuard.ts</code> validates the
                bearer token and ensures <code className="text-slate-300">role</code> is in the
                allowed list for that route
              </li>
              <li>
                <strong className="text-slate-200">Edge routing:</strong> Next.js{" "}
                <code className="text-slate-300">middleware.ts</code> guards cookie presence for
                dashboard UI and selected API prefixes (redirect unauthenticated users to{" "}
                <code className="text-slate-300">/login</code>)
              </li>
            </ul>
          </section>

          <section className="mt-14 space-y-6" aria-labelledby="rbac">
            <H2 id="rbac" icon={Shield}>
              RBAC &amp; authentication
            </H2>
            <p className="text-slate-400 leading-relaxed">
              Access is enforced in two layers: (1) middleware for browser sessions using the{" "}
              <code className="rounded bg-slate-800 px-1.5 py-0.5">auth-token</code> cookie, and
              (2) per-route checks using the <code className="rounded bg-slate-800 px-1.5 py-0.5">Authorization: Bearer &lt;jwt&gt;</code> header. API handlers use the latter.
            </p>

            <H3>JWT lifecycle</H3>
            <ol className="list-inside list-decimal space-y-2 text-slate-400">
              <li>
                <code className="text-slate-300">POST /api/auth/login</code> returns{" "}
                <code className="text-slate-300">{"{ token }"}</code> signed with{" "}
                <code className="text-slate-300">JWT_SECRET</code>.
              </li>
              <li>
                The SPA stores the token in <code className="text-slate-300">localStorage</code> and
                mirrors it to the <code className="text-slate-300">auth-token</code> cookie for
                middleware.
              </li>
              <li>
                Authenticated API calls send{" "}
                <code className="text-slate-300">Authorization: Bearer &lt;token&gt;</code>.
              </li>
            </ol>

            <H3 id="rbac-roles">Roles (<code className="text-slate-300">RoleType</code>)</H3>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Purpose</th>
                  </tr>
                </thead>
                <tbody className="text-slate-400">
                  <tr className="border-b border-slate-800/80">
                    <td className="px-4 py-3 font-mono text-indigo-300">VIEWER</td>
                    <td className="px-4 py-3">
                      Own financial records, personal dashboard summary, standard user UX.
                    </td>
                  </tr>
                  <tr className="border-b border-slate-800/80">
                    <td className="px-4 py-3 font-mono text-cyan-300">ANALYST</td>
                    <td className="px-4 py-3">
                      Same personal data access as viewer, plus organization-wide analytics endpoint
                      for reporting and charts.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono text-amber-300">ADMIN</td>
                    <td className="px-4 py-3">
                      User directory, per-user profile updates, global records browser/editor, and
                      analytics (same analytics route as analyst).
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <H3>Capability matrix (API layer)</H3>
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-3 font-medium">Endpoint area</th>
                    <th className="px-3 py-3 font-medium text-center">VIEWER</th>
                    <th className="px-3 py-3 font-medium text-center">ANALYST</th>
                    <th className="px-3 py-3 font-medium text-center">ADMIN</th>
                  </tr>
                </thead>
                <tbody className="text-slate-400">
                  {[
                    ["Auth: /api/auth/me", "✓", "✓", "✓"],
                    ["Personal /api/records", "✓", "✓", "✓"],
                    ["/api/dashboard/summary", "✓", "✓", "✓"],
                    ["/api/analytics/overview", "—", "✓", "✓"],
                    ["/api/users (list)", "—", "—", "✓"],
                    ["/api/users/:id", "—", "—", "✓"],
                    ["/api/admin/records", "—", "—", "✓"],
                  ].map(([area, v, a, ad]) => (
                    <tr key={String(area)} className="border-b border-slate-800/80">
                      <td className="px-3 py-2.5 font-mono text-xs text-slate-300">{area}</td>
                      <td className="px-3 py-2.5 text-center">{v}</td>
                      <td className="px-3 py-2.5 text-center">{a}</td>
                      <td className="px-3 py-2.5 text-center">{ad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-500">
              <strong className="text-slate-400">Note:</strong>{" "}
              <code className="text-slate-400">requireRole</code> reads{" "}
              <code className="text-slate-400">role</code> from the JWT payload. If an
              administrator changes a user&apos;s role in the database, the user should sign in
              again so the token reflects the new role.
            </p>
          </section>

          <section className="mt-14 space-y-8" aria-labelledby="apis-public">
            <H2 id="apis-public" icon={KeyRound}>
              Public APIs
            </H2>
            <p className="text-slate-400">
              No <code className="rounded bg-slate-800 px-1.5 py-0.5">Authorization</code> header
              required.
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Method m="POST" />
                <code className="text-sm text-slate-200">/api/auth/register</code>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Creates a user. Body:{" "}
                <code className="text-slate-300">name</code>, <code className="text-slate-300">email</code>,{" "}
                <code className="text-slate-300">password</code>,{" "}
                <code className="text-slate-300">role</code> (one of{" "}
                <Role>VIEWER</Role>
                <Role>ANALYST</Role>
                <Role>ADMIN</Role>). The handler returns the created row; in production you should omit
                password fields from JSON responses.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Method m="POST" />
                <code className="text-sm text-slate-200">/api/auth/login</code>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Body: <code className="text-slate-300">email</code>,{" "}
                <code className="text-slate-300">password</code>. Returns{" "}
                <code className="text-slate-300">{"{ token }"}</code>.
              </p>
            </div>
          </section>

          <section className="mt-14 space-y-8" aria-labelledby="apis-viewer">
            <H2 id="apis-viewer" icon={Server}>
              Viewer role APIs
            </H2>
            <p className="text-slate-400">
              Allowed roles: <Role>VIEWER</Role>
              <Role>ANALYST</Role>
              <Role>ADMIN</Role> (where noted below).
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Method m="GET" />
                <code className="text-sm text-slate-200">/api/auth/me</code>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Returns the current user from the database:{" "}
                <code className="text-slate-300">id</code>, <code className="text-slate-300">name</code>,{" "}
                <code className="text-slate-300">email</code>, <code className="text-slate-300">role</code>,{" "}
                <code className="text-slate-300">status</code>.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Method m="GET" />
                <code className="text-sm text-slate-200">/api/dashboard/summary</code>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Aggregates <strong className="text-slate-300">all time</strong> income and expense
                for the authenticated user. Response:{" "}
                <code className="text-slate-300">totalIncome</code>,{" "}
                <code className="text-slate-300">totalExpense</code>,{" "}
                <code className="text-slate-300">netBalance</code>,{" "}
                <code className="text-slate-300">userId</code>.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Method m="GET" />
                <code className="text-sm text-slate-200">/api/records</code>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Paginated records for the <strong className="text-slate-200">authenticated user only</strong>.
                Query: <code className="text-slate-300">page</code>,{" "}
                <code className="text-slate-300">limit</code>,{" "}
                <code className="text-slate-300">search</code> (category, note, or type keyword),{" "}
                <code className="text-slate-300">month</code> (<code className="text-slate-300">YYYY-MM</code>, UTC
                month window). Response: <code className="text-slate-300">data</code>,{" "}
                <code className="text-slate-300">meta</code> (total, page, limit, totalPages, month).
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Method m="POST" />
                <code className="text-sm text-slate-200">/api/records</code>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Creates a record for the current user. Body:{" "}
                <code className="text-slate-300">amount</code>,{" "}
                <code className="text-slate-300">type</code> (<code className="text-slate-300">INCOME</code> |{" "}
                <code className="text-slate-300">EXPENSE</code>),{" "}
                <code className="text-slate-300">category</code>,{" "}
                <code className="text-slate-300">note</code>,{" "}
                <code className="text-slate-300">date</code>. Emits a realtime event to the user room
                (see below).
              </p>
            </div>
          </section>

          <section className="mt-14 space-y-8" aria-labelledby="apis-analyst">
            <H2 id="apis-analyst" icon={Zap}>
              Analyst role APIs
            </H2>
            <p className="text-slate-400">
              In addition to all viewer endpoints, analysts may call:
            </p>

            <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Method m="GET" />
                <code className="text-sm text-slate-200">/api/analytics/overview</code>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Organization-wide aggregates across <strong className="text-slate-200">all</strong>{" "}
                financial records: totals, expense-to-income style ratios, last 12 UTC months of
                income/expense/net, category breakdowns with counts, top users by expense and by
                income, machine-generated <code className="text-slate-300">insights</code> strings,
                and <code className="text-slate-300">recommendations</code> for decision support.
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Also allowed for <Role>ADMIN</Role> (same payload).
              </p>
            </div>
          </section>

          <section className="mt-14 space-y-8" aria-labelledby="apis-admin">
            <H2 id="apis-admin" icon={Shield}>
              Admin role APIs
            </H2>
            <p className="text-slate-400">
              Requires <Role>ADMIN</Role> on the JWT. Admins can use viewer + analyst routes and the
              following.
            </p>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Method m="GET" />
                <code className="text-sm text-slate-200">/api/users</code>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Paginated user directory. Query: <code className="text-slate-300">page</code>,{" "}
                <code className="text-slate-300">limit</code>,{" "}
                <code className="text-slate-300">search</code> (name/email),{" "}
                <code className="text-slate-300">status</code>,{" "}
                <code className="text-slate-300">role</code>. Excludes password hash from selected
                fields.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Method m="GET" />
                <code className="text-sm text-slate-200">/api/users/:id</code>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Single user profile: <code className="text-slate-300">id</code>,{" "}
                <code className="text-slate-300">name</code>, <code className="text-slate-300">email</code>,{" "}
                <code className="text-slate-300">role</code>, <code className="text-slate-300">status</code>,{" "}
                <code className="text-slate-300">createdAt</code>.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Method m="PATCH" />
                <code className="text-sm text-slate-200">/api/users/:id</code>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Partial update. Body: optional <code className="text-slate-300">role</code>, optional{" "}
                <code className="text-slate-300">status</code>. At least one required.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Method m="GET" />
                <code className="text-sm text-slate-200">/api/admin/records</code>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                All users&apos; records for a calendar month (defaults to current UTC month if{" "}
                <code className="text-slate-300">month</code> omitted). Query:{" "}
                <code className="text-slate-300">page</code>, <code className="text-slate-300">limit</code>,{" "}
                <code className="text-slate-300">search</code>, <code className="text-slate-300">month</code>. Each row
                includes nested <code className="text-slate-300">user</code>{" "}
                <code className="text-slate-300">{"{ id, name, email }"}</code>.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Method m="PATCH" />
                <code className="text-sm text-slate-200">/api/admin/records/:id</code>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Updates any record by id. Body: <code className="text-slate-300">amount</code>,{" "}
                <code className="text-slate-300">type</code> (required,{" "}
                <code className="text-slate-300">INCOME</code> | <code className="text-slate-300">EXPENSE</code>),{" "}
                <code className="text-slate-300">category</code>, <code className="text-slate-300">note</code>,{" "}
                <code className="text-slate-300">date</code>. Broadcasts update to the record owner&apos;s
                socket room.
              </p>
            </div>
          </section>

          <section className="mt-14 space-y-8" aria-labelledby="apis-other">
            <H2 id="apis-other" icon={Server}>
              Other endpoints
            </H2>

            <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Method m="GET" />
                <code className="text-sm text-slate-200">/api/users/:id/financial-records</code>
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Returns all financial records for the given <code className="text-slate-300">userId</code>, ordered by{" "}
                <code className="text-slate-300">createdAt</code> descending.{" "}
                <strong className="text-amber-200/90">There is no authentication or role check</strong> in
                the current implementation; treat this as a known integration surface and protect or
                gate it in production if the app is exposed publicly.
              </p>
            </div>
          </section>

          <section className="mt-14 space-y-6" aria-labelledby="realtime">
            <H2 id="realtime" icon={Zap}>
              Realtime (Socket.IO)
            </H2>
            <p className="text-slate-400 leading-relaxed">
              A separate Socket.IO server can emit updates to user-specific rooms. When a record is
              created via <code className="rounded bg-slate-800 px-1.5 py-0.5">POST /api/records</code> or
              updated via admin PATCH, the backend emits{" "}
              <code className="text-slate-300">financial-update</code> to the room joined by{" "}
              <code className="text-slate-300">join-user-room</code> with the user id. Clients use{" "}
              <code className="text-slate-300">lib/socketClient</code> in the dashboard UI.
            </p>
          </section>

          <section className="mt-14 space-y-8" aria-labelledby="database">
            <H2 id="database" icon={Database}>
              Database schema
            </H2>
            <p className="text-slate-400">
              PostgreSQL. Prisma models and enums (abridged from{" "}
              <code className="text-slate-300">prisma/schema.prisma</code>):
            </p>

            <H3>Enums</H3>
            <Code>{`enum RoleType { VIEWER ANALYST ADMIN }
enum RecordType { INCOME EXPENSE }
enum UserStatus { ACTIVE INACTIVE }`}</Code>

            <H3>User</H3>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
              <li>
                <code className="text-slate-300">id</code> (UUID, PK)
              </li>
              <li>
                <code className="text-slate-300">name</code>, <code className="text-slate-300">email</code> (unique),{" "}
                <code className="text-slate-300">password</code> (hashed)
              </li>
              <li>
                <code className="text-slate-300">status</code> — defaults to{" "}
                <code className="text-slate-300">ACTIVE</code>
              </li>
              <li>
                <code className="text-slate-300">role</code> — <code className="text-slate-300">RoleType</code>
              </li>
              <li>
                <code className="text-slate-300">records</code> — one-to-many{" "}
                <code className="text-slate-300">FinancialRecord</code>
              </li>
              <li>
                <code className="text-slate-300">createdAt</code>, <code className="text-slate-300">updatedAt</code>
              </li>
            </ul>

            <H3>FinancialRecord</H3>
            <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
              <li>
                <code className="text-slate-300">id</code> (UUID, PK)
              </li>
              <li>
                <code className="text-slate-300">amount</code> (float),{" "}
                <code className="text-slate-300">type</code> (<code className="text-slate-300">RecordType</code>)
              </li>
              <li>
                <code className="text-slate-300">category</code>, optional{" "}
                <code className="text-slate-300">note</code>
              </li>
              <li>
                <code className="text-slate-300">date</code> — transaction date (stored as{" "}
                <code className="text-slate-300">DateTime</code>)
              </li>
              <li>
                <code className="text-slate-300">userId</code> → <code className="text-slate-300">User</code>
              </li>
              <li>
                Indexes: <code className="text-slate-300">type</code>,{" "}
                <code className="text-slate-300">category</code>, <code className="text-slate-300">date</code> (for
                filters and analytics)
              </li>
            </ul>
          </section>

          <section className="mt-14 space-y-6" aria-labelledby="errors">
            <H2 id="errors" icon={Shield}>
              Errors &amp; security notes
            </H2>
            <ul className="list-inside list-disc space-y-2 text-slate-400">
              <li>
                Failed <code className="text-slate-300">requireRole</code> typically returns JSON{" "}
                <code className="text-slate-300">{"{ error: \"Unauthorized\" | \"Forbidden\" }"}</code> with status{" "}
                <code className="text-slate-300">403</code> (handlers vary slightly; some admin routes return{" "}
                <code className="text-slate-300">500</code> on thrown errors).
              </li>
              <li>
                Passwords are hashed with bcrypt at registration; never log or return passwords in new
                endpoints.
              </li>
              <li>
                Keep <code className="text-slate-300">JWT_SECRET</code> strong and rotate with a session
                invalidation strategy if compromised.
              </li>
              <li>
                Consider adding auth to <code className="text-slate-300">/api/users/:id/financial-records</code> and
                enforcing <code className="text-slate-300">UserStatus.ACTIVE</code> on login for hardened
                deployments.
              </li>
            </ul>
          </section>

          <footer className="mt-20 border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            <p>Zorvyn — documentation reflects the codebase as implemented.</p>
            <Link href="/" className="mt-2 inline-block text-indigo-400 hover:text-indigo-300">
              Return to home
            </Link>
          </footer>
        </article>
      </div>
    </>
  );
}
