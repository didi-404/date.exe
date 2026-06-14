const typingText = document.querySelector('#typingText');
const hero = document.querySelector('#hero');
const result = document.querySelector('#result');
const yesBtn = document.querySelector('#yesBtn');
const thinkBtn = document.querySelector('#thinkBtn');
const noBtn = document.querySelector('#noBtn');
const actions = document.querySelector('#actions');
const microcopy = document.querySelector('#microcopy');
const resetBtn = document.querySelector('#resetBtn');
const chosenOption = document.querySelector('#chosenOption');
const dateOptions = document.querySelector('.date-options');
const optionButtons = document.querySelectorAll('.date-options button');
const heartsBg = document.querySelector('.hearts-bg');
const dateForm = document.querySelector('#dateForm');
const dateInput = document.querySelector('#dateInput');
const timeInput = document.querySelector('#timeInput');
const messageInput = document.querySelector('#messageInput');
const emailOption = document.querySelector('#emailOption');
const ticketDate = document.querySelector('#ticketDate');
const ticketTime = document.querySelector('#ticketTime');
const sendBtn = document.querySelector('#sendBtn');
const successMessage = document.querySelector('#successMessage');
const canvas = document.querySelector('#confettiCanvas');
const ctx = canvas.getContext('2d');

const phrase = 'pergunta.final = "quer sair comigo?";';
const noMessages = [
  'Erro 404: resposta negativa não encontrada.',
  'O botão recusou ser clicado. Tente o “Sim”.',
  'Sistema detectou indecisão. Recalculando rota...',
  'O “não” entrou em modo fugitivo.',
  'Pensa com carinho, vai.'
];

let index = 0;
let noAttempts = 0;
let confettiParticles = [];
let selectedDate = '';

function typeWriter() {
  if (index <= phrase.length) {
    typingText.textContent = phrase.slice(0, index);
    index += 1;
    setTimeout(typeWriter, 55);
  }
}

typeWriter();

function createFloatingHeart() {
  const heart = document.createElement('span');
  heart.textContent = Math.random() > 0.55 ? '♡' : '❤';
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${14 + Math.random() * 24}px`;
  heart.style.animationDuration = `${5 + Math.random() * 6}s`;
  heart.style.opacity = `${0.12 + Math.random() * 0.38}`;
  heartsBg.appendChild(heart);

  setTimeout(() => heart.remove(), 11000);
}

setInterval(createFloatingHeart, 650);

function moveNoButton() {
  noAttempts += 1;
  noBtn.classList.add('escape');

  const area = actions.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();
  const maxX = Math.max(area.width - btn.width, 0);
  const maxY = Math.max(150 - btn.height, 0);

  noBtn.style.left = `${Math.random() * maxX}px`;
  noBtn.style.top = `${Math.random() * maxY}px`;

  microcopy.textContent = noMessages[noAttempts % noMessages.length];

  if (noAttempts >= 6) {
    noBtn.textContent = 'Tá bom, talvez sim 😳';
    noBtn.classList.remove('btn-no');
    noBtn.classList.add('btn-yes');
  }
}

function acceptDate() {
  hero.classList.add('hidden');
  result.classList.remove('hidden');
  launchConfetti();
  showToast('Resposta registrada: SIM 💘');
}

function thinkHard() {
  microcopy.textContent = 'Processando argumento final: eu pago a primeira sobremesa.';
  thinkBtn.textContent = 'Ok, pensei. Sim 😌';
  thinkBtn.classList.remove('btn-think');
  thinkBtn.classList.add('btn-yes');
  thinkBtn.addEventListener('click', acceptDate, { once: true });
}

yesBtn.addEventListener('click', acceptDate);
thinkBtn.addEventListener('click', thinkHard, { once: true });
noBtn.addEventListener('mouseenter', moveNoButton);
noBtn.addEventListener('click', () => {
  if (noAttempts >= 6) {
    acceptDate();
  } else {
    moveNoButton();
  }
});

function getTodayForInput() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDateBR(value) {
  if (!value) return 'aguardando escolha';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

function updateTicketSchedule() {
  ticketDate.textContent = `Data: ${formatDateBR(dateInput.value)}`;
  ticketTime.textContent = `Horário: ${timeInput.value || 'aguardando escolha'}`;
}

dateInput.min = getTodayForInput();
dateInput.addEventListener('input', updateTicketSchedule);
timeInput.addEventListener('input', updateTicketSchedule);

optionButtons.forEach((button) => {
  button.addEventListener('click', () => {
    optionButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    selectedDate = button.dataset.option;
    chosenOption.textContent = selectedDate;
    emailOption.value = selectedDate;
    showToast(`Opção escolhida: ${selectedDate}`);
  });
});

dateForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (!selectedDate) {
    showToast('Escolha primeiro o tipo de date 💌');
    return;
  }

  if (!dateInput.value || !timeInput.value) {
    showToast('Escolha a data e o horário antes de confirmar.');
    return;
  }

  emailOption.value = selectedDate;
  sendBtn.textContent = 'Enviando para o Diego... 💌';
  sendBtn.disabled = true;

  const payload = {
    _subject: 'Date confirmado 💘',
    _captcha: 'false',
    _template: 'table',
    Resposta: 'Sim, aceitou o date',
    'Opção escolhida': selectedDate,
    'Data escolhida': formatDateBR(dateInput.value),
    'Horário escolhido': timeInput.value,
    Mensagem: messageInput.value || 'Sem mensagem'
  };

  try {
    const response = await fetch(dateForm.action, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error('Falha no envio');
    }

    dateOptions.classList.add('hidden');
    dateForm.classList.add('hidden');
    successMessage.classList.remove('hidden');
    showToast('Seu convite foi enviado, gatinha 💌');
    launchConfetti();
  } catch (error) {
    sendBtn.textContent = 'Confirmar e enviar para o Diego 💌';
    sendBtn.disabled = false;
    showToast('Não consegui enviar agora. Tente novamente em alguns segundos.');
  }
});

resetBtn.addEventListener('click', () => {
  location.reload();
});

function showToast(message) {
  const oldToast = document.querySelector('.toast');
  if (oldToast) oldToast.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2200);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function launchConfetti() {
  confettiParticles = Array.from({ length: 150 }, () => ({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    size: 6 + Math.random() * 8,
    speedX: -8 + Math.random() * 16,
    speedY: -12 + Math.random() * 8,
    gravity: 0.32 + Math.random() * 0.18,
    rotation: Math.random() * 360,
    rotationSpeed: -10 + Math.random() * 20,
    life: 120 + Math.random() * 50,
    char: Math.random() > 0.45 ? '❤' : '✦'
  }));

  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiParticles = confettiParticles.filter((p) => p.life > 0);

  confettiParticles.forEach((p) => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.speedY += p.gravity;
    p.rotation += p.rotationSpeed;
    p.life -= 1;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.globalAlpha = Math.max(p.life / 150, 0);
    ctx.font = `${p.size * 2}px Inter, sans-serif`;
    ctx.fillText(p.char, 0, 0);
    ctx.restore();
  });

  if (confettiParticles.length) {
    requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
}
