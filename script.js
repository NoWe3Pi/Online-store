//**1 Ссылки на элементы*/
const productContainer = document.getElementById("product-container");
//связываем переменную с счетчиком
let cartCount = document.getElementById("cart-count");
//ссылка на связь в поле ввода input, для сброса не найденных товаров
const searchInput = document.getElementById("search-input");
//привязка ссылки корзины
const shoppingСart = document.getElementById("cart-box");

// Ниже функция превратит 14500 в "14 500" с красивым пробелом
function formattedPrice(formatted) {
  return formatted.toLocaleString("ru-RU");
}

//**2 Данные (Data)*/
const products = [
  { name: "Биокамин", img: "image/Fireplace.jpg", price: 1265, id: 1 },
  { name: "Дренажный насос", img: "image/optimize.jpg", price: 2500, id: 2 },
  {
    name: "Чайник электрический",
    img: "image/electric kettle.jpg",
    price: 1400,
    id: 3,
  },
];
//Корзина
let shopping = [];

//**3. Основная логика */
function renderProducts(productsArray) {
  // 1. Сначала полностью очищаем контейнер, чтобы товары не дублировались
  productContainer.innerHTML = "";

  //Логика если поисковая строка без совпадений с товарами
  if (productsArray.length === 0) {
    productContainer.innerHTML = `<div class='no-products'>
            <p>К сожалению, товары не найдены 🔍</p>
            <button id='clear-search-btn'>Сбросить поиск</button>
        </div>`;

    document
      .getElementById("clear-search-btn")
      .addEventListener("click", (ev) => {
        searchInput.value = ""; // 1. Стерли текст
        renderProducts(products); // 2. Вернули товары
        searchInput.focus(); // 3. Вернули курсор в поле (удобно!)
      });

    return; // Производительность (return): Функция сразу прекращает работу, не пытаясь перебирать массив (хоть он и пустой).
  }

  //**4. ОТРИСОВКА КАРТОЧЕК ТОВАРА */

  //.forEach()- перебор всех элементов массива и выполнение функции для каждого
  productsArray.forEach((item) => {
    //форматирую item.price в productsArray
    const formattedProducts = formattedPrice(item.price);

    const cardHtml = `<div class = "card">
  <h3>${item.name}</h3>
 <img src="${item.img}" alt="${item.name}" ">
  <p>Цена: ${formattedProducts} руб.</p>
  <button class="buy-btn" data-id="${item.id}">Купить</button>
  </div>`;
    //.insertAdjacentHTML() — это метод, который позволяет «вклеить» кусок HTML-кода (строку) в определенное место на странице.
    productContainer.insertAdjacentHTML("beforeend", cardHtml);
  });

  // const totalPriceShopping = shopping.reduce((acc, item) => {
  //   return acc + item.price * item.count;
  // }, 0);

  // // 3. ОТРИСОВКА ИТОГА: Рисуем финальный блок (ВНЕ цикла, один раз)
  // const totalPriceShoppingHtml = `<div class="total-price">
  // <hr>
  // <h3>Итог по оплате: ${totalPriceShopping}</h3>
  // </div>`;
  // productContainer.insertAdjacentHTML("beforeend", totalPriceShoppingHtml);
}
renderProducts(products);

