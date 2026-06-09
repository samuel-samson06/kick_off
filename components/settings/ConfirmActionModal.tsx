"use client";

import { LuX } from "react-icons/lu";

interface ConfirmActionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel: string;
  variant?: "default" | "danger";
}

export default function ConfirmActionModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  variant = "default",
}: ConfirmActionModalProps) {
  if (!open) return null;

  const confirmStyles =
    variant === "danger"
      ? "bg-rose-500 hover:bg-rose-600 text-white"
      : "bg-lime-400 hover:bg-lime-500 text-zinc-950";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-6xl rounded-[28px] border border-white/10 bg-zinc-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button onClick={onClose} className="rounded-full p-1 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors">
            <LuX className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-3 text-sm text-zinc-400">{description}</p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 rounded-2xl px-4 py-3 font-semibold transition-colors ${confirmStyles}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
