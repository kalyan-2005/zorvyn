"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socketClient";

export default function FinancialRecords({ userId }: { userId: string }) {
  const [records, setRecords] = useState<any[]>([]);

  // 1️⃣ Initial fetch
  useEffect(() => {
    fetch(`/api/users/${userId}/financial-records`)
      .then((res) => res.json())
      .then((data) => setRecords(data.data));
  }, [userId]);

  // 2️⃣ WebSocket — join only after connect; emit before connect is dropped
  useEffect(() => {
    const onFinancialUpdate = (newRecord: unknown) => {
      setRecords((prev) => [newRecord, ...prev]);
    };

    const joinRoom = () => {
      socket.emit("join-user-room", userId);
    };

    socket.on("connect", joinRoom);
    socket.on("financial-update", onFinancialUpdate);

    if (socket.connected) {
      joinRoom();
    } else {
      socket.connect();
    }

    return () => {
      socket.off("connect", joinRoom);
      socket.off("financial-update", onFinancialUpdate);
      socket.disconnect();
    };
  }, [userId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Financial Records</h2>

      {records.map((r) => (
        <div key={r.id} className="border p-2 mb-2 rounded">
          <p>Amount: {r.amount}</p>
          <p>{new Date(r.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}