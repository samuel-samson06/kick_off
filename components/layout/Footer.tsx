export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 text-gray-400 py-6 px-6">
      <div className="max-w-7xl mx-auto text-center space-y-3">
        <p className="text-sm">&copy; 2026 Kick-Off Technologies. All rights reserved.</p>
        <nav className="flex items-center justify-center gap-3 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <span className="text-gray-600">|</span>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <span className="text-gray-600">|</span>
          <a href="#" className="hover:text-white transition-colors">Support</a>
        </nav>
      </div>
    </footer>
  )
}
