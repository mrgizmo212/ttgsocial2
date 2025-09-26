import type { ReactNode } from "react";
import { FaGoogle } from "react-icons/fa6";
import { useGoogleAuthEntry } from "../../../hooks/auth/useGoogleAuthEntry.tsx";
import type { ModalType } from "../../../types/ModalType.ts";

type GoogleSignInButtonProps = {
  children: ReactNode;
  setToggle?: (type: ModalType) => void;
};

export function GoogleAuthButton({
  children,
  setToggle,
}: GoogleSignInButtonProps) {
  const login = useGoogleAuthEntry();

  const handleLogin = () => {
    login();
    if (setToggle) {
      setToggle(null);
    }
  };

  return (
    <div
      onClick={() => handleLogin()}
      className="w-full hover:cursor-pointer hover:bg-twitterText/75 bg-twitterText text-twitterBlack flex items-center gap-2 justify-center h-10 rounded-full"
    >
      <FaGoogle />
      <p className="">{children}</p>
    </div>
  );
}
