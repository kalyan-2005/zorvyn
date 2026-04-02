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

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative z-10">
        <motion.div 
          className="text-center max-w-3xl mx-auto mt-20"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-medium text-sm mb-6">
            The next generation of finance management
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
            Control your wealth with <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">clarity</span>.
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto">
            Zorvyn provides a lightning-fast, secure, and beautiful way to track your income and expenses. Dive deep into your finances and make better decisions today.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <Button className="px-8 py-4 text-lg rounded-full">
                Start for free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" className="px-8 py-4 text-lg rounded-full">
                Sign in to dashboard
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32"
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
             <motion.div key={i} variants={itemVariants} className="bg-slate-800/40 border border-slate-700 p-8 rounded-3xl backdrop-blur-sm hover:bg-slate-800/60 transition-colors">
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
