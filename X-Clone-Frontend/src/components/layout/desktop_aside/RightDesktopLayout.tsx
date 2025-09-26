import { useNavigate } from "react-router-dom";
import { useTopFiveUsers } from "../../../hooks/queries/useTopFiveUsers.tsx";
import { TermsAndConditions } from "../../entry/TermsAndConditions";
import { UseTempAccountButton } from "../../common/buttons/UseTempAccountButton.tsx";
import { GoogleAuthButton } from "../../common/buttons/GoogleAuthButton.tsx";
import { HorizontalStripedText } from "../../common/HorizontalStripedText";
import { UserSearchResult } from "../../pages/UserSearchResult";
import { AsideContainer } from "./AsideContainer";
import { useCurrentUser } from "../../../hooks/auth/useCurrentUser.tsx";

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
            <GoogleAuthButton>Sign up with Google</GoogleAuthButton>
            <HorizontalStripedText>OR</HorizontalStripedText>
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
              {topUsers?.map((id) => (
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
              <div className="w-full flex">
                <div className="w-full flex flex-col">
                  <p className="text-twitterBorder">
                    Trending in the Netherlands
                  </p>
                  <p className="font-bold">Hague Summit</p>
                </div>
              </div>
              <div className="w-full flex">
                <div className="w-full flex flex-col">
                  <p className="text-twitterBorder">
                    Trending in the Netherlands
                  </p>
                  <p className="font-bold">Mark Rutte</p>
                </div>
              </div>
              <div className="w-full flex">
                <div className="w-full flex flex-col">
                  <p className="text-twitterBorder">
                    Trending in the Netherlands
                  </p>
                  <p className="font-bold">Bitcoin</p>
                </div>
              </div>
              <div className="w-full flex">
                <div className="w-full flex flex-col">
                  <p className="text-twitterBorder">
                    Trending in the Netherlands
                  </p>
                  <p className="font-bold">Donald Trump</p>
                </div>
              </div>
              <div className="w-full flex">
                <div className="w-full flex flex-col">
                  <p className="text-twitterBorder">
                    Trending in the Netherlands
                  </p>
                  <p className="font-bold">Elon Musk</p>
                </div>
              </div>
            </div>
          </AsideContainer>
        </>
      )}
    </div>
  );
}
