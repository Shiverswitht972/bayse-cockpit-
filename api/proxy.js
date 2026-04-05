export default async function handler(req, res) {
  // Allow requests from your Vercel frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Public-Key, x-auth-token, x-device-id, X-Timestamp, X-Signature');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const path = req.query.path;
  if (!path) {
    res.status(400).json({ error: 'Missing path parameter' });
    return;
  }

  const targetUrl = `https://relay.bayse.markets${path}`;

  // Forward only the headers Bayse needs
  const forwardHeaders = { 'Content-Type': 'application/json' };
  const passThrough = [
    'x-public-key',
    'x-auth-token',
    'x-device-id',
    'x-timestamp',
    'x-signature',
  ];
  for (const h of passThrough) {
    if (req.headers[h]) forwardHeaders[h] = req.headers[h];
  }

  const options = { method: req.method, headers: forwardHeaders };

  if (req.method === 'POST' && req.body) {
    options.body = JSON.stringify(req.body);
  }

  try {
    const upstream = await fetch(targetUrl, options);
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(502).json({ error: 'Proxy error', message: err.message });
  }
}
