"use client";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default function ToggleSwitch({ checked, onChange }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        "flex h-8 w-14 shrink-0 items-center rounded-full px-1 transition-colors",
        checked ? "justify-end bg-lime-400" : "justify-start bg-zinc-700",
      ].join(" ")}
    >
      <span className="h-6 w-6 rounded-full bg-white shadow-sm transition-transform" />
    </button>
  );
}
