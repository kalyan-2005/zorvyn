"use client";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";

import { StatCard } from "@/components/ui/StatCard";
import { motion } from "framer-motion";
import FinancialRecords from "../user/records";
import { AnalystDashboard } from "@/components/AnalystDashboard";

import Link from "next/link";
import { Link2 } from "lucide-react";

function AdminDashboard() {
  const [users, setUsers] = useState<{ id: string; name: string; email: string; role: string; status: string }[]>([]);
  const [meta, setMeta] = useState<{ page: number; totalPages: number; totalItems: number; limit: number }>({ page: 1, totalPages: 1, totalItems: 0, limit: 10 });
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
    page: 1,
  });

  const fetchUsers = async () => {
    // Avoid ESLint cascading-render warning by deferring the first state update.
    await Promise.resolve();
    setLoading(true);

    const query = new URLSearchParams({
      search: filters.search,
      role: filters.role,
      status: filters.status,
      page: String(filters.page),
    }).toString();

    const res = await apiFetch(`/users?${query}`);

    setUsers(res.data);
    setMeta(res.meta);

    setLoading(false);
  };

  useEffect(() => {
    const t = setTimeout(() => {
      void fetchUsers();
    }, 0);

    return () => clearTimeout(t);
  }, [filters]);

  const updateUser = async (
    id: string,
    data: { role?: string; status?: string },
  ) => {
    await apiFetch(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    fetchUsers();
  };

  return (
    <div className="min-w-0">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <h2 className="text-xl font-semibold sm:text-2xl">User Management</h2>

        {/* Filters */}
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap lg:max-w-2xl lg:justify-end">
          <input
            placeholder="Search..."
            className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm sm:min-w-48"
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value, page: 1 })
            }
          />

          <select
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm sm:w-40"
            onChange={(e) =>
              setFilters({ ...filters, role: e.target.value, page: 1 })
            }
          >
            <option value="">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="ANALYST">Analyst</option>
            <option value="VIEWER">Viewer</option>
          </select>

          <select
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm sm:w-44"
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value, page: 1 })
            }
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-700/80 bg-slate-800 [-webkit-overflow-scrolling:touch]">
        <div className="sm:min-w-[640px] text-center">
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 border-b border-slate-700 p-2 text-xs text-slate-400 sm:p-4 sm:text-sm">
          <span>Name</span>
          <span className="max-sm:hidden">Email</span>
          <span>Role</span>
          <span>Status</span>
          <span>Actions</span>
        </div>

        {loading ? (
          <div className="flex h-[min(480px,70vh)] items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="h-[min(480px,70vh)] overflow-y-auto">
            {users.length === 0 && (
              <div className="flex h-full items-center justify-center py-12">
                No users found
              </div>
            )}
            {users.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-4 sm:grid-cols-5 items-center gap-2 border-b border-slate-700 px-2 py-2 text-sm sm:px-4"
              >
                <span className="truncate text-left pl-4">{user.name}</span>
                <span className="truncate text-left max-sm:hidden">{user.email}</span>

                {/* Role */}
                <select
                  value={user.role}
                  onChange={(e) =>
                    updateUser(user.id, { role: e.target.value })
                  }
                  className="m-auto w-full max-w-30 rounded bg-slate-700 p-1 text-xs sm:text-sm"
                >
                  <option>ADMIN</option>
                  <option>ANALYST</option>
                  <option>VIEWER</option>
                </select>

                {/* Status */}
                <button
                  className={`h-4.5 w-10 border rounded-full m-auto relative cursor-pointer ${user.status === "ACTIVE" ? "border-green-500" : "border-red-500"}`}
                  onClick={() =>
                    updateUser(user.id, {
                      status: user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                    })
                  }
                >
                  <span className={`h-4 w-4 absolute ${user.status === "ACTIVE" ? "right-0 bg-green-500" : "left-0 bg-red-500"} rounded-full top-0`}></span>
                </button>

                <Link href={`/user/${user.id}`} className="m-auto"><Link2 /></Link>
              </motion.div>
            ))}
          </div>
        )}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          disabled={filters.page === 1}
          onClick={() =>
            setFilters({ ...filters, page: filters.page - 1 })
          }
          className="px-4 py-2 bg-slate-700 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span>
          Page {meta.page} / {meta.totalPages}
        </span>

        <button
          disabled={filters.page === meta.totalPages}
          onClick={() =>
            setFilters({ ...filters, page: filters.page + 1 })
          }
          className="px-4 py-2 bg-slate-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function ViewerDashboard({ role }: { role: string }) {
  const [data, setData] = useState<{ totalIncome: number; totalExpense: number; netBalance: number; userId: string }>({ totalIncome: 0, totalExpense: 0, netBalance: 0, userId: "" });
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
      <div className="flex min-h-[50vh] items-center justify-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
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
        <h1 className="text-2xl font-bold mb-2 sm:text-3xl">Financial Overview</h1>
        <p className="text-sm text-slate-400 sm:text-base">A quick glance at your current finances.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Income" value={data.totalIncome} type="income" />
        <StatCard title="Total Expenses" value={data.totalExpense} type="expense" />
        <StatCard title="Net Balance" value={data.netBalance} type="balance" />
      </div>

      {/* Add more widgets or charts here in the future */}
      <FinancialRecords userId={data.userId} role={role} />
    </motion.div>
  );
}

export default function Page() {
  const [profile, setProfile] = useState<{ name: string; role: string }>();
  useEffect(() => {
    apiFetch("/auth/me")
      .then((user) => {
        setProfile(user);
      })
      .catch((err) => {
        console.log(err.message || "Could not load profile");
      });
  }, []);
  return (
    <div className="min-w-0">
      {profile &&
        (profile.role === "ADMIN" ? (
          <AdminDashboard />
        ) : profile.role === "ANALYST" ? (
          <AnalystDashboard />
        ) : (
          <ViewerDashboard role={profile.role} />
        ))}
    </div>
  );
}
