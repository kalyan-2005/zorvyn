"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { setToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    apiFetch("/auth/me")
      .then(() => router.replace("/dashboard"))
      .catch(() => null);
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setToken(res.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-900">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 mb-6 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center transform group-hover:-rotate-6 transition-transform">
              <span className="text-white font-bold leading-none">Z</span>
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
              Zorvyn
            </span>
          </Link>
          <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
          <p className="text-slate-400">Sign in to manage your wealth.</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 mb-6 bg-rose-500/10 border border-rose-500/50 text-rose-400 rounded-xl text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <Button
            type="submit"
            className="w-full py-3 mt-4"
            isLoading={loading}
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
