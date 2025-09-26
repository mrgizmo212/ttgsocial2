import { useQuery } from "@tanstack/react-query";
import { userBatcher } from "../batcher/userBatcher.tsx";

export const useUser = (id: number | undefined) =>
  useQuery({
    queryKey: ["user", id],
    queryFn: () => userBatcher.fetch(id!),
    enabled: typeof id === "number" && id > 0,
    staleTime: 1000 * 60 * 5,
  });
