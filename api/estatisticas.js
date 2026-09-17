// ImersaLab - painel de estatísticas usando a API oficial do Vercel Web Analytics.
// Rota: /api/estatisticas?since=YYYY-MM-DD&until=YYYY-MM-DD
// IMPORTANTE: o token fica SOMENTE no servidor, em VERCEL_ANALYTICS_TOKEN.

const VERCEL_API = 'https://api.vercel.com';
const DEFAULT_PROJECT_NAME = 'imerlab';

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.end(JSON.stringify(body));
}

function dateOnlyUTC(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function addDays(dateString, amount) {
  const d = new Date(`${dateString}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + amount);
  return dateOnlyUTC(d);
}

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}

function normalizeRange(query = {}) {
  const today = dateOnlyUTC(new Date());
  const defaultSince = addDays(today, -6); // 7 dias, incluindo hoje.

  const since = validDate(query.since) ? query.since : defaultSince;
  const until = validDate(query.until) ? query.until : today;

  if (Date.parse(`${since}T00:00:00Z`) > Date.parse(`${until}T00:00:00Z`)) {
    const error = new Error('A data inicial não pode ser posterior à data final.');
    error.code = 'INVALID_RANGE';
    throw error;
  }

  const days = Math.floor((Date.parse(`${until}T00:00:00Z`) - Date.parse(`${since}T00:00:00Z`)) / 86400000) + 1;
  if (days > 366) {
    const error = new Error('Escolha um período de até 366 dias.');
    error.code = 'INVALID_RANGE';
    throw error;
  }

  return { since, until, days };
}

function getToken() {
  return process.env.VERCEL_ANALYTICS_TOKEN || '';
}

function getOptionalTeamId() {
  const explicit = process.env.VERCEL_ANALYTICS_TEAM_ID || '';
  if (explicit) return explicit;

  // Em projetos de equipe, VERCEL_ORG_ID normalmente começa com team_.
  const orgId = process.env.VERCEL_ORG_ID || '';
  return orgId.startsWith('team_') ? orgId : '';
}

function baseQueryParams() {
  const params = new URLSearchParams();
  const teamId = getOptionalTeamId();
  if (teamId) params.set('teamId', teamId);
  return params;
}

async function vercelFetch(path, params, token) {
  const url = new URL(`${VERCEL_API}${path}`);
  for (const [key, value] of params.entries()) url.searchParams.set(key, value);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    },
    cache: 'no-store'
  });

  let body = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  if (!response.ok) {
    const error = new Error(body?.error?.message || body?.message || `Vercel API respondeu com HTTP ${response.status}.`);
    error.status = response.status;
    error.payload = body;
    throw error;
  }

  return body;
}

async function resolveProjectId(token) {
  // Se o sistema da Vercel expuser o ID automaticamente, não há chamada extra.
  const automaticId = process.env.VERCEL_PROJECT_ID || process.env.VERCEL_ANALYTICS_PROJECT_ID;
  if (automaticId) return automaticId;

  // Fallback: busca o projeto pelo nome usando o próprio Access Token.
  const projectName = process.env.VERCEL_ANALYTICS_PROJECT_NAME || DEFAULT_PROJECT_NAME;
  const params = baseQueryParams();
  const project = await vercelFetch(`/v9/projects/${encodeURIComponent(projectName)}`, params, token);
  if (!project?.id) {
    const error = new Error('Não foi possível descobrir o Project ID do ImersaLab.');
    error.code = 'PROJECT_ID_NOT_FOUND';
    throw error;
  }
  return project.id;
}

async function queryAggregate({ token, projectId, since, until, by, limit }) {
  const params = baseQueryParams();
  params.set('projectId', projectId);
  params.set('since', since);
  params.set('until', until);
  params.set('by', by);
  if (limit) params.set('limit', String(limit));
  return vercelFetch('/v1/query/web-analytics/visits/aggregate', params, token);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, { ok: false, error: 'Método não permitido.' });
  }

  try {
    const token = getToken();

    if (!token) {
      return sendJson(res, 503, {
        ok: false,
        code: 'VERCEL_ACCESS_TOKEN_REQUIRED',
        error: 'Falta o Vercel Access Token.',
        detail: 'Crie um Vercel Access Token e salve-o em VERCEL_ANALYTICS_TOKEN nas Environment Variables do projeto. Não use uma AI Gateway API Key (vck_...).'
      });
    }

    if (token.startsWith('vck_')) {
      return sendJson(res, 503, {
        ok: false,
        code: 'WRONG_TOKEN_TYPE',
        error: 'A chave informada é uma Vercel API Key, não um Access Token.',
        detail: 'A Web Analytics API exige um Vercel Access Token. Crie um token de acesso da conta e salve-o em VERCEL_ANALYTICS_TOKEN.'
      });
    }

    const range = normalizeRange(req.query || {});
    const projectId = await resolveProjectId(token);

    const [dailyResult, countryResult] = await Promise.all([
      queryAggregate({
        token,
        projectId,
        since: range.since,
        until: range.until,
        by: 'day'
      }),
      queryAggregate({
        token,
        projectId,
        since: range.since,
        until: range.until,
        by: 'country',
        limit: 50
      })
    ]);

    const dailyRows = Array.isArray(dailyResult?.data) ? dailyResult.data : [];
    const countryRows = Array.isArray(countryResult?.data) ? countryResult.data : [];

    const daily = dailyRows.map(row => ({
      date: String(row.timestamp || '').slice(0, 10),
      visitors: Number(row.visitors || 0),
      pageviews: Number(row.pageviews || 0)
    })).filter(row => row.date);

    const countries = countryRows.map(row => ({
      country: row.country || 'Unknown',
      visitors: Number(row.visitors || 0),
      pageviews: Number(row.pageviews || 0)
    })).sort((a, b) => b.visitors - a.visitors || b.pageviews - a.pageviews);

    const visitors = daily.reduce((sum, row) => sum + row.visitors, 0);
    const pageviews = daily.reduce((sum, row) => sum + row.pageviews, 0);
    const pagesPerVisitor = visitors > 0 ? Number((pageviews / visitors).toFixed(2)) : 0;

    return sendJson(res, 200, {
      ok: true,
      source: 'Vercel Web Analytics',
      period: range,
      visitors,
      pageviews,
      pagesPerVisitor,
      daily,
      countries,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('[ImersaLab] Vercel Analytics API:', error?.status, error?.message);

    if (error.code === 'INVALID_RANGE') {
      return sendJson(res, 400, { ok: false, code: error.code, error: error.message });
    }

    if (error.status === 401 || error.status === 403) {
      return sendJson(res, 502, {
        ok: false,
        code: 'VERCEL_AUTH_ERROR',
        error: 'A Vercel recusou o token de acesso.',
        detail: 'Verifique VERCEL_ANALYTICS_TOKEN. A Web Analytics API exige um Vercel Access Token com acesso ao projeto.'
      });
    }

    if (error.status === 404) {
      return sendJson(res, 502, {
        ok: false,
        code: 'VERCEL_PROJECT_NOT_FOUND',
        error: 'O projeto não foi encontrado pela API da Vercel.',
        detail: 'Se necessário, defina VERCEL_ANALYTICS_PROJECT_ID ou VERCEL_ANALYTICS_PROJECT_NAME nas Environment Variables.'
      });
    }

    return sendJson(res, 502, {
      ok: false,
      code: error.code || 'VERCEL_ANALYTICS_ERROR',
      error: 'Não foi possível consultar o Vercel Web Analytics.',
      detail: error?.message || 'Erro desconhecido.'
    });
  }
};
