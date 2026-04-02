"use client";

import { useEffect } from "react";

export function AuthCookieSync() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      document.cookie = `auth-token=${token}; path=/; SameSite=Strict`;
    } else {
      document.cookie = "auth-token=; path=/; max-age=0; SameSite=Strict";
    }
  }, []);

  return null;
}
