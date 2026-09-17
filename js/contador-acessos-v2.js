// ImersaLab - contador simples de acessos.
// Funciona em hospedagem estática na Vercel sem token, banco de dados ou função serverless.
// O CounterAPI registra os page views e permite consultar visitantes únicos de forma agregada.
(() => {
  const path = location.pathname.toLowerCase();

  // Não contabiliza a própria página administrativa de estatísticas.
  if (path.endsWith('/estatisticas.html') || path.endsWith('estatisticas.html')) return;

  // Evita contaminar as estatísticas durante testes locais.
  if (
    location.protocol === 'file:' ||
    location.hostname === 'localhost' ||
    location.hostname === '127.0.0.1'
  ) return;

  const NAMESPACE = location.hostname || 'imerlab.vercel.app';
  const ACTION = 'pageview';
  const KEY = 'site-total';

  const url = `https://counterapi.com/api/${encodeURIComponent(NAMESPACE)}/${encodeURIComponent(ACTION)}/${encodeURIComponent(KEY)}`;

  fetch(url, {
    method: 'GET',
    cache: 'no-store',
    keepalive: true
  }).catch(error => {
    // O contador nunca deve impedir o carregamento do site.
    console.debug('[ImersaLab] Contador indisponível:', error.message);
  });
})();
