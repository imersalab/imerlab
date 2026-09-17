
const params = new URLSearchParams(location.search);
const id = params.get("id") || "luxrefra-ar";
const p = window.PROJETOS.find(x => x.id === id) || window.PROJETOS[0];

document.title = `${p.title} | Experiência`;
document.getElementById("simTopTitle").textContent = p.title;
document.getElementById("simTitle").textContent = p.title;
document.getElementById("simDescription").textContent = p.summary;
document.getElementById("backDetail").href = `detalhe.html?id=${encodeURIComponent(p.id)}`;

document.getElementById("fullscreenBtn").addEventListener("click", () => {
  document.documentElement.requestFullscreen?.();
});

const simulatorHost = document.getElementById("simulatorView");
const guideHost = document.getElementById("guideView");
const btnOpenSimulator = document.getElementById("btnOpenSimulator");
const btnOpenGuide = document.getElementById("btnOpenGuide");

btnOpenSimulator.addEventListener("click", () => switchView("simulator"));
btnOpenGuide.addEventListener("click", () => switchView("guide"));

function switchView(view) {
  const isGuide = view === "guide";
  simulatorHost.classList.toggle("active", !isGuide);
  guideHost.classList.toggle("active", isGuide);
  btnOpenSimulator.classList.toggle("active", !isGuide);
  btnOpenGuide.classList.toggle("active", isGuide);
}

buildSimulator();
buildGuide();

// Permite abrir o guia diretamente a partir da página do projeto.
if ((params.get("view") || "").toLowerCase() === "guide") {
  switchView("guide");
}

function buildSimulator() {
  if (p.id === "luxrefra-ar") {
    simulatorHost.innerHTML = `
      <div class="sim-body">
        <div class="sim-canvas-wrap"><canvas id="rayCanvas"></canvas></div>
        <aside class="sim-controls">
          <h3>Parâmetros</h3>
          <div class="ctrl"><label><span>Ângulo de incidência</span><span id="angleOut">40°</span></label><input id="angle" type="range" min="5" max="80" value="40"></div>
          <div class="ctrl"><label><span>Índice do meio 2</span><span id="nOut">1.33</span></label><input id="n" type="range" min="100" max="242" value="133"></div>
          <div class="ctrl"><label>Materiais</label><div class="material-buttons">
            <button class="mat-btn" data-n="1.00">Ar</button><button class="mat-btn active" data-n="1.33">Água</button>
            <button class="mat-btn" data-n="1.36">Etanol</button><button class="mat-btn" data-n="1.49">Acrílico</button>
            <button class="mat-btn" data-n="1.52">Vidro</button><button class="mat-btn" data-n="2.42">Diamante</button>
          </div></div>
          <div class="readout"><div><span>θi</span><strong id="incRead">40.0°</strong></div><div><span>θr</span><strong id="refRead">28.9°</strong></div><div><span>n₁</span><strong>1.00</strong></div><div><span>n₂</span><strong id="nRead">1.33</strong></div></div>
        </aside>
      </div>`;
    initRefraction();
  } else {
    simulatorHost.innerHTML = `
      <div class="launch-placeholder">
        <div class="huge">${p.icon}</div><h2>${p.title}</h2>
        <p>Esta página já está preparada para receber o simulador, aplicação WebGL, experiência Unity ou conteúdo Web específico deste projeto.</p>
        <p><strong>Tecnologia:</strong> ${p.tech} &nbsp; • &nbsp; <strong>Plataformas:</strong> ${p.platforms.join(", ")}</p>
        <button class="btn btn-primary" onclick="alert('Substitua este botão pela inicialização do seu aplicativo ou embed WebGL.')">Iniciar experiência</button>
      </div>`;
  }
}

