/* ═══════════════════════════════════════════════════════════
   TRANSLATIONS
   To add a new language: add a new key to TRANSLATIONS below
   and a new <button data-lang="xx"> in the nav switcher.
═══════════════════════════════════════════════════════════ */
var TRANSLATIONS = {
  es: {
    nav_cta:          'Descargar APK',
    hero_eyebrow:     'Gratis · Android · Sin registro',
    hero_h1:          'De sofá<br>a <em>5K.</em><br>En 8 semanas.',
    hero_sub:         'Un timer de intervalos que te dice cuándo correr y cuándo caminar. Planes estructurados semana a semana. Tan simple como suena.',
    hero_btn:         'Descargar APK gratis',
    hero_note:        'Android 8.0+ · 0 datos personales',
    features_label:   'Por qué funciona',
    features_h2:      'Todo lo que necesitas.<br>Nada de lo que no.',
    f1_title:         'El timer te habla',
    f1_desc:          'La app anuncia cada cambio de fase en voz alta. Guarda el móvil en el bolsillo y escucha: <em>"Corre"</em>, <em>"Camina"</em>, <em>"Descansa"</em>.',
    f2_title:         'Planes listos para usar',
    f2_desc:          'Elige tu objetivo: 5K, 10K o media maratón, y sigue el plan día a día. Cada sesión ya tiene los intervalos calculados.',
    f3_title:         'Pantalla encendida',
    f3_desc:          'El móvil no se apaga durante el entreno. El timer sigue visible en la pantalla de bloqueo con controles de pausa y salto de fase.',
    journey_label:    'El plan de 8 semanas',
    journey_h2:       'Menos caminar.<br>Más correr. Semana a semana.',
    legend_run:       'Minutos corriendo',
    legend_walk:      'Minutos caminando',
    journey_footnote: 'Datos de la sesión del miércoles · Plan 5K para principiantes',
    chart_5k:         '5K',
    phases_label:     'Fases del entrenamiento',
    phases_h2:        'Cada color, una instrucción.',
    phase1_label:     'Calentamiento',
    phase1_desc:      'Activa los músculos antes de empezar. Siempre 5 minutos.',
    phase2_label:     'Correr',
    phase2_desc:      'Ritmo conversacional. Deberías poder hablar en frases cortas.',
    phase3_label:     'Caminar',
    phase3_desc:      'Recuperación activa. No te pares, sigue moviéndote.',
    phase4_label:     'Vuelta calma',
    phase4_desc:      'Estiramiento ligero mientras caminas. Siempre 5 minutos.',
    cta_label:        'Descarga',
    cta_h2:           'Tu primer entreno<br>en 5 minutos.',
    cta_p:            'Instala el APK, elige tu plan y sal a correr. Sin crear cuenta, sin dar tu correo, sin nada.',
    step1:            'Descarga el APK',
    step2:            'Permite fuentes desconocidas',
    step3:            'Elige tu plan y empieza',
    cta_btn:          'Descargar RunnerApp APK',
    cta_fine:         'Android 8.0 o superior · Gratis para siempre',
    footer:           'RunnerApp · Hecho con cariño para principiantes · Gratis y sin anuncios',
    phone_day:         'Lunes',
    phone_next_label:  'A continuación',
    phone_warmup:      'Calentamiento',
    phone_run:         'Correr',
    phone_walk:        'Caminar',
    phone_cooldown:    'Vuelta calma',
    phone_interval:    'Intervalo',
    phone_of:          'de',
  },

  en: {
    nav_cta:          'Download APK',
    hero_eyebrow:     'Free · Android · No sign-up',
    hero_h1:          'Couch to<br><em>5K.</em><br>In 8 weeks.',
    hero_sub:         'An interval timer that tells you when to run and when to walk. Structured week-by-week plans. As simple as it sounds.',
    hero_btn:         'Download APK for free',
    hero_note:        'Android 8.0+ · Zero personal data',
    features_label:   'Why it works',
    features_h2:      'Everything you need.<br>Nothing you don\'t.',
    f1_title:         'The timer talks to you',
    f1_desc:          'The app announces every phase change out loud. Pocket your phone and listen: <em>"Run"</em>, <em>"Walk"</em>, <em>"Rest"</em>.',
    f2_title:         'Ready-to-use plans',
    f2_desc:          'Pick your goal: 5K, 10K, or half marathon, and follow the plan day by day. Every session has the intervals pre-calculated.',
    f3_title:         'Screen stays on',
    f3_desc:          'Your phone won\'t sleep during workouts. The timer stays visible on the lock screen with pause and skip controls.',
    journey_label:    'The 8-week plan',
    journey_h2:       'Less walking.<br>More running. Week by week.',
    legend_run:       'Running minutes',
    legend_walk:      'Walking minutes',
    journey_footnote: 'Wednesday session data · 5K beginner plan',
    chart_5k:         '5K',
    phases_label:     'Training phases',
    phases_h2:        'Every colour, one instruction.',
    phase1_label:     'Warm-up',
    phase1_desc:      'Get the muscles going before you start. Always 5 minutes.',
    phase2_label:     'Run',
    phase2_desc:      'Conversational pace. You should be able to speak in short sentences.',
    phase3_label:     'Walk',
    phase3_desc:      'Active recovery. Don\'t stop, keep moving.',
    phase4_label:     'Cool-down',
    phase4_desc:      'Light stretching while walking. Always 5 minutes.',
    cta_label:        'Download',
    cta_h2:           'First workout<br>in 5 minutes.',
    cta_p:            'Install the APK, pick your plan, and go run. No account, no email, nothing.',
    step1:            'Download the APK',
    step2:            'Allow unknown sources',
    step3:            'Pick your plan and start',
    cta_btn:          'Download RunnerApp APK',
    cta_fine:         'Android 8.0 or higher · Free forever',
    footer:           'RunnerApp · Made with care for beginners · Free, no ads',
    phone_day:        'Monday',
    phone_next_label: 'Up next',
    phone_warmup:     'Warm-up',
    phone_run:        'Run',
    phone_walk:       'Walk',
    phone_cooldown:   'Cool-down',
    phone_interval:   'Interval',
    phone_of:         'of',
  },
};

