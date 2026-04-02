import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function generateToken(user: any) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "1d",
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
  document.cookie = `auth-token=${token}; path=/; SameSite=Strict`;
}

export function getToken() {
  return localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  document.cookie = "auth-token=; path=/; max-age=0; SameSite=Strict";
  window.location.href = "/login";
}
