import type { ModalType } from "../../types/ModalType.ts";
import { FaXTwitter } from "react-icons/fa6";
import { GoogleAuthButton } from "../common/buttons/GoogleAuthButton.tsx";
import { HorizontalStripedText } from "../common/HorizontalStripedText.tsx";
import { UseTempAccountButton } from "../common/buttons/UseTempAccountButton.tsx";
import { GOOGLE_ENABLED, BACKEND_CONFIGURED } from "../../constants/env.ts";
import { DevLoginForm } from "./DevLoginForm.tsx";

type LoginViewProps = {
  setToggle: (type: ModalType) => void;
};

function LoginView({ setToggle }: LoginViewProps) {
  return (
    <div className="w-full h-full flex flex-col border text-twitterText rounded-4xl p-8 items-center gap-6 bg-(--background-main)">
      <FaXTwitter className="text-4xl" />

      <p className="text-xl font-bold text-center">Sign in to X</p>

      {GOOGLE_ENABLED && (
        <GoogleAuthButton setToggle={setToggle}>Sign in with Google</GoogleAuthButton>
      )}

      {GOOGLE_ENABLED && <HorizontalStripedText> OR </HorizontalStripedText>}

      {!BACKEND_CONFIGURED ? (
        <DevLoginForm />
      ) : (
        <UseTempAccountButton />
      )}

      <p onClick={() => setToggle("signup")} className="text-md w-full font text-twitterTextAlt">
        Don't have an account?{" "}
        <span className="text-(--color-main)">Sign up</span>
      </p>
    </div>
  );
}

export default LoginView;
