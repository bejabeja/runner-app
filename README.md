Actúa como un desarrollador experto en frontend y creador de producto especializado en UX simple. Quiero que esta aplicacion pueda ayudarme a empezar a correr desde cero con el objetivo de completar un 5K.

Soy un principiante absoluto que se abruma con las apps de running actuales. Necesito un diseño extremadamente limpio, minimalista y visual.

Requisitos clave de la aplicación:

1. Pantalla de Planificación Semanal:
- Al abrir la app, debo ver una vista general de las semanas del plan (por ejemplo, Plan de 8 semanas).
- Debo poder hacer clic en cada semana para ver los días de entrenamiento y saber exactamente qué me espera.

2. El Entrenamiento del Día (Pantalla de Temporizador):
- Cuando elija el día actual, debe aparecer un temporizador grande con un botón de "Iniciar".
- La app debe guiarme paso a paso por los intervalos del entrenamiento. Por ejemplo: 5 min calentamiento -> [1 min correr / 2 min andar] x 6 veces -> 5 min enfriamiento.
- Debe mostrar claramente en pantalla qué fase estoy haciendo (EJ: "Corriendo (Intervalo 2/6)" o "Caminando") y el tiempo restante de esa fase.

3. Alertas por Voz y Sonido (Crucial):
- Cuando cambie de fase (de caminar a correr, de correr a caminar, al empezar o al terminar), la app debe usar la API de síntesis de voz del navegador (Web Speech API) para decir en voz alta palabras clave simples en inglés: "Start", "Run", "Walk", "Finish".
- Si es posible, añade una vibración corta (Vibration API) o un pitido de audio sutil cuando cambie el intervalo para asegurar que me entere aunque lleve el móvil en el bolsillo.

4. Estética y Usabilidad:
- Diseño moderno, limpio, con modo oscuro automático o tonos suaves que no cansen la vista.
- Botones grandes y fáciles de pulsar mientras se camina o corre.



hay refactors posibles para que el codigo sea escalable y mantenible a largo plazo y que cumlpa con solid principles y clean code?
