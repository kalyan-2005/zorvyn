"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ArrowDownRight, ArrowUpRight, Search } from "lucide-react";

export default function Records() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    type: "EXPENSE",
    date: new Date().toISOString().split('T')[0],
    note: "",
  });

  const fetchRecords = async () => {
    try {
      const data = await apiFetch("/records");
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

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
      className="space-y-8"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Financial Records</h1>
          <p className="text-slate-400">Track and manage your expenses and income.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* New Record Form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 backdrop-blur">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-400" />
              Add Record
            </h2>
            <form onSubmit={createRecord} className="space-y-4">
              <Input
                label="Amount (₹)"
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-300 ml-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
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
                onChange={(e) => setForm({ ...form, category: e.target.value })}
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

        {/* Records List */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 backdrop-blur min-h-[500px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Transactions</h2>
              {/* Could add search or filters here */}
            </div>

            {loading ? (
               <div className="flex justify-center items-center h-48">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
               </div>
            ) : records.length === 0 ? (
               <div className="flex flex-col items-center justify-center text-center h-48 text-slate-500">
                 <p>No records found.</p>
                 <p className="text-sm">Create one to get started.</p>
               </div>
            ) : (
               <div className="space-y-3">
                 <AnimatePresence>
                   {records.map((record) => {
                     const isIncome = record.type === "INCOME";
                     return (
                       <motion.div
                         key={record.id}
                         initial={{ opacity: 0, x: -10 }}
                         animate={{ opacity: 1, x: 0 }}
                         exit={{ opacity: 0, scale: 0.95 }}
                         className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 hover:bg-slate-800 transition-colors border border-slate-800 hover:border-slate-700"
                       >
                         <div className="flex items-center gap-4">
                           <div className={`p-3 rounded-full ${isIncome ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                              {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                           </div>
                           <div>
                             <p className="font-semibold text-slate-200">{record.category}</p>
                             <div className="flex items-center gap-2 text-sm text-slate-500">
                               <span>{new Date(record.date).toLocaleDateString()}</span>
                               {record.note && (
                                 <>
                                   <span>•</span>
                                   <span className="truncate max-w-[120px] sm:max-w-xs">{record.note}</span>
                                 </>
                               )}
                             </div>
                           </div>
                         </div>
                         <div className={`font-bold text-lg ${isIncome ? 'text-emerald-400' : 'text-slate-200'}`}>
                           {isIncome ? '+' : '-'}₹{record.amount.toLocaleString()}
                         </div>
                       </motion.div>
                     );
                   })}
                 </AnimatePresence>
               </div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
}