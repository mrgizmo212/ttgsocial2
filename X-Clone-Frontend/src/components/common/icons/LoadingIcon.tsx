type LoadingIconProps = {
  className?: string;
};

function LoadingIcon({ className }: LoadingIconProps) {
  return (
    <div className="w-full h-10 flex items-center justify-center">
      <div
        className={`${
          className ? className : "w-6 h-6"
        } border-4 border-[color:var(--color-main)] border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
}

export default LoadingIcon;
