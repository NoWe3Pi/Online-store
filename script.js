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
const productContainer = document.getElementById("product-container");
//связываем переменную с счетчиком
let cartCount = document.getElementById("cart-count");
//Создаю корзину
let shopping = [];

//.forEach()- перебор всех элементов массива и выполнение функции для каждого
products.forEach((item) => {
  const cardHtml = `<div class = "card">
  <h3>${item.name}</h3>
 <img src="${item.img}" alt="${item.name}" ">
  <p>Цена: ${item.price} руб.</p>
  <button class="buy-btn" data-id="${item.id}">Купить</button>
  </div>`;
  //.insertAdjacentHTML() — это метод, который позволяет «вклеить» кусок HTML-кода (строку) в определенное место на странице.
  productContainer.insertAdjacentHTML("beforeend", cardHtml);
});

productContainer.addEventListener("click", function (ev) {
  //«Посмотри на тот элемент, по которому реально кликнули, и проверь — есть ли у него класс 'buy-btn'?»
  if (ev.target.classList.contains("buy-btn")) {
    const id = ev.target.dataset.id;

    //*Код написанный с помощью замены цикла for методомм .find() */
    const foundProduct = products.find((item) => item.id == id);
    shopping.push(foundProduct);
    console.log("В корзине сейчас: ", shopping);

    //Связываем корзину с обработчиком событий и меняем значение
    cartCount.textContent = shopping.length;

    // let foundProduct;
    // for (let i = 0; i < products.length; i++) {
    //   if (products[i].id == id) {
    //     foundProduct = products[i];
    //     break;
    //   }
    // }
    // shopping.push(foundProduct);
    // console.log("В корзине сейчас: ", shopping);
  }
});
