const statusEl = document.getElementById('statsStatus');
const visitasEl = document.getElementById('statVisitas');
const unicosEl = document.getElementById('statUnicos');
const paginasEl = document.getElementById('statPaginas');
const atualizadoEl = document.getElementById('statAtualizado');
const setupBox = document.getElementById('statsSetup');
const refreshBtn = document.getElementById('refreshStats');

function formatNumber(value) {
  return Number(value || 0).toLocaleString('pt-BR');
}

function setStatus(text, type = 'loading') {
  statusEl.textContent = text;
  statusEl.className = `stats-status ${type}`;
}

async function loadStats() {
  setStatus('Atualizando dados…', 'loading');
  refreshBtn.disabled = true;

  try {
    const response = await fetch('/api/visitas', { cache: 'no-store' });
    const data = await response.json().catch(() => ({}));

    if (data.setupRequired) {
      setupBox.hidden = false;
      setStatus('Contador ainda não configurado na Vercel.', 'warning');
      visitasEl.textContent = '—';
      unicosEl.textContent = '—';
      paginasEl.textContent = '—';
      atualizadoEl.textContent = 'Aguardando configuração';
      return;
    }

    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'Não foi possível consultar as estatísticas.');
    }

    setupBox.hidden = true;
    visitasEl.textContent = formatNumber(data.visitas);
    unicosEl.textContent = formatNumber(data.visitantesUnicos);
    paginasEl.textContent = formatNumber(data.paginasVisualizadas);
    atualizadoEl.textContent = new Date(data.atualizadoEm || Date.now()).toLocaleString('pt-BR');
    setStatus('Contador conectado e funcionando.', 'success');
  } catch (error) {
    setStatus(error.message, 'error');
  } finally {
    refreshBtn.disabled = false;
  }
}

refreshBtn.addEventListener('click', loadStats);
loadStats();
