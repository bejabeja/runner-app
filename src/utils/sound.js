import * as Speech from 'expo-speech';

const PHASE_WORDS = {
  run: 'Corre',
  walk: 'Camina',
  warmup: 'Calienta',
  cooldown: 'Enfría',
  rest: 'Descansa',
};

const speak = (text) => {
  Speech.stop();
  Speech.speak(text, { language: 'es-ES', rate: 1.0, pitch: 1.0 });
};

export const unlockAudio = () => {};
export const playStart = () => speak('¡Empieza!');
export const playPhaseChange = (type) => speak(PHASE_WORDS[type] || type);
export const playDone = () => speak('¡Terminado!');
export const playCountdown = () => {};
