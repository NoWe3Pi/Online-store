//**1 Ссылки на элементы*/
const productContainer = document.getElementById("product-container");
//связываем переменную с счетчиком
let cartCount = document.getElementById("cart-count");
//ссылка на связь в поле ввода input, для сброса не найденных товаров
const searchInput = document.getElementById("search-input");
//привязка ссылки корзины
const shoppingСart = document.getElementById("cart-box");

/*************** ПРИВЯЗКИ ЛОГИКИ*/
const mainTitle = document.getElementById("main-title");
const backBtn = document.getElementById("back-btn");

//Удаление всех позиций в корзине
const deleteCart = document.getElementById("clear-cart-btn");

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

//**3. Основная логика */
function renderProducts(productsArray) {
  // 1. Сначала полностью очищаем контейнер, чтобы товары не дублировались
  productContainer.innerHTML = "";

  //Логика если поисковая строка без совпадений с товарами
  if (productsArray.length === 0) {
    productContainer.innerHTML = `<div class='no-products'>
            <p>К сожалению, товары не найдены 🔍</p>
            <button id='clear-search-btn' class='clear-search-btn'>Сбросить поиск</button>
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
      shopping.push({ ...foundProduct, count: 1 });
      console.log("В корзине сейчас: ", shopping);
    }

    // shopping.push({ ...foundProduct, count: 1 }); если я тут создаю новый объект а там применяю мутацию, разве новый объект - будет взаимодействовать со всей логикой, как исходный

    // Это отличный вопрос! Ты смотришь прямо в корень проблемы ссылок и копий.Короткий ответ: Да, всё будет работать, но логика «взаимодействия» чуть-чуть изменится. Давай разберем, как именно.Как это работает сейчас (Мутация оригинала)Когда ты делаешь foundProduct.count = 1 и shopping.push(foundProduct):В массиве products и в массиве shopping лежит один и тот же объект (одна ячейка памяти).Плюс: Если ты изменишь товар в одном месте, он изменится везде.Минус: Ты «пачкаешь» исходные данные товаров техническими полями из корзины.Как это будет работать с копией ({...})Когда ты делаешь shopping.push({ ...foundProduct, count: 1 }):Создание: В корзину улетает «клон». Теперь у тебя есть два Камина: один — «витринный» (в products), другой — «покупательский» (в shopping).Связь: Они больше не связаны. Если ты изменишь цену в products, в корзине она останется старой (пока не обновишь).Логика поиска: Твоя строка shopping.find((item) => item.id === id) всё равно будет работать. Почему? Потому что она ищет по id, а id у клона и оригинала одинаковый!А будет ли работать productInCart.count++?Да, и даже лучше!Смотри, какая цепочка событий получится при втором клике:Ты кликаешь «Купить».shopping.find ищет объект в корзине по id.Он находит там твоего клона (который попал туда через {...}).productInCart теперь ссылается на этого клона.productInCart.count++ увеличивает счетчик у клона внутри массива shopping.Итог: Оригинал в products остается «чистым» (без count), а товар в корзине живет своей жизнью, увеличивая свой счетчик. Это именно то, чего хотят профессиональные разработчики — предсказуемость.Есть ли подвох?Единственный момент: если ты вдруг решишь изменить название товара в базе (products), то в корзине оно не изменится автоматически, потому что там лежит копия. Но для корзины это обычно даже хорошо: покупатель зафиксировал товар с тем именем и ценой, которые были в момент добавления.Резюме:Логика не сломается, потому что поиск идет по id, а он неизменен.Код станет чище, так как ты не мутируешь глобальный список товаров.Хочешь попробовать переписать этот кусочек на копирование и проверить, не "отвалился" ли count в корзине?Если интересно, я могу показать, как сделать удаление товара — там мы как раз увидим, как shopping обновляется без мутаций!
    //  ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ?????????????????????????????????? ??????????????????????????????????

    saveToLocalStorage();
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

function switchToPage(page) {
  if (page === "card") {
    mainTitle.textContent = "Корзина"; // Меняем текст (удаляется кнопка)
    mainTitle.prepend(backBtn); // Возвращаем стрелку в начало h1 (приклеиваем ее обратно)
    backBtn.classList.remove("hidden"); // Показываем её
    mainTitle.prepend(deleteCart); // Возвращаем корзину в начало h1 (приклеиваем ее обратно)
    deleteCart.classList.remove("hidden");
  } else {
    mainTitle.innerText = "Витрина товаров";
    backBtn.classList.add("hidden"); // Скрываем стрелку
    renderProducts(products); // Рисуем витрину заново
  }
}

backBtn.addEventListener("click", () => {
  switchToPage("vitrinaVNachalo"); // Возвращаемся на витрину
});

///Удаление всех товаров из корзины путем полной очистки
deleteCart.addEventListener("click", (ev) => {
  const deleteAll = confirm("Хотите очистить всю корзину ?");
  if (deleteAll) {
    console.log("Очистка");
    shopping.length = 0;
    productContainer.innerHTML = "";
    cartCount.textContent = 0;
    localStorage.removeItem(CART_KEY);

    if (shopping.length === 0) {
      productContainer.innerHTML = `<div class='no-products'>
            <p>Корзина Очищена</p>
            <button id='clear-search-btn'>Вернуться на главную</button>
        </div>`;

      const zeroPriceHtml = `<div class="total-price-shopping">
  <h3>Итог по оплате: 0 руб.</h3>
  </div>`;
      productContainer.insertAdjacentHTML("beforeend", zeroPriceHtml);

      document
        .getElementById("clear-search-btn")
        .addEventListener("click", (ev) => {
          if (shopping.length === 0) {
            productContainer.innerHTML = "";
            mainTitle.textContent = "Витрина товаров после обновления";
            renderProducts(products);
            // window.location.reload(); -- костыльный способ вернуться на начальный экран путем перезагрузки страницы(работает дольше- чем код выше) _______
          }
        });

      return; // Производительность (return): Функция сразу прекращает работу, не пытаясь перебирать массив (хоть он и пустой).
    }
  } else {
    console.log("Отмена очистки");
  }
});

// ***************************************************************************************************************************************************************************************

//Корзина
// Учить НИЖе
// 1. Важно: В LocalStorage всё хранится только в виде текста (строки). Если там лежит твой массив, то для браузера это просто длинный набор символов: '[{"id":1,"name":"Apple"}]'.

// 2.JSON.parse — это «переводчик». Он берет текстовую строку и превращает её обратно в настоящий объект или массив JavaScript, с которым можно работать.

//3. || [] (Оператор «ИЛИ»)Это критически важная страховка.Когда пользователь заходит на сайт в самый первый раз, в его браузере еще нет никакой «коробки» 'myCart'.В этом случае localStorage.getItem вернет пустоту (null).JSON.parse(null) не создаст массив.

// Теперь, если ты захочешь переименовать «коробку», ты меняешь только значение в const CART_KEY = "новое_имя". Весь остальной код подхватит его автоматически. Это и есть та самая «легкость правок».
const CART_KEY = "myCart";
let shopping = JSON.parse(localStorage.getItem(CART_KEY)) || [];

//LocalStorage — это очень простое хранилище, оно понимает только текст (строки). Если ты попытаешься «засунуть» туда массив напрямую, вот что произойдет:

function saveToLocalStorage() {
  localStorage.setItem(CART_KEY, JSON.stringify(shopping));
}

//Выносим отдельно в фунцию логику поведения корзины(щас работает только при событии клика на нее, а мы делаем отдельно)

//**6.ОБРАБОТЧИК КЛИКА И ПЕРЕХОД ВНУТРЬ КОРЗИНЫ*/
shoppingСart.addEventListener("click", (ev) => {
  switchToPage("card");
  shoppingСartContent();
});

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
function shoppingСartContent() {
  productContainer.innerHTML = "";

  if (shopping.length === 0) {
    productContainer.innerHTML = `<div class='no-products'>
            <p>Добавьте товары в корзину</p>
            <button id='clear-search-btn'>Сбросить поиск</button>
        </div>`;
    document
      .getElementById("clear-search-btn")
      .addEventListener("click", (ev) => {
        //__________
        if (shopping.length === 0) {
          productContainer.innerHTML = "";
          mainTitle.textContent = "Витрина товаров после обновления";
          renderProducts(products);
          // window.location.reload(); -- костыльный способ вернуться на начальный экран путем перезагрузки страницы(работает дольше- чем код выше) _______
        }
      });

    return; // Производительность (return): Функция сразу прекращает работу, не пытаясь перебирать массив (хоть он и пустой).
  }

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
  <h3>Итог по оплате: ${formattedtotalPriceShopping} руб.</h3>
  </div>`;
  productContainer.insertAdjacentHTML("beforeend", totalPriceShoppingHtml);
}

// В САМОМ НИЗУ:
// 1. Считаем сумму сразу при загрузке скрипта
const totalOnLoad = shopping.reduce((acc, item) => acc + item.count, 0);

// 2. Отрисовываем её в кружочек
if (totalOnLoad > 0) {
  cartCount.textContent = totalOnLoad;
} else {
  cartCount.textContent = "0";
}
