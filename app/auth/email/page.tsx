import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { IoFootball } from "react-icons/io5"
import EmailForm from "@/components/auth/EmailForm"

export default function EmailOnboarding() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-5 py-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-16 h-16 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center">
            <IoFootball className="w-8 h-8 text-lime-400" />
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
            Follow Teams. Never Miss Kickoff.
          </h1>

          <p className="text-gray-400 text-base sm:text-lg">
            Get match reminders delivered directly to your inbox.
          </p>

          <EmailForm />

          <p className="text-xs  md:text-sm text-gray-500 flex items-center justify-center gap-2">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            No passwords. No accounts to remember.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
