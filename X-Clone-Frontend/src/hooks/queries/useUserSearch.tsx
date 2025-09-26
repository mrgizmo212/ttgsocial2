import { useQuery } from "@tanstack/react-query";
import { API_URL, BACKEND_CONFIGURED } from "../../constants/env.ts";

export function useUserSearch(query: string) {
  return useQuery({
    queryKey: ["userSearch", query],
    queryFn: async () => {
      if (!query) return [];
      if (!BACKEND_CONFIGURED) {
        const res = await fetch(`/mock/users.json`);
        if (!res.ok) throw new Error("Failed to fetch mock users");
        const users = await res.json();
        const q = query.toLowerCase();
        return users
          .filter((u: any) =>
            [u.username, u.displayName, u.email].some((s: string) =>
              String(s || "").toLowerCase().includes(q)
            )
          )
          .map((u: any) => u.id);
      }
      const res = await fetch(
        `${API_URL}/api/users/search?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!query,
    staleTime: 1000 * 10,
  });
}