/* ═══════════════════════════════════════════════════════════
   I18N ENGINE
═══════════════════════════════════════════════════════════ */
var currentLang = 'es';
var currentPhases = [];
var phaseIdx = 0;
var remaining = 0;

function buildPhases(t) {
  return [
    { name: t.phone_warmup,   icon: '🔥', bg: '#7A2C00', duration: 300, counter: t.phone_warmup,                      next: t.phone_run      },
    { name: t.phone_run,      icon: '🏃', bg: '#8A2E00', duration: 60,  counter: t.phone_interval + ' 1 / 8',         next: t.phone_walk     },
    { name: t.phone_walk,     icon: '🚶', bg: '#1E3A7A', duration: 120, counter: t.phone_interval + ' 1 / 8',         next: t.phone_run      },
    { name: t.phone_run,      icon: '🏃', bg: '#8A2E00', duration: 60,  counter: t.phone_interval + ' 2 / 8',         next: t.phone_walk     },
    { name: t.phone_walk,     icon: '🚶', bg: '#1E3A7A', duration: 120, counter: t.phone_interval + ' 2 / 8',         next: t.phone_cooldown },
    { name: t.phone_cooldown, icon: '❄️', bg: '#3B1F7A', duration: 300, counter: t.phone_cooldown,                    next: null             },
  ];
}

