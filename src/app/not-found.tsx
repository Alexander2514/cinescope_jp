import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="relative z-[1] flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <span className="text-[5rem] mb-4">🎬</span>
      <h1 className="font-serif font-black text-white text-4xl mb-3">404</h1>
      <p className="text-white/50 mb-1">Esta página no existe</p>
      <p className="text-white/25 text-sm mb-8">La película o serie que buscas no fue encontrada</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl font-bold text-void bg-violet-glow
          transition-all duration-200 hover:bg-yellow-400 hover:shadow-[0_0_24px_rgba(251,191,36,0.5)] hover:scale-105"
      >
        Volver al inicio
      </Link>
    </main>
  )
}
