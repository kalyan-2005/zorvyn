"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "./ui/Button";

export function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
            <span className="text-white font-bold text-lg leading-none">Z</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
            Zorvyn
          </span>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="cursor-pointer">Log in</Button>
          </Link>
          <Link href="/register" className="max-sm:hidden">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
