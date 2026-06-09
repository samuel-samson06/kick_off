import Link from "next/link"
import { IoFootball } from "react-icons/io5"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black px-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="w-16 h-16 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center">
          <IoFootball className="w-8 h-8 text-lime-400" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
          You should be looking at your next match
        </h1>

        <p className="text-gray-500 text-sm">
          This page isn&apos;t part of the game plan.
        </p>

        <Link
          href="/auth/email"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-lime-400 hover:bg-lime-500 text-black font-semibold rounded-xl transition-colors"
        >
          Back to KickOff
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
