import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

const CACHE_TTL = 30 * 60 * 1000;
let _cache = null;
let _cacheAt = 0;

function wmoEmoji(code) {
  if (code === 0) return '☀️';
  if (code <= 2) return '🌤️';
  if (code === 3) return '☁️';
  if (code <= 48) return '🌫️';
  if (code <= 55) return '🌦️';
  if (code <= 65) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '🌨️';
  return '⛈️';
}

function runLabel(code) {
  if (code === 0 || code === 1) return 'perfect';
  if (code <= 3) return 'good';
  if (code <= 48) return 'fog';
  if (code <= 55) return 'drizzle';
  if (code <= 82) return 'rain';
  if (code <= 86) return 'snow';
  return 'storm';
}

export function useWeather() {
  const [weather, setWeather] = useState(_cache || null);
  const [loading, setLoading] = useState(!_cache);

  useEffect(() => {
    let cancelled = false;

    async function fetch_() {
      try {
        if (_cache && Date.now() - _cacheAt < CACHE_TTL) {
          if (!cancelled) { setWeather(_cache); setLoading(false); }
          return;
        }
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') { if (!cancelled) setLoading(false); return; }

        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        const { latitude, longitude } = loc.coords;

        const res = await global.fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude.toFixed(4)}&longitude=${longitude.toFixed(4)}&current=temperature_2m,weather_code`
        );
        const data = await res.json();
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;
        const w = { temp, code, emoji: wmoEmoji(code), runLabel: runLabel(code) };

        _cache = w;
        _cacheAt = Date.now();
        if (!cancelled) { setWeather(w); setLoading(false); }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }

    fetch_();
    return () => { cancelled = true; };
  }, []);

  return { weather, loading };
}
