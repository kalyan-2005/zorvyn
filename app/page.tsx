"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/Button";
import { ArrowRight, PieChart, Shield, Zap } from "lucide-react";

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-900 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-28 md:pt-32">
        <motion.div 
          className="mx-auto mt-12 max-w-3xl text-center sm:mt-16 md:mt-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-medium text-sm mb-6">
            The next generation of finance management
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="mb-6 text-4xl font-extrabold tracking-tight sm:mb-8 sm:text-5xl md:text-7xl">
            Control your wealth with <span className="bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-400">clarity</span>.
          </motion.h1>
          
          <motion.p variants={itemVariants} className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-slate-400 sm:mb-10 sm:text-xl">
            Zorvyn provides a lightning-fast, secure, and beautiful way to track your income and expenses. Dive deep into your finances and make better decisions today.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex w-full max-w-md mx-auto flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:items-center sm:gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button className="w-full justify-center rounded-full px-6 py-3 text-sm sm:w-auto sm:px-8 sm:py-4 sm:text-lg">
                Start for free <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full justify-center rounded-full px-6 py-3 text-sm sm:w-auto sm:px-8 sm:py-4 sm:text-lg">
                Sign in to dashboard
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          className="mt-20 grid grid-cols-1 gap-6 sm:mt-28 sm:gap-8 md:mt-32 md:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
             { icon: Zap, title: "Lightning Fast", desc: "Built on optimal edge infrastructure for instantaneous interactions." },
             { icon: Shield, title: "Bank Grade Security", desc: "Your data is encrypted, secure and never shared with anyone." },
             { icon: PieChart, title: "Advanced Analytics", desc: "Gain insightful visual metrics over your financial habits." }
          ].map((feat, i) => (
             <motion.div key={i} variants={itemVariants} className="rounded-3xl border border-slate-700 bg-slate-800/40 p-6 backdrop-blur-sm transition-colors hover:bg-slate-800/60 sm:p-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                  <feat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                <p className="text-slate-400 leading-relaxed">{feat.desc}</p>
             </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
