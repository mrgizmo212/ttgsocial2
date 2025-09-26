import { useQueryClient } from "@tanstack/react-query";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem("jwt");
    queryClient.removeQueries({ queryKey: ["currentUser"] });
    window.location.reload();
  };
};
