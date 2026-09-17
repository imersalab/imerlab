(() => {
  const path = location.pathname.toLowerCase();
  if (path.endsWith('/estatisticas.html') || path.endsWith('estatisticas.html')) return;

  const UNIQUE_KEY = 'imersalab_visitante_unico_v1';
  const LAST_VISIT_KEY = 'imersalab_ultima_visita_v1';
  const SESSION_WINDOW = 30 * 60 * 1000; // 30 minutos

  const now = Date.now();
  const lastVisit = Number(localStorage.getItem(LAST_VISIT_KEY) || 0);
  const novaVisita = !lastVisit || (now - lastVisit) > SESSION_WINDOW;
  const novoVisitante = !localStorage.getItem(UNIQUE_KEY);

  fetch('/api/visitas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      novaVisita,
      novoVisitante,
      pagina: location.pathname,
    }),
    keepalive: true,
  })
    .then(async response => {
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Falha ao registrar acesso.');
      return data;
    })
    .then(data => {
      if (novaVisita) localStorage.setItem(LAST_VISIT_KEY, String(now));
      if (novoVisitante) localStorage.setItem(UNIQUE_KEY, '1');

      document.querySelectorAll('[data-visitor-count]').forEach(el => {
        el.textContent = Number(data.visitas || 0).toLocaleString('pt-BR');
      });
    })
    .catch(error => {
      // O contador nunca deve impedir o carregamento do site.
      console.debug('[ImersaLab] Contador indisponível:', error.message);
    });
})();
