type Size = "sm" | "md" | "lg";

export default function LoadingSpinner({
  text,
  size = "md",
  fullPage,
}: {
  text?: string;
  size?: Size;
  fullPage?: boolean;
}) {
  const dotSizes: Record<Size, string> = {
    sm: "h-8 w-8 border-[3px]",
    md: "h-12 w-12 border-[4px]",
    lg: "h-16 w-16 border-[4px]",
  };

  const textSizes: Record<Size, string> = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  if (fullPage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950">
        <div className="relative flex items-center justify-center">
          <div
            className={`${dotSizes[size]} animate-spin-slow rounded-full border-zinc-800 border-t-lime-400`}
          />
          <div className="absolute h-3 w-3 animate-bounce rounded-full bg-lime-400" />
        </div>
        {text && (
          <p className={`animate-fadeIn text-zinc-400 ${textSizes[size]}`}>
            {text}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        <div
          className={`${dotSizes[size]} animate-spin-slow rounded-full border-zinc-800 border-t-lime-400`}
        />
        <div className="absolute h-2.5 w-2.5 animate-bounce rounded-full bg-lime-400" />
      </div>
      {text && (
        <p className={`animate-fadeIn text-zinc-400 ${textSizes[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
}
