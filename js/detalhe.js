
const params=new URLSearchParams(location.search);
const id=params.get("id")||"luxrefra-ar";
const p=window.PROJETOS.find(x=>x.id===id)||window.PROJETOS[0];
const techName={RA:"Realidade Aumentada",RV:"Realidade Virtual",SIM:"Simulador"};

document.title=`${p.title} | ImersaLab`;
document.getElementById("title").textContent=p.title;
document.getElementById("videoProjectTitle").textContent=p.title;
document.getElementById("videoIcon").textContent=p.icon;
document.getElementById("sideIcon").textContent=p.icon;
document.getElementById("summary").textContent=p.summary;
document.getElementById("tech").textContent=techName[p.tech];
document.getElementById("subject").textContent=p.subject;
document.getElementById("levels").textContent=p.levels.join(", ");
document.getElementById("platforms").textContent=p.platforms.join(", ");
document.getElementById("credits").textContent=p.credits;
document.getElementById("topicList").innerHTML=p.topics.map(x=>`<li>${x}</li>`).join("");
document.getElementById("topicsLong").innerHTML=p.topics.map(x=>`<li>${x}</li>`).join("");
document.getElementById("resources").innerHTML=p.resources.map(x=>`<div class="resource"><b>📄 ${x}</b><small>Material de apoio relacionado a ${p.title}.</small></div>`).join("");
document.getElementById("activities").innerHTML=(p.activities||[]).map((x,i)=>`<div class="resource"><b>Atividade ${i+1}</b><small>${x}</small></div>`).join("");

/* Atividade em PDF para download pelo professor.
   O arquivo fica dentro do próprio projeto em assets/atividades/. */
const activityCard=document.getElementById("activityDownloadCard");
const activityDownload=document.getElementById("activityDownload");
const activityPreview=document.getElementById("activityPreview");
const activityTitle=document.getElementById("activityDownloadTitle");
if(p.activityFile && activityCard && activityDownload){
  activityCard.hidden=false;
  activityTitle.textContent=p.activityTitle || "Atividade investigativa em PDF";
  activityDownload.href=p.activityFile;
  activityDownload.download=`${p.id}-atividade.pdf`;
  activityDownload.title=`Baixar atividade - ${p.title}`;
  if(activityPreview) activityPreview.href=p.activityFile;
}
document.getElementById("thumbRow").innerHTML=[1,2,3].map((x,i)=>`<div class="preview-thumb">${p.icon}<small style="margin-left:8px">Cena ${i+1}</small></div>`).join("");

const video=document.getElementById("promoVideo");
const source=document.getElementById("videoSource");
const fallback=document.getElementById("videoFallback");
const videoPath=`assets/videos/${p.id}.mp4`;

source.src=videoPath;
video.load();
video.addEventListener("canplay",()=>{
  fallback.style.display="none";
  video.play().catch(()=>{});
});
video.addEventListener("error",()=>{fallback.style.display="flex"});

/* Modal de vídeo */
const modal=document.getElementById("videoModal");
const modalVideo=document.getElementById("modalVideo");
const modalFallback=document.getElementById("modalVideoFallback");
document.getElementById("modalProjectIcon").textContent=p.icon;
document.getElementById("modalProjectTitle").textContent=p.title;

function openVideo(){
  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");

  modalFallback.style.display="none";
  modalVideo.style.display="block";
  modalVideo.src=videoPath;
  modalVideo.load();

  const onReady=()=>{
    modalFallback.style.display="none";
    modalVideo.style.display="block";
    modalVideo.play().catch(()=>{});
    modalVideo.removeEventListener("canplay",onReady);
  };
  const onError=()=>{
    modalVideo.style.display="none";
    modalFallback.style.display="flex";
    modalVideo.removeEventListener("error",onError);
  };
  modalVideo.addEventListener("canplay",onReady);
  modalVideo.addEventListener("error",onError);
}

