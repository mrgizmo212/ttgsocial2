import { useInfiniteQuery } from "@tanstack/react-query";
import { API_URL } from "../../constants/env.ts";

type UserPage = {
  users: number[];
  nextCursor: number | null;
};

export function useInfiniteUsers() {
  return useInfiniteQuery<UserPage, Error>({
    queryKey: ["discoverUsers"],
    queryFn: async ({ pageParam = Date.now() + 60_000 }) => {
      const res = await fetch(
        `${API_URL}/api/users/get-discover?cursor=${pageParam ?? ""}&limit=20`
      );
      if (!res.ok) throw new Error("Failed to fetch users");

      const result = await res.json();
      console.log("Got user feed:", result);
      return result;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: Date.now() + 60_000,
  });
}
