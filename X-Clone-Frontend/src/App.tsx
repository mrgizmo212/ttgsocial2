import "./App.css";
import FooterBar from "./components/layout/FooterBar.tsx";
import Header from "./components/layout/Header.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/pages/HomePage.tsx";
import ProfilePage from "./components/pages/profile/ProfilePage.tsx";
import { ModalProvider } from "./context/ModalProvider.tsx";
import ModalManager from "./components/modal/ModalManager";
import BookmarkPage from "./components/pages/BookmarkPage.tsx";
import NotificationPage from "./components/pages/NotificationPage.tsx";
import FullTweet from "./components/tweet/FullTweet.tsx";
import { HeaderContentProvider } from "./context/HeaderContentProvider.tsx";
import { Toaster, type DefaultToastOptions } from "react-hot-toast";
import AboutPage from "./components/pages/AboutPage.tsx";
import ExplorePage from "./components/pages/ExplorePage.tsx";
// import MessagesPage from "./components/pages/MessagesPage.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID, GOOGLE_ENABLED, BACKEND_CONFIGURED } from "./constants/env.ts";
import { BackendConfigBanner } from "./components/layout/BackendConfigBanner";
import { LeftDesktopLayout } from "./components/layout/desktop_aside/LeftDesktopLayout.tsx";
import { RightDesktopLayout } from "./components/layout/desktop_aside/RightDesktopLayout.tsx";
import { useEffect } from "react";
import type { ThemeType } from "./types/ThemeType.ts";
import type { BackgroundType } from "./types/BackgroundType.ts";

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("twitterTheme") as ThemeType | null;
    const savedBackground = localStorage.getItem(
      "twitterBackground"
    ) as BackgroundType | null;

    if (savedTheme) {
      document.documentElement.style.setProperty("--color-main", savedTheme);
    }

    if (savedBackground) {
      document.documentElement.style.setProperty(
        "--background-main",
        savedBackground
      );
    }
  }, []);

  const toastOptions: DefaultToastOptions = {
    style: {
      color: "white",
      borderRadius: "4px",
      backgroundColor: "var(--color-main)",
    },
    success: { duration: 4000 },
  };

  return (
    <Router>
      {GOOGLE_ENABLED ? (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <ModalProvider>
            <HeaderContentProvider>
              <ModalManager />

              <div className="xl:flex 2xl:px-60 xl:px-20 bg-(--background-main) xl:justify-between">
                <LeftDesktopLayout />

                <div className="xl:mt-3 overscroll-y-contain no-scrollbar w-dvw h-dvh max-h-dvh max-w-dvw xl:w-full xl:bg-none bg-[var(--background-main)] text-[var(--color-main)] transition-colors duration-300 flex flex-col">
                  <div className="">
                    {!BACKEND_CONFIGURED && <BackendConfigBanner />}
                    <Header />
                  </div>

                  <div className="flex-grow overflow-y-hidden flex flex-col bg-(--background-main)">
                    <Routes>
                      <Route path="" element={<HomePage />} />

                      <Route path="profile/:ID" element={<ProfilePage />} />

                      <Route path="tweet/:postId" element={<FullTweet />} />

                      <Route path="bookmarks" element={<BookmarkPage />} />

                      <Route path="explore" element={<ExplorePage />} />

                      {/* <Route path="messages" element={<MessagesPage />} /> */}

                      <Route
                        path="notifications"
                        element={<NotificationPage />}
                      />

                      <Route path="about" element={<AboutPage />} />
                    </Routes>
                    <Toaster
                      position="bottom-center"
                      toastOptions={toastOptions}
                      containerClassName="mb-12 xs:mb-0"
                    />
                  </div>

                  <div className="xl:hidden">
                    <FooterBar />
                  </div>
                </div>

                <RightDesktopLayout />
              </div>
            </HeaderContentProvider>
          </ModalProvider>
        </GoogleOAuthProvider>
      ) : (
        <ModalProvider>
          <HeaderContentProvider>
            <ModalManager />

            <div className="xl:flex 2xl:px-60 xl:px-20 bg-(--background-main) xl:justify-between">
              <LeftDesktopLayout />

              <div className="xl:mt-3 overscroll-y-contain no-scrollbar w-dvw h-dvh max-h-dvh max-w-dvw xl:w-full xl:bg-none bg-[var(--background-main)] text-[var(--color-main)] transition-colors duration-300 flex flex-col">
                  <div className="">
                    {!BACKEND_CONFIGURED && <BackendConfigBanner />}
                    <Header />
                  </div>

                <div className="flex-grow overflow-y-hidden flex flex-col bg-(--background-main)">
                  <Routes>
                    <Route path="" element={<HomePage />} />

                    <Route path="profile/:ID" element={<ProfilePage />} />

                    <Route path="tweet/:postId" element={<FullTweet />} />

                    <Route path="bookmarks" element={<BookmarkPage />} />

                    <Route path="explore" element={<ExplorePage />} />

                  {/* <Route path="messages" element={<MessagesPage />} /> */}

                    <Route
                      path="notifications"
                      element={<NotificationPage />}
                    />

                    <Route path="about" element={<AboutPage />} />
                  </Routes>
                  <Toaster
                    position="bottom-center"
                    toastOptions={toastOptions}
                    containerClassName="mb-12 xs:mb-0"
                  />
                </div>

                <div className="xl:hidden">
                  <FooterBar />
                </div>
              </div>

              <RightDesktopLayout />
            </div>
          </HeaderContentProvider>
        </ModalProvider>
      )}
    </Router>
  );
}

export default App;
