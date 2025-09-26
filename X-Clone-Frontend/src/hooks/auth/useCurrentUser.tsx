import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../../constants/env";
import type { User } from "../../types/User";

export const useCurrentUser = () =>
  useQuery<User>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("No auth token");
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch current user");
      return res.json();
    },
    enabled: !!localStorage.getItem("jwt"),
  });
