const statusEl = document.getElementById('statsStatus');
const visitorsEl = document.getElementById('statVisitors');
const pageviewsEl = document.getElementById('statPageviews');
const pagesPerVisitorEl = document.getElementById('statPagesPerVisitor');
const updatedEl = document.getElementById('statUpdated');
const periodLabelEl = document.getElementById('statPeriodLabel');
const refreshBtn = document.getElementById('refreshStats');
const presetEl = document.getElementById('statsPeriodPreset');
const sinceEl = document.getElementById('statsSince');
const untilEl = document.getElementById('statsUntil');
const chartEl = document.getElementById('statsChart');
const chartEmptyEl = document.getElementById('statsChartEmpty');
const countriesEl = document.getElementById('statsCountries');

const ptBR = new Intl.NumberFormat('pt-BR');
const ptDecimal = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 });
const countryNames = typeof Intl.DisplayNames === 'function'
  ? new Intl.DisplayNames(['pt-BR'], { type: 'region' })
  : null;

function toDateInput(date) {
  return date.toISOString().slice(0, 10);
}

function parseLocalDate(value) {
  const [y, m, d] = value.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(value, includeYear = false) {
  if (!value) return '—';
  const date = parseLocalDate(value);
  return date.toLocaleDateString('pt-BR', includeYear
    ? { day: '2-digit', month: '2-digit', year: 'numeric' }
    : { day: '2-digit', month: '2-digit' });
}

function setDefaultRange(days = 7) {
  const until = new Date();
  const since = new Date();
  since.setDate(until.getDate() - (days - 1));
  sinceEl.value = toDateInput(since);
  untilEl.value = toDateInput(until);
}

function setStatus(message, type = 'loading') {
  statusEl.textContent = message;
  statusEl.className = `stats-status ${type}`;
}

function clearNumbers() {
  visitorsEl.textContent = '—';
  pageviewsEl.textContent = '—';
  pagesPerVisitorEl.textContent = '—';
}

function countryFlag(code) {
  if (!/^[A-Z]{2}$/.test(code)) return '🌐';
  return String.fromCodePoint(...code.split('').map(char => 127397 + char.charCodeAt(0)));
}

function countryLabel(code) {
  if (!code || code === 'Unknown') return 'Localidade não identificada';
  try {
    return countryNames?.of(code) || code;
  } catch {
    return code;
  }
}

function renderCountries(rows = []) {
  countriesEl.innerHTML = '';

  if (!rows.length) {
    countriesEl.innerHTML = '<div class="stats-country-empty">Nenhum país registrado neste período.</div>';
    return;
  }

  // O usuário pediu uma única localidade. Mostramos o país com maior tráfego.
  const ordered = [...rows].sort((a, b) =>
    Number(b.visitors || 0) - Number(a.visitors || 0) ||
    Number(b.pageviews || 0) - Number(a.pageviews || 0)
  );

  const row = ordered[0];
  const code = String(row.country || 'Unknown').toUpperCase();
  const visitors = Number(row.visitors || 0);
  const pageviews = Number(row.pageviews || 0);
  const totalVisitors = ordered.reduce((sum, item) => sum + Number(item.visitors || 0), 0);
  const totalPageviews = ordered.reduce((sum, item) => sum + Number(item.pageviews || 0), 0);
  const base = totalVisitors > 0 ? totalVisitors : totalPageviews;
  const value = totalVisitors > 0 ? visitors : pageviews;
  const percentage = base > 0 ? Math.round((value / base) * 100) : 0;

  countriesEl.innerHTML = `
    <div class="stats-country-featured">
      <div class="stats-country-featured-flag">${countryFlag(code)}</div>
      <div class="stats-country-featured-copy">
        <strong>${countryLabel(code)}</strong>
        <span>${percentage}% dos visitantes no período</span>
        <small>${ptBR.format(visitors)} visitante${visitors === 1 ? '' : 's'} • ${ptBR.format(pageviews)} visualizaç${pageviews === 1 ? 'ão' : 'ões'}</small>
      </div>
    </div>`;
}

function fillDailyRows(rows, since, until) {
  const map = new Map((rows || []).map(row => [row.date, row]));
  const result = [];
  let cursor = parseLocalDate(since);
  const end = parseLocalDate(until);

  while (cursor <= end) {
    const key = toDateInput(cursor);
    const row = map.get(key) || { date: key, visitors: 0, pageviews: 0 };
    result.push({
      date: key,
      visitors: Number(row.visitors || 0),
      pageviews: Number(row.pageviews || 0)
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return result;
}

function svgNode(name, attrs = {}, text = '') {
  const el = document.createElementNS('http://www.w3.org/2000/svg', name);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, String(value)));
  if (text) el.textContent = text;
  return el;
}

function renderChart(rows, since, until) {
  chartEl.replaceChildren();
  const data = fillDailyRows(rows, since, until);
  const hasData = data.some(row => row.pageviews > 0 || row.visitors > 0);
  chartEmptyEl.hidden = hasData;
  chartEl.style.opacity = hasData ? '1' : '.4';

  const W = 960, H = 330;
  const margin = { left: 58, right: 24, top: 24, bottom: 54 };
  const cw = W - margin.left - margin.right;
  const ch = H - margin.top - margin.bottom;
  const maxValue = Math.max(1, ...data.flatMap(row => [row.pageviews, row.visitors]));
  const yMax = Math.max(4, Math.ceil(maxValue / 4) * 4);

  const grid = svgNode('g', { class: 'stats-chart-grid' });
  for (let i = 0; i <= 4; i++) {
    const y = margin.top + (ch * i / 4);
    const value = Math.round(yMax * (1 - i / 4));
    grid.appendChild(svgNode('line', { x1: margin.left, x2: W - margin.right, y1: y, y2: y }));
    grid.appendChild(svgNode('text', { x: margin.left - 12, y: y + 5, 'text-anchor': 'end' }, String(value)));
  }
  chartEl.appendChild(grid);

  const xStep = cw / Math.max(data.length, 1);
  const barWidth = Math.max(3, Math.min(28, xStep * 0.55));
  const points = [];

  data.forEach((row, index) => {
    const xCenter = margin.left + xStep * index + xStep / 2;
    const pageHeight = ch * (row.pageviews / yMax);
    const visitorY = margin.top + ch - ch * (row.visitors / yMax);
    points.push(`${xCenter},${visitorY}`);

    chartEl.appendChild(svgNode('rect', {
      x: xCenter - barWidth / 2,
      y: margin.top + ch - pageHeight,
      width: barWidth,
      height: Math.max(pageHeight, row.pageviews ? 2 : 0),
      rx: 4,
      class: 'stats-chart-bar'
    }));

    const tickEvery = data.length <= 10 ? 1 : data.length <= 20 ? 2 : data.length <= 40 ? 5 : 10;
    if (index % tickEvery === 0 || index === data.length - 1) {
      chartEl.appendChild(svgNode('text', {
        x: xCenter,
        y: H - 22,
        'text-anchor': 'middle',
        class: 'stats-chart-xlabel'
      }, formatDate(row.date)));
    }
  });

  chartEl.appendChild(svgNode('polyline', {
    points: points.join(' '),
    fill: 'none',
    class: 'stats-chart-line'
  }));

  data.forEach((row, index) => {
    if (!row.visitors) return;
    const xCenter = margin.left + xStep * index + xStep / 2;
    const y = margin.top + ch - ch * (row.visitors / yMax);
    chartEl.appendChild(svgNode('circle', { cx: xCenter, cy: y, r: 4.5, class: 'stats-chart-dot' }));
  });
}

async function loadStats() {
  if (!sinceEl.value || !untilEl.value) setDefaultRange(7);

  setStatus('Consultando o Vercel Web Analytics…', 'loading');
  refreshBtn.disabled = true;

  try {
    const params = new URLSearchParams({ since: sinceEl.value, until: untilEl.value });
    const response = await fetch(`/api/estatisticas?${params.toString()}`, { cache: 'no-store' });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.ok === false) {
      const error = new Error(data.detail || data.error || `HTTP ${response.status}`);
      error.code = data.code;
      throw error;
    }

    visitorsEl.textContent = ptBR.format(Number(data.visitors || 0));
    pageviewsEl.textContent = ptBR.format(Number(data.pageviews || 0));
    pagesPerVisitorEl.textContent = ptDecimal.format(Number(data.pagesPerVisitor || 0));
    updatedEl.textContent = new Date(data.updatedAt || Date.now()).toLocaleString('pt-BR');
    periodLabelEl.textContent = `${formatDate(data.period?.since || sinceEl.value, true)} a ${formatDate(data.period?.until || untilEl.value, true)}`;

    renderChart(data.daily || [], data.period?.since || sinceEl.value, data.period?.until || untilEl.value);
    renderCountries(data.countries || []);

    setStatus('Dados oficiais da Vercel atualizados com sucesso.', 'success');
  } catch (error) {
    clearNumbers();
    chartEl.replaceChildren();
    chartEmptyEl.hidden = false;
    countriesEl.innerHTML = '<div class="stats-country-empty">O país será exibido quando a API estiver configurada.</div>';
    updatedEl.textContent = 'Não atualizado';
    periodLabelEl.textContent = `${formatDate(sinceEl.value, true)} a ${formatDate(untilEl.value, true)}`;

    if (error.code === 'WRONG_TOKEN_TYPE') {
      setStatus('A chave configurada é de outro produto da Vercel. Use um Vercel Access Token.', 'error');
    } else if (error.code === 'VERCEL_ACCESS_TOKEN_REQUIRED') {
      setStatus('Falta configurar VERCEL_ANALYTICS_TOKEN na Vercel.', 'warning');
    } else {
      setStatus(error.message || 'Não foi possível consultar as estatísticas.', 'error');
    }
    console.error('[ImersaLab] Estatísticas:', error);
  } finally {
    refreshBtn.disabled = false;
  }
}

presetEl.addEventListener('change', () => {
  if (presetEl.value !== 'custom') {
    setDefaultRange(Number(presetEl.value));
    loadStats();
  }
});

sinceEl.addEventListener('change', () => { presetEl.value = 'custom'; });
untilEl.addEventListener('change', () => { presetEl.value = 'custom'; });
refreshBtn.addEventListener('click', loadStats);

setDefaultRange(7);
loadStats();
