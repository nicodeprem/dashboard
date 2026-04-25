import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { PROFESSION_MAP } from '../data/professions';

// Teardrop SVG marker factory
function makeIcon(color, size = 30, isFavorite = false, isSelected = false) {
  const w = isSelected ? size * 1.3 : size;
  const h = w * 1.4;
  const star = isFavorite
    ? `<text x="${w / 2}" y="${w * 0.55}" text-anchor="middle" dominant-baseline="middle"
         font-size="${w * 0.32}" fill="#FBBF24">★</text>`
    : '';
  const shadow = isSelected
    ? `filter: drop-shadow(0 0 6px ${color}88);`
    : 'filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35));';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 40 56" style="${shadow}">
      <path d="M20 0C9 0 0 9 0 20C0 35 20 56 20 56C20 56 40 35 40 20C40 9 31 0 20 0Z"
            fill="${color}"/>
      <circle cx="20" cy="19" r="9.5" fill="white" fill-opacity="0.92"/>
      ${star}
    </svg>`;
  return new L.DivIcon({
    html: svg,
    className: '',
    iconSize: [w, h],
    iconAnchor: [w / 2, h],
    popupAnchor: [0, -h + 4],
  });
}

// Fly to selected marker
function FlyTo({ selectedPractitioner }) {
  const map = useMap();
  useEffect(() => {
    if (selectedPractitioner) {
      map.flyTo(selectedPractitioner.coordinates, Math.max(map.getZoom(), 15), {
        duration: 0.8,
      });
    }
  }, [selectedPractitioner, map]);
  return null;
}

export default function MapView({
  practitioners,
  favorites,
  selectedId,
  onSelect,
  onToggleFavorite,
}) {
  const selected = practitioners.find(p => p.id === selectedId) ?? null;

  return (
    <div className="flex-1 relative z-0">
      <MapContainer
        center={[48.848, 2.318]}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyTo selectedPractitioner={selected} />

        {practitioners.map(p => {
          const prof = PROFESSION_MAP[p.profession];
          const isFav = favorites.has(p.id);
          const isSel = p.id === selectedId;
          return (
            <Marker
              key={p.id}
              position={p.coordinates}
              icon={makeIcon(prof?.color ?? '#64748B', 30, isFav, isSel)}
              zIndexOffset={isSel ? 1000 : isFav ? 500 : 0}
              eventHandlers={{ click: () => onSelect(p.id) }}
            >
              <Popup className="medmap-popup">
                <div style={{ minWidth: 220, fontFamily: 'Inter, system-ui, sans-serif' }}>
                  {/* Header */}
                  <div
                    style={{
                      background: prof?.color ?? '#64748B',
                      margin: '-8px -8px 10px -8px',
                      padding: '10px 12px 8px',
                      borderRadius: '8px 8px 0 0',
                    }}
                  >
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, marginBottom: 2 }}>
                      {prof?.icon} {prof?.label}
                    </div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: 14, lineHeight: 1.2 }}>
                      {p.nom}
                    </div>
                    {p.specialite && (
                      <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 2 }}>
                        {p.specialite}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ fontSize: 12, color: '#475569', lineHeight: 1.6 }}>
                    <div style={{ marginBottom: 4 }}>
                      📍 {p.adresse}
                    </div>
                    {p.telephone && (
                      <div style={{ marginBottom: 4 }}>
                        📞 <a href={`tel:${p.telephone}`} style={{ color: '#2563EB' }}>{p.telephone}</a>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                      {p.secteur && (
                        <span style={{ background: '#F1F5F9', padding: '2px 8px', borderRadius: 999, fontSize: 11 }}>
                          Secteur {p.secteur}
                        </span>
                      )}
                      <span style={{
                        background: p.accepteNouveauxPatients ? '#ECFDF5' : '#FEF2F2',
                        color: p.accepteNouveauxPatients ? '#059669' : '#DC2626',
                        padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600,
                      }}>
                        {p.accepteNouveauxPatients ? '✓ Nouveaux patients' : '✗ Complet'}
                      </span>
                      {p.doctolib && (
                        <span style={{ background: '#EFF6FF', color: '#2563EB', padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 600 }}>
                          Doctolib
                        </span>
                      )}
                    </div>
                    {p.langues?.length > 0 && (
                      <div style={{ marginTop: 6, fontSize: 11, color: '#94A3B8' }}>
                        🗣 {p.langues.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Favorite button */}
                  <button
                    onClick={() => onToggleFavorite(p.id)}
                    style={{
                      marginTop: 10,
                      width: '100%',
                      padding: '7px',
                      borderRadius: 8,
                      border: favorites.has(p.id) ? '1px solid #FCD34D' : '1px solid #E2E8F0',
                      background: favorites.has(p.id) ? '#FFFBEB' : '#F8FAFC',
                      color: favorites.has(p.id) ? '#D97706' : '#64748B',
                      fontWeight: 600,
                      fontSize: 12,
                      cursor: 'pointer',
                    }}
                  >
                    {favorites.has(p.id) ? '★ Dans mes favoris' : '☆ Ajouter aux favoris'}
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
