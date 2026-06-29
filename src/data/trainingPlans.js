export const TRAINING_PLANS = [
  {
    id: 'plan-5k',
    name: '5K para principiantes',
    goal: '5K',
    weeks: 8,
    difficulty: 'Principiante',
    defaultDaysPerWeek: 3,
    description: 'Pasa de 0 a completar tu primer 5K con una mezcla de caminar y correr.',
    color: '#48BB78',
    schedule: [
      {
        week: 1,
        focus: 'startMoving',
        sessions: [
          { day: 'Lunes', type: 'runWalk', distance: 3.5, description: '5 min calentamiento + Alterna 1 min corriendo y 2 min caminando × 8 + 5 min vuelta calma' },
          { day: 'Miércoles', type: 'runWalk', distance: 3.5, description: '5 min calentamiento + Alterna 1 min corriendo y 2 min caminando × 8 + 5 min vuelta calma' },
          { day: 'Viernes', type: 'runWalk', distance: 4.0, description: '5 min calentamiento + Alterna 1 min corriendo y 2 min caminando × 10 + 5 min vuelta calma' },
        ],
      },
      {
        week: 2,
        focus: 'buildRunTime',
        sessions: [
          { day: 'Lunes', type: 'runWalk', distance: 3.0, description: '5 min calentamiento + Alterna 2 min corriendo y 2 min caminando × 7 + 5 min vuelta calma' },
          { day: 'Miércoles', type: 'runWalk', distance: 3.0, description: '5 min calentamiento + Alterna 2 min corriendo y 2 min caminando × 7 + 5 min vuelta calma' },
          { day: 'Viernes', type: 'runWalk', distance: 3.5, description: '5 min calentamiento + Alterna 2 min corriendo y 1 min caminando × 8 + 5 min vuelta calma' },
        ],
      },
      {
        week: 3,
        focus: 'longerIntervals',
        sessions: [
          { day: 'Lunes', type: 'runWalk', distance: 3.5, description: '5 min calentamiento + Alterna 3 min corriendo y 2 min caminando × 6 + 5 min vuelta calma' },
          { day: 'Miércoles', type: 'runWalk', distance: 3.5, description: '5 min calentamiento + Alterna 3 min corriendo y 2 min caminando × 6 + 5 min vuelta calma' },
          { day: 'Sábado', type: 'longRunBeginner', distance: 4.0, description: '5 min calentamiento + Alterna 3 min corriendo y 1 min caminando × 8 + 5 min vuelta calma' },
        ],
      },
      {
        week: 4,
        focus: 'consolidateBase',
        sessions: [
          { day: 'Lunes', type: 'runWalk', distance: 4.0, description: '5 min calentamiento + Alterna 4 min corriendo y 2 min caminando × 5 + 5 min vuelta calma' },
          { day: 'Miércoles', type: 'runWalk', distance: 4.0, description: '5 min calentamiento + Alterna 4 min corriendo y 2 min caminando × 5 + 5 min vuelta calma' },
          { day: 'Sábado', type: 'longRunBeginner', distance: 4.5, description: '5 min calentamiento + Alterna 4 min corriendo y 1 min caminando × 6 + 5 min vuelta calma' },
        ],
      },
      {
        week: 5,
        focus: 'first10min',
        sessions: [
          { day: 'Lunes', type: 'continuousRun', distance: 4.5, description: '5 min calentamiento + Alterna 6 min corriendo y 2 min caminando × 3 + 5 min vuelta calma' },
          { day: 'Miércoles', type: 'continuousRun', distance: 4.5, description: '5 min calentamiento + Alterna 6 min corriendo y 2 min caminando × 3 + 5 min vuelta calma' },
          { day: 'Sábado', type: 'longRunBeginner', distance: 4.5, description: '5 min calentamiento + 15 min a ritmo suave + 5 min vuelta calma' },
        ],
      },
      {
        week: 6,
        focus: 'longerRuns',
        sessions: [
          { day: 'Lunes', type: 'continuousRun', distance: 4.5, description: '5 min calentamiento + 20 min a ritmo fácil + 5 min vuelta calma' },
          { day: 'Miércoles', type: 'continuousRun', distance: 4.5, description: '5 min calentamiento + 20 min a ritmo fácil + 5 min vuelta calma' },
          { day: 'Sábado', type: 'longRunBeginner', distance: 5.5, description: '5 min calentamiento + 25 min a ritmo fácil + 5 min vuelta calma' },
        ],
      },
      {
        week: 7,
        focus: 'almostThere',
        sessions: [
          { day: 'Lunes', type: 'continuousRun', distance: 5.0, description: '5 min calentamiento + 25 min a ritmo fácil + 5 min vuelta calma' },
          { day: 'Miércoles', type: 'shortRun', distance: 3.5, description: '5 min caminata suave + 15 min trote suave de recuperación + 5 min caminata suave' },
          { day: 'Sábado', type: 'longRunBeginner', distance: 5.5, description: '5 min calentamiento + 28 min a ritmo fácil + 5 min vuelta calma' },
        ],
      },
      {
        week: 8,
        focus: 'raceWeek',
        sessions: [
          { day: 'Lunes', type: 'shortRun', distance: 3.0, description: 'Trote suave 15 min, mantén energía' },
          { day: 'Miércoles', type: 'shortRun', distance: 2.5, description: 'Trote muy suave 10 min' },
          { day: 'Sábado', type: 'race5k', distance: 5.0, description: '¡Tu primer 5K! Disfruta cada metro' },
        ],
      },
    ],
  },
  {
    id: 'plan-10k',
    name: '10K intermedio',
    goal: '10K',
    weeks: 10,
    difficulty: 'Intermedio',
    defaultDaysPerWeek: 3,
    description: 'Prepárate para completar un 10K con calidad. Requiere poder correr 30 min continuos.',
    color: '#4299E1',
    schedule: [
      {
        week: 1, focus: 'baseWeek', sessions: [
          { day: 'Martes', type: 'easyRun', distance: 5, description: '30 min a ritmo conversacional' },
          { day: 'Jueves', type: 'paceChanges', distance: 6, description: '5 min calentamiento + 4×5 min a ritmo 10K + 5 min vuelta calma' },
          { day: 'Sábado', type: 'longRun', distance: 7, description: '45 min ritmo fácil' },
        ]
      },
      {
        week: 2, focus: 'moderateVolume', sessions: [
          { day: 'Martes', type: 'easyRun', distance: 5, description: '30 min a ritmo conversacional' },
          { day: 'Jueves', type: 'tempo', distance: 7, description: '10 min calentamiento + 20 min a ritmo tempo + 10 min vuelta calma' },
          { day: 'Domingo', type: 'longRun', distance: 8, description: '50 min ritmo fácil' },
        ]
      },
      {
        week: 3, focus: 'intensity', sessions: [
          { day: 'Martes', type: 'intervals', distance: 8, description: '10 min calentamiento + 5×800m a ritmo 5K con 90s descanso + 10 min vuelta calma' },
          { day: 'Jueves', type: 'easyRun', distance: 6, description: '35 min ritmo suave' },
          { day: 'Domingo', type: 'longRun', distance: 9, description: '55 min ritmo fácil' },
        ]
      },
      {
        week: 4, focus: 'activeRecovery', sessions: [
          { day: 'Martes', type: 'easyRun', distance: 4, description: '25 min muy suave' },
          { day: 'Jueves', type: 'easyRun', distance: 5, description: '30 min ritmo fácil' },
          { day: 'Domingo', type: 'mediumRun', distance: 7, description: '45 min ritmo fácil' },
        ]
      },
      {
        week: 5, focus: 'highLoad', sessions: [
          { day: 'Martes', type: 'intervals', distance: 8, description: '10 min calentamiento + 5×800m a ritmo 5K con 90s descanso + 10 min vuelta calma' },
          { day: 'Jueves', type: 'tempo', distance: 7, description: '10 min calentamiento + 20 min tempo + 10 min vuelta calma' },
          { day: 'Domingo', type: 'longRun', distance: 8, description: '50 min ritmo fácil' },
        ]
      },
      {
        week: 6, focus: 'raceSimulation', sessions: [
          { day: 'Martes', type: 'fartlek', distance: 7, description: '10 min calentamiento + Fartlek: 5 min rápido / 3 min suave × 4 + 10 min vuelta calma' },
          { day: 'Jueves', type: 'easyRun', distance: 6, description: '35 min ritmo fácil' },
          { day: 'Domingo', type: 'longRun', distance: 11, description: '65 min ritmo fácil' },
        ]
      },
      {
        week: 7, focus: 'maintainForm', sessions: [
          { day: 'Martes', type: 'intervals', distance: 9, description: '10 min calentamiento + 5×1000m a ritmo objetivo 10K con 90s descanso + 10 min vuelta calma' },
          { day: 'Jueves', type: 'easyRun', distance: 6, description: '35 min suave' },
          { day: 'Domingo', type: 'longRun', distance: 11, description: '65 min ritmo fácil' },
        ]
      },
      {
        week: 8, focus: 'taperBegins', sessions: [
          { day: 'Martes', type: 'easyRun', distance: 5, description: '30 min ritmo fácil' },
          { day: 'Jueves', type: 'shortTempo', distance: 6, description: '10 min calentamiento + 15 min tempo + 10 min vuelta calma' },
          { day: 'Domingo', type: 'mediumRun', distance: 8, description: '50 min ritmo fácil' },
        ]
      },
      {
        week: 9, focus: 'finalTaper', sessions: [
          { day: 'Martes', type: 'easyRun', distance: 5, description: '30 min muy suave' },
          { day: 'Jueves', type: 'activation', distance: 4, description: '20 min suave + 4 strides al final' },
          { day: 'Viernes', type: 'shortJog', distance: 3, description: '15 min muy suave. conserva las piernas para mañana' },
        ]
      },
      {
        week: 10, focus: 'raceWeek', sessions: [
          { day: 'Lunes', type: 'easyJog', distance: 3, description: '15 min muy suave' },
          { day: 'Miércoles', type: 'activation', distance: 2, description: '10 min suave + 2 aceleraciones cortas' },
          { day: 'Viernes', type: 'shortJog', distance: 2, description: '10 min muy suave + 2 aceleraciones de 80m. activa las piernas para el domingo' },
          { day: 'Domingo', type: 'race10k', distance: 10, description: '¡Es tu día! Ejecuta el plan y disfruta' },
        ]
      },
    ],
  },
  {
    id: 'plan-half',
    name: 'Media Maratón',
    goal: '21.1K',
    weeks: 12,
    difficulty: 'Avanzado',
    defaultDaysPerWeek: 4,
    description: 'Para completar tu primera media maratón. Requisito: correr 60 min sin parar y 40 km/semana.',
    color: '#9F7AEA',
    schedule: [
      {
        week: 1, focus: 'buildBase', sessions: [
          { day: 'Martes',  type: 'easyRun',  distance: 8,  description: '40 min a ritmo fácil' },
          { day: 'Jueves',  type: 'tempo',          distance: 10, description: '10 min calentamiento + 20 min a ritmo tempo + 10 min vuelta calma' },
          { day: 'Sábado',  type: 'easyRun',  distance: 8,  description: '40 min ritmo suave' },
          { day: 'Domingo', type: 'longRun',   distance: 14, description: '75 min ritmo fácil' },
        ],
      },
      {
        week: 2, focus: 'gainVolume', sessions: [
          { day: 'Martes',  type: 'easyRun',  distance: 9,  description: '45 min a ritmo fácil' },
          { day: 'Jueves',  type: 'fartlek',        distance: 11, description: '10 min calentamiento + Fartlek: 5 min rápido / 3 min suave × 4 + 10 min vuelta calma' },
          { day: 'Sábado',  type: 'easyRun',  distance: 9,  description: '45 min ritmo suave' },
          { day: 'Domingo', type: 'longRun',   distance: 16, description: '85 min ritmo fácil' },
        ],
      },
      {
        week: 3, focus: 'longerIntervals', sessions: [
          { day: 'Martes',  type: 'easyRun',  distance: 9,  description: '45 min a ritmo fácil' },
          { day: 'Jueves',  type: 'intervals',      distance: 12, description: '10 min calentamiento + 5×800m a ritmo 5K con 90s descanso + 10 min vuelta calma' },
          { day: 'Sábado',  type: 'easyRun',  distance: 9,  description: '45 min ritmo suave' },
          { day: 'Domingo', type: 'longRun',   distance: 17, description: '90 min ritmo fácil' },
        ],
      },
      {
        week: 4, focus: 'activeRecovery', sessions: [
          { day: 'Martes',  type: 'easyRun',  distance: 7,  description: '35 min a ritmo fácil' },
          { day: 'Jueves',  type: 'easyRun',  distance: 8,  description: '40 min ritmo suave' },
          { day: 'Sábado',  type: 'easyRun',  distance: 7,  description: '35 min ritmo suave' },
          { day: 'Domingo', type: 'mediumRun',   distance: 12, description: '60 min ritmo fácil' },
        ],
      },
      {
        week: 5, focus: 'consolidateQuality', sessions: [
          { day: 'Martes',  type: 'easyRun',  distance: 9,  description: '45 min a ritmo fácil' },
          { day: 'Jueves',  type: 'tempo',          distance: 12, description: '10 min calentamiento + 25 min a ritmo tempo + 10 min vuelta calma' },
          { day: 'Sábado',  type: 'easyRun',  distance: 9,  description: '45 min ritmo suave' },
          { day: 'Domingo', type: 'longRun',   distance: 18, description: '95 min ritmo fácil' },
        ],
      },
      {
        week: 6, focus: 'intensity', sessions: [
          { day: 'Martes',  type: 'easyRun',  distance: 10, description: '50 min a ritmo fácil' },
          { day: 'Jueves',  type: 'fartlek',        distance: 12, description: '10 min calentamiento + Fartlek: 4 min rápido / 2 min suave × 5 + 10 min vuelta calma' },
          { day: 'Sábado',  type: 'easyRun',  distance: 10, description: '50 min ritmo suave' },
          { day: 'Domingo', type: 'longRun',   distance: 19, description: '100 min ritmo fácil' },
        ],
      },
      {
        week: 7, focus: 'maintainForm', sessions: [
          { day: 'Martes',  type: 'easyRun',  distance: 10, description: '50 min a ritmo fácil' },
          { day: 'Jueves',  type: 'intervals',      distance: 13, description: '10 min calentamiento + 5×1000m a ritmo 5K con 90s descanso + 10 min vuelta calma' },
          { day: 'Sábado',  type: 'easyRun',  distance: 10, description: '50 min ritmo suave' },
          { day: 'Domingo', type: 'longRun',   distance: 19, description: '100 min ritmo fácil' },
        ],
      },
      {
        week: 8, focus: 'recovery', sessions: [
          { day: 'Martes',  type: 'easyRun',  distance: 8,  description: '40 min a ritmo fácil' },
          { day: 'Jueves',  type: 'easyRun',  distance: 9,  description: '45 min ritmo suave' },
          { day: 'Sábado',  type: 'easyRun',  distance: 8,  description: '40 min ritmo suave' },
          { day: 'Domingo', type: 'mediumRun',   distance: 14, description: '70 min ritmo fácil' },
        ],
      },
      {
        week: 9, focus: 'racePace', sessions: [
          { day: 'Martes',  type: 'easyRun',  distance: 10, description: '50 min a ritmo fácil' },
          { day: 'Jueves',  type: 'halfMarathonPace',    distance: 14, description: '10 min calentamiento + 30 min a ritmo media maratón + 10 min vuelta calma' },
          { day: 'Sábado',  type: 'easyRun',  distance: 10, description: '50 min ritmo suave' },
          { day: 'Domingo', type: 'longRun',   distance: 18, description: '95 min ritmo fácil' },
        ],
      },
      {
        week: 10, focus: 'peakForm', sessions: [
          { day: 'Martes',  type: 'easyRun',  distance: 10, description: '50 min a ritmo fácil' },
          { day: 'Jueves',  type: 'fartlek',        distance: 13, description: '10 min calentamiento + Fartlek: 3 min rápido / 2 min suave × 6 + 10 min vuelta calma' },
          { day: 'Sábado',  type: 'easyRun',  distance: 10, description: '50 min ritmo suave' },
          { day: 'Domingo', type: 'longRun',   distance: 19, description: '100 min ritmo fácil. el rodaje más largo del plan' },
        ],
      },
      {
        week: 11, focus: 'taper', sessions: [
          { day: 'Martes',  type: 'easyRun',  distance: 8,  description: '40 min a ritmo fácil' },
          { day: 'Jueves',  type: 'shortTempo',    distance: 9,  description: '10 min calentamiento + 15 min a ritmo media maratón + 10 min vuelta calma' },
          { day: 'Sábado',  type: 'easyRun',  distance: 8,  description: '40 min ritmo suave' },
          { day: 'Domingo', type: 'longRun',   distance: 16, description: '85 min ritmo fácil' },
        ],
      },
      {
        week: 12, focus: 'raceWeek', sessions: [
          { day: 'Lunes',   type: 'easyJog',    distance: 5,    description: '25 min muy suave. conserva energía' },
          { day: 'Miércoles', type: 'activation',   distance: 4,    description: '20 min suave + 3 aceleraciones cortas' },
          { day: 'Sábado',  type: 'shortJog',    distance: 3,    description: '15 min muy suave' },
          { day: 'Domingo', type: 'raceHalf', distance: 21.1, description: '¡Tu día! Empieza conservador. los primeros 7 km a ritmo fácil' },
        ],
      },
    ],
  },
  {
    id: 'plan-marathon',
    name: 'Maratón completo',
    goal: '42.2K',
    weeks: 16,
    difficulty: 'Avanzado',
    defaultDaysPerWeek: 4,
    description: 'Para completar tu primer maratón. Base mínima recomendada: 50 km/semana y haber corrido una media maratón.',
    color: '#F56565',
    schedule: [
      {
        week: 1, focus: 'aerobicBase', sessions: [
          { day: 'Lunes', type: 'easyRun', distance: 10, description: '60 min a ritmo conversacional', targetPace: '6:30' },
          { day: 'Miércoles', type: 'mediumRun', distance: 12, description: '70 min ritmo fácil', targetPace: '6:30' },
          { day: 'Viernes', type: 'easyRun', distance: 8, description: '50 min muy suave', targetPace: '6:45' },
          { day: 'Domingo', type: 'marathonLongRun', distance: 18, description: '105 min ritmo fácil. la clave del maratón', targetPace: '6:45' },
        ]
      },
      {
        week: 2, focus: 'consolidateVolume', sessions: [
          { day: 'Lunes', type: 'easyRun', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'tempo', distance: 13, description: '10 min calentamiento + 25 min a ritmo tempo + 10 min vuelta calma', targetPace: '5:10' },
          { day: 'Viernes', type: 'easyRun', distance: 8, description: '50 min muy suave', targetPace: '6:45' },
          { day: 'Domingo', type: 'marathonLongRun', distance: 20, description: '120 min ritmo fácil', targetPace: '6:45' },
        ]
      },
      {
        week: 3, focus: 'firstPeak', sessions: [
          { day: 'Lunes', type: 'easyRun', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'intervals', distance: 12, description: '10 min calentamiento + 5×1000m a ritmo 5K con 90s descanso + 10 min vuelta calma', targetPace: '5:00' },
          { day: 'Viernes', type: 'easyRun', distance: 10, description: '60 min suave', targetPace: '6:30' },
          { day: 'Domingo', type: 'marathonLongRun', distance: 22, description: '130 min ritmo fácil', targetPace: '6:45' },
        ]
      },
      {
        week: 4, focus: 'recovery', sessions: [
          { day: 'Lunes', type: 'easyRun', distance: 8, description: '50 min muy suave', targetPace: '7:00' },
          { day: 'Miércoles', type: 'easyRun', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Viernes', type: 'easyRun', distance: 8, description: '50 min suave', targetPace: '6:45' },
          { day: 'Domingo', type: 'marathonLongRun', distance: 16, description: '95 min ritmo muy fácil. semana de descarga', targetPace: '7:00' },
        ]
      },
      {
        week: 5, focus: 'buildQuality', sessions: [
          { day: 'Lunes', type: 'easyRun', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'tempo', distance: 14, description: '10 min calentamiento + 30 min a ritmo tempo + 10 min vuelta calma', targetPace: '5:05' },
          { day: 'Viernes', type: 'easyRun', distance: 10, description: '60 min suave', targetPace: '6:30' },
          { day: 'Domingo', type: 'marathonLongRun', distance: 24, description: '140 min ritmo fácil', targetPace: '6:40' },
        ]
      },
      {
        week: 6, focus: 'highVolume', sessions: [
          { day: 'Lunes', type: 'easyRun', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'intervals', distance: 14, description: '10 min calentamiento + 6×1000m a ritmo 10K con 90s descanso + 10 min vuelta calma', targetPace: '5:10' },
          { day: 'Viernes', type: 'mediumRun', distance: 12, description: '70 min ritmo fácil', targetPace: '6:30' },
          { day: 'Domingo', type: 'marathonLongRun', distance: 26, description: '155 min. introduce km de maratón al final (últimos 8 km a ritmo objetivo)', targetPace: '6:00' },
        ]
      },
      {
        week: 7, focus: 'activeRecovery', sessions: [
          { day: 'Lunes', type: 'easyRun', distance: 8, description: '50 min muy suave', targetPace: '7:00' },
          { day: 'Miércoles', type: 'easyRun', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Viernes', type: 'easyRun', distance: 8, description: '50 min suave', targetPace: '6:45' },
          { day: 'Domingo', type: 'marathonLongRun', distance: 18, description: '110 min ritmo muy fácil. semana de descarga', targetPace: '7:00' },
        ]
      },
      {
        week: 8, focus: 'volumePeak', sessions: [
          { day: 'Lunes', type: 'easyRun', distance: 12, description: '70 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'longTempo', distance: 16, description: '10 min calentamiento + 40 min tempo + 10 min vuelta calma', targetPace: '5:00' },
          { day: 'Viernes', type: 'easyRun', distance: 10, description: '60 min suave', targetPace: '6:30' },
          { day: 'Domingo', type: 'marathonLongRun', distance: 28, description: '165 min. los últimos 10 km a ritmo maratón objetivo', targetPace: '6:00' },
        ]
      },
      {
        week: 9, focus: 'marathonSpecific', sessions: [
          { day: 'Lunes', type: 'easyRun', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'marathonPace', distance: 16, description: '5 min calentamiento + 25 min a ritmo maratón + 5 min vuelta calma', targetPace: '6:00' },
          { day: 'Viernes', type: 'easyRun', distance: 10, description: '60 min suave', targetPace: '6:30' },
          { day: 'Domingo', type: 'marathonLongRun', distance: 30, description: '175 min. 15 km a ritmo fácil + 15 km a ritmo maratón', targetPace: '6:00' },
        ]
      },
      {
        week: 10, focus: 'unload', sessions: [
          { day: 'Lunes', type: 'easyRun', distance: 8, description: '50 min muy suave', targetPace: '7:00' },
          { day: 'Miércoles', type: 'easyRun', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Viernes', type: 'easyRun', distance: 8, description: '50 min suave', targetPace: '6:45' },
          { day: 'Domingo', type: 'marathonLongRun', distance: 20, description: '120 min ritmo muy fácil. semana de descarga importante', targetPace: '7:00' },
        ]
      },
      {
        week: 11, focus: 'maxLoadWeek', sessions: [
          { day: 'Lunes', type: 'easyRun', distance: 12, description: '70 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'marathonPace', distance: 15, description: '5 min calentamiento + 20 min ritmo maratón + 5 min vuelta calma', targetPace: '6:00' },
          { day: 'Viernes', type: 'easyRun', distance: 10, description: '60 min suave', targetPace: '6:30' },
          { day: 'Domingo', type: 'marathonLongRun', distance: 29, description: '175 min. el rodaje más largo del plan. Los primeros 20 km a ritmo muy fácil', targetPace: '6:10' },
        ]
      },
      {
        week: 12, focus: 'activeRecovery', sessions: [
          { day: 'Lunes', type: 'easyRun', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'easyRun', distance: 12, description: '70 min ritmo fácil. sin trabajo de calidad esta semana', targetPace: '6:30' },
          { day: 'Viernes', type: 'easyRun', distance: 10, description: '60 min suave', targetPace: '6:30' },
          { day: 'Domingo', type: 'marathonLongRun', distance: 22, description: '130 min ritmo fácil. semana de descarga post-pico', targetPace: '6:40' },
        ]
      },
      {
        week: 13, focus: 'taperBegins', sessions: [
          { day: 'Lunes', type: 'easyRun', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'tempo', distance: 12, description: '10 min calentamiento + 20 min tempo + 10 min vuelta calma', targetPace: '5:05' },
          { day: 'Viernes', type: 'easyRun', distance: 8, description: '50 min suave', targetPace: '6:30' },
          { day: 'Domingo', type: 'marathonLongRun', distance: 22, description: '130 min. empieza a bajar el volumen', targetPace: '6:30' },
        ]
      },
      {
        week: 14, focus: 'moderateTaper', sessions: [
          { day: 'Lunes', type: 'easyRun', distance: 8, description: '50 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'marathonPace', distance: 12, description: '5 min calentamiento + 20 min ritmo maratón + 5 min vuelta calma', targetPace: '6:00' },
          { day: 'Viernes', type: 'easyRun', distance: 6, description: '40 min suave', targetPace: '6:30' },
          { day: 'Domingo', type: 'marathonLongRun', distance: 18, description: '105 min ritmo fácil', targetPace: '6:40' },
        ]
      },
      {
        week: 15, focus: 'finalTaper', sessions: [
          { day: 'Martes', type: 'easyRun', distance: 8, description: '50 min ritmo fácil. mantén las piernas activas', targetPace: '6:30' },
          { day: 'Jueves', type: 'activation', distance: 6, description: '30 min suave + 4 strides de 100m al final', targetPace: '6:30' },
          { day: 'Sábado', type: 'shortJog', distance: 5, description: '30 min muy suave', targetPace: '7:00' },
        ]
      },
      {
        week: 16, focus: 'raceWeek', sessions: [
          { day: 'Lunes', type: 'easyJog', distance: 4, description: '25 min muy suave. descansa bien', targetPace: '7:00' },
          { day: 'Miércoles', type: 'activation', distance: 3, description: '20 min suave + 2 aceleraciones de 100m', targetPace: '6:30' },
          { day: 'Viernes', type: 'shortJog', distance: 2, description: '10 min muy suave + 2 aceleraciones de 100m. activa las piernas, nada más', targetPace: '7:00' },
          { day: 'Domingo', type: 'raceMarathon', distance: 42.2, description: '¡Hoy es el gran día! Empieza conservador, confía en tu entrenamiento', targetPace: '6:00' },
        ]
      },
    ],
  }
];
