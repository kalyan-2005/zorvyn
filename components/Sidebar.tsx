"use client";

import { Home, BarChart3, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function Sidebar() {
  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-64 h-screen bg-slate-800 p-6 flex flex-col gap-6"
    >
      <h1 className="text-xl font-bold text-indigo-400">FinanceAI</h1>

      <nav className="flex flex-col gap-4">
        <SidebarItem icon={<Home />} label="Dashboard" />
        <SidebarItem icon={<BarChart3 />} label="Analytics" />
        <SidebarItem icon={<Users />} label="Users" />
      </nav>
    </motion.div>
  );
}

function SidebarItem({ icon, label }: any) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700 transition cursor-pointer">
      {icon}
      <span>{label}</span>
    </div>
  );
}