//1.*****Ссылки на элементы
const productContainer = document.getElementById("product-container");
//связываем переменную с счетчиком
let cartCount = document.getElementById("cart-count");
const searchInput = document.getElementById("search-input");

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
}
renderProducts(products);

productContainer.addEventListener("click", function (ev) {
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
    shopping.push(foundProduct);
    console.log("В корзине сейчас: ", shopping);

    //Связываем корзину с обработчиком событий и меняем значение
    cartCount.textContent = shopping.length;

    // let foundProduct;
    // for (let i = 0; i < products.length; i++) {
    //   if (products[i].id === id) {
    //     foundProduct = products[i];
    //     break;
    //   }
    // }
    // shopping.push(foundProduct);
    // console.log("В корзине сейчас: ", shopping);
  }
});

searchInput.addEventListener("input", (ev) => {
  const searchTextLow = ev.target.value.toLowerCase();
  const filterProducts = products.filter((item) => {
    return item.name.toLowerCase().includes(searchTextLow);
  });

  renderProducts(filterProducts);
});
