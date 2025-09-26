import type { ModalType } from "../../types/ModalType.ts";
import { useState } from "react";
import type { User } from "../../types/User.ts";
import { useUpdateUser } from "../../hooks/mutations/useUpdateUser.tsx";

type CustomizeAccountProps = {
  setToggle: (type: ModalType) => void;
  currentUser: User;
};

function CustomizeAccount({ setToggle, currentUser }: CustomizeAccountProps) {
  const [inputPfp, setInputPfp] = useState(currentUser.profilePictureUrl);
  const [inputBanner, setInputBanner] = useState(currentUser.bannerImageUrl);
  const [inputDisplayName, setInputDisplayName] = useState(
    currentUser.displayName ? currentUser.displayName : ""
  );
  const [inputUsername, setInputUsername] = useState(currentUser.username);
  const [inputBio, setInputBio] = useState(currentUser.bio);
  const [pfpFile, setPfpFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const [userNameError, setUsernameError] = useState("");

  const updateUser = useUpdateUser();

  const hasFilledMandatoryFields =
    inputUsername.length > 0 && inputDisplayName.length > 0;

  function handleSave() {
    if (!hasFilledMandatoryFields) return;

    const formData = new FormData();
    formData.append("displayName", inputDisplayName);
    formData.append("username", inputUsername);
    formData.append("bio", inputBio);
    if (pfpFile) formData.append("profilePicture", pfpFile);
    if (bannerFile) formData.append("bannerImage", bannerFile);

    updateUser.mutate(formData, {
      onError: (error) => {
        if (
          error instanceof Error &&
          error.message.includes("Username already exists")
        ) {
          setUsernameError("Username already exists");
        } else {
          setUsernameError("");
        }
      },
      onSuccess: () => {
        setUsernameError("");
        setToggle(null);
        window.location.reload();
      },
    });
  }

  return (
    <div className="w-full max-h-[calc(100dvh-8rem)] overflow-hidden rounded-4xl border border-(--color-main)">
      <div className="w-full max-h-[calc(100dvh-8rem)] overflow-y-auto scrollbar-blue p-8 flex flex-col items-center gap-10 bg-(--background-main) text-twitterText">
        <p className="text-xl font-bold text-center">Edit Profile</p>

        <div className="w-full relative h-fit mb-4">
          <div className="relative h-26 w-full">
            <img
              src={inputBanner}
              className="h-26 w-full object-cover hover:opacity-60"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setBannerFile(file);
                  setInputBanner(URL.createObjectURL(file));
                }
              }}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <div className="w-18 h-18 absolute bottom-0 left-1/2 translate-x-[-50%] translate-y-8">
            <img
              src={inputPfp}
              className="w-full h-full rounded-full border-2 border-twitterBlack object-cover hover:opacity-80"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setPfpFile(file);
                  setInputPfp(URL.createObjectURL(file));
                }
              }}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer rounded-full"
            />
          </div>
        </div>

        <div className="flex flex-col w-full h-full gap-4">
          <div className="flex w-full flex-col gap-2">
            <p className="pl-1 text-twitterTextAlt font-bold">
              Enter Display name
            </p>
            <input
              value={inputDisplayName}
              onChange={(e) => setInputDisplayName(e.target.value)}
              className="w-full border border-twitterBorder focus:outline-none focus:ring-0 rounded-xl px-2 h-16"
              placeholder="Enter display name"
            />
          </div>

          <div className="flex w-full flex-col gap-2">
            <p
              className={`pl-1 ${
                userNameError ? "text-red-500" : "text-twitterTextAlt"
              } font-bold`}
            >
              Enter Username
            </p>
            <input
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              className="w-full border border-twitterBorder focus:outline-none focus:ring-0 rounded-xl focus:border-(--color-main) px-2 h-16"
              placeholder="Enter username"
            />
          </div>

          <div className="flex w-full flex-col gap-2">
            <p className="pl-1 text-twitterTextAlt font-bold">Enter Bio</p>
            <input
              value={inputBio}
              onChange={(e) => setInputBio(e.target.value)}
              className="w-full border border-twitterBorder focus:outline-none focus:ring-0 px-2 rounded-xl h-16"
              placeholder="Enter bio"
            />
          </div>
        </div>

        <div
          onClick={() => hasFilledMandatoryFields && handleSave()}
          className={` ${
            hasFilledMandatoryFields
              ? "hover:cursor-pointer hover:bg-(--color-main)/75"
              : "hover:cursor-not-allowed text-twitterTextAlt bg-(--color-main)/50"
          }  w-full bg-(--color-main) text-twitterText flex items-center gap-2 justify-center h-10 rounded-full`}
        >
          <p className="">Save</p>
        </div>
      </div>
    </div>
  );
}

export default CustomizeAccount;
