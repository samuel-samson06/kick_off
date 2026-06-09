import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function EmailOnboarding() {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center">
          <div className="max-w-7xl w-full space-y-6 text-center">
            <div className="mx-auto w-16 h-16 bg-zinc-900 border border-zinc-700 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-lime-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2v10l7 7M12 12L5 5M12 12l-2 9M12 12l9-2" />
              </svg>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
              Follow Teams. Never Miss Kickoff.
            </h1>

            <p className="text-gray-400 text-base sm:text-lg">
              Get match reminders delivered directly to your inbox.
            </p>

            <div className="pt-4 space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3.5 bg-zinc-900 border border-zinc-700 text-white rounded-xl placeholder:text-gray-500 pr-12 outline-none focus:ring-2 focus:ring-lime-400/50 transition-shadow"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono text-lg">
                  @
                </span>
              </div>

              <button className="w-full py-3.5 bg-lime-400 hover:bg-lime-500 text-black font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors">
                Continue
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-500 flex items-center justify-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              No passwords. No accounts to remember.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
