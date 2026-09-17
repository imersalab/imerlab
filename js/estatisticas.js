const statusEl = document.getElementById('statsStatus');
const visitasEl = document.getElementById('statVisitas');
const unicosEl = document.getElementById('statUnicos');
const paginasEl = document.getElementById('statPaginas');
const atualizadoEl = document.getElementById('statAtualizado');
const setupBox = document.getElementById('statsSetup');
const diagnosticBox = document.getElementById('statsDiagnostic');
const diagnosticText = document.getElementById('statsDiagnosticText');
const apiTestLink = document.getElementById('apiTestLink');
const refreshBtn = document.getElementById('refreshStats');

function formatNumber(value) {
  return Number(value || 0).toLocaleString('pt-BR');
}

function setStatus(text, type = 'loading') {
  statusEl.textContent = text;
  statusEl.className = `stats-status ${type}`;
}

function resetNumbers() {
  visitasEl.textContent = '—';
  unicosEl.textContent = '—';
  paginasEl.textContent = '—';
}

function showDiagnostic(title, detail) {
  diagnosticBox.hidden = false;
  diagnosticBox.querySelector('h2').textContent = title;
  diagnosticText.textContent = detail;
}

async function loadStats() {
  setStatus('Atualizando dados…', 'loading');
  refreshBtn.disabled = true;
  setupBox.hidden = true;
  diagnosticBox.hidden = true;

  try {
    const response = await fetch('/api/visitas', { cache: 'no-store' });
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
      resetNumbers();
      atualizadoEl.textContent = 'API indisponível';

      if (response.status === 404) {
        setStatus('A rota /api/visitas não foi encontrada.', 'error');
        showDiagnostic(
          'A função da Vercel não está sendo executada',
          'Isso normalmente acontece quando o site está aberto pelo Live Server/arquivo local, ou quando a pasta api não está na raiz publicada na Vercel. Para testar localmente, use “vercel dev”. Para o site publicado, confirme que api/visitas.js está na raiz do projeto implantado.'
        );
      } else {
        setStatus(`A API retornou uma resposta inválida (${response.status}).`, 'error');
        showDiagnostic('Resposta inesperada da API', 'A página recebeu HTML ou outro conteúdo no lugar de JSON. Abra /api/visitas diretamente para verificar o que está sendo retornado.');
      }
      return;
    }

    const data = await response.json().catch(() => ({}));

    if (data.setupRequired) {
      resetNumbers();
      setupBox.hidden = false;
      atualizadoEl.textContent = 'Aguardando configuração';
      setStatus('Contador ainda não configurado na Vercel.', 'warning');
      const missing = [];
      if (!data.config?.workspaceConfigured) missing.push('COUNTERAPI_WORKSPACE');
      if (!data.config?.tokenConfigured) missing.push('COUNTERAPI_TOKEN');
      if (missing.length) {
        showDiagnostic('Configuração incompleta', `Falta configurar: ${missing.join(' e ')}. Depois de salvar as variáveis, faça um novo deploy.`);
      }
      return;
    }

    if (!response.ok || !data.ok) {
      resetNumbers();
      atualizadoEl.textContent = 'Falha na consulta';
      const message = data.error || `Erro HTTP ${response.status}`;
      const detail = data.detail || 'Abra /api/visitas diretamente para consultar o diagnóstico.';
      setStatus(message, 'error');
      showDiagnostic('Diagnóstico do contador', detail);
      return;
    }

    visitasEl.textContent = formatNumber(data.visitas);
    unicosEl.textContent = formatNumber(data.visitantesUnicos);
    paginasEl.textContent = formatNumber(data.paginasVisualizadas);
    atualizadoEl.textContent = new Date(data.atualizadoEm || Date.now()).toLocaleString('pt-BR');
    setStatus('Contador conectado e funcionando.', 'success');
  } catch (error) {
    resetNumbers();
    atualizadoEl.textContent = 'Sem conexão';
    setStatus('Não foi possível acessar a função de estatísticas.', 'error');
    showDiagnostic(
      'Verifique onde o site está sendo executado',
      'Se estiver testando pelo Live Server ou abrindo o HTML diretamente, /api/visitas não funciona porque ela é uma função serverless da Vercel. Publique o projeto na Vercel ou execute localmente com “vercel dev”.'
    );
  } finally {
    refreshBtn.disabled = false;
  }
}

apiTestLink.href = `${location.origin}/api/visitas`;
refreshBtn.addEventListener('click', loadStats);
loadStats();
