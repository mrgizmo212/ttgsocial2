type PostLineProps = {
  showLine?: boolean;
};

export function PostLine({ showLine }: PostLineProps) {
  if (showLine) {
    return (
      <div className="relative w-12">
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-gray-600" />
      </div>
    );
  } else {
    return <div></div>;
  }
}
