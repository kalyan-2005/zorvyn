"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { motion } from "framer-motion";

export default function Admin() {
  const [users, setUsers] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    status: "",
    page: 1,
  });

  const fetchUsers = async () => {
    setLoading(true);

    const query = new URLSearchParams(filters as any).toString();

    const res = await apiFetch(`/users?${query}`);

    setUsers(res.data);
    setMeta(res.meta);

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const updateUser = async (id: string, data: any) => {
    await apiFetch(`/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    fetchUsers();
  };

  return (
    <div>
      <h2 className="text-2xl mb-6 font-semibold">User Management</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          placeholder="Search..."
          className="p-2 bg-slate-800 rounded"
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value, page: 1 })
          }
        />

        <select
          className="p-2 bg-slate-800 rounded"
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
          className="p-2 bg-slate-800 rounded"
          onChange={(e) =>
            setFilters({ ...filters, status: e.target.value, page: 1 })
          }
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-xl overflow-hidden">
        <div className="grid grid-cols-5 p-4 border-b border-slate-700 text-slate-400">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Status</span>
        </div>

        {loading ? (
          <div className="p-6 animate-pulse">Loading users...</div>
        ) : (
          users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-5 p-4 border-b border-slate-700 items-center"
            >
              <span>{user.name}</span>
              <span>{user.email}</span>

              {/* Role */}
              <select
                value={user.role}
                onChange={(e) =>
                  updateUser(user.id, { role: e.target.value })
                }
                className="bg-slate-700 p-1 rounded"
              >
                <option>ADMIN</option>
                <option>ANALYST</option>
                <option>VIEWER</option>
              </select>

              {/* Status */}
              <button
                className="bg-indigo-500 px-3 py-1 rounded hover:bg-indigo-600 transition"
                onClick={() =>
                  updateUser(user.id, {
                    status: user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                  })
                }
              >
                Toggle Status
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-6">
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