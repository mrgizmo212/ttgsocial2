import { useModal } from "../../context/ModalProvider.tsx";
import Modal from "./Modal.tsx";
import SignupView from "../entry/SignupView.tsx";
import LoginView from "../entry/LoginView.tsx";
import ComposeTweet from "../input/ComposeTweet.tsx";
import { AnimatePresence } from "framer-motion";
import ChangeColorModal from "./modals/ChangeColorModal.tsx";
import ImageModal from "./modals/ImageModal.tsx";
import { FeedbackModal } from "./modals/FeedbackModal.tsx";
import CustomizeAccount from "../input/CustomizeAccount.tsx";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser.tsx";

function ModalManager() {
  const { modalType, setModalType, modalData } = useModal();
  const { data: currentUser } = useCurrentUser();

  return (
    <AnimatePresence>
      {modalType && (
        <Modal
          setToggle={setModalType}
          center={modalType == "imagepreview" ? true : false}
        >
          {modalType === "signup" && <SignupView setToggle={setModalType} />}
          {modalType === "login" && <LoginView setToggle={setModalType} />}
          {modalType === "posting" && <ComposeTweet setToggle={setModalType} />}
          {modalType === "changeColor" && (
            <ChangeColorModal setToggle={setModalType} />
          )}
          {modalType === "replying" && modalData && (
            <ComposeTweet
              setToggle={setModalType}
              parentId={modalData.mainId}
              showParentPreview={true}
            />
          )}
          {modalType === "imagepreview" &&
            modalData &&
            modalData.mainId &&
            modalData.auxiliaryId && (
              <ImageModal
                setToggle={setModalType}
                mediaId={modalData.mainId}
                mediaList={modalData.auxiliaryId}
              />
            )}
          {modalType === "feedback" && <FeedbackModal />}
          {(modalType === "createAccount" || modalType == "editProfile") && currentUser && (
            <CustomizeAccount
              setToggle={setModalType}
              currentUser={currentUser}
            />
          )}
        </Modal>
      )}
    </AnimatePresence>
  );
}

export default ModalManager;
