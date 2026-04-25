import { useState, useMemo, useEffect } from 'react';
import { PRACTITIONERS } from './data/practitioners';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MapView from './components/MapView';

const FAV_KEY = 'medmap_favorites_v1';

function loadFavorites() {
  try {
    const saved = localStorage.getItem(FAV_KEY);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  } catch {
    return new Set();
  }
}

export default function App() {
  const [search, setSearch] = useState('');
  const [activeProfessions, setActiveProfessions] = useState(new Set());
  const [favorites, setFavorites] = useState(loadFavorites);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleProfession = (id) => {
    setActiveProfessions(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return PRACTITIONERS.filter(p => {
      if (activeProfessions.size > 0 && !activeProfessions.has(p.profession)) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const haystack = [p.nom, p.specialite, p.adresse, p.profession]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [search, activeProfessions]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header
        search={search}
        onSearch={setSearch}
        favoritesCount={favorites.size}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          practitioners={filtered}
          favorites={favorites}
          selectedId={selectedId}
          activeProfessions={activeProfessions}
          onSelectProfession={toggleProfession}
          onSelect={setSelectedId}
          onToggleFavorite={toggleFavorite}
        />
        <MapView
          practitioners={filtered}
          favorites={favorites}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onToggleFavorite={toggleFavorite}
        />
      </div>
    </div>
  );
}
