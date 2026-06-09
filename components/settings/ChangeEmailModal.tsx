"use client";

import { useState } from "react";
import { LuX } from "react-icons/lu";

interface ChangeEmailModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ChangeEmailModal({ open, onClose }: ChangeEmailModalProps) {
  const [email, setEmail] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-6xl rounded-[28px] border border-white/10 bg-zinc-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Change Email</h2>
          <button onClick={onClose} className="rounded-full p-1 text-zinc-400 hover:bg-white/10 hover:text-white transition-colors">
            <LuX className="h-5 w-5" />
          </button>
        </div>

        <p className="mt-2 text-sm text-zinc-400">
          Enter your new email address. We&apos;ll send a verification link.
        </p>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="new@example.com"
          className="mt-5 w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-500 focus:border-lime-400"
        />

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Phase 2: send verification email
              onClose();
            }}
            className="flex-1 rounded-2xl bg-lime-400 px-4 py-3 font-semibold text-zinc-950 transition-colors hover:bg-lime-500"
          >
            Send Verification
          </button>
        </div>
      </div>
    </div>
  );
}
