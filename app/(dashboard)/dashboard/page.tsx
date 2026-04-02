"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { StatCard } from "@/components/ui/StatCard";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/dashboard/summary")
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
        Failed to load dashboard: {error}
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">Financial Overview</h1>
        <p className="text-slate-400">A quick glance at your current finances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Income" value={data.totalIncome} type="income" />
        <StatCard title="Total Expenses" value={data.totalExpense} type="expense" />
        <StatCard title="Net Balance" value={data.netBalance} type="balance" />
      </div>

      {/* Add more widgets or charts here in the future */}
    </motion.div>
  );
}