function buildGuide() {
  const guide = getGuideData(p);
  guideHost.innerHTML = `
    <div class="study-guide-shell">
      <div class="study-book">
        <div class="study-page study-page-left">
          <div class="study-page-stripes"></div>
          <div class="study-bubble bubble-one"></div>
          <div class="study-bubble bubble-two"></div>
          <h2 class="study-left-title">${guide.leftTitle}</h2>
          <p class="study-lead">${guide.leftLead}</p>
          <p class="study-copy">${guide.leftTextA}</p>
          <p class="study-copy">${guide.leftTextB}</p>
          <div class="study-device-frame">
            <div class="study-device-topbar"></div>
            <div class="study-device-screen">
              ${p.cardImage ? `<img src="${p.cardImage}" alt="Imagem de apoio do projeto ${p.title}">` : `<div class="study-fallback-icon">${p.icon}</div>`}
            </div>
            <div class="study-device-base"></div>
          </div>
          <div class="study-caption-block">
            <h3>${guide.leftBottomTitle}</h3>
            <p>${guide.leftBottomText}</p>
          </div>
        </div>

        <div class="study-page study-page-right">
          <div class="study-ribbon">GUIA</div>
          <div class="study-page-number">7</div>
          <p class="study-right-note">${guide.rightIntro}</p>

          <div class="study-feature-row">
            <div class="study-feature-copy">
              <h3>${guide.featureOneTitle}</h3>
              <p>${guide.featureOneText}</p>
              <small>${guide.featureOneLabel}</small>
            </div>
            <div class="study-figure-card">
              ${p.cardImage ? `<img src="${p.cardImage}" alt="Ilustração do projeto ${p.title}">` : `<div class="study-figure-placeholder">${p.icon}</div>`}
            </div>
          </div>

          <p class="study-divider-text">${guide.middleNote}</p>

          <div class="study-feature-row study-feature-row-bottom">
            <div class="study-feature-copy">
              <h3>${guide.featureTwoTitle}</h3>
              <p>${guide.featureTwoText}</p>
              <small>${guide.featureTwoLabel}</small>
            </div>
            <div class="study-figure-card alt">
              <div class="study-concept-grid">
                ${(guide.keywords || []).slice(0,6).map(keyword => `<span>${keyword}</span>`).join("")}
              </div>
            </div>
          </div>

          <p class="study-footer-note">${guide.bottomNote}</p>

          <div class="study-page-controls" aria-hidden="true">
            <span class="study-nav-btn">◀</span>
            <span class="study-page-indicator">7 / 7</span>
            <span class="study-nav-btn">▶</span>
          </div>
        </div>
      </div>
    </div>`;
}

function getGuideData(project) {
  const genericKeywords = project.topics || [];

  if (project.id === "luxrefra-ar") {
    return {
      leftTitle: "Estudo orientado",
      leftLead: "O guia auxilia o estudante a compreender como a luz se comporta ao passar de um meio para outro e como o índice de refração altera a trajetória do raio luminoso.",
      leftTextA: "Utilize o simulador para alterar o ângulo de incidência e comparar o comportamento da luz em materiais como água, vidro, acrílico, etanol e diamante. Observe cuidadosamente a normal, o raio incidente, o raio refletido e o raio refratado.",
      leftTextB: "Registre os valores de θi e θr, identifique padrões e relacione os resultados à Lei de Snell. O professor pode usar este espaço para inserir textos explicativos, exemplos do cotidiano e orientações de investigação.",
      leftBottomTitle: "LuxRefra AR no ImersaLab",
      leftBottomText: "O conteúdo do guia pode ser personalizado com conceitos, fórmulas, questões norteadoras e imagens relacionadas ao tema estudado. Assim, a própria página do simulador se transforma em material de apoio para a aula.",
      rightIntro: "Para ilustrar relações geométricas e ópticas, os parâmetros podem ser modificados e as observações podem ser associadas a explicações teóricas, imagens e resumos conceituais.",
      featureOneTitle: "Lei de Snell na prática",
      featureOneText: "A variação entre os índices de refração dos meios altera o ângulo do raio refratado. Quanto maior o índice do meio 2, maior tende a ser o desvio do feixe em direção à normal.",
      featureOneLabel: "Relação entre ângulos e índices de refração",
      middleNote: "O professor pode definir sequências de leitura, propor desafios investigativos e orientar os alunos a comparar previsões com resultados observados no simulador.",
      featureTwoTitle: "Aplicações e situações do cotidiano",
      featureTwoText: "Este espaço permite inserir textos sobre miragens, lentes, prismas, fibras ópticas, a colher no copo, o fundo aparente da piscina e outros fenômenos em que a refração da luz pode ser percebida.",
      featureTwoLabel: "Palavras-chave e conceitos centrais",
      bottomNote: "O guia pode reunir textos, exemplos, ilustrações e orientações para transformar o simulador em um ambiente completo de estudo, revisão e aprofundamento conceitual.",
      keywords: ["Refração", "Lei de Snell", "Ângulo", "Normal", "Índice n", "Aplicações"]
    };
  }

  return {
    leftTitle: `Guia de estudo — ${project.title}`,
    leftLead: `Este espaço foi preparado para inserir textos de apoio, conceitos introdutórios e orientações de estudo sobre ${project.subject.toLowerCase()}.`,
    leftTextA: project.summary,
    leftTextB: `O professor pode adaptar o conteúdo com resumos, observações, exemplos práticos e questões investigativas relacionadas aos tópicos: ${(project.topics || []).join(", ")}.`,
    leftBottomTitle: `${project.title} no ImersaLab`,
    leftBottomText: "Use este bloco para acrescentar uma síntese do tema, instruções de uso e recomendações para leitura orientada antes ou depois da experiência interativa.",
    rightIntro: "A estrutura do guia foi pensada para receber textos curtos, imagens de apoio e destaques conceituais, seguindo um formato visual semelhante a um material didático ilustrado.",
    featureOneTitle: "Conceitos fundamentais",
    featureOneText: `Organize aqui a explicação principal do conteúdo e destaque os conceitos essenciais para compreender o tema abordado no projeto.`,
    featureOneLabel: (project.topics || []).slice(0, 3).join(" • "),
    middleNote: "As seções podem ser adaptadas para teoria, procedimentos, aplicações, curiosidades ou desafios, conforme o objetivo da aula.",
    featureTwoTitle: "Aplicações e aprofundamento",
    featureTwoText: `Utilize este espaço para descrever aplicações práticas, propor comparações, apresentar atividades e orientar o estudante em novas explorações.`,
    featureTwoLabel: (project.resources || []).slice(0, 2).join(" • "),
    bottomNote: "A composição visual desta página segue o modelo solicitado e pode ser personalizada com os textos desejados pelo professor ou pela equipe do projeto.",
    keywords: genericKeywords
  };
}

