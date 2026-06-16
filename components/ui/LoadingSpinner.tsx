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
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 overflow-hidden bg-zinc-950">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(163,230,53,0.14),transparent_28%),radial-gradient(circle_at_bottom,rgba(255,255,255,0.05),transparent_25%)]" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400/10 blur-3xl" />
        <div className="relative flex items-center justify-center">
          <div
            className={`${dotSizes[size]} animate-spin-slow rounded-full border border-zinc-800 border-t-lime-400 shadow-[0_0_32px_rgba(163,230,53,0.22)]`}
          />
          <div className="absolute h-20 w-20 animate-pulse rounded-full border border-lime-400/20 bg-lime-400/5" />
          <div className="absolute h-3 w-3 animate-bounce rounded-full bg-lime-400 shadow-[0_0_18px_rgba(163,230,53,0.9)]" />
        </div>
        {text && (
          <p className={`animate-fadeIn text-zinc-300 ${textSizes[size]}`}>
            {text}
          </p>
        )}
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-zinc-500">
          <span className="h-1 w-1 rounded-full bg-lime-400/80" />
          Preparing your match reminders
          <span className="h-1 w-1 rounded-full bg-lime-400/80" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="relative flex items-center justify-center">
        <div
          className={`${dotSizes[size]} animate-spin-slow rounded-full border border-zinc-800 border-t-lime-400 shadow-[0_0_20px_rgba(163,230,53,0.18)]`}
        />
        <div className="absolute h-10 w-10 animate-pulse rounded-full border border-lime-400/20 bg-lime-400/5" />
        <div className="absolute h-2.5 w-2.5 animate-bounce rounded-full bg-lime-400 shadow-[0_0_12px_rgba(163,230,53,0.8)]" />
      </div>
      {text && (
        <p className={`animate-fadeIn text-zinc-300 ${textSizes[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
}
