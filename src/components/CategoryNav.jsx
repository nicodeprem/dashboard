import { CATEGORIES } from '../data/steps';

export default function CategoryNav({ steps, statuses, active, onChange }) {
  const getProgress = (catId) => {
    const catSteps = steps.filter(s => s.category === catId);
    const done = catSteps.filter(s => statuses[s.id] === 'done').length;
    return { done, total: catSteps.length };
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-[61px] z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex gap-1 overflow-x-auto py-2.5 scrollbar-hide">
          <button
            onClick={() => onChange('all')}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              active === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Toutes
          </button>
          {CATEGORIES.map(cat => {
            const { done, total } = getProgress(cat.id);
            const isActive = active === cat.id;
            const allDone = done === total;
            return (
              <button
                key={cat.id}
                onClick={() => onChange(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span className="hidden sm:inline">{cat.label}</span>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : allDone
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {done}/{total}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
