import { useMemo, type MouseEvent } from "react";
import { HeroIcon, type IconName } from "../icons/HeroIcon.tsx";
import { InteractionCounter } from "../InteractionCounter.tsx";
import { useModal } from "../../../context/ModalProvider.tsx";
import { useCurrentUser } from "../../../hooks/auth/useCurrentUser.tsx";

type InteractionButtonProps = {
  numberList: number[];
  buttonColor: string;
  mutationFunction: () => void;
  iconName: IconName;
};

function InteractionButton({
  numberList,
  buttonColor,
  mutationFunction,
  iconName,
}: InteractionButtonProps) {
  const { data: currentUser } = useCurrentUser();
  const { setModalType } = useModal();

  const canInteract = !!currentUser;

  const isMarked = useMemo(() => {
    if (!currentUser) return false;
    if (buttonColor == "notAColor") {
      return false;
    }
    return numberList.includes(currentUser.id);
  }, [currentUser, numberList]);

  const count = numberList.length;

  const handleMutation = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (canInteract) {
      mutationFunction();
    } else {
      setModalType("signup");
    }
  };

  const hoverBg = "hover:bg-" + "twitterRed" + "/10";

  console.log(hoverBg);

  return (
    <div className="">
      <div
        className={`h-5 flex w-16 hover:cursor-pointer ${
          isMarked ? "text-" + buttonColor : ""
        } align-middle items-center gap-3`}
      >
        <div
          className={`group p-2 rounded-full hover:bg-blue-500/10 focus-visible:ring-2 transition`}
          onClick={(e) => handleMutation(e)}
        >
          <HeroIcon
            iconName={iconName}
            solid={isMarked}
            className={`h-6 w-6`}
          />
        </div>
        <InteractionCounter count={count} />
      </div>
    </div>
  );
}

export default InteractionButton;
