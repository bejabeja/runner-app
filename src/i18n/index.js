import { createContext, useContext, useState } from 'react';
import store from '../storage/asyncStorageAdapter';
import { STORAGE_KEYS } from '../storage/keys';
import { translations } from './translations/index';

const LanguageContext = createContext({
  lang: 'es',
  t: (key) => key,
  setLang: () => { },
});

export function LanguageProvider({ initialLang = 'es', children }) {
  const [lang, setLangState] = useState(initialLang);

  const setLang = async (l) => {
    setLangState(l);
    await store.setItem(STORAGE_KEYS.LANGUAGE, l);
  };

  const t = (key, vars) => {
    const keys = key.split('.');
    let val = translations[lang];
    for (const k of keys) val = val?.[k];
    if (val === undefined) {
      val = translations.es;
      for (const k of keys) val = val?.[k];
    }
    if (val === undefined) {
      if (__DEV__) console.warn(`[i18n] Missing key: "${key}"`);
      return key;
    }
    if (typeof val !== 'string' && typeof val !== 'number') return val;
    const str = String(val);
    if (!vars) return str;
    return str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`));
  };

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
