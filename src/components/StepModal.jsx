import { useEffect } from 'react';
import { CATEGORY_MAP, STEP_MAP } from '../data/steps';

const CATEGORY_COLORS = {
  purple: '#7C3AED',
  blue: '#2563EB',
  emerald: '#059669',
  amber: '#D97706',
  teal: '#0D9488',
  indigo: '#4338CA',
  rose: '#DB2777',
};

const STATUS_CONFIG = {
  todo: { label: 'À faire', badge: 'bg-slate-100 text-slate-600' },
  in_progress: { label: 'En cours', badge: 'bg-amber-100 text-amber-700' },
  done: { label: '✓ Terminé', badge: 'bg-emerald-100 text-emerald-700' },
};

const PRIORITY_CONFIG = {
  critical: { label: 'Obligatoire', cls: 'bg-red-50 text-red-600 border border-red-200' },
  important: { label: 'Important', cls: 'bg-amber-50 text-amber-600 border border-amber-200' },
  optional: { label: 'Optionnel', cls: 'bg-slate-50 text-slate-500 border border-slate-200' },
};

export default function StepModal({ step, status, statuses, onUpdate, onClose }) {
  const cfg = STATUS_CONFIG[status];
  const priority = PRIORITY_CONFIG[step.priority];
  const category = CATEGORY_MAP[step.category];
  const accentColor = CATEGORY_COLORS[category.color];

  const blockedBy = step.dependencies.filter(d => statuses[d] !== 'done');

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const cycleStatus = () => {
    const next = { todo: 'in_progress', in_progress: 'done', done: 'todo' };
    onUpdate(next[status]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 modal-backdrop"
      style={{ backgroundColor: 'rgba(15,23,42,0.5)' }}
      onClick={onClose}
    >
      <div
        className="modal-card bg-white w-full sm:max-w-xl sm:rounded-2xl rounded-t-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header stripe */}
        <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: accentColor }} />

        {/* Header */}
        <div className="p-5 pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex flex-wrap gap-2">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priority.cls}`}
              >
                {priority.label}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}>
                {cfg.label}
              </span>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Fermer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-1.5 mb-1.5">
            <span>{category.icon}</span>
            <span className="text-xs font-semibold" style={{ color: accentColor }}>
              {category.label}
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-900 leading-snug">{step.title}</h2>
          <p className="text-sm text-slate-500 mt-0.5">{step.subtitle}</p>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Description */}
          <p className="text-sm text-slate-700 leading-relaxed">{step.description}</p>

          {/* Méta info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Délai estimé
              </div>
              <div className="font-semibold text-slate-800 text-sm">
                {step.estimatedWeeks.min === 0
                  ? '< 1 semaine'
                  : step.estimatedWeeks.min === step.estimatedWeeks.max
                  ? `${step.estimatedWeeks.min} semaine${step.estimatedWeeks.min > 1 ? 's' : ''}`
                  : `${step.estimatedWeeks.min} – ${step.estimatedWeeks.max} semaines`}
              </div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Coût estimé
              </div>
              <div className="font-semibold text-slate-800 text-sm">{step.cost}</div>
            </div>
          </div>

          {/* Blockers */}
          {blockedBy.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-amber-700 mb-1">⚠ Prérequis non terminés</p>
              <ul className="space-y-1">
                {blockedBy.map(id => (
                  <li key={id} className="text-xs text-amber-700 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    {STEP_MAP[id]?.title ?? id}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Documents */}
          {step.documents.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Documents requis
              </h3>
              <ul className="space-y-1.5">
                {step.documents.map((doc, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <svg className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tip */}
          {step.tips && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-xs font-semibold text-blue-700 mb-1">💡 Conseil</p>
              <p className="text-sm text-blue-800 leading-relaxed">{step.tips}</p>
            </div>
          )}

          {/* Official link */}
          {step.officialLink && (
            <a
              href={step.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Lien officiel →
            </a>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 shrink-0 flex gap-2">
          {status !== 'done' && (
            <button
              onClick={() => { onUpdate('in_progress'); }}
              disabled={status === 'in_progress'}
              className={`flex-1 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors border ${
                status === 'in_progress'
                  ? 'bg-amber-50 text-amber-700 border-amber-200 cursor-default'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
              }`}
            >
              {status === 'in_progress' ? '⏳ En cours…' : 'Commencer'}
            </button>
          )}
          <button
            onClick={() => onUpdate(status === 'done' ? 'todo' : 'done')}
            className={`flex-1 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors border ${
              status === 'done'
                ? 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500 shadow-sm'
            }`}
          >
            {status === 'done' ? 'Réouvrir' : '✓ Marquer comme fait'}
          </button>
        </div>
      </div>
    </div>
  );
}
