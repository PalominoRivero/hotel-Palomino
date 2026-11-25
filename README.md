# Hotel Palomino — sitio web

Sitio web responsive en español para presentar Hotel Palomino, sus categorías de habitación y amenidades, recibir solicitudes de reserva por WhatsApp y ofrecer un concierge digital.

## Estado de esta primera versión

- Landing page responsive con identidad visual inspirada en el Caribe y la herencia afrocolombiana.
- Secciones de hotel, habitaciones NK1/NQQ/Suite, amenidades, cultura y reservas.
- Formulario que prepara la solicitud de reserva para WhatsApp.
- Chatbot con endpoint de IA opcional en `/api/concierge`; si no se configura, muestra respuestas informativas locales.
- No hay motor de reservas ni inventario en tiempo real conectado todavía. El equipo del hotel debe confirmar toda reserva.

## Configuración obligatoria antes de publicar

### 1. WhatsApp del hotel

En `index.html`, busca:

```js
const HOTEL_WHATSAPP = "HOTEL_WHATSAPP";
```

Reemplázalo por el número oficial en formato internacional, solo dígitos y sin `+`, espacios ni guiones. Ejemplo ficticio: `573001234567`.

### 2. Concierge con IA 24/7

La función `api/concierge.js` está preparada para Vercel y usa la API de OpenAI. Despliega este repositorio en Vercel y configura estas variables en Project Settings → Environment Variables:

- `OPENAI_API_KEY`: clave privada de API de OpenAI. Nunca la pongas en el HTML ni en el repositorio.
- `OPENAI_MODEL` (opcional): modelo disponible en tu cuenta; por defecto `gpt-4.1-mini`.
- `HOTEL_KNOWLEDGE_BASE` (opcional): información oficial y actualizada del hotel para que el concierge responda con precisión.

El endpoint es un punto de partida funcional, pero antes de producción se recomienda añadir limitación de solicitudes, monitoreo y pruebas. El uso de la API puede generar costos.

### 3. Publicación

Para que funcione el endpoint de IA, usa Vercel (no GitHub Pages como hosting estático). Importa el repositorio, despliega y configura las variables anteriores.

## Información que debe entregar el hotel para completar el contenido

1. Dirección exacta, teléfono y WhatsApp oficial.
2. Repartición de las 100 habitaciones entre NK1, NQQ y Suite.
3. Capacidad, camas, metraje, fotos y amenidades de cada categoría.
4. Tarifas, impuestos, políticas de cancelación, check-in/check-out y temporadas.
5. Lista definitiva de amenidades y horarios.
6. Servicios accesibles, parqueadero, restaurante, piscina, Wi-Fi y experiencias culturales (confirmar solo los que existan).
7. Idiomas de atención y preguntas frecuentes.

## Reserva

El formulario abre WhatsApp con una solicitud. No confirma disponibilidad ni bloquea habitaciones. Para reservas automáticas se debe integrar posteriormente un PMS o motor de reservas que sea la fuente oficial del inventario.
