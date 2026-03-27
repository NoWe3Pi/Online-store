//1.*****Ссылки на элементы
const productContainer = document.getElementById("product-container");
//связываем переменную с счетчиком
let cartCount = document.getElementById("cart-count");
//ссылка на связь в поле ввода input, для сброса не найденных товаров
const searchInput = document.getElementById("search-input");

//привязка ссылки корзины
const shoppingСart = document.getElementById("cart-box");

//2***** Данные (Data)
//Создаю товары
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
//Создаю корзину
let shopping = [];

//3.*****
//.forEach()- перебор всех элементов массива и выполнение функции для каждого
function renderProducts(productsArray) {
  // 1. Сначала полностью очищаем контейнер, чтобы товары не дублировались
  productContainer.innerHTML = "";

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

  // 2. Используем именно productsArray (тот, что пришел в скобках)
  productsArray.forEach((item) => {
    const cardHtml = `<div class = "card">
  <h3>${item.name}</h3>
 <img src="${item.img}" alt="${item.name}" ">
  <p>Цена: ${item.price} руб.</p>
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

productContainer.addEventListener("click", (ev) => {
  //«Посмотри на тот элемент, по которому реально кликнули, и проверь — есть ли у него класс 'buy-btn'?»
  if (ev.target.classList.contains("buy-btn")) {
    // 1. Сразу добавляем класс анимации и меняем текст
    // ev.target.classList.add("added");
    // ev.target.textContent = "Добавлено!";

    // // 2. Ставим таймер на возврат текста и класса через 1 сек
    // setTimeout(() => {
    //     ev.target.classList.remove("added");
    //     ev.target.textContent = "Купить";
    // }, 1000);

    ev.target.classList.add("added");
    ev.target.textContent = "Добавлено!";
    setTimeout(() => {
      ev.target.classList.remove("added");
      ev.target.textContent = "Купить";
    }, 700);

    const id = parseInt(ev.target.dataset.id);

    //*Код написанный с помощью замены цикла for методомм .find() */
    const foundProduct = products.find((item) => item.id === id);
    const productInCart = shopping.find((item) => item.id === id);

    if (productInCart) {
      // В JavaScript объекты передаются по ссылке. Когда ты нашел товар через .find() и положил его в переменную productInCart, эта переменная — не копия товара, а «пульт управления» тем самым объектом, который уже лежит в массиве shopping.
      productInCart.count++;
      //Счетчик после кнопки купить от 2 нажатий начинает отображаться
      ev.target.textContent = `Добавлено (${productInCart.count})`;
    } else {
      foundProduct.count = 1; // ВОТ ЗДЕСЬ ПОЯВИЛОСЬ .count!
      shopping.push(foundProduct);
      console.log("В корзине сейчас: ", shopping);
    }
    // «Пройдись по списку и сократи (reduce)чисел до одного числа(суммы)»
    // Как это происходит в памяти (пошагово):
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
  const filterProducts = products.filter((item) => {
    return item.name.toLowerCase().includes(searchTextLow);
  });

  renderProducts(filterProducts);
});

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
    const cardShop = `<div class = "card">
   <h3>${item.name}</h3>
  <img src="${item.img}" alt="${item.name}" ">
   <p>Цена: ${item.price} руб.</p>
   <p>Количество: ${item.count} шт.</p>
   </div>`;
    productContainer.insertAdjacentHTML("beforeend", cardShop);
  });
  const totalPriceShopping = shopping.reduce((acc, item) => {
    return acc + item.price * item.count;
  }, 0);

  // 3. ОТРИСОВКА ИТОГА: Рисуем финальный блок (ВНЕ цикла, один раз)
  const totalPriceShoppingHtml = `<div class="total-price-shopping">
  <h3>Итог по оплате: ${totalPriceShopping}</h3>
  </div>`;
  productContainer.insertAdjacentHTML("beforeend", totalPriceShoppingHtml);
});
