import { create, windowScheduler } from "@yornaath/batshit";
import { API_URL } from "../../constants/env.ts";
import type { Notification } from "../../types/Notification.ts";

export const notificationBatcher = create<Notification, number>({
  fetcher: async (ids: number[]) => {
    const res = await fetch(`${API_URL}/api/notifications/get-notifications`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ids),
    });

    if (!res.ok) throw new Error("Failed to fetch posts");
    return await res.json();
  },

  resolver: (results, id) => {
    if (!Array.isArray(results)) {
      throw new Error("Expected array of notifications");
    }
    const match = results.find((p) => p.id === id);
    if (!match) throw new Error("Notification not found for id: " + id);
    return match;
  },

  scheduler: windowScheduler(10),
});
