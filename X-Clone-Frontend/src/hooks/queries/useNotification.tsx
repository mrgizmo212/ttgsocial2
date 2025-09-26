import { useQuery } from "@tanstack/react-query";
import { notificationBatcher } from "../batcher/notificationBatcher.tsx";
export const useNotification = (id: number) =>
  useQuery({
    queryKey: ["notification", id],
    queryFn: () => notificationBatcher.fetch(id),
    enabled: typeof id === "number" && id > 0,
    staleTime: 1000 * 60 * 5,
  });
