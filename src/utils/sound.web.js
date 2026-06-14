let ctx = null;

const getCtx = () => {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
};

const beep = (freq, dur, delay = 0) => {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.frequency.value = freq;
    osc.type = 'sine';
    const t = c.currentTime + delay;
    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    osc.start(t);
    osc.stop(t + dur);
  } catch {}
};

const speak = (text, delay = 0) => {
  try {
    if (!window.speechSynthesis) return;
    const fire = () => {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'en-US';
      utt.rate = 0.95;
      utt.volume = 1.0;
      window.speechSynthesis.speak(utt);
    };
    if (delay > 0) setTimeout(fire, delay * 1000);
    else fire();
  } catch {}
};

const PHASE_WORDS = {
  run: 'Run',
  walk: 'Walk',
  warmup: 'Warm up',
  cooldown: 'Cool down',
  rest: 'Rest',
};

export const unlockAudio = () => getCtx();

export const playStart = () => {
  beep(880, 0.12);
  beep(1100, 0.2, 0.18);
  speak('Start', 0.1);
};

export const playPhaseChange = (type) => {
  if (type === 'run') {
    beep(880, 0.1);
    beep(1100, 0.18, 0.13);
  } else if (type === 'walk') {
    beep(660, 0.1);
    beep(440, 0.18, 0.13);
  } else if (type === 'warmup') {
    beep(750, 0.12);
    beep(900, 0.15, 0.15);
  } else if (type === 'cooldown') {
    beep(600, 0.12);
    beep(480, 0.18, 0.15);
  } else {
    beep(660, 0.15);
  }
  speak(PHASE_WORDS[type] || type, 0.05);
};

export const playCountdown = () => beep(440, 0.07);

export const playDone = () => {
  beep(523, 0.15);
  beep(659, 0.15, 0.22);
  beep(784, 0.3, 0.44);
  speak('Finish', 0.5);
};
