import { useQuery } from "@tanstack/react-query";
import { API_URL } from "../../constants/env.ts";

export function useUserSearch(query: string) {
  return useQuery({
    queryKey: ["userSearch", query],
    queryFn: async () => {
      if (!query) return [];
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
