'use strict';
import Swiper from 'https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js'

const RED_COLOR = '#ff0000';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const loginPassword = document.querySelector('#password');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');

const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');


let login = localStorage.getItem('gloDelivery');

function validName(str) {
  // Имя пользователя (с ограничением 2-20 символов, которыми могут быть буквы и цифры, первый символ обязательно буква)
  const regNName = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;

  return regNName.test(str);
}

function validPassword(str) {
  // Пароль (Строчные и прописные латинские буквы, цифры, спецсимволы. Минимум 8 символов)
  const regNName = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

  return regNName.test(str);
}

function toggleModal() {
  modal.classList.toggle("is-open");
}

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");

  if (modalAuth.classList.contains("is-open")) {
    disableScroll();
  } else {
    enableScroll();
  }
}

function clearForm() {
  loginPassword.value = '';
  loginInput.style.borderColor = '';
  loginInput.value = '';
  loginPassword.style.borderColor = '';
}

function authorized() {
  function logOut() {
    login = null;
    localStorage.removeItem('gloDelivery');

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';

    buttonOut.removeEventListener('click', logOut);

    checkAuth();
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'block';

  buttonOut.addEventListener('click', logOut);
}

function noAuthorized() {
  function logIn(evt) {
    evt.preventDefault();

    if (validName(loginInput.value) && validPassword(loginPassword.value)) {
      login = loginInput.value;
      localStorage.setItem('gloDelivery', login);
      toggleModalAuth();

      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', clearForm);
      logInForm.removeEventListener('submit', logIn);

      logInForm.reset();
      checkAuth();
    } else if (!validName(loginInput.value)) {
      alert('Имя пользователя: с ограничением 2-20 символов, которыми могут быть буквы и цифры, первый символ обязательно буква');
      loginInput.style.borderColor = RED_COLOR;
      loginInput.value = '';
    } else if (!validPassword(loginPassword.value)) {
      alert('Пароль: cтрочные и прописные латинские буквы, цифры, спецсимволы. Минимум 8 символов');
      loginPassword.style.borderColor = RED_COLOR;
      loginPassword.value = '';
    }
  }

  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', clearForm);
  logInForm.addEventListener('submit', logIn);
  modalAuth.addEventListener('click', function (evt) {
    if (evt.target.classList.contains('is-open')) {
      toggleModalAuth();
    }
  });
}

function checkAuth() {
  if (login) {
    authorized();
  } else {
    noAuthorized();
  }
}

function createCardRestaurant() {
  const card = `
    <a class="card card-restaurant">
      <img src="img/tanuki/preview.jpg" alt="image" class="card-image" />
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">Тануки</h3>
          <span class="card-tag tag">60 мин</span>
        </div>
        <div class="card-info">
          <div class="rating">
            4.5
          </div>
          <div class="price">От 1 200 ₽</div>
          <div class="category">Суши, роллы</div>
        </div>
      </div>
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);

}

function createCardGood() {
  const card = document.createElement('div');
  card.className = 'card';

  card.insertAdjacentHTML('beforeend', `
    <img src="img/pizza-plus/pizza-classic.jpg" alt="image" class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">Пицца Классика</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">Соус томатный, сыр «Моцарелла», сыр «Пармезан», ветчина, салями, грибы.</div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">510 ₽</strong>
      </div>
    </div>
  `);

  cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(evt) {
  const target = evt.target;
  const restaurant = target.closest('.card-restaurant');

  if (login) {
    if (restaurant) {
      cardsMenu.textContent = '';

      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      createCardGood();
      createCardGood();
      createCardGood();
    }
  } else {
    toggleModalAuth();
  }
}

cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);
cardsRestaurants.addEventListener('click', openGoods);

logo.addEventListener('click', function () {
  containerPromo.classList.remove('hide')
  restaurants.classList.remove('hide')
  menu.classList.add('hide')
});

checkAuth();

createCardRestaurant();
createCardRestaurant();
createCardRestaurant();

// Слайдер

new Swiper('.swiper-container', {
  sliderPerView: 1,
  loop: true,
  autoplay: true,
  /*
  grapCursor: true,
  effect: 'cube',
  cubeEffect: {
    shadow: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  */
  effect: 'coverflow',
  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true,
  },
})