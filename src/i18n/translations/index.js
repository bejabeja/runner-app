import * as common from './common';
import * as finder from './finder';
import * as history from './history';
import * as home from './home';
import * as onboarding from './onboarding';
import * as plans from './plans';
import * as settings from './settings';
import * as timer from './timer';

export const translations = {
  es: {
    ...common.es,
    home: home.es,
    timer: timer.es,
    plans: plans.es,
    history: history.es,
    settings: settings.es,
    onboarding: onboarding.es,
    finder: finder.es,
  },
  en: {
    ...common.en,
    home: home.en,
    timer: timer.en,
    plans: plans.en,
    history: history.en,
    settings: settings.en,
    onboarding: onboarding.en,
    finder: finder.en,
  },
};
