/*
  EQUIPE DO IMERSALAB
  ------------------------------------------------------------
  Para cadastrar um integrante, copie um dos objetos abaixo e altere:
  - nome
  - funcao
  - descricao
  - foto (opcional)
  - linkedin (opcional)
  - email (opcional)

  Exemplo de foto:
  foto: "assets/equipe/nome-do-integrante.jpg"
*/

const integrantes = [
  {
    nome: "Nome do integrante 01",
    funcao: "Coordenação do projeto",
    descricao: "Insira aqui uma breve apresentação do integrante, sua formação, área de atuação e a principal contribuição para o ImersaLab.",
    foto: "",
    linkedin: "",
    email: ""
  },
  {
    nome: "Nome do integrante 02",
    funcao: "Desenvolvimento e tecnologia",
    descricao: "Use este espaço para explicar as competências do integrante e os tipos de aplicativos, simuladores ou experiências em que ele atua.",
    foto: "",
    linkedin: "",
    email: ""
  },
  {
    nome: "Nome do integrante 03",
    funcao: "Conteúdo e educação",
    descricao: "Apresente a experiência com educação, ciência, pesquisa, planejamento pedagógico ou produção dos materiais utilizados no projeto.",
    foto: "",
    linkedin: "",
    email: ""
  },
  {
    nome: "Nome do integrante 04",
    funcao: "Design e experiências imersivas",
    descricao: "Descreva a participação em identidade visual, interfaces, modelagem, realidade aumentada, realidade virtual ou outros recursos do ecossistema.",
    foto: "",
    linkedin: "",
    email: ""
  }
];

const teamGrid = document.getElementById("teamGrid");

function iniciais(nome) {
  return nome
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(parte => parte.charAt(0).toUpperCase())
    .join("") || "IM";
}

function linkSeguro(url) {
  if (!url) return "";
  return /^https?:\/\//i.test(url) ? url : "";
}

function criarCard(integrante) {
  const article = document.createElement("article");
  article.className = "team-member-card";

  const media = integrante.foto
    ? `<div class="team-member-photo"><img src="${integrante.foto}" alt="Foto de ${integrante.nome}" loading="lazy"></div>`
    : `<div class="team-member-photo team-member-placeholder" aria-label="Espaço para fotografia"><span>${iniciais(integrante.nome)}</span><small>FOTO</small></div>`;

  const linkedin = linkSeguro(integrante.linkedin);
  const actions = [];

  if (linkedin) {
    actions.push(`<a href="${linkedin}" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>`);
  }

  if (integrante.email) {
    actions.push(`<a href="mailto:${integrante.email}">E-mail</a>`);
  }

  article.innerHTML = `
    ${media}
    <div class="team-member-body">
      <span class="team-member-role">${integrante.funcao}</span>
      <h3>${integrante.nome}</h3>
      <p>${integrante.descricao}</p>
      ${actions.length ? `<div class="team-member-links">${actions.join("")}</div>` : ""}
    </div>
  `;

  return article;
}

integrantes.forEach(integrante => teamGrid.appendChild(criarCard(integrante)));
