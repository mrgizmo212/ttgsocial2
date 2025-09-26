import type { ModalType } from "../../types/ModalType.ts";
import { FaXTwitter } from "react-icons/fa6";
import { GoogleAuthButton } from "../common/buttons/GoogleAuthButton.tsx";
import { HorizontalStripedText } from "../common/HorizontalStripedText.tsx";
import { TermsAndConditions } from "./TermsAndConditions.tsx";
import { UseTempAccountButton } from "../common/buttons/UseTempAccountButton.tsx";
import { GOOGLE_ENABLED } from "../../constants/env.ts";

type SignUpViewProps = {
  setToggle: (type: ModalType) => void;
};

function SignupView({ setToggle }: SignUpViewProps) {
  return (
    <div className="w-full h-full flex flex-col border text-twitterText rounded-4xl p-8 items-center gap-6 bg-(--background-main)">
      <>
        <FaXTwitter className="text-4xl" />

        <p className="text-xl font-bold text-center">Create an account</p>

        {GOOGLE_ENABLED && (
          <GoogleAuthButton setToggle={setToggle}>Sign up with Google</GoogleAuthButton>
        )}

        {GOOGLE_ENABLED && <HorizontalStripedText> OR </HorizontalStripedText>}

        <UseTempAccountButton />

        <TermsAndConditions />

        <p className="text-lg font-bold text-center">
          Already have an account?
        </p>

        <div onClick={() => setToggle("login")} className="w-full hover:cursor-pointer hover:bg-twitterText/75 bg-twitterText text-(--color-main) flex items-center gap-2 justify-center h-10 rounded-full">
          <p>Sign in</p>
        </div>
      </>
    </div>
  );
}

export default SignupView;
