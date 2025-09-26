import { create, windowScheduler } from "@yornaath/batshit";
import type { User } from "../../types/User.ts";
import { API_URL } from "../../constants/env.ts";

export const userBatcher = create<User, number>({
  fetcher: async (ids: number[]) => {
    const res = await fetch(`${API_URL}/api/users/get-users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ids),
    });

    if (!res.ok) throw new Error("Failed to fetch users");
    return await res.json();
  },

  resolver: (results, id) => {
    if (!Array.isArray(results)) {
      throw new Error("Expected array of users");
    }
    const match = results.find((u) => u.id === id);
    if (!match) throw new Error("User not found for id: " + id);
    return match;
  },

  scheduler: windowScheduler(10),
});
