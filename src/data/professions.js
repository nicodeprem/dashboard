export const PROFESSIONS = [
  { id: 'generaliste',     label: 'Médecin généraliste',   short: 'Généraliste',    icon: '🩺', color: '#3B82F6' },
  { id: 'cardiologue',     label: 'Cardiologue',            short: 'Cardiologue',    icon: '❤️', color: '#EF4444' },
  { id: 'pediatre',        label: 'Pédiatre',               short: 'Pédiatre',       icon: '👶', color: '#EC4899' },
  { id: 'dermatologue',    label: 'Dermatologue',           short: 'Dermatologue',   icon: '🔬', color: '#8B5CF6' },
  { id: 'ophtalmo',        label: 'Ophtalmologue',          short: 'Ophtalmo',       icon: '👁️', color: '#0EA5E9' },
  { id: 'psychiatre',      label: 'Psychiatre',             short: 'Psychiatre',     icon: '🧠', color: '#6366F1' },
  { id: 'rhumatologue',    label: 'Rhumatologue',           short: 'Rhumatologue',   icon: '🦴', color: '#A78BFA' },
  { id: 'radiologue',      label: 'Radiologue',             short: 'Radiologue',     icon: '🩻', color: '#64748B' },
  { id: 'kinesitherapeute',label: 'Kinésithérapeute',       short: 'Kiné',           icon: '💪', color: '#10B981' },
  { id: 'podologue',       label: 'Podologue',              short: 'Podologue',      icon: '🦶', color: '#F59E0B' },
  { id: 'infirmier',       label: 'Infirmier(e) libéral(e)',short: 'Infirmier',      icon: '💉', color: '#06B6D4' },
  { id: 'osteopathe',      label: 'Ostéopathe',             short: 'Ostéopathe',     icon: '🙌', color: '#84CC16' },
  { id: 'dentiste',        label: 'Chirurgien-dentiste',    short: 'Dentiste',       icon: '🦷', color: '#D946EF' },
];

export const PROFESSION_MAP = Object.fromEntries(PROFESSIONS.map(p => [p.id, p]));
