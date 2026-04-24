import { useState, useEffect, useMemo } from 'react';
import { STEPS, CATEGORIES } from './data/steps';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import StepCard from './components/StepCard';
import StepModal from './components/StepModal';

const STORAGE_KEY = 'medinstall_v1';

function loadStatuses() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return Object.fromEntries(STEPS.map(s => [s.id, 'todo']));
}

export default function App() {
  const [statuses, setStatuses] = useState(loadStatuses);
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedStep, setSelectedStep] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses));
  }, [statuses]);

  const updateStatus = (id, status) => {
    setStatuses(prev => ({ ...prev, [id]: status }));
  };

  const cycleStatus = (id) => {
    setStatuses(prev => {
      const next = { todo: 'in_progress', in_progress: 'done', done: 'todo' };
      return { ...prev, [id]: next[prev[id]] };
    });
  };

  const filteredSteps = useMemo(() => {
    if (activeCategory === 'all') return STEPS;
    return STEPS.filter(s => s.category === activeCategory);
  }, [activeCategory]);

  const doneCount = useMemo(
    () => Object.values(statuses).filter(s => s === 'done').length,
    [statuses]
  );
  const inProgressCount = useMemo(
    () => Object.values(statuses).filter(s => s === 'in_progress').length,
    [statuses]
  );

  const groupedSteps = useMemo(() => {
    if (activeCategory !== 'all') return null;
    return CATEGORIES.map(cat => ({
      ...cat,
      steps: STEPS.filter(s => s.category === cat.id),
    }));
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        total={STEPS.length}
        done={doneCount}
        inProgress={inProgressCount}
        statuses={statuses}
      />
      <CategoryNav
        steps={STEPS}
        statuses={statuses}
        active={activeCategory}
        onChange={setActiveCategory}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {groupedSteps ? (
          // "All" view: grouped by category with section headers
          <div className="space-y-8">
            {groupedSteps.map(cat => (
              <section key={cat.id}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">{cat.icon}</span>
                  <div>
                    <h2 className="font-bold text-slate-800 text-base">{cat.label}</h2>
                    <p className="text-xs text-slate-500">{cat.description}</p>
                  </div>
                  <div className="ml-auto text-xs font-semibold text-slate-400">
                    {cat.steps.filter(s => statuses[s.id] === 'done').length}/{cat.steps.length} terminées
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {cat.steps.map(step => (
                    <StepCard
                      key={step.id}
                      step={step}
                      status={statuses[step.id]}
                      statuses={statuses}
                      onCycle={() => cycleStatus(step.id)}
                      onSelect={() => setSelectedStep(step)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        ) : (
          // Filtered view: flat grid
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredSteps.map(step => (
              <StepCard
                key={step.id}
                step={step}
                status={statuses[step.id]}
                statuses={statuses}
                onCycle={() => cycleStatus(step.id)}
                onSelect={() => setSelectedStep(step)}
              />
            ))}
          </div>
        )}
      </main>

      {selectedStep && (
        <StepModal
          step={selectedStep}
          status={statuses[selectedStep.id]}
          statuses={statuses}
          onUpdate={(status) => {
            updateStatus(selectedStep.id, status);
            setSelectedStep(prev => prev); // keep modal open
          }}
          onClose={() => setSelectedStep(null)}
        />
      )}
    </div>
  );
}
