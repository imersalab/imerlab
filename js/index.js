
function renderHomeVideos(){
  const grid=document.getElementById("homeVideoGrid");
  if(!grid) return;

  const featured=window.PROJETOS.slice(0,6);

  grid.innerHTML=featured.map(p=>`
    <article class="home-video-card">
      <div class="home-video-media" data-video-id="${p.id}">
        <video muted playsinline preload="metadata">
          <source src="assets/videos/${p.id}.mp4" type="video/mp4">
        </video>

        <div class="home-video-fallback">
          <span class="home-video-icon">${p.icon}</span>
          <strong>${p.title}</strong>
          <small>${p.subject} • ${techName[p.tech]}</small>
        </div>

        <div class="home-video-play">▶</div>
      </div>

      <div class="home-video-info">
        <div>
          <h3>${p.title}</h3>
          <p>${p.summary}</p>
        </div>

        <a href="detalhe.html?id=${encodeURIComponent(p.id)}"
           target="_blank"
           rel="noopener">
          Conhecer projeto ↗
        </a>
      </div>
    </article>
  `).join("");

  grid.querySelectorAll(".home-video-media").forEach(media=>{
    const preview=media.querySelector("video");
    const fallback=media.querySelector(".home-video-fallback");

    preview.addEventListener("canplay",()=>{
      fallback.style.opacity="0";
    });

    preview.addEventListener("error",()=>{
      fallback.style.opacity="1";
    });

    media.addEventListener("click",()=>{
      const id=media.dataset.videoId;
      const projeto=window.PROJETOS.find(p=>p.id===id);
      openHomeVideo(projeto);
    });
  });
}


const techName={RA:"Realidade Aumentada",RV:"Realidade Virtual",SIM:"Simulador"};
const techClass={RA:"ra",RV:"rv",SIM:"sim"};
const cards=document.getElementById("cards");
const search=document.getElementById("searchInput");
const sort=document.getElementById("sortSelect");
const checks=[...document.querySelectorAll("[data-filter]")];

function selected(type){return checks.filter(x=>x.dataset.filter===type&&x.checked).map(x=>x.value)}
function match(value, wanted){
  if(!wanted.length)return true;
  const arr=Array.isArray(value)?value:[value];
  return wanted.some(v=>arr.includes(v));
}
function render(){
  const f={tech:selected("tech"),subject:selected("subject"),level:selected("level"),platform:selected("platform"),status:selected("status")};
  const term=search.value.trim().toLowerCase();
  let list=window.PROJETOS.filter(p=>{
    const text=[p.title,p.summary,p.subject,p.tech,...p.levels,...p.platforms,...p.topics].join(" ").toLowerCase();
    return (!term||text.includes(term))&&match(p.tech,f.tech)&&match(p.subject,f.subject)&&match(p.levels,f.level)&&match(p.platforms,f.platform)&&match(p.status,f.status);
  });
  if(sort.value==="za") list.sort((a,b)=>b.title.localeCompare(a.title,"pt-BR"));
  else if(sort.value==="tech") list.sort((a,b)=>a.tech.localeCompare(b.tech)||a.title.localeCompare(b.title,"pt-BR"));
  else list.sort((a,b)=>a.title.localeCompare(b.title,"pt-BR"));
  cards.innerHTML=list.map(p=>`
    <a class="card" href="detalhe.html?id=${encodeURIComponent(p.id)}" target="_blank" rel="noopener">
      <div class="card-cover ${techClass[p.tech]}">
        <span class="badge">${techName[p.tech]}</span><span class="card-icon">${p.icon}</span>
      </div>
      <div class="card-body">
        <div class="tags"><span class="tag">${p.subject}</span><span class="tag">${p.status}</span><span class="tag">${p.levels[0]}</span></div>
        <h3>${p.title}</h3><p>${p.summary}</p>
        <div class="card-foot"><small>${p.platforms.join(" • ")}</small><span class="btn btn-primary">Abrir ↗</span></div>
      </div>
    </a>`).join("");
  document.getElementById("resultCount").textContent=list.length;
  document.getElementById("activeCount").textContent=`Filtros ativos: ${checks.filter(x=>x.checked).length+(term?1:0)}`;
  document.getElementById("empty").style.display=list.length?"none":"block";
}
checks.forEach(x=>x.addEventListener("change",render)); search.addEventListener("input",render); sort.addEventListener("change",render);
document.getElementById("clearFilters").onclick=()=>{checks.forEach(x=>x.checked=false);search.value="";sort.value="az";render()};
document.getElementById("mobileFilter").onclick=()=>document.getElementById("filters").classList.toggle("show");


const homeVideoModal=document.getElementById("homeVideoModal");
const homeModalVideo=document.getElementById("homeModalVideo");
const homeModalFallback=document.getElementById("homeModalVideoFallback");
const homeModalProjectIcon=document.getElementById("homeModalProjectIcon");
const homeModalProjectTitle=document.getElementById("homeModalProjectTitle");

function openHomeVideo(projeto){
  if(!projeto) return;

  homeModalProjectIcon.textContent=projeto.icon;
  homeModalProjectTitle.textContent=projeto.title;

  homeVideoModal.classList.add("show");
  homeVideoModal.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");

  homeModalFallback.style.display="none";
  homeModalVideo.style.display="block";
  homeModalVideo.src=`assets/videos/${projeto.id}.mp4`;
  homeModalVideo.load();

  const ready=()=>{
    homeModalFallback.style.display="none";
    homeModalVideo.style.display="block";
    homeModalVideo.play().catch(()=>{});
    homeModalVideo.removeEventListener("canplay",ready);
  };

  const failed=()=>{
    homeModalVideo.style.display="none";
    homeModalFallback.style.display="flex";
    homeModalVideo.removeEventListener("error",failed);
  };

  homeModalVideo.addEventListener("canplay",ready);
  homeModalVideo.addEventListener("error",failed);
}

function closeHomeVideo(){
  homeVideoModal.classList.remove("show");
  homeVideoModal.setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");

  homeModalVideo.pause();
  homeModalVideo.removeAttribute("src");
  homeModalVideo.load();
}

document.getElementById("homeCloseVideoModal")?.addEventListener("click",closeHomeVideo);

document.querySelectorAll("[data-home-close-video]").forEach(el=>{
  el.addEventListener("click",closeHomeVideo);
});

document.addEventListener("keydown",e=>{
  if(e.key==="Escape" && homeVideoModal?.classList.contains("show")){
    closeHomeVideo();
  }
});

render();
renderHomeVideos();
