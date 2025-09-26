import { useNavigate } from "react-router-dom";
import { useTopFiveUsers } from "../../../hooks/queries/useTopFiveUsers.tsx";
import { TermsAndConditions } from "../../entry/TermsAndConditions";
import { UseTempAccountButton } from "../../common/buttons/UseTempAccountButton.tsx";
import { GoogleAuthButton } from "../../common/buttons/GoogleAuthButton.tsx";
import { HorizontalStripedText } from "../../common/HorizontalStripedText";
import { UserSearchResult } from "../../pages/UserSearchResult";
import { AsideContainer } from "./AsideContainer";
import { useCurrentUser } from "../../../hooks/auth/useCurrentUser.tsx";
import { GOOGLE_ENABLED } from "../../../constants/env.ts";

export function RightDesktopLayout() {
  const { data: currentUser } = useCurrentUser();

  const { data: topUsers } = useTopFiveUsers();

  const navigate = useNavigate();

  return (
    <div className="hidden xl:flex xl:flex-col gap-4 px-10 md:items-start py-3 xl:w-2/3">
      {!currentUser && (
        <AsideContainer>
          <p className="text-xl font-bold">New to X?</p>
          <p className="text-twitterTextAlt text-xs">
            Sign up now to get your own personalized timeline!
          </p>

          <div className="w-full flex flex-col gap-4 pt-4">
            {GOOGLE_ENABLED && (
              <GoogleAuthButton>Sign up with Google</GoogleAuthButton>
            )}
            {GOOGLE_ENABLED && <HorizontalStripedText>OR</HorizontalStripedText>}
            <UseTempAccountButton />
            <TermsAndConditions />
          </div>
        </AsideContainer>
      )}

      {currentUser && (
        <>
          <AsideContainer>
            <p className="text-xl pl-2 font-bold">You might like</p>
            <div className="w-full flex flex-col pt-4">
              {topUsers
                ?.filter((id) => id !== currentUser?.id)
                .map((id) => (
                  <UserSearchResult userId={id} />
                ))}
            </div>
            <p
              className="pl-2 text-(--color-main) hover:cursor-pointer"
              onClick={() => navigate("/explore")}
            >
              Show more
            </p>
          </AsideContainer>

          <AsideContainer disabled={true}>
            <p className="text-xl font-bold">What's Happening?</p>
            <div className="w-full flex flex-col gap-4 pt-4">
              <div
                className="w-full flex hover:cursor-pointer hover:bg-white/5 rounded-md p-2"
                onClick={() => navigate("/explore")}
              >
                <div className="w-full flex flex-col">
                  <p className="text-twitterBorder">Trending in TTG Main Chat</p>
                  <p className="font-bold">SugesFeet</p>
                </div>
              </div>
              <div
                className="w-full flex hover:cursor-pointer hover:bg-white/5 rounded-md p-2"
                onClick={() => navigate("/explore")}
              >
                <div className="w-full flex flex-col">
                  <p className="text-twitterBorder">Trending in ClockTower</p>
                  <p className="font-bold">TripleDigitWinner</p>
                </div>
              </div>
              <div
                className="w-full flex hover:cursor-pointer hover:bg-white/5 rounded-md p-2"
                onClick={() => navigate("/explore")}
              >
                <div className="w-full flex flex-col">
                  <p className="text-twitterBorder">Trending in Crypto</p>
                  <p className="font-bold">Bitcoin</p>
                </div>
              </div>
              <div
                className="w-full flex hover:cursor-pointer hover:bg-white/5 rounded-md p-2"
                onClick={() => navigate("/explore")}
              >
                <div className="w-full flex flex-col">
                  <p className="text-twitterBorder">Trending in the News</p>
                  <p className="font-bold">Donald Trump</p>
                </div>
              </div>
              <div
                className="w-full flex hover:cursor-pointer hover:bg-white/5 rounded-md p-2"
                onClick={() => navigate("/explore")}
              >
                <div className="w-full flex flex-col">
                  <p className="text-twitterBorder">Trending in Investing</p>
                  <p className="font-bold">$NVDA</p>
                </div>
              </div>
            </div>
          </AsideContainer>
        </>
      )}
    </div>
  );
}
