export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  const response = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      email,
      listIds: [4],
      updateEnabled: true,
    }),
  });

  if (response.ok || response.status === 204) {
    return res.status(200).json({ ok: true });
  }

  const data = await response.json();
  // Contact already exists — treat as success
  if (data.code === 'duplicate_parameter') {
    return res.status(200).json({ ok: true });
  }

  return res.status(500).json({ error: 'Error al suscribir' });
}
