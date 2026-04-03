"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { socket } from "@/lib/socketClient";
import { LineChart as LineChartIcon } from "lucide-react";

type FinancialRecord = {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  note?: string | null;
  date: string;
  createdAt: string;
};

type ChartPoint = {
  label: string;
  balance: number;
  change: number;
  fullDate: string;
};

function buildRunningBalanceSeries(records: FinancialRecord[]): ChartPoint[] {
  const sorted = [...records].sort((a, b) => {
    const da = new Date(a.date).getTime();
    const db = new Date(b.date).getTime();
    if (da !== db) return da - db;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  let running = 0;
  return sorted.map((r) => {
    const change = r.type === "INCOME" ? r.amount : -r.amount;
    running += change;
    const d = new Date(r.date);
    return {
      label: d.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      balance: Math.round(running * 100) / 100,
      change: Math.round(change * 100) / 100,
      fullDate: d.toLocaleDateString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };
  });
}

const fmtMoney = (n: number) =>
  new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);

export default function FinancialRecords({ userId }: { userId: string }) {
  const [records, setRecords] = useState<FinancialRecord[]>([]);

  useEffect(() => {
    fetch(`/api/users/${userId}/financial-records`)
      .then((res) => res.json())
      .then((data) => setRecords(data.data ?? []));
  }, [userId]);

  useEffect(() => {
    const onFinancialUpdate = (newRecord: unknown) => {
      setRecords((prev) => [newRecord as FinancialRecord, ...prev]);
    };

    const joinRoom = () => {
      socket.emit("join-user-room", userId);
    };

    socket.on("connect", joinRoom);
    socket.on("financial-update", onFinancialUpdate);

    if (socket.connected) {
      joinRoom();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", joinRoom);
      socket.off("financial-update", onFinancialUpdate);
      socket.disconnect();
    };
  }, [userId]);

  const chartData = useMemo(() => buildRunningBalanceSeries(records), [records]);
  const totals = useMemo(() => {
    const income = records
      .filter((r) => r.type === "INCOME")
      .reduce((sum, r) => sum + r.amount, 0);
    const expense = records
      .filter((r) => r.type === "EXPENSE")
      .reduce((sum, r) => sum + r.amount, 0);

    return {
      income,
      expense,
      net: income - expense,
      count: records.length,
    };
  }, [records]);

  return (
    <div className="p-4 max-w-4xl">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-100">
            Financial records
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Running balance over time by transaction date (income adds, expense subtracts).
          </p>
        </div>
        {totals.count > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-800/40 px-3 py-2 text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              <span className="text-slate-400">Income</span>
              <span className="ml-auto font-mono font-medium tabular-nums text-emerald-300">
                {fmtMoney(totals.income)}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-800/40 px-3 py-2 text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
              <span className="text-slate-400">Expense</span>
              <span className="ml-auto font-mono font-medium tabular-nums text-rose-300">
                {fmtMoney(totals.expense)}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-800/40 px-3 py-2 text-sm">
              <LineChartIcon className="h-4 w-4 text-indigo-400/80 shrink-0" aria-hidden />
              <span className="text-slate-400">Net</span>
              <span
                className={`ml-auto font-mono font-medium tabular-nums ${
                  totals.net >= 0 ? "text-emerald-300" : "text-rose-300"
                }`}
              >
                {fmtMoney(totals.net)}
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-800/40 px-3 py-2 text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-slate-400/80" />
              <span className="text-slate-400">Entries</span>
              <span className="ml-auto font-mono font-medium tabular-nums text-slate-200">
                {totals.count}
              </span>
            </div>
          </div>
        )}
      </div>

      <section
        className="mb-8 rounded-xl border border-slate-700/80 bg-slate-800/30 p-4 shadow-lg shadow-black/20"
        aria-label="Balance history chart"
      >
        {chartData.length === 0 ? (
          <div className="flex h-[280px] items-center justify-center rounded-lg border border-dashed border-slate-600/60 bg-slate-900/40 text-sm text-slate-500">
            Add records to see your balance trend here.
          </div>
        ) : (
          <div className="h-[300px] w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgb(51 65 85 / 0.5)"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: "rgb(148 163 184)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgb(51 65 85)" }}
                  interval="preserveStartEnd"
                  minTickGap={24}
                />
                <YAxis
                  tick={{ fill: "rgb(148 163 184)", fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgb(51 65 85)" }}
                  tickFormatter={(v) => fmtMoney(Number(v))}
                  width={56}
                />
                <ReferenceLine y={0} stroke="rgb(71 85 105)" strokeDasharray="4 4" />
                <Tooltip
                  cursor={{ stroke: "rgb(100 116 139)", strokeWidth: 1 }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0].payload as ChartPoint;
                    return (
                      <div className="rounded-lg border border-slate-600 bg-slate-900/95 px-3 py-2 shadow-xl backdrop-blur-sm">
                        <p className="text-xs text-slate-400 mb-1">{p.fullDate}</p>
                        <p className="text-sm font-medium text-slate-100">
                          Balance{" "}
                          <span
                            className={
                              p.balance >= 0 ? "text-emerald-400" : "text-rose-400"
                            }
                          >
                            {fmtMoney(p.balance)}
                          </span>
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          This entry:{" "}
                          <span
                            className={
                              p.change >= 0 ? "text-emerald-400/90" : "text-rose-400/90"
                            }
                          >
                            {p.change >= 0 ? "+" : ""}
                            {fmtMoney(p.change)}
                          </span>
                        </p>
                      </div>
                    );
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  name="Balance"
                  stroke="#34d399"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: "#6ee7b7", stroke: "#022c22", strokeWidth: 2 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>
    </div>
  );
}
