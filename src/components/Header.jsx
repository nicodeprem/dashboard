export default function Header({ search, onSearch, favoritesCount }) {
  return (
    <header className="bg-white border-b border-slate-200 h-14 flex items-center px-4 gap-4 shrink-0 z-20 shadow-sm">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <span className="font-bold text-slate-900 text-sm hidden sm:block">MedMap</span>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={e => onSearch(e.target.value)}
          placeholder="Nom, spécialité, adresse…"
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {search && (
          <button
            onClick={() => onSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            ×
          </button>
        )}
      </div>

      {/* Favorites count */}
      {favoritesCount > 0 && (
        <div className="flex items-center gap-1.5 shrink-0 text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
          <span>⭐</span>
          <span>{favoritesCount} favori{favoritesCount > 1 ? 's' : ''}</span>
        </div>
      )}
    </header>
  );
}
