
const params=new URLSearchParams(location.search);
const id=params.get("id")||"luxrefra-ar";
const p=window.PROJETOS.find(x=>x.id===id)||window.PROJETOS[0];

document.title=`Carregando ${p.title} | ImersaLab`;
document.getElementById("loadingProject").textContent=p.title;

const bar=document.getElementById("loadingBar");
const percent=document.getElementById("loadingPercent");
let value=0;

/* Simula o carregamento visual; em uma build Unity WebGL este progresso pode
   ser substituído pelo callback real de carregamento. */
const timer=setInterval(()=>{
  const increment=value<55?4:value<85?2:1;
  value=Math.min(100,value+increment);
  bar.style.width=value+"%";
  percent.textContent=value+"%";

  if(value>=100){
    clearInterval(timer);
    percent.textContent="Iniciando...";
    setTimeout(()=>{
      location.replace(`simulador.html?id=${encodeURIComponent(p.id)}`);
    },450);
  }
},55);
