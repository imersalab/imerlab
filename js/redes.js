// Links das redes sociais do projeto.
// Substitua os endereços abaixo pelos perfis oficiais do ImersaLab quando estiverem definidos.
window.REDES_SOCIAIS = {
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
  x: "https://x.com/",
  youtube: "https://www.youtube.com/",
  linkedin: "https://www.linkedin.com/",
  tiktok: "https://www.tiktok.com/"
};

document.querySelectorAll(".social-link[data-social]").forEach(link => {
  const rede = link.dataset.social;
  const url = window.REDES_SOCIAIS[rede];
  if (url) link.href = url;
});
