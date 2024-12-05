// https://hexschool.github.io/hexschoolliveswagger/
// LV 1｜挑選做前台或後台功能任一頁（後台功能做圓餅圖，做全產品類別營收比重，類別含三項，共有：床架、收納、窗簾）
// LV 2｜挑選做前台或後台功能任一頁（後台功能做圓餅圖，做全品項營收比重，類別含四項，篩選出前三名營收品項，其他 4~8 名都統整為「其它」）
// LV 3｜兩頁前後台都做（後台功能做圓餅圖，做全產品類別營收比重 與 做全品項營收比重 擇一）
// LV 4｜兩頁 JS 撰寫時間在一個工作天八小時內完成
//列表:取得 篩選
//購物車:取得 新增 刪除
//訂單:提交
const url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/cjyang";

// 初始化
let products, carts;
function init() {
  axios
    .get(`${url}/products`)
    .then((res) => {
      products = res.data.products;
      renderOptions();
      renderCards("全部");
      getCart();
      swAlert('Welcome Back', 'error');
    })
    .catch((err) => console.log(err.message));
}
// 渲染下拉選項
const productSelect = document.querySelector(".productSelect");
function renderOptions() {
  productSelect.innerHTML = `<option value="全部" selected>全部</option>`;
  let arr = products.map((item) => item.category);
  let newArr = arr.filter((item, index) => arr.indexOf(item) === index);
  newArr.forEach((item) => {
    productSelect.innerHTML += `<option value="${item}">${item}</option>`;
  });
  productSelect.addEventListener("change", (e) => {
    renderCards(e.target.value);
  });
}
// 渲染商品卡片
const productWrap = document.querySelector(".productWrap");
function renderCards(option) {
  productWrap.innerHTML = "";
  let cardsList =
    option == "全部"
      ? products
      : products.filter((item) => item.category === option);
  cardsList.forEach((item) => {
    productWrap.innerHTML += `<li class="productCard">
        <h4 class="productType">新品</h4>
        <img src="${item.images}" alt="">
        <a href="#" class="addCardBtn" data-id="${
          item.id
        }" data-quantity="1">加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${item.origin_price.toLocaleString()}</del>
        <p class="nowPrice">NT$${item.price.toLocaleString()}</p>
      </li>`;
  });
  document.querySelectorAll(".addCardBtn").forEach((item) => {
    item.addEventListener("click", function (e) {
      const postData = {
        productId: e.target.dataset.id,
        quantity: 1,
      };
      addToCart(postData);
      e.preventDefault();
    });
  });
}
// 取購物車資料
function getCart() {
  axios
    .get(`${url}/carts`)
    .then((res) => {
      carts = res.data;
      renderCart(carts);
    })
    .catch((err) => console.log(err.response.statusText));
}
// 渲染購物車
function renderCart(cartObj) {
  const shoppingCart = document.querySelector(".shoppingCart-table");
  let cartText = "";
  if (cartObj.carts.length === 0) {
    cartText = `<tr><td colspan="4">${
      !cartObj.message
        ? "購物車內已經沒有商品了 RRR ((((；゜Д゜)))"
        : cartObj.message
    }</td></tr>`;
  } else {
    cartObj.carts.forEach((item) => {
      cartText += `<tr>
          <td>
            <div class="cardItem-title">
              <img src="${item.product.images}" alt="">
              <p>${item.product.title}</p>
            </div>
          </td>
          <td>NT$${item.product.price.toLocaleString()}</td>
          <td>${item.quantity}</td>
          <td>NT$${(item.product.price * item.quantity).toLocaleString()}</td>
          <td class="discardBtn">
            <a href="#" class="material-icons removeItem" data-id="${item.id}">
              clear
            </a>
          </td>
        </tr>`;
    });
  }
  shoppingCart.innerHTML = `<tr>
          <th width="40%">品項</th>
          <th width="15%">單價</th>
          <th width="15%">數量</th>
          <th width="15%">金額</th>
          <th width="15%"></th>
        </tr>
        ${cartText}
        <tr>
          <td colspan="2">
            <a href="#" class="discardAllBtn">刪除所有品項</a>
          </td>
          <td></td>
          <td>
            <p>總金額</p>
          </td>
          <td>NT$${cartObj.finalTotal.toLocaleString()}</td>
        </tr>`;
  document.querySelectorAll(".removeItem").forEach((item) => {
    item.addEventListener("click", (e) => {
      removeItem(e.target.dataset.id);
      e.preventDefault();
    });
  });
  document.querySelector(".discardAllBtn").addEventListener("click", (e) => {
    removeAllItems();
    e.preventDefault();
  });
  document.querySelectorAll(".productQuan").forEach((item) => {
    item.addEventListener("change", (e) => {
      const postData = {
        productId: e.target.dataset.id,
        quantity: e.target.value * 1,
      };
      console.log(postData);
      addToCart(postData);
    });
  });
}
// 加入購物車
function addToCart(data) {
  let product = {
    data: { ...data },
  };
  axios
    .post(`${url}/carts`, product)
    .then((res) => {
      console.log(res.data);
      carts = res.data;
      swAlert('已加入購物車', 'success');
      renderCart(carts);
    })
    .catch((err) => console.log(err.response.status));
}
// 刪除購物車內特定產品
function removeItem(id) {
  axios
    .delete(`${url}/carts/${id}`)
    .then((res) => {
      carts = res.data;
      swAlert('已刪除商品', 'success');
      renderCart(carts);
    })
    .catch((err) => console.log(err.response.data));
}
// 清除購物車內全部產品
function removeAllItems() {
  axios
    .delete(`${url}/carts`)
    .then((res) => {
      carts = res.data;
      swAlert('已清空購物車', 'success');
      renderCart(carts);
    })
    .catch((err) => console.log(err.response.data));
}
// 送出購買訂單
function submitOrder() {
  const order = {
    data: {
      user: {
        name: document.getElementById("customerName").value,
        tel: document.getElementById("customerPhone").value,
        email: document.getElementById("customerEmail").value,
        address: document.getElementById("customerAddress").value,
        payment: document.getElementById("tradeWay").value,
      },
    },
  };
  axios
    .post(`${url}/orders`, order)
    .then((res) => {
      console.log(res.data);
      renderCart([]);
      form.reset();
    })
    .catch((err) => console.log(err.response.status));
}
//
function swAlert(text, icon){
  swal({
    title: text,
    icon: icon,
    buttons: {
      ok: true
    }
  })
}
document.querySelector(".orderInfo-btn").addEventListener("click", (e) => {
  e.preventDefault();
  submitOrder();
});
init();

const constraints = {
  name: {
    presence: {
      allowEmpty: false,
      message: "必填",
    },
    type: "string",
  },
  tel: {
    presence: {
      message: "必填",
    },
    length: {
      minimum: 8,
      maximum: 10,
    },
  },
  Email: {
    presence: {
      message: "必填",
    },
    email: true,
  },
  address: {
    presence: {
      message: "必填",
    },
    type: "string",
  },
  tradeWay: {},
};
const form = document.querySelector(".orderInfo-form");
let inputs = document.querySelectorAll(".orderInfo-input");
const submit = document.querySelector(".orderInfo-btn");
inputs.forEach((item) => {
  item.addEventListener("change", () => {
    item.nextElementSibling.textContent = "";
    let errors = validate(form, constraints);
    if (errors) {
      Object.keys(errors).forEach((err) => {
        document.querySelector(
          `.${err}`
        ).nextElementSibling.textContent = `${errors[err]}`;
      });
    }
  });
});
