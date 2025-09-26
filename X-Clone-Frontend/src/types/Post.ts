import type { PostMedia } from "./PostMedia.ts";

export type Post = {
  id: number;
  userId: number;
  text: string;
  createdAt: string;
  likedBy: number[];
  bookmarkedBy: number[];
  parentId?: number;
  replies: number[];
  retweetedBy: number[];
  postMedia: PostMedia[];
  pollId?: number;
  pollExpiryTimeStamp: string;
};
