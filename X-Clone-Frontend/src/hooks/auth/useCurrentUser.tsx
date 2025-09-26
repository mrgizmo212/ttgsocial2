import { useQuery } from "@tanstack/react-query";
import { API_URL, BACKEND_CONFIGURED } from "../../constants/env";
import type { User } from "../../types/User";

export const useCurrentUser = () =>
  useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = localStorage.getItem("jwt");
      if (!token && !BACKEND_CONFIGURED) {
        throw new Error("No auth token");
      }
      if (!BACKEND_CONFIGURED) {
        const res = await fetch(`/mock/users.json`);
        if (!res.ok) throw new Error("Failed to fetch mock user");
        const users: User[] = await res.json();
        const admin = users.find((u) => u.username === "mockuser1") || users[0];
        return admin as User;
      }
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch current user");
      return res.json();
    },
    enabled: !!localStorage.getItem("jwt") || !BACKEND_CONFIGURED,
  });
