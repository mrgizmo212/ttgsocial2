import { RiQuillPenLine } from "react-icons/ri";

import { useModal } from "../../../context/ModalProvider.tsx";
import { useLocation } from "react-router-dom";

function ComposePostMobileButton() {
  const { setModalType } = useModal();

  const location = useLocation();

  const isOnFullTweet = location.pathname.startsWith("/tweet")

  if (isOnFullTweet) return null;

  return (
    <>
      <div className="absolute h-14 w-14 right-5 bottom-20">
        <div className="bg-(--color-main) flex items-center justify-center text-3xl rounded-full w-full h-full">
          <RiQuillPenLine onClick={() => setModalType("posting")} />
        </div>
      </div>
    </>
  );
}

export default ComposePostMobileButton;
