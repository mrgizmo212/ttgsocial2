import cn from "clsx";
import LoadingIcon from "../../common/icons/LoadingIcon.tsx";

type MediaImageProps = {
  url: string;
  roundedClass?: string;
  isModal?: boolean;
};

export function TweetImage({ url, roundedClass, isModal }: MediaImageProps) {
  return (
    <>
      {url ? (
        <img
          src={url}
          className={cn("w-full h-full object-cover", roundedClass)}
        />
      ) : !isModal ? (
        <div
          className={cn(
            " bg-gray-600 animate-pulse w-full h-full object-cover",
            roundedClass
          )}
        ></div>
      ) : (
        <LoadingIcon className="w-12 h-12" />
      )}
    </>
  );
}
