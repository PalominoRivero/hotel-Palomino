// Vercel Serverless Function: POST /api/concierge
// Configure OPENAI_API_KEY in Vercel Project Settings > Environment Variables.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const message = typeof req.body?.message === "string" ? req.body.message.trim().slice(0, 1200) : "";
  if (!message) return res.status(400).json({ error: "Escribe un mensaje." });
  if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "Concierge IA no configurado" });

  const hotelFacts = process.env.HOTEL_KNOWLEDGE_BASE || [
    "Hotel Palomino, hotel con identidad y temática afrocolombiana.",
    "Inventario total informado: 100 habitaciones.",
    "Categorías de habitación: NK1, NQQ y Suite.",
    "Reservas y solicitudes se canalizan por WhatsApp; el personal debe confirmar disponibilidad y tarifa.",
    "No se han proporcionado todavía tarifas, capacidades por categoría, distribución de habitaciones, dirección ni listado definitivo de amenidades."
  ].join("\n");

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: `Eres el concierge digital 24/7 de Hotel Palomino. Responde siempre en español, con tono amable, claro y breve. Ayuda con habitaciones, amenidades, experiencias culturales y orientación para reservar. La identidad del hotel celebra la cultura afrocolombiana con respeto y sin estereotipos. Usa únicamente estos datos confirmados: ${hotelFacts}. Nunca inventes precios, disponibilidad, servicios, horarios, dirección, políticas ni confirmaciones de reserva. Si falta un dato, dilo claramente y ofrece que el huésped lo confirme con el equipo por WhatsApp. No afirmes que una reserva está hecha: solo el personal puede confirmarla. No solicites datos de tarjetas ni información sensible.`,
        input: message,
        max_output_tokens: 260
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("OpenAI API error", data);
      return res.status(502).json({ error: "No fue posible consultar el concierge." });
    }
    const reply = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n")
      .trim();
    return res.status(200).json({ reply: reply || "No pude generar una respuesta. Intenta de nuevo o contacta al equipo del hotel." });
  } catch (error) {
    console.error("Concierge error", error);
    return res.status(500).json({ error: "Error interno del concierge." });
  }
}
