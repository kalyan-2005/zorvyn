"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Lightbulb,
  ListChecks,
  PieChart as PieChartIcon,
  TrendingUp,
} from "lucide-react";

type AnalyticsPayload = {
  totals: {
    income: number;
    expense: number;
    net: number;
    transactionCount: number;
    usersWithRecords: number;
  };
  ratios: { expenseToIncome: number | null; savingsRate: number | null };
  monthly: { month: string; income: number; expense: number; net: number }[];
  categories: {
    category: string;
    type: "INCOME" | "EXPENSE";
    total: number;
    count: number;
    pctOfType: number;
  }[];
  topExpenseUsers: {
    userId: string;
    name: string;
    email: string;
    total: number;
  }[];
  topIncomeUsers: {
    userId: string;
    name: string;
    email: string;
    total: number;
  }[];
  insights: string[];
  recommendations: string[];
};

const fmtMoney = (n: number) =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);

function formatMonthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  if (!y || !m) return key;
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString(undefined, {
    month: "short",
    year: "2-digit",
  });
}

const PIE_COLORS = [
  "#818cf8",
  "#34d399",
  "#f472b6",
  "#fbbf24",
  "#38bdf8",
  "#a78bfa",
  "#fb7185",
  "#2dd4bf",
];

export function AnalystDashboard() {
  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("analytics/overview")
      .then((res: AnalyticsPayload) => setData(res))
      .catch((err: Error) => setError(err.message || "Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  const monthlyChartData = useMemo(() => {
    if (!data) return [];
    return data.monthly.map((m) => ({
      ...m,
      label: formatMonthLabel(m.month),
    }));
  }, [data]);

  const expensePieData = useMemo(() => {
    if (!data) return [];
    return data.categories
      .filter((c) => c.type === "EXPENSE" && c.total > 0)
      .slice(0, 8)
      .map((c) => ({ name: c.category, value: c.total }));
  }, [data]);

  const incomePieData = useMemo(() => {
    if (!data) return [];
    return data.categories
      .filter((c) => c.type === "INCOME" && c.total > 0)
      .slice(0, 8)
      .map((c) => ({ name: c.category, value: c.total }));
  }, [data]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center py-16">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-400">
        {error}
      </div>
    );
  }

  if (!data) return null;

  const hasData = data.totals.transactionCount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-10"
    >
      {/* Summary metrics */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-700/80 bg-slate-800/40 p-4">
          <p className="text-xs font-medium text-slate-500">Total income</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-emerald-300 sm:text-2xl">
            ₹{fmtMoney(data.totals.income)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-700/80 bg-slate-800/40 p-4">
          <p className="text-xs font-medium text-slate-500">Total expenses</p>
          <p className="mt-1 text-xl font-bold tabular-nums text-rose-300 sm:text-2xl">
            ₹{fmtMoney(data.totals.expense)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-700/80 bg-slate-800/40 p-4">
          <p className="text-xs font-medium text-slate-500">Net position</p>
          <p
            className={`mt-1 text-xl font-bold tabular-nums sm:text-2xl ${
              data.totals.net >= 0 ? "text-indigo-300" : "text-amber-300"
            }`}
          >
            ₹{fmtMoney(data.totals.net)}
          </p>
        </div>
        <div className="rounded-xl border border-slate-700/80 bg-slate-800/40 p-4">
          <p className="text-xs font-medium text-slate-500">Activity</p>
          <p className="mt-1 text-lg font-semibold text-slate-200">
            {data.totals.transactionCount}{" "}
            <span className="text-sm font-normal text-slate-500">txns</span>
          </p>
          <p className="text-xs text-slate-500">
            {data.totals.usersWithRecords} users with records
          </p>
        </div>
      </div>

      {/* Ratios */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-700/80 bg-slate-800/30 p-5">
          <div className="mb-2 flex items-center gap-2 text-slate-200">
            <TrendingUp className="h-5 w-5 text-indigo-400" />
            <h2 className="font-semibold">Key ratios</h2>
          </div>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-slate-700/60 py-2">
              <dt className="text-slate-400">Expense ÷ income</dt>
              <dd className="font-mono font-medium text-slate-200">
                {data.ratios.expenseToIncome != null
                  ? `${(data.ratios.expenseToIncome * 100).toFixed(1)}%`
                  : "—"}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-2">
              <dt className="text-slate-400">Net ÷ income (surplus rate)</dt>
              <dd className="font-mono font-medium text-slate-200">
                {data.ratios.savingsRate != null
                  ? `${data.ratios.savingsRate.toFixed(1)}%`
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-slate-700/80 bg-slate-800/30 p-5">
          <div className="mb-3 flex items-center gap-2 text-slate-200">
            <Lightbulb className="h-5 w-5 text-amber-400" />
            <h2 className="font-semibold">What this supports</h2>
          </div>
          <ul className="list-inside list-disc space-y-2 text-sm text-slate-400">
            <li>Budget reallocation when categories or months diverge from plan</li>
            <li>Spotting users or categories that dominate cash outflows</li>
            <li>Deciding whether margins are sustainable across recent months</li>
          </ul>
        </div>
      </div>

      {/* Narrative insights */}
      <section
        className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-6"
        aria-label="Analytical narrative"
      >
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
          <ListChecks className="h-5 w-5 text-indigo-400" />
          Interpretation &amp; signals
        </h2>
        <ul className="space-y-3 text-sm leading-relaxed text-slate-300">
          {data.insights.map((line, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
        {data.recommendations.length > 0 && (
          <>
            <h3 className="mb-3 mt-6 text-sm font-semibold text-slate-200">
              Suggested next decisions
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              {data.recommendations.map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-indigo-400/90">→</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      {!hasData ? (
        <p className="text-center text-sm text-slate-500">
          Add transactions across the organization to unlock charts and deeper
          breakdowns.
        </p>
      ) : (
        <>
          <section aria-label="Monthly trend">
            <h2 className="mb-4 text-lg font-semibold text-slate-100">
              Monthly income vs expenses (last 12 months)
            </h2>
            <div className="h-[300px] w-full min-w-0 rounded-xl border border-slate-700/80 bg-slate-800/20 p-2 sm:h-[340px] sm:p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyChartData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgb(51 65 85 / 0.4)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "rgb(148 163 184)", fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "rgb(51 65 85)" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    tick={{ fill: "rgb(148 163 184)", fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "rgb(51 65 85)" }}
                    tickFormatter={(v) => fmtMoney(Number(v))}
                    width={52}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgb(15 23 42 / 0.95)",
                      border: "1px solid rgb(51 65 85)",
                      borderRadius: "0.5rem",
                    }}
                    formatter={(value) => [
                      `₹${fmtMoney(Number(value ?? 0))}`,
                      "",
                    ]}
                    labelFormatter={(_, payload) =>
                      payload?.[0]?.payload?.month ?? ""
                    }
                  />
                  <Legend />
                  <Bar
                    dataKey="income"
                    name="Income"
                    fill="#34d399"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    name="Expense"
                    fill="#fb7185"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-2">
            <section aria-label="Expense categories">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
                <PieChartIcon className="h-5 w-5 text-rose-400" />
                Top expense categories
              </h2>
              <div className="h-[280px] w-full min-w-0 rounded-xl border border-slate-700/80 bg-slate-800/20 sm:h-[300px]">
                {expensePieData.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">
                    No expense categories
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensePieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={88}
                        paddingAngle={2}
                        label={({ name, percent }) => {
                          const n = String(name ?? "");
                          return `${n.slice(0, 14)}${n.length > 14 ? "…" : ""} ${((percent ?? 0) * 100).toFixed(0)}%`;
                        }}
                      >
                        {expensePieData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) =>
                          `₹${fmtMoney(Number(value ?? 0))}`
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            <section aria-label="Income categories">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-100">
                <PieChartIcon className="h-5 w-5 text-emerald-400" />
                Top income categories
              </h2>
              <div className="h-[280px] w-full min-w-0 rounded-xl border border-slate-700/80 bg-slate-800/20 sm:h-[300px]">
                {incomePieData.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">
                    No income categories
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incomePieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={52}
                        outerRadius={88}
                        paddingAngle={2}
                        label={({ name, percent }) => {
                          const n = String(name ?? "");
                          return `${n.slice(0, 14)}${n.length > 14 ? "…" : ""} ${((percent ?? 0) * 100).toFixed(0)}%`;
                        }}
                      >
                        {incomePieData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={PIE_COLORS[(i + 2) % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) =>
                          `₹${fmtMoney(Number(value ?? 0))}`
                        }
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>
          </div>

          {/* Net trend mini chart */}
          <section aria-label="Net by month">
            <h2 className="mb-4 text-lg font-semibold text-slate-100">
              Net flow by month
            </h2>
            <p className="mb-3 text-sm text-slate-500">
              Positive bars mean income exceeded expenses that month; negative
              bars flag months to investigate.
            </p>
            <div className="h-[240px] w-full min-w-0 rounded-xl border border-slate-700/80 bg-slate-800/20 p-2 sm:p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyChartData}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgb(51 65 85 / 0.4)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "rgb(148 163 184)", fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "rgb(51 65 85)" }}
                  />
                  <YAxis
                    tick={{ fill: "rgb(148 163 184)", fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: "rgb(51 65 85)" }}
                    tickFormatter={(v) => fmtMoney(Number(v))}
                    width={52}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgb(15 23 42 / 0.95)",
                      border: "1px solid rgb(51 65 85)",
                      borderRadius: "0.5rem",
                    }}
                    formatter={(value) => [
                      `₹${fmtMoney(Number(value ?? 0))}`,
                      "Net",
                    ]}
                  />
                  <Bar dataKey="net" name="Net" radius={[4, 4, 0, 0]}>
                    {monthlyChartData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          entry.net >= 0 ? "rgb(52 211 153)" : "rgb(251 113 133)"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-2">
            <section className="rounded-xl border border-slate-700/80 bg-slate-800/20 p-4 sm:p-5">
              <h2 className="mb-4 font-semibold text-slate-100">
                Highest expense totals by user
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-xs text-slate-500">
                      <th className="pb-2 pr-2 font-medium">User</th>
                      <th className="pb-2 text-right font-medium">Expense</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topExpenseUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={2}
                          className="py-6 text-center text-slate-500"
                        >
                          No data
                        </td>
                      </tr>
                    ) : (
                      data.topExpenseUsers.map((u) => (
                        <tr
                          key={u.userId}
                          className="border-b border-slate-700/50"
                        >
                          <td className="py-2 pr-2">
                            <div className="font-medium text-slate-200">
                              {u.name}
                            </div>
                            <div className="truncate text-xs text-slate-500">
                              {u.email}
                            </div>
                          </td>
                          <td className="py-2 text-right font-mono text-rose-300">
                            ₹{fmtMoney(u.total)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-xl border border-slate-700/80 bg-slate-800/20 p-4 sm:p-5">
              <h2 className="mb-4 font-semibold text-slate-100">
                Highest income totals by user
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700 text-xs text-slate-500">
                      <th className="pb-2 pr-2 font-medium">User</th>
                      <th className="pb-2 text-right font-medium">Income</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topIncomeUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan={2}
                          className="py-6 text-center text-slate-500"
                        >
                          No data
                        </td>
                      </tr>
                    ) : (
                      data.topIncomeUsers.map((u) => (
                        <tr
                          key={u.userId}
                          className="border-b border-slate-700/50"
                        >
                          <td className="py-2 pr-2">
                            <div className="font-medium text-slate-200">
                              {u.name}
                            </div>
                            <div className="truncate text-xs text-slate-500">
                              {u.email}
                            </div>
                          </td>
                          <td className="py-2 text-right font-mono text-emerald-300">
                            ₹{fmtMoney(u.total)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Full category table for decisions */}
          <section aria-label="Category detail">
            <h2 className="mb-4 text-lg font-semibold text-slate-100">
              Category ledger (all recorded splits)
            </h2>
            <p className="mb-3 text-sm text-slate-500">
              Use this table to validate pie charts and to find long-tail
              categories that still add up.
            </p>
            <div className="max-h-[360px] overflow-auto rounded-xl border border-slate-700/80">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="sticky top-0 bg-slate-900/95 backdrop-blur">
                  <tr className="border-b border-slate-700 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 text-right font-medium">Amount</th>
                    <th className="px-4 py-3 text-right font-medium">% of type</th>
                    <th className="px-4 py-3 text-right font-medium">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {data.categories.map((c, i) => (
                    <tr
                      key={`${c.category}-${c.type}-${i}`}
                      className="border-b border-slate-800/80"
                    >
                      <td className="px-4 py-2.5 text-slate-200">
                        {c.category}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={
                            c.type === "INCOME"
                              ? "text-emerald-400"
                              : "text-rose-400"
                          }
                        >
                          {c.type}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-slate-200">
                        ₹{fmtMoney(c.total)}
                      </td>
                      <td className="px-4 py-2.5 text-right text-slate-400">
                        {c.pctOfType.toFixed(1)}%
                      </td>
                      <td className="px-4 py-2.5 text-right text-slate-500">
                        {c.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </motion.div>
  );
}
