import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import { logError } from './logError';

let _lang = 'es';
export const setSoundLanguage = (lang) => { _lang = lang; };

const PHASE_WORDS = {
  es: { run: 'Corre', walk: 'Camina', warmup: 'Calienta', cooldown: 'Enfría', rest: 'Descansa' },
  en: { run: 'Run',   walk: 'Walk',   warmup: 'Warm up',  cooldown: 'Cool down', rest: 'Rest' },
};

const VOICE_STRINGS = {
  es: { go: '¡Empieza!', done: '¡Terminado!' },
  en: { go: 'Go!',       done: 'Done!' },
};

const SOUND_COUNTDOWN = require('../../assets/sounds/beep_countdown.wav');
const SOUND_START     = require('../../assets/sounds/beep_start.wav');
const SOUND_PHASE     = require('../../assets/sounds/beep_phase.wav');
const SOUND_DONE      = require('../../assets/sounds/beep_done.wav');

// Preloaded sound pool
const sounds = {};

const loadSound = async (key, asset) => {
  if (sounds[key]) return;
  const { sound } = await Audio.Sound.createAsync(asset, { shouldPlay: false });
  sounds[key] = sound;
};

export const unlockAudio = async () => {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: false,
    });
    await Promise.all([
      loadSound('countdown', SOUND_COUNTDOWN),
      loadSound('start',     SOUND_START),
      loadSound('phase',     SOUND_PHASE),
      loadSound('done',      SOUND_DONE),
    ]);
  } catch (e) { logError('sound:unlock', e); }
};

const playSound = async (key) => {
  try {
    const s = sounds[key];
    if (!s) return;
    await s.setPositionAsync(0);
    await s.playAsync();
  } catch (e) { logError('sound:play', e); }
};

const speak = (text) => {
  try {
    Speech.stop();
    const locale = _lang === 'en' ? 'en-US' : 'es-ES';
    Speech.speak(text, { language: locale, rate: 1.1, pitch: 1.0 });
  } catch (e) { logError('sound:speak', e); }
};

export const playCountdown = () => playSound('countdown');

export const playStart = async () => {
  await playSound('start');
  speak(VOICE_STRINGS[_lang]?.go || VOICE_STRINGS.es.go);
};

export const playPhaseChange = async (type) => {
  await playSound('phase');
  if (type) speak((PHASE_WORDS[_lang] || PHASE_WORDS.es)[type] || type);
};

export const playDone = async () => {
  await playSound('done');
  speak(VOICE_STRINGS[_lang]?.done || VOICE_STRINGS.es.done);
};
