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

  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });
  } catch (networkError) {
    const error = new Error('Não foi possível conectar ao CounterAPI.');
    error.code = 'COUNTER_NETWORK_ERROR';
    error.cause = networkError;
    throw error;
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch (_) {
    payload = null;
  }

  // Um contador ainda inexistente pode ser tratado como zero em consultas.
  if (response.status === 404 && !operation) {
    return { value: 0, raw: payload };
  }

  if (!response.ok) {
    const message = payload?.message || payload?.error || `CounterAPI respondeu com status ${response.status}`;
    const error = new Error(message);
    error.code = 'COUNTER_UPSTREAM_ERROR';
    error.status = response.status;
    error.upstreamMessage = message;
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

  const { workspace, token } = envConfig();

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
        code: 'COUNTER_CONFIG_REQUIRED',
        error: 'O contador ainda não foi configurado na Vercel.',
        detail: 'Crie COUNTERAPI_WORKSPACE e COUNTERAPI_TOKEN em Settings → Environment Variables e faça um novo deploy.',
        config: {
          workspaceConfigured: Boolean(workspace),
          tokenConfigured: Boolean(token),
        },
      });
    }

    if (error.code === 'COUNTER_NETWORK_ERROR') {
      console.error('Erro de rede ao acessar CounterAPI:', error.cause || error);
      return sendJson(res, 502, {
        ok: false,
        code: 'COUNTER_NETWORK_ERROR',
        error: 'A função da Vercel está ativa, mas não conseguiu se conectar ao CounterAPI.',
        detail: 'Tente novamente em alguns instantes e verifique os logs da função na Vercel.',
      });
    }

    if (error.code === 'COUNTER_UPSTREAM_ERROR') {
      console.error('Erro do CounterAPI:', error.status, error.upstreamMessage);
      let detail = error.upstreamMessage || 'Falha ao consultar o serviço de contagem.';
      if (error.status === 401 || error.status === 403) {
        detail = 'O token do CounterAPI foi recusado. Gere uma API key válida e atualize COUNTERAPI_TOKEN na Vercel.';
      } else if (error.status === 404) {
        detail = 'O workspace ou contador não foi encontrado. Confira o valor de COUNTERAPI_WORKSPACE.';
      } else if (error.status === 429) {
        detail = 'O limite de requisições do CounterAPI foi atingido temporariamente.';
      }
      return sendJson(res, 502, {
        ok: false,
        code: 'COUNTER_UPSTREAM_ERROR',
        counterApiStatus: error.status || null,
        error: 'A API de contagem respondeu com erro.',
        detail,
      });
    }

    console.error('Erro inesperado no contador de visitas:', error);
    return sendJson(res, 500, {
      ok: false,
      code: 'COUNTER_UNKNOWN_ERROR',
      error: 'Erro inesperado ao registrar ou consultar as visitas.',
      detail: 'Abra os logs da função /api/visitas na Vercel para ver o erro completo.',
    });
  }
};
