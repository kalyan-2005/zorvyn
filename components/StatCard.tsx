"use client";

import { motion } from "framer-motion";

export default function StatCard({ title, value, type }: any) {
  const color =
    type === "income"
      ? "text-green-400"
      : type === "expense"
      ? "text-red-400"
      : "text-indigo-400";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-slate-800 p-5 rounded-xl shadow-lg"
    >
      <p className="text-slate-400">{title}</p>
      <h3 className={`text-2xl font-bold ${color}`}>₹ {value}</h3>
    </motion.div>
  );
}