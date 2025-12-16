console.log("app.js loaded");

// ======================
// STATE
// ======================
let currentUser = null;
let menuItems = [];
let cart = [];
let editingId = null;


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

  if (currentUser.role === "admin") {
    document.getElementById("adminSection").classList.remove("hidden");
  }

  fetchMenu();
}

// ======================
// FETCH MENU
// ======================
async function fetchMenu() {
  const res = await fetch("/api/menu");
  menuItems = await res.json();
  renderMenu();
  if (currentUser.role === "admin") renderAdminList();
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

async function saveMenuItem() {
  const name = document.getElementById("itemName").value.trim();
  const price = parseInt(document.getElementById("itemPrice").value);

  if (!name || isNaN(price)) {
    alert("Nama & harga wajib diisi");
    return;
  }

  const payload = { name, price };

  if (editingId) {
    await fetch(`/api/menu/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    editingId = null;
  } else {
    await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  document.getElementById("itemName").value = "";
  document.getElementById("itemPrice").value = "";

  fetchMenu();
}


function renderAdminList() {
  const list = document.getElementById("adminList");
  list.innerHTML = "";

  menuItems.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - Rp ${item.price}
      <button onclick="editItem(${item.id})" class="ml-2 text-blue-600">Edit</button>
      <button onclick="deleteItem(${item.id})" class="ml-2 text-red-600">Hapus</button>
    `;
    list.appendChild(li);
  });
}


function editItem(id) {
  const item = menuItems.find(i => i.id === id);
  editingId = id;

  document.getElementById("itemName").value = item.name;
  document.getElementById("itemPrice").value = item.price;
}


async function deleteItem(id) {
  if (!confirm("Yakin hapus menu?")) return;

  await fetch(`/api/menu/${id}`, { method: "DELETE" });
  fetchMenu();
}


async function submitOrder() {
  if (cart.length === 0) {
    alert("Keranjang kosong");
    return;
  }

  const total = cart.reduce((sum, i) => sum + i.price, 0);

  await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: currentUser.id,
      items: cart,
      total
    })
  });

  alert("Pesanan berhasil dibuat 🎉");
  cart = [];
  renderCart();
}


