console.log("app.js loaded");

// ======================
// STATE
// ======================
let currentUser = null;
let menuItems = [];
let cart = [];

// ======================
// LOGIN
// ======================
async function handleLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      alert("Username atau password salah");
      return;
    }

    currentUser = await res.json();
    showMainPage();

  } catch (err) {
    console.error(err);
    alert("Gagal login");
  }
}

// ======================
// MAIN PAGE
// ======================
function showMainPage() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("mainPage").classList.remove("hidden");
  fetchMenu();
}

// ======================
// FETCH MENU
// ======================
async function fetchMenu() {
  const res = await fetch("/api/menu");
  menuItems = await res.json();
  renderMenu();
}

// ======================
// RENDER MENU
// ======================
function renderMenu() {
  const list = document.getElementById("menu-list");
  list.innerHTML = "";

  menuItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded shadow";

    div.innerHTML = `
      <img src="${item.image}" class="w-full h-32 object-cover rounded mb-2">
      <div class="font-bold">${item.name}</div>
      <div>Rp ${item.price}</div>
      <button onclick="addToCart(${item.id})"
        class="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
        Tambah
      </button>
    `;

    list.appendChild(div);
  });

  document.getElementById("cartSection").classList.remove("hidden");
}

// ======================
// CART
// ======================
function addToCart(id) {
  const item = menuItems.find(m => m.id === id);
  cart.push(item);
  renderCart();
}

function renderCart() {
  const list = document.getElementById("cartList");
  list.innerHTML = "";

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - Rp ${item.price}`;
    list.appendChild(li);
  });
}
