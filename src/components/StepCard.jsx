import { CATEGORY_MAP, STEP_MAP } from '../data/steps';

const STATUS_CONFIG = {
  todo: {
    label: 'À faire',
    badge: 'bg-slate-100 text-slate-600',
    nextLabel: 'Commencer',
    nextBtn: 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200',
  },
  in_progress: {
    label: 'En cours',
    badge: 'bg-amber-100 text-amber-700',
    nextLabel: 'Marquer comme fait ✓',
    nextBtn: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200',
  },
  done: {
    label: '✓ Terminé',
    badge: 'bg-emerald-100 text-emerald-700',
    nextLabel: 'Réouvrir',
    nextBtn: 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200',
  },
};

const PRIORITY_CONFIG = {
  critical: { label: 'Obligatoire', cls: 'bg-red-50 text-red-600' },
  important: { label: 'Important', cls: 'bg-amber-50 text-amber-600' },
  optional: { label: 'Optionnel', cls: 'bg-slate-50 text-slate-500' },
};

const CATEGORY_COLORS = {
  purple: '#7C3AED',
  blue: '#2563EB',
  emerald: '#059669',
  amber: '#D97706',
  teal: '#0D9488',
  indigo: '#4338CA',
  rose: '#DB2777',
};

export default function StepCard({ step, status, statuses, onCycle, onSelect }) {
  const cfg = STATUS_CONFIG[status];
  const priority = PRIORITY_CONFIG[step.priority];
  const category = CATEGORY_MAP[step.category];
  const accentColor = CATEGORY_COLORS[category.color];

  const blockedBy = step.dependencies.filter(d => statuses[d] !== 'done');
  const isDone = status === 'done';

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden transition-all hover:shadow-md ${
        isDone ? 'opacity-70' : ''
      }`}
    >
      {/* Color stripe */}
      <div className="h-1 w-full" style={{ backgroundColor: accentColor }} />

      <div className="p-5 flex flex-col flex-1">
        {/* Top badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${priority.cls}`}>
            {priority.label}
          </span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
            {cfg.label}
          </span>
        </div>

        {/* Category label */}
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-sm">{category.icon}</span>
          <span className="text-xs font-medium" style={{ color: accentColor }}>
            {category.label}
          </span>
        </div>

        {/* Title */}
        <h3 className={`font-semibold text-slate-900 text-sm leading-snug mb-0.5 ${isDone ? 'line-through text-slate-400' : ''}`}>
          {step.title}
        </h3>
        <p className="text-xs text-slate-500 mb-3">{step.subtitle}</p>

        {/* Delay + cost */}
        <div className="flex gap-3 mb-3">
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {step.estimatedWeeks.min === 0
              ? `< 1 sem.`
              : step.estimatedWeeks.min === step.estimatedWeeks.max
              ? `${step.estimatedWeeks.min} sem.`
              : `${step.estimatedWeeks.min}–${step.estimatedWeeks.max} sem.`}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {step.cost}
          </span>
        </div>

        {/* Blocked warning */}
        {blockedBy.length > 0 && status === 'todo' && (
          <div className="mb-3 flex items-start gap-1.5 bg-amber-50 border border-amber-200 rounded-lg p-2">
            <span className="text-amber-500 text-sm leading-none mt-0.5">⚠</span>
            <p className="text-xs text-amber-700">
              Attend :{' '}
              {blockedBy.map(id => STEP_MAP[id]?.title ?? id).join(', ')}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex gap-2">
          <button
            onClick={onSelect}
            className="flex-1 text-xs font-medium px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
          >
            Voir le détail
          </button>
          <button
            onClick={onCycle}
            className={`flex-1 text-xs font-medium px-3 py-2 rounded-lg transition-colors ${cfg.nextBtn}`}
          >
            {cfg.nextLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
