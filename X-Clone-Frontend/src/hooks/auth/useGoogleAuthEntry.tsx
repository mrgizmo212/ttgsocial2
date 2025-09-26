import { useGoogleLogin } from "@react-oauth/google";
import { API_URL } from "../../constants/env.ts";
import { useQueryClient } from "@tanstack/react-query";

export function useGoogleAuthEntry() {
  const queryClient = useQueryClient();

  return useGoogleLogin({
    flow: "implicit",
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(`${API_URL}/api/auth/google-login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        if (!res.ok) {
          console.error("Login failed");
          return;
        }

        const data = await res.json();
        console.log("User authenticated with data: " + JSON.stringify(data));
        localStorage.setItem("jwt", data.token);
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        window.location.reload();
      } catch (err) {
        console.error("Login error:", err);
      }
    },
    onError: () => {
      console.error("Google login failed");
    },
  });
}
