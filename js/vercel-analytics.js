// ImersaLab - Vercel Web Analytics para HTML estático.
// Ative Web Analytics no painel da Vercel e faça um novo deploy.
window.va = window.va || function () {
  (window.vaq = window.vaq || []).push(arguments);
};

(function loadVercelAnalytics() {
  if (document.querySelector('script[data-imersalab-vercel-analytics]')) return;
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  script.dataset.imersalabVercelAnalytics = 'true';
  document.head.appendChild(script);
})();