//**5. ИЗМЕНЕНИЕ КНОПКИ КУПИТЬ, ПРИ КЛИКЕ*/
productContainer.addEventListener("click", (ev) => {
  //«Посмотри на тот элемент, по которому реально кликнули, и проверь — есть ли у него класс 'buy-btn'?»
  if (ev.target.classList.contains("buy-btn")) {
    // Добавляем класс анимации .added и меняем текст
    ev.target.classList.add("added");
    ev.target.textContent = "Добавлено!";
    //Ставим таймер на возврат текста и класса через 1 сек
    setTimeout(() => {
      ev.target.classList.remove("added");
      ev.target.textContent = "Купить";
    }, 700);

    const id = parseInt(ev.target.dataset.id);

    const foundProduct = products.find((item) => item.id === id);
    const productInCart = shopping.find((item) => item.id === id);

    if (productInCart) {
      // В JavaScript объекты передаются по ссылке. Когда ты нашел товар через .find() и положил его в переменную productInCart, эта переменная — не копия товара, а «пульт управления» тем самым объектом, который уже лежит в массиве shopping.
      productInCart.count++;
      //Счетчик кнопки 'Купить' после 2-х кликов (2,3,4... и тд)
      ev.target.textContent = `Добавлено (${productInCart.count})`;
    } //выполсяется блок else при первом клике, т.к товара в корзине нет и вернется undefined, что для JavaScript означает (false) в условие if()
    else {
      foundProduct.count = 1; // ВОТ ЗДЕСЬ ПОЯВИЛОСЬ .count!
      shopping.push(foundProduct);
      console.log("В корзине сейчас: ", shopping);
    }

    // Представь, что в shopping лежат: Камин (count: 2) и Светильник (count: 3).
    // Шаг 0: Бухгалтер берет калькулятор. На экране: 0 (наше начальное значение).
    // Шаг 1: Берет Камин. Смотрит в его count (там 2). Прибавляет к нулю: 0 + 2 = 2. Теперь в копилке (acc) лежит 2.
    // Шаг 2: Берет Светильник. Смотрит в его count (там 3). Прибавляет к тому, что уже было: 2 + 3 = 5. Теперь в копилке 5.Финал: Массив закончился. Метод возвращает итоговое число 5 и записывает его в константу totalItems.

    const totalItem = shopping.reduce((acc, item) => acc + item.count, 0);

    //Связываем корзину с обработчиком событий и меняем значение
    cartCount.textContent = totalItem;
  }
});

//Обработчик событий при вводе в поисковую строку
searchInput.addEventListener("input", (ev) => {
  //.trim() убирает лишние пробелы в начале и в конце строки. Так поиск не будет пытаться искать товары, состоящие из одних пробелов.
  const searchTextLow = ev.target.value.toLowerCase().trim();
  //Cоздаю новый массив filterProducts(метод filter так работает), содержащие подстроку из searchTextLow
  const filterProducts = products.filter((item) => {
    return item.name.toLowerCase().includes(searchTextLow);
  });

  renderProducts(filterProducts);

  /*!!!! КЛАССНАЯ ИНФА МОГУ ЗАБЫТЬ пустой .includes("") - true - как будто совпадения есть со всеми карточками, его особенность, так как пустота «есть» в любом тексте
  "Биокамин".includes("Био") — true (совпадение есть)."Биокамин".includes("") — true (пустота «есть» в любом тексте).*/
});

//**6.ОБРАБОТЧИК КЛИКА И ПЕРЕХОД ВНУТРЬ КОРЗИНЫ*/
shoppingСart.addEventListener("click", (ev) => {
  productContainer.innerHTML = "";
  if (shopping.length === 0) {
    productContainer.innerHTML = `<div class='no-products'>
            <p>Добавьте товары в корзину</p>
            <button id='clear-search-btn'>Сбросить поиск</button>
        </div>`;
  }

  document.querySelector("h1").innerHTML = "Корзина";
  shopping.forEach((item) => {
    //форматирую item.price в shopping
    const formattedShopping = formattedPrice(item.price);

    const cardShop = `<div class = "card">
   <h3>${item.name}</h3>
  <img src="${item.img}" alt="${item.name}" ">
   <p>Цена: ${formattedShopping} руб.</p>
   <p>Количество: ${item.count} шт.</p>
   </div>`;
    productContainer.insertAdjacentHTML("beforeend", cardShop);
  });
  const totalPriceShopping = shopping.reduce((acc, item) => {
    return acc + item.price * item.count;
  }, 0);

  // 3. ОТРИСОВКА ИТОГА: Рисуем финальный блок (ВНЕ цикла, один раз)
  const formattedtotalPriceShopping = formattedPrice(totalPriceShopping);
  const totalPriceShoppingHtml = `<div class="total-price-shopping">
  <h3>Итог по оплате: ${formattedtotalPriceShopping}</h3>
  </div>`;
  productContainer.insertAdjacentHTML("beforeend", totalPriceShoppingHtml);
});
