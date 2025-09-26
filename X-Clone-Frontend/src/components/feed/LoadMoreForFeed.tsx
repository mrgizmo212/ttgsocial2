import LoadingIcon from "../common/icons/LoadingIcon.tsx";

type LoadMoreForFeedProps = {
  triggerRef: (node?: Element | null) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
};

export function LoadMoreForFeed({
  triggerRef,
  isFetchingNextPage,
}: LoadMoreForFeedProps) {
  return (
    <div className="w-full flex flex-col justify-center items-center h-20">
      <div
        ref={triggerRef}
        className="w-full h-0 pointer-events-none opacity-0"
      />

      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-2">
          <LoadingIcon />
        </div>
      )}
    </div>
  );
}
