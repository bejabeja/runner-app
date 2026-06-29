export const recommend = (exp, goal, canRun30) => {
  if (goal === '5k') {
    if (canRun30) return { planId: 'plan-10k', noteKey: 'finder.noteReady10k' };
    return { planId: 'plan-5k' };
  }

  if (goal === '10k') {
    if (!canRun30) return { planId: 'plan-5k', noteKey: 'finder.noteBase10k' };
    return { planId: 'plan-10k' };
  }

  if (goal === 'half') {
    if (!canRun30) return { planId: 'plan-5k', noteKey: 'finder.noteBaseHalf' };
    if (exp === 'none' || exp === 'some') return { planId: 'plan-10k', noteKey: 'finder.noteBase10kFirst' };
    return { planId: 'plan-half' };
  }

  if (goal === 'marathon') {
    if (!canRun30) return { planId: 'plan-5k', noteKey: 'finder.noteBaseMarathon' };
    if (exp === 'none' || exp === 'some') return { planId: 'plan-10k', noteKey: 'finder.noteBase10kFirst' };
    return { planId: 'plan-marathon' };
  }

  return { planId: 'plan-5k' };
};
