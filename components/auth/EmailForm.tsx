"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmed = email.trim();

    if (!trimmed) {
      setError("Please enter your email address");
      return;
    }

    if (!EMAIL_REGEX.test(trimmed)) {
      setError("Enter a valid email address");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <p className="text-lime-400 text-center">
        Check your email for the magic link.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-700 text-white rounded-xl placeholder:text-gray-500 pr-12 outline-none focus:ring-2 focus:ring-lime-400/50 transition-shadow"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-lg">
          @
        </span>
      </div>

      {error && (
        <p className="text-sm text-rose-400 text-left">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-lime-400 hover:bg-lime-500 disabled:opacity-50 text-black font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        {loading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        )}
        {loading ? "Sending" : "Continue"}
      </button>
    </form>
  );
}
