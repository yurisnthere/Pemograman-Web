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

  // --- AKUN SIMULASI UNTUK DEBUGGING ---
  const validUsers = [
    { username: "admin", password: "admin123", role: "admin", id: 1 },
    { username: "user", password: "user123", role: "user", id: 2 }
  ];

  const foundUser = validUsers.find(
    u => u.username === username && u.password === password
  );

  if (foundUser) {
    currentUser = foundUser; // Menggunakan data simulasi
    // Set teks di header sebelum menampilkan main page
    document.getElementById("currentUsername").textContent = currentUser.username;
    document.getElementById("currentRole").textContent = currentUser.role;
    showMainPage();
    return;
  }
  // --- END AKUN SIMULASI ---


  // --- BLOK INI HANYA JIKA ANDA INGIN KEMBALI MENGGUNAKAN API (Backend) ---
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

    // Jika API berhasil, gunakan data dari API
    currentUser = await res.json();
    // Set teks di header sebelum menampilkan main page
    document.getElementById("currentUsername").textContent = currentUser.username;
    document.getElementById("currentRole").textContent = currentUser.role;
    showMainPage();

  } catch (err) {
    console.error(err);
    alert("Gagal login: Periksa koneksi atau backend API.");
  }
}

// ======================
// MAIN PAGE
// ======================
function showMainPage() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("mainPage").classList.remove("hidden");

  // Tampilkan username dan role di header
  document.getElementById("currentUsername").textContent = currentUser.username;
  document.getElementById("currentRole").textContent = currentUser.role;

  if (currentUser.role === "admin") {
    // Menggunakan ID yang sudah disamakan: adminSection
    document.getElementById("adminSection").classList.remove("hidden");
    document.getElementById("cartSection").classList.add("hidden"); // Admin tidak perlu Cart
  } else {
    document.getElementById("adminSection").classList.add("hidden");
    document.getElementById("cartSection").classList.remove("hidden"); // User perlu Cart
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
  const itemsContainer = document.getElementById("cartItems");
  const totalContainer = document.getElementById("cartTotal");
  const totalAmount = document.getElementById("totalAmount");
  const cartCount = document.getElementById("cartCount");

  itemsContainer.innerHTML = "";

  if (cart.length === 0) {
    totalContainer.classList.add("hidden");
    cartCount.textContent = "0 Item";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const div = document.createElement("div");
    div.className = "flex justify-between items-center border-b py-2";

    div.innerHTML = `
      <div>
        <p class="font-semibold">${item.name}</p>
        <p class="text-sm text-gray-500">Rp ${item.price}</p>
      </div>
      <button onclick="removeFromCart(${index})"
        class="text-red-600 hover:text-red-800">
        ❌
      </button>
    `;

    itemsContainer.appendChild(div);
  });

  cartCount.textContent = `${cart.length} Item`;
  totalAmount.textContent = `Rp ${total}`;
  totalContainer.classList.remove("hidden");
}

function addToCart(id) {
  const item = menuItems.find(m => m.id === id);
  cart.push(item);
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
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

  document.getElementById("modalTitle").textContent = "Edit Menu";
  document.getElementById("menuName").value = item.name;
  document.getElementById("menuPrice").value = item.price;
  document.getElementById("menuCategory").value = item.category || "Nasi";
  document.getElementById("menuImage").value = item.image || "";

  document.getElementById("modal").classList.remove("hidden");
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

function openAddModal() {
  editingId = null;
  document.getElementById("modalTitle").textContent = "Tambah Menu Baru";
  document.getElementById("menuName").value = "";
  document.getElementById("menuPrice").value = "";
  document.getElementById("menuCategory").value = "Nasi";
  document.getElementById("menuImage").value = "";
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modal").classList.add("hidden");
}

async function handleSubmitMenu() {
  const name = document.getElementById("menuName").value.trim();
  const price = parseInt(document.getElementById("menuPrice").value);
  const category = document.getElementById("menuCategory").value;
  const image = document.getElementById("menuImage").value || "🍽️";

  if (!name || isNaN(price)) {
    alert("Nama dan harga wajib diisi");
    return;
  }

  const payload = { name, price, category, image };

  if (editingId) {
    await fetch(`/api/menu/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } else {
    await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  closeModal();
  fetchMenu();
}

function handleLogout() {
  currentUser = null;
  cart = [];
  document.getElementById("mainPage").classList.add("hidden");
  document.getElementById("loginPage").classList.remove("hidden");
}





