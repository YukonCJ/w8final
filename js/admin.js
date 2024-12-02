console.clear();
// https://hexschool.github.io/hexschoolliveswagger/
// LV 1｜挑選做前台或後台功能任一頁（後台功能做圓餅圖，做全產品類別營收比重，類別含三項，共有：床架、收納、窗簾）
// LV 2｜挑選做前台或後台功能任一頁（後台功能做圓餅圖，做全品項營收比重，類別含四項，篩選出前三名營收品項，其他 4~8 名都統整為「其它」）
// LV 3｜兩頁前後台都做（後台功能做圓餅圖，做全產品類別營收比重 與 做全品項營收比重 擇一）
// LV 4｜兩頁 JS 撰寫時間在一個工作天八小時內完成
const url = "https://livejs-api.hexschool.io/api/livejs/v1/admin/cjyang";
const token = "zqPKI5j2cfgwzRfjd6kITdqQlmC2";
let orders = [];
// C3.js
let chart = c3.generate({
  bindto: "#chart", // HTML 元素綁定
  data: {
    type: "pie",
    columns: [
      ["Louvre 雙人床架", 1],
      ["Antony 雙人床架", 2],
      ["Anty 雙人床架", 3],
      ["其他", 4],
    ],
    colors: {
      "Louvre 雙人床架": "#DACBFF",
      "Antony 雙人床架": "#9D7FEA",
      "Anty 雙人床架": "#5434A7",
      其他: "#301E5F",
    },
  },
});
// init
function init() {
  fetchOrders();
}
// fetch orders
function fetchOrders() {
  axios
    .get(`${url}/orders`, {
      headers: {
        authorization: token,
      },
    })
    .then((res) => {
      orders = res.data.orders;
      renderTable();
    })
    .catch((err) => console.log(err.message));
}
// render table
function renderTable() {
  console.log(orders);
  const table = document.querySelector(".orderPage-table");
  table.innerHTML = `<thead>
                    <tr>
                        <th>訂單編號</th>
                        <th>聯絡人</th>
                        <th>聯絡地址</th>
                        <th>電子郵件</th>
                        <th>訂單品項</th>
                        <th>訂單日期</th>
                        <th>訂單狀態</th>
                        <th>操作</th>
                    </tr>
                </thead>`;
  orders.forEach((order) => {
    let title;
    if (order.products.length < 2) {
      title = order.products[0]?.title;
    } else {
      order.products.forEach((product) => {
        title += `<p>${product.title}</p>`;
      });
    }
    table.innerHTML += `<tr>
                    <td>${order.id}</td>
                    <td><p>${order.user.name}<br>${order.user.tel}</p></td>
                    <td>${order.user.address}</td>
                    <td>${order.user.email}</td>
                    <td>${title}</td>
                    <td>${order.createdAt}</td>
                    <td class="orderStatus">
                        <a href="#" class="editStatus" data-id="${
                          order.id
                        }" data-status="${order.paid}">${
      order.paid ? "已處理" : "未處理"
    }</a>
                    </td>
                    <td>
                        <input type="button" class="delSingleOrder-Btn" value="刪除">
                    </td>
                </tr>`;
  });
  document.querySelectorAll(".editStatus").forEach((btn) => {
    btn.addEventListener("click", (e) =>
      editStatus(e.target.dataset.id, e.target.dataset.status)
    );
  });
}
// 修改訂單狀態
function editStatus(orderId, status) {
  axios
    .put(
      `${url}/orders`,
      {
        headers: {
          authorization: token,
        },
      },
      {
        data: {
          id: orderId,
          paid: !status,
        },
      }
    )
    .then((res) => {
      orders = res.data.orders;
      renderTable();
      console.log(orders);
    })
    .catch((err) => console.log(err.message));
}
// 刪除全部訂單
function deleteAllOrder() {
  axios
    .delete(`${url}/orders`, {
      headers: {
        authorization: token,
      },
    })
    .then((res) => {
      orders = res.data.orders;
      renderTable();
      console.log(orders);
    })
    .catch((err) => console.log(err.message));
}
// 刪除特定訂單
function deleteItem(orderId) {
  axios
    .delete(`${url}/orders/${orderId}`, {
      headers: {
        authorization: token,
      },
    })
    .then((res) => {
      orders = res.data.orders;
      renderTable();
      console.log(orders);
    })
    .catch((err) => console.log(err.message));
}
init();
