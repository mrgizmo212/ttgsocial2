// removed FaXTwitter icon in favor of image logo
import ProfilePic from "../user/ProfilePic.tsx";
import { FaArrowLeft } from "react-icons/fa";

import { useModal } from "../../context/ModalProvider.tsx";
import { useContext, useState } from "react";
import MobileMainDrawer from "../modal/drawer/MobileMainDrawer.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { HeaderContentContext } from "../../context/HeaderContentProvider.tsx";
import { useCurrentUser } from "../../hooks/auth/useCurrentUser.tsx";

function Header() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { data: currentUser } = useCurrentUser();
  const { setModalType } = useModal();
  const navigate = useNavigate();
  const location = useLocation();
  const { headerContent } = useContext(HeaderContentContext);

  const isHome = location.pathname === "/";

  return (
    <>
      <div
        className={`h-16 flex ${
          !isHome ? "border-b" : "xl:hidden"
        } w-full xl:border-x border-twitterBorder relative justify-between bg-(--background-main) px-3 text-white`}
      >
        <div className="h-full w-full flex relative items-center justify-start">
          {currentUser && isHome ? (
            <div
              onClick={() => setDrawerOpen(true)}
              className="w-10 h-10 flex justify-center items-center"
            >
              <ProfilePic disableNavigation={true} userId={currentUser.id} />
            </div>
          ) : (
            !isHome && (
              //Todo export this into own function
              <div
                className="w-12 h-12 flex items-center  justify-center text-xl"
                onClick={() => {
                  const isInternalReferrer = document.referrer.startsWith(
                    window.location.origin
                  );

                  if (isInternalReferrer) {
                    navigate(-1);
                  } else {
                    navigate("/");
                  }
                }}
              >
                <FaArrowLeft className="hover:cursor-pointer" />
              </div>
            )
          )}
          {headerContent && (
            <div className="text-xl font-semibold pl-2 flex items-center h-full ">
              {headerContent}
            </div>
          )}
        </div>

        {!headerContent ? (
          <>
            <div className="h-full w-full flex relative items-center justify-center text-xl font-bold">
              <img
                src="/icon-charts.png"
                alt="Logo"
                onClick={() => navigate("/")}
                className="h-8 w-8 hover:cursor-pointer"
              />
            </div>
            <div className="h-full w-full flex relative items-center justify-end"></div>
          </>
        ) : null}
      </div>

      {!currentUser && (
        <>
          <div className="flex p-3 gap-4 xl:hidden h-14 font-bold bg-(--background-main) justify-center items-center w-full">
            <div
              className="p-1 rounded-2xl border-twitterTextAlt text-(--color-main) flex items-center justify-center w-full border"
              onClick={() => setModalType("signup")}
            >
              <p>Register</p>
            </div>
            <div
              className="p-1 rounded-2xl text-twitterText flex items-center justify-center w-full bg-(--color-main)"
              onClick={() => setModalType("login")}
            >
              <p>Log in</p>
            </div>
          </div>
        </>
      )}

      <AnimatePresence>
        {drawerOpen && <MobileMainDrawer setDrawerOpen={setDrawerOpen} />}
      </AnimatePresence>
    </>
  );
}

export default Header;
