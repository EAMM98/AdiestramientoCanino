const cart = [];
const cartDrawer = document.querySelector('#cart-drawer');
const overlay = document.querySelector('#overlay');
const cartItems = document.querySelector('#cart-items');
const cartCount = document.querySelector('#cart-count');
const drawerCount = document.querySelector('#drawer-count');
const cartTotal = document.querySelector('#cart-total');

function formatPrice(value) {
  return `${value.toFixed(2).replace('.', ',')} €`;
}

function renderCart() {
  const count = cart.length;
  cartCount.textContent = count;
  drawerCount.textContent = `(${count})`;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = formatPrice(total);

  if (!count) {
    cartItems.innerHTML = '<div class="empty-cart"><span>✦</span><p>Tu cesta está tranquila.<br />Añade algo bonito para el paseo.</p></div>';
    return;
  }

  cartItems.innerHTML = cart.map((item, index) => `
    <div class="cart-line"><span>${item.name}</span><span>${formatPrice(item.price)} <button type="button" data-remove="${index}">Quitar</button></span></div>
  `).join('');
  cartItems.querySelectorAll('[data-remove]').forEach((button) => {
    button.addEventListener('click', () => {
      cart.splice(Number(button.dataset.remove), 1);
      renderCart();
    });
  });
}

function setCartOpen(isOpen) {
  cartDrawer.classList.toggle('open', isOpen);
  overlay.classList.toggle('open', isOpen);
  cartDrawer.setAttribute('aria-hidden', String(!isOpen));
}

document.querySelector('#open-cart').addEventListener('click', () => setCartOpen(true));
document.querySelector('#close-cart').addEventListener('click', () => setCartOpen(false));
overlay.addEventListener('click', () => setCartOpen(false));

document.querySelectorAll('.add-button').forEach((button) => {
  button.addEventListener('click', () => {
    cart.push({ name: button.dataset.product, price: Number(button.dataset.price) });
    renderCart();
    setCartOpen(true);
  });
});

const menuButton = document.querySelector('#menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
menuButton.addEventListener('click', () => mobileNav.classList.toggle('open'));
mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => mobileNav.classList.remove('open')));

document.querySelectorAll('a[href="#"]').forEach((link) => link.addEventListener('click', (event) => event.preventDefault()));

const quizQuestions = [
  { text: '¿Qué situación quieres entender mejor?', options: ['Tira de la correa durante el paseo', 'Ladra cuando llega alguien', 'Le cuesta quedarse solo'] },
  { text: '¿Cuándo sucede con más frecuencia?', options: ['En lugares con muchos estímulos', 'Cuando está excitado o nervioso', 'En momentos de cambio'] },
  { text: '¿Cómo os gustaría sentiros?', options: ['Pasear con más calma', 'Recibir visitas sin estrés', 'Tener más confianza en casa'] }
];
let quizStep = 0;

function showQuizStep() {
  const question = quizQuestions[quizStep];
  document.querySelector('#quiz-content').innerHTML = `<div class="quiz-step">Pregunta ${quizStep + 1} de ${quizQuestions.length}</div><h2>${question.text}</h2><p>No hay respuestas incorrectas. Cuanto mejor os conozcamos, mejor os podemos orientar.</p><div class="quiz-options">${question.options.map((option) => `<button type="button">${option} <span>↗</span></button>`).join('')}</div>`;
  document.querySelectorAll('.quiz-options button').forEach((button) => button.addEventListener('click', () => {
    quizStep += 1;
    if (quizStep < quizQuestions.length) showQuizStep();
    else showQuizResult();
  }));
}

function showQuizResult() {
  document.querySelector('#quiz-content').innerHTML = '<div class="quiz-step">Vuestra pista</div><h2>La calma se <i>entrena.</i></h2><p>Empieza por premiar cada pequeño momento de atención y tranquilidad. Cinco minutos diarios de juego de olfato pueden cambiar la energía de todo un paseo.</p><a class="button button-primary" href="#contacto" id="quiz-contact">Quiero orientación <span>↗</span></a>';
  document.querySelector('#quiz-contact').addEventListener('click', closeQuiz);
}

function closeQuiz() {
  document.querySelector('#quiz-modal').classList.remove('open');
  document.querySelector('#quiz-modal').setAttribute('aria-hidden', 'true');
}

document.querySelector('#start-quiz').addEventListener('click', () => {
  quizStep = 0;
  document.querySelector('#quiz-modal').classList.add('open');
  document.querySelector('#quiz-modal').setAttribute('aria-hidden', 'false');
  showQuizStep();
});
document.querySelector('#close-quiz').addEventListener('click', closeQuiz);
document.querySelector('#quiz-modal').addEventListener('click', (event) => { if (event.target.id === 'quiz-modal') closeQuiz(); });

document.querySelectorAll('.reveal').forEach((element) => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      element.classList.add('visible');
      observer.unobserve(element);
    }
  }, { threshold: 0.12 });
  observer.observe(element);
});

renderCart();
