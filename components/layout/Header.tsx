export default function Header() {
  return (
    <header className="px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center gap-2.5">
        <svg className="w-6 h-6 md:w-10 md:h-10 text-lime-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <span className="text-xl md:text-3xl font-bold text-white tracking-tight">KickOff</span>
      </div>
    </header>
  )
}
