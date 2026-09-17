// ======================================================
// IMERSALAB - API DE CONTROLE DE ACESSOS
// Arquivo: api/visitas.js
// ======================================================

const BASE_URL = 'https://api.counterapi.dev/v2';

// ------------------------------------------------------
// Lê as variáveis cadastradas na Vercel
// ------------------------------------------------------
function getConfig() {
  return {
    workspace: process.env.COUNTERAPI_WORKSPACE,
    token: process.env.COUNTERAPI_TOKEN
  };
}

// ------------------------------------------------------
// Evita caracteres inválidos no nome dos contadores
// ------------------------------------------------------
function safeCounterName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .slice(0, 80);
}

// ------------------------------------------------------
// Tenta localizar o valor retornado pelo CounterAPI
// ------------------------------------------------------
function extractValue(payload) {

  if (payload === null || payload === undefined) {
    return 0;
  }

  if (typeof payload === 'number') {
    return payload;
  }

  if (
    typeof payload === 'string' &&
    /^\d+$/.test(payload)
  ) {
    return Number(payload);
  }

  if (typeof payload === 'object') {

    const possibleValues = [
      payload.value,
      payload.count,
      payload.total,
      payload.current
    ];

    for (const item of possibleValues) {

      const number = Number(item);

      if (Number.isFinite(number)) {
        return number;
      }

    }

    if (payload.data) {

      const value = extractValue(payload.data);

      if (Number.isFinite(value)) {
        return value;
      }

    }

    if (payload.counter) {

      const value = extractValue(payload.counter);

      if (Number.isFinite(value)) {
        return value;
      }

    }

  }

  return 0;
}

// ------------------------------------------------------
// Comunicação com CounterAPI
//
// operação vazia = consulta
// operação "up" = incrementa contador
// ------------------------------------------------------
async function counterRequest(counterName, operation = '') {

  const {
    workspace,
    token
  } = getConfig();

  // Verifica configuração da Vercel
  if (!workspace || !token) {

    const error =
      new Error('COUNTER_CONFIG_REQUIRED');

    error.code =
      'COUNTER_CONFIG_REQUIRED';

    throw error;
  }

  const counter =
    safeCounterName(counterName);

  const suffix =
    operation ? `/${operation}` : '';

  const url =
    `${BASE_URL}/` +
    `${encodeURIComponent(workspace)}/` +
    `${encodeURIComponent(counter)}` +
    `${suffix}`;

  console.log(
    '[ImersaLab] CounterAPI:',
    operation || 'consultar',
    counter
  );

  let response;

  try {

    response = await fetch(url, {

      method: 'GET',

      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      },

      cache: 'no-store'

    });

  } catch (networkError) {

    const error =
      new Error(
        'Não foi possível conectar ao CounterAPI.'
      );

    error.code =
      'COUNTER_NETWORK_ERROR';

    error.cause =
      networkError;

    throw error;
  }

  let payload = null;

  try {

    payload =
      await response.json();

  } catch {

    payload = null;

  }

  // ----------------------------------------------
  // Consulta de contador ainda inexistente
  // ----------------------------------------------

  if (
    response.status === 404 &&
    !operation
  ) {

    return {
      value: 0,
      raw: payload
    };

  }

  // ----------------------------------------------
  // Erro retornado pelo CounterAPI
  // ----------------------------------------------

  if (!response.ok) {

    const message =
      payload?.message ||
      payload?.error ||
      `CounterAPI respondeu com status ${response.status}`;

    const error =
      new Error(message);

    error.code =
      'COUNTER_UPSTREAM_ERROR';

    error.status =
      response.status;

    error.upstreamMessage =
      message;

    throw error;
  }

  return {

    value:
      extractValue(payload),

    raw:
      payload

  };
}

// ------------------------------------------------------
// Envia resposta JSON
// ------------------------------------------------------
function sendJson(res, status, body) {

  res.statusCode = status;

  res.setHeader(
    'Content-Type',
    'application/json; charset=utf-8'
  );

  res.setHeader(
    'Cache-Control',
    'no-store, max-age=0'
  );

  res.end(
    JSON.stringify(body)
  );
}

// ------------------------------------------------------
// Converte o body recebido
// ------------------------------------------------------
function parseBody(req) {

  if (!req.body) {
    return {};
  }

  if (typeof req.body === 'object') {
    return req.body;
  }

  if (typeof req.body === 'string') {

    try {

      return JSON.parse(req.body);

    } catch {

      return {};

    }

  }

  return {};
}

// ======================================================
// FUNÇÃO PRINCIPAL DA VERCEL
// ======================================================

