"use client";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import ViewerDashboard from "./viewer";
import Admin from "./admin";

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
    <div>
      {profile && (profile.role === "ADMIN" ? <Admin /> : <ViewerDashboard />)}
    </div>
  );
}
