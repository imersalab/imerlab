// ======================================================
// IMERSALAB - ESTATÍSTICAS COM VERCEL WEB ANALYTICS
// Arquivo: api/visitas.js
// ======================================================

const ANALYTICS_URL = 'https://api.vercel.com/v1/query/web-analytics/visits/count';

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.end(JSON.stringify(body));
}

function getConfig() {
  return {
    token: process.env.VERCEL_ANALYTICS_TOKEN || process.env.VERCEL_TOKEN || '',
    projectId: process.env.VERCEL_PROJECT_ID || process.env.VERCEL_ANALYTICS_PROJECT_ID || '',
    teamId: process.env.VERCEL_TEAM_ID || process.env.VERCEL_ANALYTICS_TEAM_ID || '',
  };
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return sendJson(res, 405, {
      ok: false,
      error: 'Método não permitido. Use GET.'
    });
  }

  const { token, projectId, teamId } = getConfig();

  if (!token || !projectId) {
    return sendJson(res, 503, {
      ok: false,
      setupRequired: true,
      code: 'VERCEL_ANALYTICS_CONFIG_REQUIRED',
      error: 'A consulta do Vercel Web Analytics ainda precisa ser configurada.',
      detail: 'Ative Web Analytics na Vercel, crie um Access Token e salve-o como VERCEL_ANALYTICS_TOKEN. O VERCEL_PROJECT_ID normalmente é fornecido automaticamente pela Vercel.',
      config: {
        tokenConfigured: Boolean(token),
        projectIdConfigured: Boolean(projectId),
        teamIdConfigured: Boolean(teamId)
      }
    });
  }

  const url = new URL(ANALYTICS_URL);
  url.searchParams.set('projectId', projectId);
  if (teamId) url.searchParams.set('teamId', teamId);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      },
      cache: 'no-store'
    });

    let payload = null;
    try {
      payload = await response.json();
    } catch (_) {
      payload = null;
    }

    if (!response.ok) {
      const upstreamMessage =
        payload?.error?.message ||
        payload?.message ||
        payload?.error ||
        `A Vercel respondeu com status ${response.status}.`;

      let detail = typeof upstreamMessage === 'string'
        ? upstreamMessage
        : 'Não foi possível consultar o Web Analytics.';

      let teamRequired = false;

      if (response.status === 401) {
        detail = 'O Access Token da Vercel foi recusado. Gere um token válido e atualize VERCEL_ANALYTICS_TOKEN.';
      } else if (response.status === 403) {
        detail = 'O token não tem acesso ao projeto ou ao time. Se o projeto pertence a um time, configure também VERCEL_TEAM_ID.';
        teamRequired = !teamId;
      } else if (response.status === 404) {
        detail = 'Projeto ou dados de Analytics não encontrados. Confirme que o Web Analytics está ativado e que o deployment foi publicado novamente.';
        teamRequired = !teamId;
      }

      return sendJson(res, 502, {
        ok: false,
        code: 'VERCEL_ANALYTICS_UPSTREAM_ERROR',
        vercelStatus: response.status,
        teamRequired,
        error: 'Não foi possível consultar o Vercel Web Analytics.',
        detail,
        config: {
          tokenConfigured: Boolean(token),
          projectIdConfigured: Boolean(projectId),
          teamIdConfigured: Boolean(teamId)
        }
      });
    }

    const visitors = Number(payload?.data?.visitors || 0);
    const pageviews = Number(payload?.data?.pageviews || 0);
    const pagesPerVisitor = visitors > 0 ? pageviews / visitors : 0;

    return sendJson(res, 200, {
      ok: true,
      source: 'Vercel Web Analytics',
      visitantes: visitors,
      paginasVisualizadas: pageviews,
      paginasPorVisitante: Number(pagesPerVisitor.toFixed(2)),
      atualizadoEm: new Date().toISOString()
    });
  } catch (error) {
    console.error('[ImersaLab] Erro ao consultar Vercel Web Analytics:', error);
    return sendJson(res, 500, {
      ok: false,
      code: 'VERCEL_ANALYTICS_REQUEST_ERROR',
      error: 'Falha ao consultar as estatísticas da Vercel.',
      detail: error?.message || 'Erro inesperado.'
    });
  }
};
