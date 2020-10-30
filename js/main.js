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
const restaurantTitle = document.querySelector('.restaurant-title')
const restaurantRating = document.querySelector('.rating')
const restaurantPrice = document.querySelector('.price')
const restaurantcategory = document.querySelector('.category')
const inputSearch = document.querySelector('.input-search')

/*
// Создает ссылки-элементы из списка
const str = 'сыр \n соус \n кофе';
str.split('\n').map(string => string.trim()).forEach(item => {
  document.body.insertAdjacentHTML('beforeend', `
    <a href='?search=${item}'>${item}</a>
  `);
});
*/

let login = localStorage.getItem('gloDelivery');

const getData = async function (url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу "${url}", статус ошибки ${response.status}!`);
  }

  return await response.json();
}

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

function createCardRestaurant(restaurant) {
  const { image, kitchen, name, price, products, stars, ime_of_delivery: timeOfDelivery } = restaurant;

  const cardRestaurant = document.createElement('a');
  cardRestaurant.classList.add('card', 'card-restaurant');
  cardRestaurant.products = products;
  cardRestaurant.info = { kitchen, name, price, stars };

  const card = `
    <img src=${image} alt=${name} class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery}</span>
      </div>
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
    </div>
  `;
  cardRestaurant.insertAdjacentHTML('beforeend', card);
  cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant);
}

function createCardGood(goods) {
  const card = document.createElement('div');
  card.className = 'card';

  const { description, image, name, price } = goods;

  card.insertAdjacentHTML('beforeend', `
    <img src=${image} alt=${name} class="card-image" />
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}</div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
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

      const { kitchen, name, price, stars } = restaurant.info;

      restaurantTitle.textContent = name;
      restaurantRating.textContent = stars;
      restaurantPrice.textContent = `От ${price} ₽`;
      restaurantcategory.textContent = kitchen;

      // TODO По кнопке браузера Назад возвращать на предыдущую отрисовку
      // location.hash = `#${name}`;

      getData(`./db/${restaurant.products}`).then(function (data) {
        data.forEach(createCardGood);
      });
    }
  } else {
    toggleModalAuth();
  }
}

function init() {
  getData(`./db/partners.json`).then(function (data) {
    data.forEach(createCardRestaurant);
  });

  cartButton.addEventListener("click", toggleModal);
  close.addEventListener("click", toggleModal);
  cardsRestaurants.addEventListener('click', openGoods);

  logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide')
    restaurants.classList.remove('hide')
    menu.classList.add('hide')
  });

  checkAuth();

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

  inputSearch.addEventListener('keypress', function (evt) {
    if (evt.key === 'Enter') {
      const value = evt.target.value;

      if (!value) {
        evt.target.style.backgroundColor = RED_COLOR;
        evt.target.value = '';
        setTimeout(function () {
          evt.target.style.backgroundColor = '';
        }, 1500);

        return;
      }

      getData(`./db/partners.json`)
        .then(function (data) {
          return data.map(function (partner) {
            return partner.products;
          });
        })
        .then(function (linksProduct) {
          cardsMenu.textContent = '';

          linksProduct.forEach(function (link) {
            getData(`./db/${link}`)
              .then(function (data) {
                const resultSearch = data.filter(function (item) {
                  const name = item.name.toLowerCase();

                  return name.includes(value.toLowerCase());
                });

                containerPromo.classList.add('hide');
                restaurants.classList.add('hide');
                menu.classList.remove('hide');

                restaurantTitle.textContent = 'Результат поиска';
                restaurantRating.textContent = '';
                restaurantPrice.textContent = '';
                restaurantcategory.textContent = 'разная кухня';
                resultSearch.forEach(createCardGood);
              });
          });
        });
    }

  });
}

init();