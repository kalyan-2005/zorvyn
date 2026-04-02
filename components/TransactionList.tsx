"use client";

import { motion } from "framer-motion";

export default function TransactionList({ data }: any) {
  return (
    <div className="bg-slate-800 p-5 rounded-xl">
      <h3 className="mb-4 font-semibold">Recent Transactions</h3>

      <div className="flex flex-col gap-3">
        {data.map((item: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between p-3 bg-slate-700 rounded-lg"
          >
            <div>
              <p>{item.category}</p>
              <span className="text-sm text-slate-400">
                {item.date}
              </span>
            </div>

            <p
              className={
                item.type === "INCOME"
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              ₹ {item.amount}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}