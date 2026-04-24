import { useMemo } from 'react';
import { STEPS } from '../data/steps';

const CRITICAL_CHAIN = ['ordre', 'rpps', 'conventionnement', 'local', 'rc-pro'];

function estimateWeeksRemaining(statuses) {
  const remaining = STEPS.filter(s => statuses[s.id] !== 'done' && s.priority === 'critical');
  if (remaining.length === 0) return 0;
  // conservative: max of the remaining critical steps (parallel tracks)
  return Math.max(...remaining.map(s => s.estimatedWeeks.max));
}

export default function Header({ total, done, inProgress, statuses }) {
  const progress = Math.round((done / total) * 100);
  const weeksLeft = useMemo(() => estimateWeeksRemaining(statuses), [statuses]);
  const monthsLeft = Math.ceil(weeksLeft / 4);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-sm">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-tight">MedInstall</h1>
            <p className="text-xs text-slate-400 leading-tight">Guide d'installation cabinet</p>
          </div>
        </div>

        {/* Progress area */}
        <div className="flex items-center gap-5 flex-1 max-w-xl">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-slate-600">
                <span className="font-bold text-slate-900">{done}</span>/{total} étapes terminées
                {inProgress > 0 && (
                  <span className="ml-2 text-amber-600 font-medium">· {inProgress} en cours</span>
                )}
              </span>
              <span className="text-xs font-semibold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* ETA badge */}
          <div className="shrink-0 text-right">
            {done === total ? (
              <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-200">
                🎉 Installation complète !
              </span>
            ) : (
              <div>
                <div className="text-xs text-slate-400">Estimation restante</div>
                <div className="font-bold text-slate-800 text-sm">
                  {monthsLeft <= 1 ? '< 1 mois' : `~${monthsLeft} mois`}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
