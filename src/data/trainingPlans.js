export const TRAINING_PLANS = [
  {
    id: 'plan-5k',
    name: '5K para principiantes',
    goal: '5K',
    weeks: 8,
    difficulty: 'Principiante',
    description: 'Pasa de 0 a completar tu primer 5K en 8 semanas con una mezcla de caminar y correr.',
    color: '#48BB78',
    schedule: [
      {
        week: 1,
        focus: 'Empezar a moverse',
        sessions: [
          { day: 'Lunes', type: 'Carrera/Caminata', distance: 2.5, description: '5 min calentamiento + Alterna 1 min corriendo y 2 min caminando × 8 + 5 min vuelta calma' },
          { day: 'Miércoles', type: 'Carrera/Caminata', distance: 2.5, description: '5 min calentamiento + Alterna 1 min corriendo y 2 min caminando × 8 + 5 min vuelta calma' },
          { day: 'Viernes', type: 'Carrera/Caminata', distance: 3.0, description: '5 min calentamiento + Alterna 1 min corriendo y 2 min caminando × 10 + 5 min vuelta calma' },
        ],
      },
      {
        week: 2,
        focus: 'Aumentar tiempo corriendo',
        sessions: [
          { day: 'Lunes', type: 'Carrera/Caminata', distance: 3.0, description: '5 min calentamiento + Alterna 2 min corriendo y 2 min caminando × 7 + 5 min vuelta calma' },
          { day: 'Miércoles', type: 'Carrera/Caminata', distance: 3.0, description: '5 min calentamiento + Alterna 2 min corriendo y 2 min caminando × 7 + 5 min vuelta calma' },
          { day: 'Viernes', type: 'Carrera/Caminata', distance: 3.5, description: '5 min calentamiento + Alterna 2 min corriendo y 1 min caminando × 8 + 5 min vuelta calma' },
        ],
      },
      {
        week: 3,
        focus: 'Tramos más largos',
        sessions: [
          { day: 'Lunes', type: 'Carrera/Caminata', distance: 3.5, description: '5 min calentamiento + Alterna 3 min corriendo y 2 min caminando × 6 + 5 min vuelta calma' },
          { day: 'Miércoles', type: 'Carrera/Caminata', distance: 3.5, description: '5 min calentamiento + Alterna 3 min corriendo y 2 min caminando × 6 + 5 min vuelta calma' },
          { day: 'Sábado', type: 'Carrera larga', distance: 4.0, description: '5 min calentamiento + Alterna 3 min corriendo y 1 min caminando × 8 + 5 min vuelta calma' },
        ],
      },
      {
        week: 4,
        focus: 'Consolidar base',
        sessions: [
          { day: 'Lunes', type: 'Carrera/Caminata', distance: 4.0, description: '5 min calentamiento + Alterna 5 min corriendo y 2 min caminando × 5 + 5 min vuelta calma' },
          { day: 'Miércoles', type: 'Carrera/Caminata', distance: 4.0, description: '5 min calentamiento + Alterna 5 min corriendo y 2 min caminando × 5 + 5 min vuelta calma' },
          { day: 'Sábado', type: 'Carrera larga', distance: 4.5, description: '5 min calentamiento + Alterna 5 min corriendo y 1 min caminando × 6 + 5 min vuelta calma' },
        ],
      },
      {
        week: 5,
        focus: 'Primer 10 min seguidos',
        sessions: [
          { day: 'Lunes', type: 'Carrera continua', distance: 4.5, description: 'Corre 10 min, camina 2 min, corre 10 min' },
          { day: 'Miércoles', type: 'Carrera continua', distance: 4.5, description: 'Corre 10 min, camina 2 min, corre 10 min' },
          { day: 'Sábado', type: 'Carrera larga', distance: 5.0, description: '5 min calentamiento + 20 min a ritmo suave + 5 min vuelta calma' },
        ],
      },
      {
        week: 6,
        focus: 'Rodajes más largos',
        sessions: [
          { day: 'Lunes', type: 'Carrera continua', distance: 4.5, description: '5 min calentamiento + 20 min a ritmo fácil + 5 min vuelta calma' },
          { day: 'Miércoles', type: 'Carrera continua', distance: 4.5, description: '5 min calentamiento + 20 min a ritmo fácil + 5 min vuelta calma' },
          { day: 'Sábado', type: 'Carrera larga', distance: 5.5, description: '5 min calentamiento + 25 min a ritmo fácil + 5 min vuelta calma' },
        ],
      },
      {
        week: 7,
        focus: 'Casi en la meta',
        sessions: [
          { day: 'Lunes', type: 'Carrera continua', distance: 5.0, description: '5 min calentamiento + 25 min a ritmo fácil + 5 min vuelta calma' },
          { day: 'Miércoles', type: 'Carrera corta', distance: 3.0, description: 'Trote suave 15 min de recuperación' },
          { day: 'Sábado', type: 'Carrera larga', distance: 5.5, description: '5 min calentamiento + 28 min a ritmo fácil + 5 min vuelta calma' },
        ],
      },
      {
        week: 8,
        focus: 'Semana de carrera',
        sessions: [
          { day: 'Lunes', type: 'Carrera corta', distance: 3.0, description: 'Trote suave 15 min, mantén energía' },
          { day: 'Miércoles', type: 'Carrera corta', distance: 2.5, description: 'Trote muy suave 10 min' },
          { day: 'Sábado', type: '¡CARRERA 5K!', distance: 5.0, description: '¡Tu primer 5K! Disfruta cada metro' },
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
    description: 'Prepárate para completar un 10K con calidad. Requiere poder correr 30 min continuos.',
    color: '#4299E1',
    schedule: [
      {
        week: 1, focus: 'Semana base', sessions: [
          { day: 'Martes', type: 'Rodaje fácil', distance: 5, description: '30 min a ritmo conversacional' },
          { day: 'Jueves', type: 'Rodaje con cambios', distance: 6, description: '5 min calentamiento + 4×5 min a ritmo 10K + 5 min vuelta calma' },
          { day: 'Sábado', type: 'Rodaje largo', distance: 7, description: '45 min ritmo fácil' },
        ]
      },
      {
        week: 2, focus: 'Volumen moderado', sessions: [
          { day: 'Martes', type: 'Rodaje fácil', distance: 5, description: '30 min a ritmo conversacional' },
          { day: 'Jueves', type: 'Tempo', distance: 7, description: '10 min calentamiento + 20 min a ritmo tempo + 10 min vuelta calma' },
          { day: 'Domingo', type: 'Rodaje largo', distance: 8, description: '50 min ritmo fácil' },
        ]
      },
      {
        week: 3, focus: 'Intensidad', sessions: [
          { day: 'Martes', type: 'Intervals', distance: 6, description: '5×800m a ritmo 5K con 90s descanso' },
          { day: 'Jueves', type: 'Rodaje fácil', distance: 6, description: '35 min ritmo suave' },
          { day: 'Domingo', type: 'Rodaje largo', distance: 9, description: '55 min ritmo fácil' },
        ]
      },
      {
        week: 4, focus: 'Recuperación activa', sessions: [
          { day: 'Martes', type: 'Rodaje fácil', distance: 4, description: '25 min muy suave' },
          { day: 'Jueves', type: 'Rodaje fácil', distance: 5, description: '30 min ritmo fácil' },
          { day: 'Domingo', type: 'Rodaje medio', distance: 7, description: '45 min ritmo fácil' },
        ]
      },
      {
        week: 5, focus: 'Carga alta', sessions: [
          { day: 'Martes', type: 'Intervals', distance: 7, description: '6×800m a ritmo 5K con 90s descanso' },
          { day: 'Jueves', type: 'Tempo', distance: 8, description: '10 min calentamiento + 25 min tempo + 10 min vuelta calma' },
          { day: 'Domingo', type: 'Rodaje largo', distance: 10, description: '60 min ritmo fácil' },
        ]
      },
      {
        week: 6, focus: 'Simular carrera', sessions: [
          { day: 'Martes', type: 'Fartlek', distance: 7, description: 'Juega con el ritmo 5 min rápido / 3 min suave × 4' },
          { day: 'Jueves', type: 'Rodaje fácil', distance: 6, description: '35 min ritmo fácil' },
          { day: 'Domingo', type: 'Rodaje largo', distance: 11, description: '65 min ritmo fácil' },
        ]
      },
      {
        week: 7, focus: 'Mantener forma', sessions: [
          { day: 'Martes', type: 'Intervals', distance: 7, description: '5×1000m a ritmo objetivo 10K' },
          { day: 'Jueves', type: 'Rodaje fácil', distance: 6, description: '35 min suave' },
          { day: 'Domingo', type: 'Rodaje largo', distance: 11, description: '65 min ritmo fácil' },
        ]
      },
      {
        week: 8, focus: 'Taper inicio', sessions: [
          { day: 'Martes', type: 'Rodaje fácil', distance: 5, description: '30 min ritmo fácil' },
          { day: 'Jueves', type: 'Tempo corto', distance: 6, description: '10 min calentamiento + 15 min tempo + 10 min vuelta calma' },
          { day: 'Domingo', type: 'Rodaje medio', distance: 8, description: '50 min ritmo fácil' },
        ]
      },
      {
        week: 9, focus: 'Taper final', sessions: [
          { day: 'Martes', type: 'Rodaje fácil', distance: 5, description: '30 min muy suave' },
          { day: 'Jueves', type: 'Activación', distance: 4, description: '20 min suave + 4 strides al final' },
          { day: 'Sábado', type: 'Trote corto', distance: 3, description: '15 min muy suave' },
        ]
      },
      {
        week: 10, focus: 'Semana de carrera', sessions: [
          { day: 'Lunes', type: 'Trote suave', distance: 3, description: '15 min muy suave' },
          { day: 'Miércoles', type: 'Activación', distance: 2, description: '10 min suave + 2 aceleraciones cortas' },
          { day: 'Domingo', type: '¡CARRERA 10K!', distance: 10, description: '¡Es tu día! Ejecuta el plan y disfruta' },
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
    description: 'Plan de 12 semanas para completar tu primera media maratón. Base mínima: 40 km/semana.',
    color: '#9F7AEA',
    schedule: Array.from({ length: 12 }, (_, i) => ({
      week: i + 1,
      focus: i < 3 ? 'Construir base' : i < 6 ? 'Volumen' : i < 9 ? 'Calidad' : 'Taper',
      sessions: [
        { day: 'Martes', type: 'Rodaje fácil', distance: 8 + i * 0.5, description: `${40 + i * 3} min a ritmo conversacional` },
        { day: 'Jueves', type: 'Entrenamiento de calidad', distance: 10 + i * 0.5, description: 'Intervals o tempo según semana' },
        { day: 'Sábado', type: 'Rodaje fácil', distance: 7 + i * 0.3, description: '40 min ritmo suave' },
        { day: 'Domingo', type: 'Rodaje largo', distance: 12 + i * 1.2, description: `${60 + i * 5} min ritmo fácil` },
      ],
    })),
  },
  {
    id: 'plan-marathon',
    name: 'Maratón completo',
    goal: '42.2K',
    weeks: 16,
    difficulty: 'Avanzado',
    description: 'Plan de 16 semanas para completar tu primer maratón. Base mínima recomendada: 50 km/semana y haber corrido una media maratón.',
    color: '#F56565',
    schedule: [
      {
        week: 1, focus: 'Base aeróbica', sessions: [
          { day: 'Lunes', type: 'Rodaje fácil', distance: 10, description: '60 min a ritmo conversacional', targetPace: '6:30' },
          { day: 'Miércoles', type: 'Rodaje medio', distance: 12, description: '70 min ritmo fácil', targetPace: '6:30' },
          { day: 'Viernes', type: 'Rodaje fácil', distance: 8, description: '50 min muy suave', targetPace: '6:45' },
          { day: 'Domingo', type: 'Tirada larga', distance: 18, description: '105 min ritmo fácil — la clave del maratón', targetPace: '6:45' },
        ]
      },
      {
        week: 2, focus: 'Consolidar volumen', sessions: [
          { day: 'Lunes', type: 'Rodaje fácil', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'Tempo', distance: 13, description: '10 min calentamiento + 25 min a ritmo tempo + 10 min vuelta calma', targetPace: '5:10' },
          { day: 'Viernes', type: 'Rodaje fácil', distance: 8, description: '50 min muy suave', targetPace: '6:45' },
          { day: 'Domingo', type: 'Tirada larga', distance: 20, description: '120 min ritmo fácil', targetPace: '6:45' },
        ]
      },
      {
        week: 3, focus: 'Primer pico', sessions: [
          { day: 'Lunes', type: 'Rodaje fácil', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'Intervals', distance: 12, description: '5×1000m a ritmo 5K con 90s descanso', targetPace: '5:00' },
          { day: 'Viernes', type: 'Rodaje fácil', distance: 10, description: '60 min suave', targetPace: '6:30' },
          { day: 'Domingo', type: 'Tirada larga', distance: 22, description: '130 min ritmo fácil', targetPace: '6:45' },
        ]
      },
      {
        week: 4, focus: 'Recuperación', sessions: [
          { day: 'Lunes', type: 'Rodaje fácil', distance: 8, description: '50 min muy suave', targetPace: '7:00' },
          { day: 'Miércoles', type: 'Rodaje fácil', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Viernes', type: 'Rodaje fácil', distance: 8, description: '50 min suave', targetPace: '6:45' },
          { day: 'Domingo', type: 'Tirada larga', distance: 16, description: '95 min ritmo muy fácil — semana de descarga', targetPace: '7:00' },
        ]
      },
      {
        week: 5, focus: 'Construir calidad', sessions: [
          { day: 'Lunes', type: 'Rodaje fácil', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'Tempo', distance: 14, description: '10 min calentamiento + 30 min a ritmo tempo + 10 min vuelta calma', targetPace: '5:05' },
          { day: 'Viernes', type: 'Rodaje fácil', distance: 10, description: '60 min suave', targetPace: '6:30' },
          { day: 'Domingo', type: 'Tirada larga', distance: 24, description: '140 min ritmo fácil', targetPace: '6:40' },
        ]
      },
      {
        week: 6, focus: 'Volumen alto', sessions: [
          { day: 'Lunes', type: 'Rodaje fácil', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'Intervals', distance: 14, description: '6×1000m a ritmo 10K con 90s descanso', targetPace: '5:10' },
          { day: 'Viernes', type: 'Rodaje medio', distance: 12, description: '70 min ritmo fácil', targetPace: '6:30' },
          { day: 'Domingo', type: 'Tirada larga', distance: 26, description: '155 min — introduce km de maratón al final (últimos 8 km a ritmo objetivo)', targetPace: '6:00' },
        ]
      },
      {
        week: 7, focus: 'Recuperación activa', sessions: [
          { day: 'Lunes', type: 'Rodaje fácil', distance: 8, description: '50 min muy suave', targetPace: '7:00' },
          { day: 'Miércoles', type: 'Rodaje fácil', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Viernes', type: 'Rodaje fácil', distance: 8, description: '50 min suave', targetPace: '6:45' },
          { day: 'Domingo', type: 'Tirada larga', distance: 18, description: '110 min ritmo muy fácil — semana de descarga', targetPace: '7:00' },
        ]
      },
      {
        week: 8, focus: 'Pico de volumen', sessions: [
          { day: 'Lunes', type: 'Rodaje fácil', distance: 12, description: '70 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'Tempo largo', distance: 16, description: '10 min calentamiento + 40 min tempo + 10 min vuelta calma', targetPace: '5:00' },
          { day: 'Viernes', type: 'Rodaje fácil', distance: 10, description: '60 min suave', targetPace: '6:30' },
          { day: 'Domingo', type: 'Tirada larga', distance: 28, description: '165 min — los últimos 10 km a ritmo maratón objetivo', targetPace: '6:00' },
        ]
      },
      {
        week: 9, focus: 'Específico maratón', sessions: [
          { day: 'Lunes', type: 'Rodaje fácil', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'Ritmo maratón', distance: 16, description: '5 min calentamiento + 25 min a ritmo maratón + 5 min vuelta calma', targetPace: '6:00' },
          { day: 'Viernes', type: 'Rodaje fácil', distance: 10, description: '60 min suave', targetPace: '6:30' },
          { day: 'Domingo', type: 'Tirada larga', distance: 30, description: '175 min — 15 km a ritmo fácil + 15 km a ritmo maratón', targetPace: '6:00' },
        ]
      },
      {
        week: 10, focus: 'Descarga', sessions: [
          { day: 'Lunes', type: 'Rodaje fácil', distance: 8, description: '50 min muy suave', targetPace: '7:00' },
          { day: 'Miércoles', type: 'Rodaje fácil', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Viernes', type: 'Rodaje fácil', distance: 8, description: '50 min suave', targetPace: '6:45' },
          { day: 'Domingo', type: 'Tirada larga', distance: 20, description: '120 min ritmo muy fácil — semana de descarga importante', targetPace: '7:00' },
        ]
      },
      {
        week: 11, focus: 'Semana de carga máxima', sessions: [
          { day: 'Lunes', type: 'Rodaje fácil', distance: 12, description: '70 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'Ritmo maratón', distance: 18, description: '5 min calentamiento + 35 min ritmo maratón + 5 min vuelta calma', targetPace: '6:00' },
          { day: 'Viernes', type: 'Rodaje fácil', distance: 10, description: '60 min suave', targetPace: '6:30' },
          { day: 'Domingo', type: 'Tirada larga', distance: 32, description: '190 min — el rodaje más largo del plan. Gestiona bien el ritmo', targetPace: '6:10' },
        ]
      },
      {
        week: 12, focus: 'Mantener forma', sessions: [
          { day: 'Lunes', type: 'Rodaje fácil', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'Intervals', distance: 13, description: '5×1000m a ritmo 10K con 90s descanso', targetPace: '5:10' },
          { day: 'Viernes', type: 'Rodaje fácil', distance: 10, description: '60 min suave', targetPace: '6:30' },
          { day: 'Domingo', type: 'Tirada larga', distance: 26, description: '155 min ritmo fácil + 8 km a ritmo maratón', targetPace: '6:00' },
        ]
      },
      {
        week: 13, focus: 'Inicio del taper', sessions: [
          { day: 'Lunes', type: 'Rodaje fácil', distance: 10, description: '60 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'Tempo', distance: 12, description: '10 min calentamiento + 20 min tempo + 10 min vuelta calma', targetPace: '5:05' },
          { day: 'Viernes', type: 'Rodaje fácil', distance: 8, description: '50 min suave', targetPace: '6:30' },
          { day: 'Domingo', type: 'Tirada larga', distance: 22, description: '130 min — empieza a bajar el volumen', targetPace: '6:30' },
        ]
      },
      {
        week: 14, focus: 'Taper moderado', sessions: [
          { day: 'Lunes', type: 'Rodaje fácil', distance: 8, description: '50 min ritmo fácil', targetPace: '6:30' },
          { day: 'Miércoles', type: 'Ritmo maratón', distance: 12, description: '5 min calentamiento + 20 min ritmo maratón + 5 min vuelta calma', targetPace: '6:00' },
          { day: 'Viernes', type: 'Rodaje fácil', distance: 6, description: '40 min suave', targetPace: '6:30' },
          { day: 'Domingo', type: 'Tirada larga', distance: 18, description: '105 min ritmo fácil', targetPace: '6:40' },
        ]
      },
      {
        week: 15, focus: 'Taper final', sessions: [
          { day: 'Martes', type: 'Rodaje fácil', distance: 8, description: '50 min ritmo fácil — mantén las piernas activas', targetPace: '6:30' },
          { day: 'Jueves', type: 'Activación', distance: 6, description: '30 min suave + 4 strides de 100m al final', targetPace: '6:30' },
          { day: 'Sábado', type: 'Trote corto', distance: 5, description: '30 min muy suave', targetPace: '7:00' },
        ]
      },
      {
        week: 16, focus: '¡Semana de carrera!', sessions: [
          { day: 'Lunes', type: 'Trote suave', distance: 4, description: '25 min muy suave — descansa bien', targetPace: '7:00' },
          { day: 'Miércoles', type: 'Activación', distance: 3, description: '20 min suave + 2 aceleraciones de 100m', targetPace: '6:30' },
          { day: 'Domingo', type: '¡MARATÓN 42.2K!', distance: 42.2, description: '¡Hoy es el gran día! Empieza conservador, confía en tu entrenamiento', targetPace: '6:00' },
        ]
      },
    ],
  }
];