module.exports = async function handler(req, res) {

  // ----------------------------------------------------
  // Aceita somente GET e POST
  // ----------------------------------------------------

  if (
    req.method !== 'GET' &&
    req.method !== 'POST'
  ) {

    res.setHeader(
      'Allow',
      'GET, POST'
    );

    return sendJson(
      res,
      405,
      {
        ok: false,
        error: 'Método não permitido.'
      }
    );

  }

  const {
    workspace,
    token
  } = getConfig();

  try {

    // ==================================================
    // GET
    //
    // Consulta estatísticas
    // ==================================================

    if (req.method === 'GET') {

      const [
        visitas,
        visitantes,
        paginas
      ] = await Promise.all([

        counterRequest(
          'visitas-totais'
        ),

        counterRequest(
          'visitantes-unicos'
        ),

        counterRequest(
          'paginas-visualizadas'
        )

      ]);

      return sendJson(
        res,
        200,
        {

          ok: true,

          visitas:
            visitas.value,

          visitantesUnicos:
            visitantes.value,

          paginasVisualizadas:
            paginas.value,

          atualizadoEm:
            new Date().toISOString()

        }
      );
    }

    // ==================================================
    // POST
    //
    // Registra acesso
    // ==================================================

    const body =
      parseBody(req);

    const novaVisita =
      Boolean(body.novaVisita);

    const novoVisitante =
      Boolean(body.novoVisitante);

    const pagina =
      String(
        body.pagina || '/'
      );

    console.log(
      '[ImersaLab] Página:',
      pagina
    );

    console.log(
      '[ImersaLab] Nova visita:',
      novaVisita
    );

    console.log(
      '[ImersaLab] Novo visitante:',
      novoVisitante
    );

    // Toda página carregada conta como visualização
    const operations = [

      counterRequest(
        'paginas-visualizadas',
        'up'
      )

    ];

    // Nova visita depois de 30 minutos
    if (novaVisita) {

      operations.push(

        counterRequest(
          'visitas-totais',
          'up'
        )

      );

    }

    // Primeiro acesso deste navegador
    if (novoVisitante) {

      operations.push(

        counterRequest(
          'visitantes-unicos',
          'up'
        )

      );

    }

    await Promise.all(
      operations
    );

    // --------------------------------------------------
    // Busca números atualizados
    // --------------------------------------------------

    const [
      visitas,
      visitantes,
      paginas
    ] = await Promise.all([

      counterRequest(
        'visitas-totais'
      ),

      counterRequest(
        'visitantes-unicos'
      ),

      counterRequest(
        'paginas-visualizadas'
      )

    ]);

    return sendJson(
      res,
      200,
      {

        ok: true,

        visitas:
          visitas.value,

        visitantesUnicos:
          visitantes.value,

        paginasVisualizadas:
          paginas.value,

        pagina,

        atualizadoEm:
          new Date().toISOString()

      }
    );

  } catch (error) {

    // ==================================================
    // Variáveis da Vercel não configuradas
    // ==================================================

    if (
      error.code ===
      'COUNTER_CONFIG_REQUIRED'
    ) {

      return sendJson(
        res,
        503,
        {

          ok: false,

          setupRequired: true,

          code:
            'COUNTER_CONFIG_REQUIRED',

          error:
            'O contador ainda não foi configurado na Vercel.',

          detail:
            'Crie COUNTERAPI_WORKSPACE e COUNTERAPI_TOKEN em Settings → Environment Variables e depois faça um novo deploy.',

          config: {

            workspaceConfigured:
              Boolean(workspace),

            tokenConfigured:
              Boolean(token)

          }

        }
      );

    }

    // ==================================================
    // Falha de conexão
    // ==================================================

    if (
      error.code ===
      'COUNTER_NETWORK_ERROR'
    ) {

      console.error(
        '[ImersaLab] Erro de rede:',
        error.cause || error
      );

      return sendJson(
        res,
        502,
        {

          ok: false,

          code:
            'COUNTER_NETWORK_ERROR',

          error:
            'A função da Vercel está funcionando, mas não conseguiu conectar ao CounterAPI.',

          detail:
            'Verifique sua conexão com o serviço CounterAPI.'

        }
      );

    }

    // ==================================================
    // CounterAPI retornou erro
    // ==================================================

    if (
      error.code ===
      'COUNTER_UPSTREAM_ERROR'
    ) {

      console.error(
        '[ImersaLab] CounterAPI:',
        error.status,
        error.upstreamMessage
      );

      let detail =
        error.upstreamMessage ||
        'Erro ao acessar o serviço de contagem.';

      // Token incorreto
      if (
        error.status === 401 ||
        error.status === 403
      ) {

        detail =
          'O token do CounterAPI foi recusado. Verifique COUNTERAPI_TOKEN na Vercel.';

      }

      // Workspace incorreto
      else if (
        error.status === 404
      ) {

        detail =
          'Workspace ou contador não encontrado. Confira COUNTERAPI_WORKSPACE.';

      }

      // Limite
      else if (
        error.status === 429
      ) {

        detail =
          'O limite de requisições do CounterAPI foi atingido temporariamente.';

      }

      return sendJson(
        res,
        502,
        {

          ok: false,

          code:
            'COUNTER_UPSTREAM_ERROR',

          counterApiStatus:
            error.status || null,

          error:
            'A API de contagem retornou um erro.',

          detail

        }
      );

    }

    // ==================================================
    // Erro não identificado
    // ==================================================

    console.error(
      '[ImersaLab] Erro inesperado:',
      error
    );

    return sendJson(
      res,
      500,
      {

        ok: false,

        code:
          'COUNTER_UNKNOWN_ERROR',

        error:
          'Erro inesperado ao registrar ou consultar as visitas.',

        detail:
          error?.message ||
          'Consulte os logs da Vercel.'

      }
    );

  }

};