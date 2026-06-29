---
name: feedback-design-hero-card
description: Design decisions for the home screen hero card and color usage
metadata:
  type: feedback
---

Reservar el color primario (naranja #FF5C00) solo para elementos de acción puntual, botón CTA, etiquetas de estado, acentos, nunca como fondo de card completo.

**Why:** Una card entera naranja se ve como "app de supermercado". El botón pierde impacto cuando compite con toda la card del mismo color. El usuario lo confirmó al ver la versión oscura con botón naranja: "mucho mejor".

**How to apply:** Cards de contenido → `surfaceElevated` (#191C2B) con borde `colors.border` y sombra naranja muy suave (opacity 0.12). El naranja va solo en: botones CTA primarios, etiquetas de estado (uppercase tiny text), y barras de progreso.