function initRefraction(){
  const canvas=document.getElementById("rayCanvas"),ctx=canvas.getContext("2d");
  const angle=document.getElementById("angle"), n=document.getElementById("n");
  function resize(){const r=canvas.parentElement.getBoundingClientRect();canvas.width=r.width*devicePixelRatio;canvas.height=Math.max(570,r.height)*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);draw()}
  function draw(){
    const w=canvas.clientWidth,h=canvas.clientHeight,cx=w/2,cy=h/2;
    const ai=+angle.value*Math.PI/180,n2=+n.value/100;
    const ar=Math.asin(Math.min(1,Math.sin(ai)/n2));
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle="#eaf8ff";ctx.fillRect(0,0,w,cy);ctx.fillStyle="#c8edf7";ctx.fillRect(0,cy,w,h-cy);
    ctx.strokeStyle="#52677f";ctx.lineWidth=2;ctx.setLineDash([7,7]);ctx.beginPath();ctx.moveTo(cx,35);ctx.lineTo(cx,h-35);ctx.stroke();ctx.setLineDash([]);
    ctx.strokeStyle="#e54848";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(cx-Math.sin(ai)*230,cy-Math.cos(ai)*230);ctx.lineTo(cx,cy);ctx.stroke();
    ctx.strokeStyle="#2e6bff";ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(ar)*250,cy+Math.cos(ar)*250);ctx.stroke();
    ctx.strokeStyle="#f29c38";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.sin(ai)*180,cy-Math.cos(ai)*180);ctx.stroke();
    ctx.fillStyle="#111827";ctx.font="16px Arial";ctx.fillText("Meio 1 • Ar (n=1,00)",22,35);ctx.fillText(`Meio 2 • n=${n2.toFixed(2)}`,22,cy+30);
    document.getElementById("angleOut").textContent=`${angle.value}°`;
    document.getElementById("nOut").textContent=n2.toFixed(2);
    document.getElementById("incRead").textContent=`${(+angle.value).toFixed(1)}°`;
    document.getElementById("refRead").textContent=`${(ar*180/Math.PI).toFixed(1)}°`;
    document.getElementById("nRead").textContent=n2.toFixed(2);
  }
  angle.oninput=draw;n.oninput=draw;
  document.querySelectorAll(".mat-btn").forEach(b=>b.onclick=()=>{document.querySelectorAll(".mat-btn").forEach(x=>x.classList.remove("active"));b.classList.add("active");n.value=Math.round(parseFloat(b.dataset.n)*100);draw()});
  addEventListener("resize",resize);resize();
}
