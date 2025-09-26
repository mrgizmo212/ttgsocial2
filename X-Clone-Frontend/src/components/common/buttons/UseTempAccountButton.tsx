import { useQueryClient } from "@tanstack/react-query";
import { API_URL, BACKEND_CONFIGURED } from "../../../constants/env.ts";
import { useModal } from "../../../context/ModalProvider.tsx";

export function UseTempAccountButton() {
  const { setModalType } = useModal();
  const queryClient = useQueryClient();

  function authenticateTempUser() {
    fetch(`${API_URL}/api/auth/demo-signup`, {
      method: "POST",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Temp login failed");
        return res.json();
      })
      .then(async (data) => {
        localStorage.setItem("jwt", data.token);
        await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
        setModalType("createAccount");
      })

      .catch((err) => {
        console.error("Admin login error:", err);
      });
  }

  return (
    <div
      onClick={() => BACKEND_CONFIGURED && authenticateTempUser()}
      className={`hover:cursor-pointer hover:bg-(--color-main)/75 w-full bg-(--color-main) text-twitterText flex items-center gap-2 justify-center h-10 rounded-full`}
    >
      <p className="">{BACKEND_CONFIGURED ? "Use a temporary account" : "Backend not configured"}</p>
    </div>
  );
}
