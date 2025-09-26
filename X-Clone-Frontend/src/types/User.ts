export type User = {
  id: number;
  username: string;
  email: string;
  displayName: string;
  bio: string;
  createdAt: string;
  posts: number[];
  replies: number[];
  likedPosts: number[];
  bookmarkedPosts: number[];
  followers: number[];
  following: number[];
  retweets: number[];
  profilePictureUrl: string;
  bannerImageUrl: string;
  pinnedPostId: number | null;
  verified: boolean;
};
