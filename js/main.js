'use strict';
import Swiper from 'https://unpkg.com/swiper/swiper-bundle.esm.browser.min.js'

// Слайдер
const swiper = new Swiper('.swiper-container', {
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
const restaurantTitle = document.querySelector('.restaurant-title');
const restaurantRating = document.querySelector('.rating');
const restaurantPrice = document.querySelector('.price');
const restaurantcategory = document.querySelector('.category');
const inputSearch = document.querySelector('.input-search');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCart = document.querySelector('.clear-cart');

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
const cart = JSON.parse(localStorage.getItem(`gloDelivery_${login}`)) || [];

function saveCart() {
  localStorage.setItem(`gloDelivery_${login}`, JSON.stringify(cart));
}

function downloadCart() {
  if (localStorage.getItem(`gloDelivery_${login}`)) {
    const data = JSON.parse(localStorage.getItem(`gloDelivery_${login}`));
    cart.pussh(...data);
  }
}

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

  // TODO return regNName.test(str);
  return true;
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

function returnMain() {
  containerPromo.classList.remove('hide');
  swiper.init();
  restaurants.classList.add('hide');
  menu.classList.remove('hide');
}

function authorized() {
  function logOut() {
    login = null;
    cart.length = 0;
    localStorage.removeItem('gloDelivery');

    buttonAuth.style.display = '';
    userName.style.display = '';
    buttonOut.style.display = '';

    buttonOut.removeEventListener('click', logOut);

    checkAuth();
    returnMain();
  }

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = 'inline';
  buttonOut.style.display = 'flex';
  cartButton.style.display = 'flex';

  buttonOut.addEventListener('click', logOut);
}

function noAuthorized() {
  function logIn(evt) {
    evt.preventDefault();

    if (validName(loginInput.value) && validPassword(loginPassword.value)) {
      login = loginInput.value;
      localStorage.setItem('gloDelivery', login);
      toggleModalAuth();
      downloadCart();

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
  const { description, image, name, price, id } = goods;

  card.insertAdjacentHTML('beforeend', `
    <img src=${image} alt=${name} class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}</div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} ₽</strong>
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
      swiper.destroy(false);
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

function addToCart(evt) {
  const target = evt.target;
  const buttonAddToCart = target.closest('.button-add-cart');

  if (buttonAddToCart) {
    const card = target.closest('.card');
    const image = card.querySelector('.card-image').src;
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;

    const food = cart.find(function (item) {
      return item.id === id;
    });

    if (food) {
      food.count++;
    } else {
      cart.push({ id, image, title, cost, count: 1 });
    }

    saveCart();
  }
}

function renderCart() {
  modalBody.textContent = '';

  cart.forEach(function ({ id, image, title, cost, count }) {
    const itemCart = `
      <div class="food-row">
        <div class="foot-item">
          <img src=${image} alt="${title}">
          <span class="food-name">${title}</span>
        </div>
        <div class="food-desc">
          <strong class="food-price">${cost}</strong>
          <div class="food-counter">
            <button class="counter-button counter-minus" data-id=${id}>-</button>
            <span class="counter">${count}</span>
            <button class="counter-button counter-plus" data-id=${id}>+</button>
          </div>
        </div>
      </div>
    `;
    /*
    const itemCart = `
      <div class="food-row">
        <span class="food-name">${title}</span>
        <strong class="food-price">${cost}</strong>
        <div class="food-counter">
          <button class="counter-button counter-minus" data-id=${id}>-</button>
          <span class="counter">${count}</span>
          <button class="counter-button counter-plus" data-id=${id}>+</button>
        </div>
      </div>
    `;
    */

    modalBody.insertAdjacentHTML('beforeend', itemCart);
  });

  const totalPrice = cart.reduce(function (result, item) {
    return result + (parseFloat(item.cost) * item.count);
  }, 0);

  modalPrice.textContent = `${totalPrice} ₽`;
  saveCart();
}

function changeCount(evt) {
  const target = evt.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find(function (item) {
      return item.id === target.dataset.id;
    });

    if (target.classList.contains('counter-minus')) {
      food.count--;

      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    };

    if (target.classList.contains('counter-plus')) {
      food.count++;
    }

    renderCart();
  }
}

function init() {
  getData(`./db/partners.json`).then(function (data) {
    data.forEach(createCardRestaurant);
  });

  cartButton.addEventListener("click", function () {
    renderCart();
    toggleModal();
  });

  buttonClearCart.addEventListener('click', function () {
    cart.length = 0;
    renderCart();
    renderCart();
  });

  logo.addEventListener('click', function () {
    containerPromo.classList.remove('hide');
    swiper.init();
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  });

  modalBody.addEventListener('click', changeCount);
  cardsMenu.addEventListener('click', addToCart);
  close.addEventListener('click', toggleModal);
  cardsRestaurants.addEventListener('click', openGoods);

  checkAuth();

  inputSearch.addEventListener('keyup', function (evt) {
    const value = evt.target.value;

    if (!value && evt.key === 'Enter') {
      evt.target.style.backgroundColor = RED_COLOR;
      evt.target.value = '';
      setTimeout(function () {
        evt.target.style.backgroundColor = '';
      }, 1500);

      return;
    }

    if (value.length < 3) {
      return;
    }

    if (evt.which == "undefined") {
    } else if (evt.which == "number" && evt.which > 0) {
      if (evt.ctrlKey || evt.metaKey || evt.altKey || evt.which === 8) {
        return;
      } else if (!/^[А-Яа-яЁё]$/.test(evt.key)) {
        return;
      }
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
              swiper.destroy(false);
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
  });
}

init();