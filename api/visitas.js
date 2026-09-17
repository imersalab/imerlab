const BASE_URL = 'https://api.counterapi.dev/v2';

function envConfig() {
  return {
    workspace: process.env.COUNTERAPI_WORKSPACE,
    token: process.env.COUNTERAPI_TOKEN,
  };
}

function safeCounterName(name) {
  return String(name || '').toLowerCase().replace(/[^a-z0-9-_]/g, '-').slice(0, 80);
}

function extractValue(payload) {
  if (payload == null) return 0;
  if (typeof payload === 'number') return payload;
  if (typeof payload === 'string' && /^\d+$/.test(payload)) return Number(payload);

  const direct = [payload.value, payload.count, payload.total, payload.current];
  for (const candidate of direct) {
    const number = Number(candidate);
    if (Number.isFinite(number)) return number;
  }

  if (payload.data) {
    const nested = extractValue(payload.data);
    if (Number.isFinite(nested)) return nested;
  }

  if (payload.counter) {
    const nested = extractValue(payload.counter);
    if (Number.isFinite(nested)) return nested;
  }

  return 0;
}

async function counterRequest(counterName, operation = '') {
  const { workspace, token } = envConfig();
  if (!workspace || !token) {
    const error = new Error('COUNTER_CONFIG_REQUIRED');
    error.code = 'COUNTER_CONFIG_REQUIRED';
    throw error;
  }

  const name = safeCounterName(counterName);
  const suffix = operation ? `/${operation}` : '';
  const url = `${BASE_URL}/${encodeURIComponent(workspace)}/${encodeURIComponent(name)}${suffix}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (response.status === 404 && !operation) {
    return { value: 0, raw: null };
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (_) {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || payload?.error || `CounterAPI respondeu ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return { value: extractValue(payload), raw: payload };
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return sendJson(res, 405, { ok: false, error: 'Método não permitido.' });
  }

  try {
    if (req.method === 'GET') {
      const [visitas, unicos, paginas] = await Promise.all([
        counterRequest('visitas-totais'),
        counterRequest('visitantes-unicos'),
        counterRequest('paginas-visualizadas'),
      ]);

      return sendJson(res, 200, {
        ok: true,
        visitas: visitas.value,
        visitantesUnicos: unicos.value,
        paginasVisualizadas: paginas.value,
        atualizadoEm: new Date().toISOString(),
      });
    }

    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const novaVisita = Boolean(body.novaVisita);
    const novoVisitante = Boolean(body.novoVisitante);

    const operations = [counterRequest('paginas-visualizadas', 'up')];
    if (novaVisita) operations.push(counterRequest('visitas-totais', 'up'));
    if (novoVisitante) operations.push(counterRequest('visitantes-unicos', 'up'));

    await Promise.all(operations);

    const [visitas, unicos, paginas] = await Promise.all([
      counterRequest('visitas-totais'),
      counterRequest('visitantes-unicos'),
      counterRequest('paginas-visualizadas'),
    ]);

    return sendJson(res, 200, {
      ok: true,
      visitas: visitas.value,
      visitantesUnicos: unicos.value,
      paginasVisualizadas: paginas.value,
    });
  } catch (error) {
    if (error.code === 'COUNTER_CONFIG_REQUIRED') {
      return sendJson(res, 503, {
        ok: false,
        setupRequired: true,
        error: 'Configure COUNTERAPI_WORKSPACE e COUNTERAPI_TOKEN na Vercel para ativar o contador.',
      });
    }

    console.error('Erro no contador de visitas:', error);
    return sendJson(res, 500, {
      ok: false,
      error: 'Não foi possível registrar ou consultar as visitas agora.',
    });
  }
};
