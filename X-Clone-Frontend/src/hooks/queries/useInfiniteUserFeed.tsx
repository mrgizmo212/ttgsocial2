import { useInfiniteQuery } from "@tanstack/react-query";
import { API_URL, BACKEND_CONFIGURED } from "../../constants/env.ts";

type UserPage = {
  users: number[];
  nextCursor: number | null;
};

export function useInfiniteUsers() {
  return useInfiniteQuery<UserPage, Error>({
    queryKey: ["discoverUsers"],
    queryFn: async ({ pageParam = 0 }) => {
      if (!BACKEND_CONFIGURED) {
        const res = await fetch(`/mock/discover_users_page_0.json`);
        if (!res.ok) throw new Error("Failed to fetch mock discover users");
        return await res.json();
      }
      const res = await fetch(
        `${API_URL}/api/users/get-discover?cursor=${pageParam ?? 0}&limit=20`
      );
      if (!res.ok) throw new Error("Failed to fetch users");

      const result = await res.json();
      console.log("Got user feed:", result);
      return result;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  });
}
