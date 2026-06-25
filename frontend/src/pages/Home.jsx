/**
 * Home — Landing page (Commit #1).
 * Displays project name and initialization confirmation.
 * Full dashboard UI will replace this in Commit #2.
 */
function Home() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">

      {/* ── Ambient background glow ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="w-[600px] h-[600px] rounded-full bg-brand-600/20 blur-[120px]" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 w-80 h-80 rounded-full bg-purple-600/15 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 rounded-full bg-pink-600/10 blur-[100px]"
      />

      {/* ── Card ── */}
      <div className="glass-card relative z-10 w-full max-w-lg p-10 text-center shadow-2xl">

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/20 border border-brand-500/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-brand-400"
            aria-hidden="true"
          >
            <path d="M12 2a10 10 0 1 0 10 10" />
            <path d="M12 6v6l4 2" />
            <path d="M22 6l-3 3-3-3" />
          </svg>
        </div>

        {/* Commit badge */}
        <span className="badge mb-6">Commit #1 · Initial Setup</span>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 gradient-text">
          Productivity Assistant AI
        </h1>

        {/* Sub-heading */}
        <p className="text-lg font-medium text-gray-300 mb-8">
          Project Initialized Successfully
        </p>

        {/* Divider */}
        <div className="border-t border-white/10 my-6" />

        {/* Stack info */}
        <ul className="grid grid-cols-2 gap-3 text-sm text-gray-400 text-left">
          {[
            { label: 'Frontend', value: 'React + Vite' },
            { label: 'Styling',  value: 'Tailwind CSS' },
            { label: 'Backend',  value: 'Python Flask' },
            { label: 'Database', value: 'SQLite' },
            { label: 'AI',       value: 'Google Gemini (soon)' },
            { label: 'Version',  value: '0.1.0' },
          ].map(({ label, value }) => (
            <li key={label} className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {label}
              </span>
              <span className="text-gray-200 font-medium">{value}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer note */}
      <p className="relative z-10 mt-6 text-xs text-gray-600">
        More features arrive in the next commit ✦
      </p>
    </main>
  )
}

export default Home
