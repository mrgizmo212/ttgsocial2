import { useUser } from "../../hooks/queries/useUser.tsx";

type BannerComponentProps = {
  userId?: number;
};

function BannerComponent({ userId }: BannerComponentProps) {
  const { data: user } = useUser(userId);

  if (!userId) {
    return (
      <div className="w-full h-full rounded-full bg-red-600 animate-pulse"></div>
    );
  }

  return (
    <>
      {user ? (
        <img className="object-cover h-full w-full" src={user.bannerImageUrl} />
      ) : (
        <div className="h-full w-full bg-gray-600 animate-pulse"></div>
      )}
    </>
  );
}

export default BannerComponent;
