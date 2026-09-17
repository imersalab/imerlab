/*
  CONFIGURAÇÃO DE DOAÇÕES
  ------------------------------------------------------------
  1. PIX:
     Troque pixKey pelo seu CPF/CNPJ/e-mail/celular/chave aleatória.

  2. CHECKOUT ONLINE:
     Cole em checkoutUrl a URL do seu Mercado Pago, Stripe Payment Link,
     PagBank, PayPal ou outro provedor.

  O site não coleta nem armazena dados de cartão.
*/
const DONATION_CONFIG = {
  pixKey: "",
  checkoutUrl: ""
};

let selectedAmount = 50;
let selectedFrequency = "once";
let selectedPayment = "pix";

const money = value => Number(value || 0).toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL"
});

const amountButtons = [...document.querySelectorAll(".amount-btn")];
const frequencyButtons = [...document.querySelectorAll(".frequency-btn")];
const paymentButtons = [...document.querySelectorAll(".payment-option")];

const customAmount = document.getElementById("customAmount");
const summaryAmount = document.getElementById("summaryAmount");
const summaryFrequency = document.getElementById("summaryFrequency");
const summaryPayment = document.getElementById("summaryPayment");

const pixPanel = document.getElementById("pixPanel");
const checkoutPanel = document.getElementById("checkoutPanel");
const pixKeyLabel = document.getElementById("pixKeyLabel");
const copyPixBtn = document.getElementById("copyPixBtn");

function updateSummary(){
  summaryAmount.textContent = money(selectedAmount);
  summaryFrequency.textContent = selectedFrequency === "monthly" ? "Contribuição mensal" : "Doação única";
  summaryPayment.textContent = selectedPayment === "pix" ? "PIX" : "Pagamento online";
}

amountButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    amountButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedAmount = Number(btn.dataset.amount);
    customAmount.value = "";
    updateSummary();
  });
});

customAmount.addEventListener("input", () => {
  const value = Number(customAmount.value);
  if(value > 0){
    amountButtons.forEach(b => b.classList.remove("active"));
    selectedAmount = value;
    updateSummary();
  }
});

frequencyButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    frequencyButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedFrequency = btn.dataset.frequency;
    updateSummary();
  });
});

paymentButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    paymentButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedPayment = btn.dataset.payment;

    pixPanel.classList.toggle("hidden", selectedPayment !== "pix");
    checkoutPanel.classList.toggle("hidden", selectedPayment !== "checkout");
    updateSummary();
  });
});

if(DONATION_CONFIG.pixKey){
  pixKeyLabel.textContent = DONATION_CONFIG.pixKey;
  copyPixBtn.disabled = false;
}

copyPixBtn.addEventListener("click", async () => {
  if(!DONATION_CONFIG.pixKey) return;
  try{
    await navigator.clipboard.writeText(DONATION_CONFIG.pixKey);
    copyPixBtn.textContent = "Copiado!";
    setTimeout(() => copyPixBtn.textContent = "Copiar", 1600);
  }catch{
    copyPixBtn.textContent = "Selecione e copie";
  }
});

const modal = document.getElementById("donationModal");
const modalTitle = document.getElementById("donationModalTitle");
const modalText = document.getElementById("donationModalText");

function showDonationMessage(title, text){
  modalTitle.textContent = title;
  modalText.innerHTML = text;
  modal.classList.add("show");
  modal.setAttribute("aria-hidden","false");
  document.body.classList.add("modal-open");
}

function closeDonationMessage(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
  document.body.classList.remove("modal-open");
}

document.querySelectorAll("[data-close-donation-modal]").forEach(el => {
  el.addEventListener("click", closeDonationMessage);
});

document.getElementById("donateSubmitBtn").addEventListener("click", () => {
  const name = document.getElementById("donorName").value.trim();
  const email = document.getElementById("donorEmail").value.trim();

  if(selectedAmount <= 0){
    showDonationMessage("Escolha um valor", "Informe um valor válido para continuar.");
    return;
  }

  if(!name || !email){
    showDonationMessage(
      "Complete seus dados",
      "Informe seu <strong>nome</strong> e <strong>e-mail</strong> para continuar."
    );
    return;
  }

  if(selectedPayment === "pix"){
    if(!DONATION_CONFIG.pixKey){
      showDonationMessage(
        "Configure sua chave PIX",
        `A página está pronta, mas a chave PIX ainda não foi informada.<br><br>
        Abra <strong>js/doacao.js</strong> e preencha <strong>pixKey</strong> no início do arquivo.`
      );
      return;
    }

    showDonationMessage(
      "Contribuição via PIX",
      `Obrigado pelo apoio!<br><br>
      Valor: <strong>${money(selectedAmount)}</strong><br>
      ${selectedFrequency === "monthly" ? "Modalidade: <strong>mensal</strong><br>" : ""}
      Use a chave PIX:<br><strong>${DONATION_CONFIG.pixKey}</strong>`
    );
    return;
  }

  if(selectedPayment === "checkout"){
    if(!DONATION_CONFIG.checkoutUrl){
      showDonationMessage(
        "Configure o checkout",
        `Adicione o link do seu provedor de pagamentos no campo
        <strong>checkoutUrl</strong>, dentro de <strong>js/doacao.js</strong>.`
      );
      return;
    }

    const separator = DONATION_CONFIG.checkoutUrl.includes("?") ? "&" : "?";
    const target =
      `${DONATION_CONFIG.checkoutUrl}${separator}amount=${encodeURIComponent(selectedAmount)}` +
      `&frequency=${encodeURIComponent(selectedFrequency)}`;

    window.location.href = target;
  }
});

document.addEventListener("keydown", e => {
  if(e.key === "Escape") closeDonationMessage();
});

updateSummary();
