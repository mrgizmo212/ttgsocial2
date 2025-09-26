import type { NotificationType } from "./NotificationType.ts";

export type Notification = {
  id: number;
  senderId: number;
  receiverId: number;
  referenceId: number;
  text: string;
  type: NotificationType;
  createdAt: string;
  seen: boolean;
};
