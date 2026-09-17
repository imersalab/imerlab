const statusEl = document.getElementById('statsStatus');
const visitantesEl = document.getElementById('statVisitas');
const paginasEl = document.getElementById('statPaginas');
const mediaEl = document.getElementById('statMedia');
const atualizadoEl = document.getElementById('statAtualizado');
const refreshBtn = document.getElementById('refreshStats');

const NAMESPACE = location.hostname || 'imerlab.vercel.app';
const ACTION = 'pageview';
const KEY = 'site-total';

const BASE = `https://counterapi.com/api/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(ACTION)}/${encodeURIComponent(KEY)}`;

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

async function readCounter(unique = false) {
  const params = new URLSearchParams({ readOnly: 'true' });
  if (unique) params.set('unique', 'true');

  const response = await fetch(`${BASE}?${params.toString()}`, {
    method: 'GET',
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP ${response.status}`);
  }

  const data = await response.json();
  return Number(data?.value || 0);
}

async function loadStats() {
  setStatus('Atualizando estatísticas…', 'loading');
  refreshBtn.disabled = true;

  try {
    const [paginas, visitantes] = await Promise.all([
      readCounter(false),
      readCounter(true)
    ]);

    const media = visitantes > 0 ? paginas / visitantes : 0;

    visitantesEl.textContent = formatNumber(visitantes);
    paginasEl.textContent = formatNumber(paginas);
    mediaEl.textContent = formatDecimal(media);
    atualizadoEl.textContent = new Date().toLocaleString('pt-BR');

    if (paginas === 0) {
      setStatus('Contador ativo. Visite a página inicial para registrar o primeiro acesso.', 'warning');
    } else {
      setStatus('Estatísticas atualizadas com sucesso.', 'success');
    }
  } catch (error) {
    resetNumbers();
    atualizadoEl.textContent = 'Falha na atualização';
    setStatus('Não foi possível consultar o contador. Confirme se esta versão foi publicada e recarregue a página com Ctrl+F5.', 'error');
    console.error('[ImersaLab] Erro ao consultar estatísticas:', error);
  } finally {
    refreshBtn.disabled = false;
  }
}

refreshBtn.addEventListener('click', loadStats);
loadStats();
