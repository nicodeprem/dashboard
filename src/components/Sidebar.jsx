import { useState } from 'react';
import { PROFESSIONS, PROFESSION_MAP } from '../data/professions';

function PractitionerRow({ p, isFavorite, isSelected, onSelect, onToggleFavorite }) {
  const prof = PROFESSION_MAP[p.profession];
  return (
    <button
      onClick={() => onSelect(p.id)}
      className={`w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
        isSelected ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''
      }`}
    >
      {/* Color dot */}
      <div
        className="w-3 h-3 rounded-full mt-1 shrink-0"
        style={{ backgroundColor: prof?.color }}
      />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-slate-900 truncate">{p.nom}</div>
        <div className="text-xs text-slate-500 truncate">
          {prof?.short}{p.specialite ? ` · ${p.specialite}` : ''}
        </div>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {p.secteur && (
            <span className="text-xs text-slate-400">Secteur {p.secteur}</span>
          )}
          {p.accepteNouveauxPatients && (
            <span className="text-xs text-emerald-600 font-medium">✓ Nouveaux patients</span>
          )}
          {p.doctolib && (
            <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-medium">
              Doctolib
            </span>
          )}
        </div>
      </div>

      {/* Favorite star */}
      <button
        onClick={e => { e.stopPropagation(); onToggleFavorite(p.id); }}
        className={`shrink-0 text-lg leading-none transition-transform hover:scale-110 ${
          isFavorite ? 'text-amber-400' : 'text-slate-200 hover:text-amber-300'
        }`}
        title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        ★
      </button>
    </button>
  );
}

export default function Sidebar({
  practitioners,
  favorites,
  selectedId,
  activeProfessions,
  onSelectProfession,
  onSelect,
  onToggleFavorite,
}) {
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [showNouveaux, setShowNouveaux] = useState(false);

  const favList = practitioners.filter(p => favorites.has(p.id));
  const results = practitioners.filter(p => {
    if (showOnlyFavorites && !favorites.has(p.id)) return false;
    if (showNouveaux && !p.accepteNouveauxPatients) return false;
    return true;
  });

  return (
    <aside className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-hidden shrink-0">
      {/* Profession filter pills */}
      <div className="p-3 border-b border-slate-100 space-y-2">
        <div className="flex flex-wrap gap-1">
          {PROFESSIONS.map(prof => {
            const isActive = activeProfessions.has(prof.id);
            const count = practitioners.filter(p => p.profession === prof.id).length;
            if (count === 0) return null;
            return (
              <button
                key={prof.id}
                onClick={() => onSelectProfession(prof.id)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all border ${
                  isActive
                    ? 'text-white border-transparent shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
                style={isActive ? { backgroundColor: prof.color, borderColor: prof.color } : {}}
              >
                <span>{prof.icon}</span>
                <span>{prof.short}</span>
                <span className={`${isActive ? 'text-white/70' : 'text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowNouveaux(v => !v)}
            className={`flex-1 text-xs font-medium px-2 py-1.5 rounded-lg border transition-colors ${
              showNouveaux
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            ✓ Nouveaux patients
          </button>
          <button
            onClick={() => setShowOnlyFavorites(v => !v)}
            className={`flex-1 text-xs font-medium px-2 py-1.5 rounded-lg border transition-colors ${
              showOnlyFavorites
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            ⭐ Mes favoris
          </button>
        </div>
      </div>

      {/* Results list */}
      <div className="flex-1 overflow-y-auto">
        {/* Favorites section (always shown if exists and not already filtering) */}
        {!showOnlyFavorites && favList.length > 0 && (
          <div>
            <div className="px-4 py-2 text-xs font-bold text-amber-600 uppercase tracking-wider bg-amber-50 border-b border-amber-100 flex items-center gap-1">
              ⭐ Mes favoris ({favList.length})
            </div>
            {favList.map(p => (
              <PractitionerRow
                key={p.id}
                p={p}
                isFavorite
                isSelected={selectedId === p.id}
                onSelect={onSelect}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}

        {/* All results */}
        <div>
          <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 border-b border-slate-100">
            {results.length} praticien{results.length > 1 ? 's' : ''}
          </div>
          {results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              Aucun résultat
            </div>
          ) : (
            results.map(p => (
              <PractitionerRow
                key={p.id}
                p={p}
                isFavorite={favorites.has(p.id)}
                isSelected={selectedId === p.id}
                onSelect={onSelect}
                onToggleFavorite={onToggleFavorite}
              />
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