function closeVideo(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
  modalVideo.pause();
  modalVideo.removeAttribute("src");
  modalVideo.load();
}

document.getElementById("promoVideoCard").addEventListener("click",openVideo);
document.getElementById("closeVideoModal").addEventListener("click",closeVideo);
document.querySelectorAll("[data-close-video]").forEach(x=>x.addEventListener("click",closeVideo));
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeVideo()});

/* Abrir experiência passa pela tela de carregamento */
function openExperience(){
  window.open(`loading.html?id=${encodeURIComponent(p.id)}`,"_blank","noopener");
}
document.getElementById("openSimTop").addEventListener("click",openExperience);
document.getElementById("openSimSide").addEventListener("click",openExperience);

/* Guia de estudo: acesso visível diretamente na página do projeto. */
function openStudyGuide(){
  window.open(`simulador.html?id=${encodeURIComponent(p.id)}&view=guide`,`_blank`,`noopener`);
}
document.getElementById("openGuideTop")?.addEventListener("click",openStudyGuide);
document.getElementById("openGuidePanel")?.addEventListener("click",openStudyGuide);
document.getElementById("openGuideSide")?.addEventListener("click",openStudyGuide);


/* Conteúdo exclusivo para projetos de Realidade Aumentada */
if(p.tech==="RA"){
  const arSection=document.getElementById("arKitSection");
  if(arSection) arSection.hidden=false;
  document.querySelectorAll(".ar-only-tab").forEach(tab=>tab.hidden=false);

  const cardImage=p.cardImage || `assets/cards/${p.id}.png`;
  const cardImg=document.getElementById("arCardImage");
  if(cardImg){cardImg.src=cardImage;cardImg.alt=`Card de referência - ${p.title}`;}

  const cardTitle=document.getElementById("arCardTitle");
  if(cardTitle) cardTitle.textContent=`Card de referência — ${p.title}`;

  const cardText=document.getElementById("arCardText");
  if(cardText) cardText.textContent=p.cardText || "Utilize este card como imagem-alvo da experiência.";

  const download=document.getElementById("arDownloadCard");
  if(download){download.href=cardImage;download.download=`${p.id}-card.png`;}

  /* Download automático do aplicativo Android.
     Basta colocar assets/apps/ID-DO-PROJETO.apk no site. */
  const appDownload=document.getElementById("arDownloadApp");
  if(appDownload){
    const appFile=p.appFile || `assets/apps/${p.id}.apk`;
    appDownload.href=appFile;
    appDownload.download=`${p.id}.apk`;
    appDownload.title=`Baixar ${p.title} para Android`;
  }

  document.getElementById("arWatchVideo")?.addEventListener("click",openVideo);

  const lessonPlanList=document.getElementById("lessonPlanList");
  if(lessonPlanList){
    lessonPlanList.innerHTML=(p.lessonPlan||[]).map((item,i)=>`
      <div class="pedagogical-item"><span class="pedagogical-number">${String(i+1).padStart(2,"0")}</span><p>${item}</p></div>
    `).join("");
  }

  const howToUseList=document.getElementById("howToUseList");
  if(howToUseList){
    howToUseList.innerHTML=(p.howToUse||[]).map((item,i)=>`
      <div class="step-item"><div class="step-number">${i+1}</div><div><strong>Etapa ${i+1}</strong><p>${item}</p></div></div>
    `).join("");
  }

  const scriptsList=document.getElementById("lessonScriptsList");
  if(scriptsList){
    scriptsList.innerHTML=(p.lessonScripts||[]).map((item,i)=>`
      <div class="resource"><b>📘 Sugestão ${i+1}</b><small>${item}</small></div>
    `).join("");
  }
}

document.querySelectorAll(".tab-btn").forEach(btn=>btn.addEventListener("click",()=>{
  document.querySelectorAll(".tab-btn").forEach(b=>b.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(panel=>panel.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById(btn.dataset.tab).classList.add("active");
}));

