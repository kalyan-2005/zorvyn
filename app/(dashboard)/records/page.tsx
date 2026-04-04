"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowDownRight, ArrowUpRight, X } from "lucide-react";

type Profile = { name: string; role: string };

type AdminFinancialRecord = {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  note: string | null;
  date: string;
  userId: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type AdminDraft = {
  amount: string;
  type: "INCOME" | "EXPENSE";
  category: string;
  note: string;
  date: string; // YYYY-MM-DD
};

function toDateInputValue(date: unknown) {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(String(date));
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function UserRecordsView() {
  type UserFinancialRecord = {
    id: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    category: string;
    note: string | null;
    date: string;
    createdAt: string;
  };

  const now = useMemo(() => new Date(), []);
  const currentMonth = `${now.getUTCFullYear()}-${String(
    now.getUTCMonth() + 1,
  ).padStart(2, "0")}`;

  type UserRecordsMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    month: string | null;
  };

  const [records, setRecords] = useState<UserFinancialRecord[]>([]);
  const [meta, setMeta] = useState<UserRecordsMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    month: currentMonth,
  });
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    month: currentMonth,
    page: 1,
    limit: 10,
  });
  const [form, setForm] = useState({
    amount: "",
    category: "",
    type: "EXPENSE",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search: filters.search,
        month: filters.month,
        page: String(filters.page),
        limit: String(filters.limit),
      }).toString();

      const res = await apiFetch(`/records?${query}`);
      setRecords((res.data ?? []) as UserFinancialRecord[]);
      setMeta(
        (res.meta ?? {
          total: 0,
          page: filters.page,
          limit: filters.limit,
          totalPages: 1,
          month: filters.month,
        }) as UserRecordsMeta,
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    } 
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.month, filters.page]);

  const createRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await apiFetch("/records", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      });
      setForm({ ...form, amount: "", category: "", note: "" });
      setOpenDialog(false);
      await fetchRecords();
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >

      <div className="min-w-0">
        {openDialog && (
          <>
            <button
              type="button"
              aria-label="Close add record dialog"
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpenDialog(false)}
            />
            <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
              <div
                className="max-h-[90dvh] w-9/10 max-w-md overflow-y-auto rounded-t-3xl border border-slate-700/50 bg-slate-900/98 p-5 shadow-2xl backdrop-blur-xl sm:max-h-[min(90vh,640px)] sm:rounded-3xl sm:p-6"
                onClick={(e) => e.stopPropagation()}
              >
            <div className="mb-4 flex items-start justify-between gap-3">
              <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
                <Plus className="h-5 w-5 shrink-0 text-indigo-400" />
                Add Record
              </h2>
              <button
                type="button"
                aria-label="Close"
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                onClick={() => setOpenDialog(false)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={createRecord} className="space-y-4">
              <Input
                label="Amount (₹)"
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) =>
                  setForm({ ...form, amount: e.target.value })
                }
                required
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-300 ml-1">
                  Type
                </label>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl text-slate-100 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="EXPENSE">Expense</option>
                  <option value="INCOME">Income</option>
                </select>
              </div>

              <Input
                label="Category"
                type="text"
                placeholder="e.g. Groceries, Salary"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                required
              />

              <Input
                label="Date"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />

              <Input
                label="Note (Optional)"
                type="text"
                placeholder="Additional details..."
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />

              <Button type="submit" className="w-full mt-4" isLoading={creating}>
                Save Record
              </Button>
            </form>
              </div>
            </div>
          </>
        )}

        <div className="min-w-0">
          <div className="py-2 sm:py-4">
            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
                <div>
                  <h1 className="text-xl font-bold mb-2">Financial Records</h1>
                  <p className="text-sm text-slate-400">
                    View and manage your financial records
                  </p>
                </div>
                <div className="w-full sm:w-72">
                  <input
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value, page: 1 })
                    }
                    placeholder="Search category, note, or type..."
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl text-slate-100 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div className="w-full sm:w-44">
                  <input
                    type="month"
                    value={filters.month}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        month: e.target.value,
                        page: 1,
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl text-slate-100 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <div className="text-sm text-slate-400 max-sm:hidden">
                  Total:{" "}
                  <span className="font-medium text-slate-200">
                    {meta.total ?? 0}
                  </span>
                </div>
                <Button
                  className="w-full sm:w-auto"
                  onClick={() => setOpenDialog(true)}
                  disabled={creating}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Record
                </Button>
              </div>
            </div>

            {loading ? (
              <div className="flex h-[min(540px,65vh)] items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500" />
              </div>
            ) : records.length === 0 ? (
              <div className="flex h-[min(540px,65vh)] flex-col items-center justify-center text-center text-slate-500">
                <p>No records found.</p>
                <p className="text-sm">Create one to get started.</p>
              </div>
            ) : (
              <div className="h-[min(540px,65vh)] space-y-1 overflow-y-auto [-webkit-overflow-scrolling:touch]">
                <AnimatePresence>
                  {records.map((record) => {
                    const isIncome = record.type === "INCOME";
                    return (
                      <motion.div
                        key={record.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex rounded-2xl border border-slate-800 bg-slate-900/50 p-3 transition-colors hover:border-slate-700 hover:bg-slate-800 items-center justify-between sm:gap-4 sm:px-6 sm:py-2"
                      >
                        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                          <div
                            className={`p-2 rounded-full ${
                              isIncome
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-rose-500/10 text-rose-400"
                            }`}
                          >
                            {isIncome ? (
                              <ArrowUpRight className="w-5 h-5" />
                            ) : (
                              <ArrowDownRight className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-200">
                              {record.category}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-500">
                              <span>
                                {new Date(record.date).toLocaleDateString()}
                              </span>
                              {record.note && (
                                <>
                                  <span>•</span>
                                  <span className="truncate max-w-[120px] sm:max-w-xs">
                                    {record.note}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`shrink-0 text-right text-base font-bold sm:text-lg ${
                            isIncome ? "text-emerald-400" : "text-slate-200"
                          }`}
                        >
                          {isIncome ? "+" : "-"}₹{record.amount.toLocaleString()}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

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

              <span className="text-slate-400">
                Page {meta.page ?? 1} / {meta.totalPages ?? 1}
              </span>

              <button
                disabled={filters.page >= (meta.totalPages ?? 1)}
                onClick={() =>
                  setFilters({ ...filters, page: filters.page + 1 })
                }
                className="px-4 py-2 bg-slate-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AdminRecordsTable() {
  const router = useRouter();

  const now = useMemo(() => new Date(), []);
  const currentMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;

  const [records, setRecords] = useState<AdminFinancialRecord[]>([]);
  type AdminRecordsMeta = {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    month: string;
  };

  const [meta, setMeta] = useState<AdminRecordsMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    month: currentMonth,
  });
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    search: "",
    month: currentMonth,
    page: 1,
    limit: 10,
  });

  const [drafts, setDrafts] = useState<Record<string, AdminDraft>>({});

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search: filters.search,
        month: filters.month,
        page: String(filters.page),
        limit: String(filters.limit),
      }).toString();

      const res = await apiFetch(`/admin/records?${query}`);
      setRecords(res.data ?? []);
      setMeta(res.meta ?? {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.month, filters.page]);

  useEffect(() => {
    const next: Record<string, AdminDraft> = {};
    for (const r of records) {
      next[r.id] = {
        amount: String(r.amount ?? 0),
        type: r.type,
        category: r.category ?? "",
        note: r.note ?? "",
        date: toDateInputValue(r.date),
      };
    }
    setDrafts(next);
  }, [records]);

  const setDraftField = (id: string, patch: Partial<AdminDraft>) => {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] ?? ({} as AdminDraft)),
        ...patch,
      },
    }));
  };

  const saveRecord = async (id: string) => {
    const d = drafts[id];
    if (!d) return;
    if (savingId === id) return;
    setSavingId(id);

    try {
      await apiFetch(`/admin/records/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          amount: Number(d.amount),
          type: d.type,
          category: d.category,
          note: d.note.trim() === "" ? null : d.note,
          date: d.date,
        }),
      });
      await fetchRecords();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >

      <div>
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-2">
          <div className="flex items-center flex-col sm:flex-row gap-4 w-full">
            <div>
              <h1 className="text-xl font-bold mb-2">All Records</h1>
              <p className="text-slate-400 text-sm">Filter by month, search, and edit key fields.</p>
            </div>
            <div className="flex flex-col w-full sm:w-80">
              <label className="text-sm font-medium text-slate-300 ml-1">
                Search
              </label>
              <input
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value, page: 1 })
                }
                placeholder="Category, note, user name/email, or INCOME/EXPENSE"
                className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl text-slate-100 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div className="flex flex-col w-full sm:w-56">
              <label className="text-sm font-medium text-slate-300 ml-1">
                Month
              </label>
              <input
                type="month"
                value={filters.month}
                onChange={(e) =>
                  setFilters({ ...filters, month: e.target.value, page: 1 })
                }
                className="w-full px-4 py-2 bg-slate-800/80 border border-slate-700 focus:border-indigo-500 rounded-xl text-slate-100 outline-none transition-all focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <div className="text-sm text-slate-400">
            Total: <span className="text-slate-200 font-medium">{meta.total ?? 0}</span>
          </div>
        </div>

        <div className="min-w-0 overflow-x-auto [-webkit-overflow-scrolling:touch]">
          <div className="min-w-[920px]">
            <div className="grid grid-cols-7 gap-2 border-b border-slate-700 p-3 text-xs uppercase tracking-wide text-slate-400">
              <div>User</div>
              <div>Category</div>
              <div>Type</div>
              <div className="text-right">Amount</div>
              <div>Date</div>
              <div>Note</div>
              <div className="text-right">Actions</div>
            </div>

            {loading ? (
              <div className="flex h-[min(480px,70vh)] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
              </div>
            ) : records.length === 0 ? (
              <div className="flex h-[min(480px,70vh)] items-center justify-center text-slate-500">No records found for this month.</div>
            ) : (
              <div className="h-[min(480px,70vh)] overflow-y-auto">
              {records.map((r) => {
                const d = drafts[r.id];
                const isSaving = savingId === r.id;
                return (
                  <div
                    key={r.id}
                    className="grid grid-cols-7 gap-2 px-3 py-2 border-b border-slate-700 items-center text-sm"
                  >
                    <div className="min-w-[160px]">
                      <div
                        className="text-slate-200 font-medium cursor-pointer hover:underline"
                        onClick={() => router.push(`/user/${r.user.id}`)}
                      >
                        {r.user.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {r.user.email}
                      </div>
                    </div>

                    <div>
                      <input
                        value={d?.category ?? ""}
                        onChange={(e) =>
                          setDraftField(r.id, { category: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-900/40 border border-slate-700 focus:border-indigo-500 rounded-lg text-slate-100 outline-none"
                      />
                    </div>

                    <div>
                      <select
                        value={d?.type ?? r.type}
                        onChange={(e) =>
                          setDraftField(r.id, {
                            type:
                              e.target.value === "INCOME" ? "INCOME" : "EXPENSE",
                          })
                        }
                        className="w-full px-3 py-2 bg-slate-900/40 border border-slate-700 focus:border-indigo-500 rounded-lg text-slate-100 outline-none"
                      >
                        <option value="INCOME">INCOME</option>
                        <option value="EXPENSE">EXPENSE</option>
                      </select>
                    </div>

                    <div className="text-right">
                      <input
                        type="number"
                        step="0.01"
                        value={d?.amount ?? String(r.amount ?? 0)}
                        onChange={(e) =>
                          setDraftField(r.id, { amount: e.target.value })
                        }
                        className="w-full text-right px-3 py-2 bg-slate-900/40 border border-slate-700 focus:border-indigo-500 rounded-lg text-slate-100 outline-none"
                      />
                    </div>

                    <div>
                      <input
                        type="date"
                        value={d?.date ?? toDateInputValue(r.date)}
                        onChange={(e) =>
                          setDraftField(r.id, { date: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-slate-900/40 border border-slate-700 focus:border-indigo-500 rounded-lg text-slate-100 outline-none"
                      />
                    </div>

                    <div className="min-w-[200px]">
                      <input
                        value={d?.note ?? ""}
                        onChange={(e) =>
                          setDraftField(r.id, { note: e.target.value })
                        }
                        placeholder="Optional"
                        className="w-full px-3 py-2 bg-slate-900/40 border border-slate-700 focus:border-indigo-500 rounded-lg text-slate-100 outline-none"
                      />
                    </div>

                    <div className="text-right">
                      <button
                        onClick={() => saveRecord(r.id)}
                        disabled={isSaving}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  </div>
                );
              })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            disabled={filters.page === 1}
            onClick={() =>
              setFilters({ ...filters, page: filters.page - 1 })
            }
            className="rounded bg-slate-700 px-4 py-2 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-slate-400">
            Page {meta.page ?? 1} / {meta.totalPages ?? 1}
          </span>
          <button
            disabled={filters.page >= (meta.totalPages ?? 1)}
            onClick={() =>
              setFilters({ ...filters, page: filters.page + 1 })
            }
            className="rounded bg-slate-700 px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function RecordsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    apiFetch("/auth/me")
      .then((user) => {
        setProfile(user);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  if (!profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center py-16">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return profile.role === "ADMIN" ? <AdminRecordsTable /> : <UserRecordsView />;
}