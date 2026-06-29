// Re-export barrel, import from the domain modules directly for new code:
//   storage/runs.js     → getRuns, saveRun
//   storage/plan.js     → getActivePlan, setActivePlan, clearActivePlan
//   storage/settings.js → getLanguagePref, setLanguagePref, getOnboardingDone, setOnboardingDone
export * from './plan';
export * from './runs';
export * from './settings';

