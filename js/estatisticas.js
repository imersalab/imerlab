const statusEl = document.getElementById('statsStatus');
const visitantesEl = document.getElementById('statVisitas');
const paginasEl = document.getElementById('statPaginas');
const mediaEl = document.getElementById('statMedia');
const atualizadoEl = document.getElementById('statAtualizado');
const setupBox = document.getElementById('statsSetup');
const diagnosticBox = document.getElementById('statsDiagnostic');
const diagnosticText = document.getElementById('statsDiagnosticText');
const apiTestLink = document.getElementById('apiTestLink');
const refreshBtn = document.getElementById('refreshStats');

function formatNumber(value) {
  return Number(value || 0).toLocaleString('pt-BR');
}

function formatDecimal(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
}

function setStatus(text, type = 'loading') {
  statusEl.textContent = text;
  statusEl.className = `stats-status ${type}`;
}

function resetNumbers() {
  visitantesEl.textContent = '—';
  paginasEl.textContent = '—';
  mediaEl.textContent = '—';
}

function showDiagnostic(title, detail) {
  diagnosticBox.hidden = false;
  diagnosticBox.querySelector('h2').textContent = title;
  diagnosticText.textContent = detail;
}

async function loadStats() {
  setStatus('Atualizando dados da Vercel…', 'loading');
  refreshBtn.disabled = true;
  setupBox.hidden = true;
  diagnosticBox.hidden = true;

  try {
    const response = await fetch('/api/visitas', { cache: 'no-store' });
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      resetNumbers();
      atualizadoEl.textContent = 'API indisponível';
      setStatus('A função /api/visitas não retornou JSON.', 'error');
      showDiagnostic(
        'Função serverless indisponível',
        'Confirme que a pasta api está na raiz publicada na Vercel e que api/visitas.js foi incluído no deployment.'
      );
      return;
    }

    const data = await response.json().catch(() => ({}));

    if (data.setupRequired) {
      resetNumbers();
      setupBox.hidden = false;
      atualizadoEl.textContent = 'Aguardando configuração';
      setStatus('Vercel Web Analytics ainda precisa ser configurado.', 'warning');

      const missing = [];
      if (!data.config?.tokenConfigured) missing.push('VERCEL_ANALYTICS_TOKEN');
      if (!data.config?.projectIdConfigured) missing.push('VERCEL_PROJECT_ID');

      if (missing.length) {
        showDiagnostic(
          'Configuração incompleta',
          `Falta configurar ou disponibilizar: ${missing.join(' e ')}. Depois faça um novo deploy.`
        );
      }
      return;
    }

    if (!response.ok || !data.ok) {
      resetNumbers();
      atualizadoEl.textContent = 'Falha na consulta';
      setStatus(data.error || `Erro HTTP ${response.status}`, 'error');

      let detail = data.detail || 'Abra a API de estatísticas para consultar o diagnóstico.';
      if (data.teamRequired) {
        detail += ' Este projeto parece exigir o escopo do time. Adicione VERCEL_TEAM_ID nas variáveis de ambiente.';
      }
      showDiagnostic('Diagnóstico do Vercel Analytics', detail);
      return;
    }

    visitantesEl.textContent = formatNumber(data.visitantes);
    paginasEl.textContent = formatNumber(data.paginasVisualizadas);
    mediaEl.textContent = formatDecimal(data.paginasPorVisitante);
    atualizadoEl.textContent = new Date(data.atualizadoEm || Date.now()).toLocaleString('pt-BR');
    setStatus('Dados carregados do Vercel Web Analytics.', 'success');
  } catch (error) {
    resetNumbers();
    atualizadoEl.textContent = 'Sem conexão';
    setStatus('Não foi possível acessar a função de estatísticas.', 'error');
    showDiagnostic(
      'Falha de conexão',
      'A página não conseguiu acessar /api/visitas. Verifique o deployment na Vercel e tente novamente.'
    );
  } finally {
    refreshBtn.disabled = false;
  }
}

apiTestLink.href = `${location.origin}/api/visitas`;
refreshBtn.addEventListener('click', loadStats);
loadStats();
