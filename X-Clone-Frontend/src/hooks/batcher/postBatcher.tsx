import { create, windowScheduler } from "@yornaath/batshit";
import type { Post } from "../../types/Post.ts";
import { API_URL, BACKEND_CONFIGURED } from "../../constants/env.ts";

export const postBatcher = create<Post, number>({
  fetcher: async (ids: number[]) => {
    if (!BACKEND_CONFIGURED) {
      const res = await fetch(`/mock/posts.json`);
      if (!res.ok) throw new Error("Failed to fetch mock posts");
      return await res.json();
    }
    const res = await fetch(`${API_URL}/api/posts/get-posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ids),
    });

    if (!res.ok) throw new Error("Failed to fetch posts");
    return await res.json();
  },

  resolver: (results, id) => {
    if (!Array.isArray(results)) {
      throw new Error("Expected array of posts");
    }
    const match = results.find((p) => p.id === id);
    if (!match) throw new Error("Post not found for id: " + id);
    return match;
  },

  scheduler: windowScheduler(10),
});
