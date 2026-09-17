const form = document.getElementById("contactForm");
const purposeOptions = [...document.querySelectorAll(".contact-purpose-option")];
const purposeRadios = [...document.querySelectorAll('input[name="Tipo de contato"]')];
const visitFields = document.getElementById("visitFields");
const appSuggestionFields = document.getElementById("appSuggestionFields");
const visitInstitution = document.getElementById("visitInstitution");
const messageLabel = document.getElementById("messageLabel");
const contactMessage = document.getElementById("contactMessage");
const formSubject = document.getElementById("formSubject");
const submitBtn = document.getElementById("contactSubmitBtn");
const contactStatus = document.getElementById("contactStatus");
const emailInput = document.getElementById("contactEmail");
const replyToEmail = document.getElementById("replyToEmail");
const nextInput = document.getElementById("formNext");

function updatePurpose(){
  const selected = purposeRadios.find(r => r.checked)?.value || "Mensagem geral";

  purposeOptions.forEach(option => {
    option.classList.toggle("active", option.querySelector("input")?.checked);
  });

  visitFields.hidden = selected !== "Solicitação de visita";
  appSuggestionFields.hidden = selected !== "Sugestão de novo aplicativo";
  visitInstitution.required = selected === "Solicitação de visita";

  if(selected === "Solicitação de visita"){
    messageLabel.textContent = "Conte o objetivo da visita *";
    contactMessage.placeholder = "Explique o que espera da visita, quais experiências gostaria de conhecer e outras informações importantes...";
    formSubject.value = "Solicitação de visita - ImersaLab";
  } else if(selected === "Sugestão de novo aplicativo"){
    messageLabel.textContent = "Descreva sua ideia de aplicativo *";
    contactMessage.placeholder = "Explique o conteúdo, fenômeno ou atividade que você gostaria de transformar em uma experiência interativa...";
    formSubject.value = "Sugestão de novo aplicativo - ImersaLab";
  } else {
    messageLabel.textContent = "Mensagem *";
    contactMessage.placeholder = "Escreva sua mensagem...";
    formSubject.value = "Novo contato - ImersaLab";
  }
}

purposeRadios.forEach(radio => radio.addEventListener("change", updatePurpose));

function setStatus(message, type = ""){
  if(!contactStatus) return;
  contactStatus.textContent = message;
  contactStatus.className = `contact-form-status ${type}`.trim();
}

/*
  O FormSubmit aceita formulários HTML tradicionais enviados por POST.
  Evitamos fetch/AJAX aqui porque chamadas cross-origin podem ser bloqueadas
  quando o site é testado localmente (file:// ou alguns servidores locais).
*/
form.addEventListener("submit", event => {
  if(!form.reportValidity()){
    event.preventDefault();
    return;
  }

  // Faz com que o botão "Responder" no e-mail recebido use o e-mail do visitante.
  replyToEmail.value = emailInput.value.trim();

  // O FormSubmit exige URL absoluta para _next. Só definimos quando o site
  // estiver publicado em HTTP/HTTPS. Em testes locais, removemos o campo.
  if(window.location.protocol === "http:" || window.location.protocol === "https:"){
    nextInput.value = new URL("contato-sucesso.html", window.location.href).href;
    nextInput.disabled = false;
  } else {
    nextInput.disabled = true;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = "<span>⌛</span> Enviando...";
  setStatus("Enviando sua mensagem...", "sending");

  // NÃO usar preventDefault aqui: o navegador enviará o formulário por POST.
});

// Se o usuário voltar para a página pelo botão Voltar do navegador,
// reabilita o botão de envio.
window.addEventListener("pageshow", () => {
  submitBtn.disabled = false;
  submitBtn.innerHTML = "<span>✉</span> Enviar mensagem";
});

updatePurpose();