function setLanguage(lang) {
  if (!TRANSLATIONS[lang]) return;
  currentLang = lang;
  var t = TRANSLATIONS[lang];

  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.textContent = t[key];
  });

  document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
    var key = el.getAttribute('data-i18n-html');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  document.querySelectorAll('.lang-btn').forEach(function(btn) {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  currentPhases = buildPhases(t);
  phaseIdx = 0;
  remaining = currentPhases[0].duration;
  applyPhase(phaseIdx, remaining);

  try { localStorage.setItem('runnerapp_lang', lang); } catch(e) {}
}

/* ═══════════════════════════════════════════════════════════
   PHONE TIMER ANIMATION
═══════════════════════════════════════════════════════════ */
var TICK_MS = 80;
var EL = {};

function fmt(s) {
  var m = Math.floor(s / 60);
  var sec = s % 60;
  return (m < 10 ? '0' : '') + m + ':' + (sec < 10 ? '0' : '') + sec;
}

function initDots() {
  EL.dots.innerHTML = '';
  for (var i = 0; i < 10; i++) {
    var d = document.createElement('div');
    d.className = 'dot';
    EL.dots.appendChild(d);
  }
}

function updateDots(activeIdx) {
  var kids = EL.dots.children;
  for (var i = 0; i < kids.length; i++) {
    kids[i].className = 'dot' + (i < activeIdx ? ' done' : '') + (i === activeIdx ? ' active' : '');
  }
}

function applyPhase(idx, rem) {
  var p = currentPhases[idx];
  EL.screen.style.background = p.bg;
  EL.name.textContent    = p.name;
  EL.icon.textContent    = p.icon;
  EL.counter.textContent = p.counter;
  EL.timer.textContent   = fmt(rem);
  EL.of.textContent      = TRANSLATIONS[currentLang].phone_of + ' ' + fmt(p.duration);
  EL.fill.style.width    = ((p.duration - rem) / p.duration) * 100 + '%';
  if (p.next) {
    EL.next.style.display   = 'flex';
    EL.nextName.textContent = p.next;
  } else {
    EL.next.style.display = 'none';
  }
  updateDots(Math.min(Math.floor(idx * 1.8), 9));
}

function tick() {
  remaining--;
  if (remaining < 0) {
    phaseIdx = (phaseIdx + 1) % currentPhases.length;
    remaining = currentPhases[phaseIdx].duration;
  }
  applyPhase(phaseIdx, remaining);
}

/* ═══════════════════════════════════════════════════════════
   JOURNEY CHART
═══════════════════════════════════════════════════════════ */
var weekData = [
  { run: 16, walk: 16 },
  { run: 14, walk: 14 },
  { run: 18, walk: 12 },
  { run: 20, walk: 10 },
  { run: 18, walk:  6 },
  { run: 20, walk:  0 },
  { run: 25, walk:  0 },
  { run: 30, walk:  0 },
];

function drawChart() {
  var canvas = document.getElementById('journeyChart');
  var dpr = window.devicePixelRatio || 1;
  var W = canvas.parentElement.clientWidth - 80;
  var H = 180;
  canvas.style.width = W + 'px';
  canvas.style.height = H + 'px';
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  var PAD_L = 40, PAD_R = 16, PAD_T = 16, PAD_B = 28;
  var chartW = W - PAD_L - PAD_R;
  var chartH = H - PAD_T - PAD_B;
  var maxVal = 36;
  var barW = chartW / weekData.length;
  var innerBar = barW * 0.55;
  var halfBar = innerBar / 2 - 1;

  [0, 10, 20, 30].forEach(function(v) {
    var y = PAD_T + chartH - (v / maxVal) * chartH;
    ctx.beginPath();
    ctx.moveTo(PAD_L, y);
    ctx.lineTo(PAD_L + chartW, y);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '9px -apple-system, system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(v + '\'', PAD_L - 6, y + 3.5);
  });

  function drawBar(x, y, w, h) {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, [3, 3, 0, 0]);
    else ctx.rect(x, y, w, h);
    ctx.fill();
  }

  weekData.forEach(function(w, i) {
    var x = PAD_L + i * barW + (barW - innerBar) / 2;
    if (w.walk > 0) {
      var walkH = (w.walk / maxVal) * chartH;
      ctx.fillStyle = '#2563EB';
      drawBar(x + halfBar + 1, PAD_T + chartH - walkH, halfBar, walkH);
    }
    var runH = (w.run / maxVal) * chartH;
    ctx.fillStyle = i === 7 ? '#48BB78' : '#FF5C00';
    drawBar(x, PAD_T + chartH - runH, halfBar, runH);
  });
}

/* ═══════════════════════════════════════════════════════════
   SCROLL REVEALS
═══════════════════════════════════════════════════════════ */
var observer = new IntersectionObserver(
  function(entries) {
    entries.forEach(function(e) { if (e.isIntersecting) e.target.classList.add('visible'); });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
(function init() {
  EL.screen   = document.getElementById('phoneScreen');
  EL.name     = document.getElementById('phaseName');
  EL.icon     = document.getElementById('phaseIcon');
  EL.counter  = document.getElementById('phaseCounter');
  EL.timer    = document.getElementById('phoneTimer');
  EL.of       = document.getElementById('phoneOf');
  EL.fill     = document.getElementById('progressFill');
  EL.next     = document.getElementById('phoneNext');
  EL.nextName = document.getElementById('nextPhaseName');
  EL.dots     = document.getElementById('phoneDots');

  initDots();

  var saved = null;
  try { saved = localStorage.getItem('runnerapp_lang'); } catch(e) {}
  var browser = (navigator.language || navigator.userLanguage || 'es').slice(0, 2).toLowerCase();
  var detected = saved || (TRANSLATIONS[browser] ? browser : 'es');

  setLanguage(detected);
  setInterval(tick, TICK_MS);
  drawChart();
  window.addEventListener('resize', drawChart);
})();
