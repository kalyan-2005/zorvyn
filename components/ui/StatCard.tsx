import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  type: "income" | "expense" | "balance";
}

export function StatCard({ title, value, type }: StatCardProps) {
  const config = {
    income: {
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    expense: {
      icon: TrendingDown,
      color: "text-rose-400",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
    balance: {
      icon: Wallet,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
  };

  const { icon: Icon, color, bg, border } = config[type];

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-slate-800/40 p-6 rounded-3xl border border-slate-700/50 flex flex-col items-center sm:items-start text-center sm:text-left shadow-lg backdrop-blur"
    >
      <div className={`p-3 rounded-2xl ${bg} ${border} border mb-4 inline-flex items-center justify-center`}>
         <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <p className="text-slate-400 font-medium mb-1">{title}</p>
      <h3 className="text-3xl font-bold tracking-tight">
        ₹{value.toLocaleString()}
      </h3>
    </motion.div>
  );
}
