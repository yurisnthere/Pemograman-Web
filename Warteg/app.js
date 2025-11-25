// =======================================
// SUPABASE CLIENT
// =======================================
const SUPABASE_URL = "https://voxixlbcouozgxiplvur.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZveGl4bGJjb3Vvemd4aXBsdnVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MzU1MjcsImV4cCI6MjA3OTAxMTUyN30.gzcAP5NsfOVC5WUxCfVa50MiN5jSwn2THtMtMRJ-zUw";

const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// =======================================
// STATE
// =======================================
let currentUser = null;
let menuItems = [];
let cart = [];
let editingId = null;

window.onload = () => {
    fetchMenu();
};



// =======================================
// LOGIN
// =======================================
async function handleLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const { data: users, error } = await client
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (error || !users) {
    alert("Username atau password salah");
    return;
  }

  currentUser = users;
  showMainPage();
}


// =======================================
// FETCH MENU
// =======================================
async function fetchMenu() {
  const { data, error } = await client.from("menu_items").select("*");

  if (error) {
    console.error(error);
    alert("Gagal mengambil menu");
    return;
  }

  menuItems = data;
  renderMenuItems();
}


// =======================================
// MAIN PAGE TOGGLE
// =======================================
function showMainPage() {
  document.getElementById("loginPage").classList.add("hidden");
  document.getElementById("mainPage").classList.remove("hidden");

  renderMenuItems();
  renderAdminList();

  if (currentUser.role === "admin") {
    document.getElementById("adminSection").classList.remove("hidden");
    document.getElementById("cartSection").classList.add("hidden");
  } else {
    document.getElementById("cartSection").classList.remove("hidden");
  }
}


// =======================================
// RENDER MENU LIST
// =======================================
function renderMenuItems() {
  const list = document.getElementById("menu-list");
  list.innerHTML = "";

  menuItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "bg-white p-4 rounded shadow";

    div.innerHTML = `
      <div class="font-bold">${item.name}</div>
      <div class="text-gray-600">Rp ${item.price}</div>

      ${
        currentUser && currentUser.role === "user"
        ? `<button onclick="addToCart(${item.id})" class="mt-2 bg-blue-600 text-white px-3 py-1 rounded">Tambah</button>`
        : ``
      }
    `;

    list.appendChild(div);
  });
}


// =======================================
// CART USER
// =======================================
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
    li.textContent = `${item.name} — Rp ${item.price}`;
    list.appendChild(li);
  });
}

async function submitOrder() {
  if (cart.length === 0) {
    alert("Keranjang kosong");
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const { error } = await client.from("orders").insert({
    user_id: currentUser.id,
    items: cart,
    total
  });

  if (error) {
    console.error(error);
    alert("Gagal membuat pesanan");
    return;
  }

  alert("Pesanan berhasil dibuat!");
  cart = [];
  renderCart();
}


// =======================================
// ADMIN PANEL
// =======================================
async function saveMenuItem() {
  const name = document.getElementById("itemName").value.trim();
  const price = parseInt(document.getElementById("itemPrice").value);

  if (!name || isNaN(price)) {
    alert("Nama dan harga harus diisi");
    return;
  }

  if (editingId) {
    await client.from("menu_items").update({ name, price }).eq("id", editingId);
    editingId = null;
  } else {
    await client.from("menu_items").insert({ name, price });
  }

  document.getElementById("itemName").value = "";
  document.getElementById("itemPrice").value = "";

  fetchMenu();
  renderAdminList();
}

function renderAdminList() {
  const list = document.getElementById("adminList");
  list.innerHTML = "";

  menuItems.forEach(item => {
    const li = document.createElement("li");
    li.className = "mb-2";

    li.innerHTML = `
      ${item.name} – Rp ${item.price}
      <button onclick="editItem(${item.id})" class="ml-2 text-blue-600">Edit</button>
      <button onclick="deleteItem(${item.id})" class="ml-2 text-red-600">Hapus</button>
    `;

    list.appendChild(li);
  });
}

function editItem(id) {
  editingId = id;
  const item = menuItems.find(i => i.id === id);

  document.getElementById("itemName").value = item.name;
  document.getElementById("itemPrice").value = item.price;
}

async function deleteItem(id) {
  await client.from("menu_items").delete().eq("id", id);
  fetchMenu();
  renderAdminList();
}
