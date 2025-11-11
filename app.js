// ========================
// STATE MANAGEMENT
// ========================
let currentUser = null;
let menuItems = [];
let cart = [];
let orders = [];
let editingItemId = null;

// ========================
// INITIALIZATION
// ========================
function initializeData() {
  // Data dummy untuk testing
  // Nanti akan diganti dengan API call
  menuItems = [
    { id: 1, name: 'Nasi Putih', price: 5000, category: 'Nasi', image: '🍚' },
    { id: 2, name: 'Ayam Goreng', price: 15000, category: 'Lauk', image: '🍗' },
    { id: 3, name: 'Tempe Goreng', price: 3000, category: 'Lauk', image: '🟫' },
    { id: 4, name: 'Sayur Asem', price: 5000, category: 'Sayur', image: '🥗' },
    { id: 5, name: 'Es Teh Manis', price: 3000, category: 'Minuman', image: '🧋' },
  ];
}

// ========================
// AUTH FUNCTIONS
// ========================
function handleLogin() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if (!username || !password) {
    alert('Username dan password harus diisi!');
    return;
  }
  
  // TODO: Ganti dengan API call
  // const response = await fetch('/api/login', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ username, password })
  // });
  // const data = await response.json();
  
  // Simulasi login
  if ((username === 'admin' && password === 'admin123') || 
      (username === 'user' && password === 'user123')) {
    currentUser = {
      username: username,
      role: username === 'admin' ? 'admin' : 'user'
    };
    
    showMainPage();
  } else {
    alert('Username atau password salah!');
  }
}

function handleLogout() {
  if (confirm('Yakin ingin logout?')) {
    currentUser = null;
    cart = [];
    orders = [];
    
    document.getElementById('mainPage').classList.add('hidden');
    document.getElementById('loginPage').classList.remove('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('cartSection').classList.add('hidden');
  }
}

function showMainPage() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('mainPage').classList.remove('hidden');
  document.getElementById('currentUsername').textContent = currentUser.username;
  document.getElementById('currentRole').textContent = currentUser.role;
  
  if (currentUser.role === 'admin') {
    document.getElementById('adminPanel').classList.remove('hidden');
  } else {
    document.getElementById('cartSection').classList.remove('hidden');
  }
  
  initializeData();
  renderMenuItems();
  renderOrders();
}

// ========================
// MENU FUNCTIONS
// ========================
function renderMenuItems() {
  // TODO: Ganti dengan API call
  // const response = await fetch('/api/menu');
  // menuItems = await response.json();
  
  const menuList = document.getElementById('menuList');
  menuList.innerHTML = '';
  
  if (menuItems.length === 0) {
    menuList.innerHTML = '<p class="text-gray-500 text-center py-8 col-span-full">Belum ada menu tersedia</p>';
    return;
  }
  
  menuItems.forEach(item => {
    const menuCard = createMenuCard(item);
    menuList.appendChild(menuCard);
  });
}

function createMenuCard(item) {
  const menuCard = document.createElement('div');
  menuCard.className = 'border border-gray-200 rounded-xl p-4 hover:shadow-lg transition';
  
  let actionButtons = '';
  if (currentUser.role === 'user') {
    actionButtons = `
      <button onclick="addToCart(${item.id})" class="w-full bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition">
        ➕ Tambah
      </button>
    `;
  } else {
    actionButtons = `
      <div class="flex space-x-2">
        <button onclick="openEditModal(${item.id})" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          ✏️ Edit
        </button>
        <button onclick="deleteMenuItem(${item.id})" class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition">
          🗑️ Hapus
        </button>
      </div>
    `;
  }
  
  menuCard.innerHTML = `
    <div class="text-6xl text-center mb-3">${item.image}</div>
    <h3 class="text-xl font-bold text-gray-800 mb-2">${item.name}</h3>
    <p class="text-sm text-gray-600 mb-2">${item.category}</p>
    <p class="text-2xl font-bold text-orange-600 mb-4">Rp ${item.price.toLocaleString('id-ID')}</p>
    ${actionButtons}
  `;
  
  return menuCard;
}

function deleteMenuItem(itemId) {
  if (confirm('Yakin ingin menghapus menu ini?')) {
    // TODO: Ganti dengan API call
    // await fetch(`/api/menu/${itemId}`, { method: 'DELETE' });
    
    menuItems = menuItems.filter(item => item.id !== itemId);
    renderMenuItems();
    alert('Menu berhasil dihapus!');
  }
}

// ========================
// CART FUNCTIONS
// ========================
function addToCart(itemId) {
  const item = menuItems.find(m => m.id === itemId);
  
  if (!item) {
    alert('Menu tidak ditemukan!');
    return;
  }
  
  const existing = cart.find(c => c.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  
  renderCart();
}

function updateCartQty(itemId, qty) {
  if (qty <= 0) {
    cart = cart.filter(c => c.id !== itemId);
  } else {
    const item = cart.find(c => c.id === itemId);
    if (item) item.qty = qty;
  }
  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const totalAmount = document.getElementById('totalAmount');
  
  cartCount.textContent = `${cart.length} Item`;
  
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="text-gray-500 text-center py-8">Keranjang masih kosong</p>';
    cartTotal.classList.add('hidden');
    return;
  }
  
  cartTotal.classList.remove('hidden');
  cartItems.innerHTML = '';
  
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.qty;
    const cartItem = createCartItem(item);
    cartItems.appendChild(cartItem);
  });
  
  totalAmount.textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

function createCartItem(item) {
  const cartItem = document.createElement('div');
  cartItem.className = 'flex items-center justify-between border-b pb-4 mb-4';
  cartItem.innerHTML = `
    <div class="flex items-center space-x-4">
      <span class="text-4xl">${item.image}</span>
      <div>
        <h3 class="font-bold text-gray-800">${item.name}</h3>
        <p class="text-orange-600 font-semibold">Rp ${item.price.toLocaleString('id-ID')}</p>
      </div>
    </div>
    <div class="flex items-center space-x-4">
      <div class="flex items-center space-x-2">
        <button onclick="updateCartQty(${item.id}, ${item.qty - 1})" class="bg-gray-200 px-3 py-1 rounded-lg font-bold hover:bg-gray-300">-</button>
        <span class="font-bold w-8 text-center">${item.qty}</span>
        <button onclick="updateCartQty(${item.id}, ${item.qty + 1})" class="bg-gray-200 px-3 py-1 rounded-lg font-bold hover:bg-gray-300">+</button>
      </div>
      <button onclick="updateCartQty(${item.id}, 0)" class="text-red-600 hover:text-red-800 text-xl">🗑️</button>
    </div>
  `;
  return cartItem;
}

// ========================
// ORDER FUNCTIONS
// ========================
function submitOrder() {
  if (cart.length === 0) {
    alert('Keranjang masih kosong!');
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  // TODO: Ganti dengan API call
  // const response = await fetch('/api/orders', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ items: cart, total, user: currentUser.username })
  // });
  
  const newOrder = {
    id: Date.now(),
    items: [...cart],
    total: total,
    user: currentUser.username,
    date: new Date().toLocaleString('id-ID')
  };
  
  orders.push(newOrder);
  cart = [];
  renderCart();
  renderOrders();
  alert('Pesanan berhasil dibuat!');
}

function renderOrders() {
  // TODO: Ganti dengan API call
  // const response = await fetch('/api/orders');
  // orders = await response.json();
  
  const ordersSection = document.getElementById('ordersSection');
  const ordersList = document.getElementById('ordersList');
  
  if (orders.length === 0) {
    ordersSection.classList.add('hidden');
    return;
  }
  
  ordersSection.classList.remove('hidden');
  ordersList.innerHTML = '';
  
  orders.forEach(order => {
    const orderCard = createOrderCard(order);
    ordersList.appendChild(orderCard);
  });
}

function createOrderCard(order) {
  const orderCard = document.createElement('div');
  orderCard.className = 'border border-gray-200 rounded-lg p-4 mb-4';
  
  const itemsList = order.items.map(item => 
    `<p>${item.name} x${item.qty}</p>`
  ).join('');
  
  orderCard.innerHTML = `
    <div class="flex items-center justify-between mb-3">
      <div>
        <p class="font-semibold text-gray-800">Pesanan #${order.id}</p>
        <p class="text-sm text-gray-600">${order.date}</p>
        <p class="text-sm text-gray-600">Oleh: ${order.user}</p>
      </div>
      <p class="text-2xl font-bold text-green-600">Rp ${order.total.toLocaleString('id-ID')}</p>
    </div>
    <div class="text-sm text-gray-600">
      ${itemsList}
    </div>
  `;
  
  return orderCard;
}

// ========================
// MODAL FUNCTIONS
// ========================
function openAddModal() {
  editingItemId = null;
  document.getElementById('modalTitle').textContent = 'Tambah Menu Baru';
  document.getElementById('menuName').value = '';
  document.getElementById('menuPrice').value = '';
  document.getElementById('menuCategory').value = 'Nasi';
  document.getElementById('menuImage').value = '🍽️';
  document.getElementById('modal').classList.remove('hidden');
}

function openEditModal(itemId) {
  const item = menuItems.find(m => m.id === itemId);
  
  if (item) {
    editingItemId = itemId;
    document.getElementById('modalTitle').textContent = 'Edit Menu';
    document.getElementById('menuName').value = item.name;
    document.getElementById('menuPrice').value = item.price;
    document.getElementById('menuCategory').value = item.category;
    document.getElementById('menuImage').value = item.image;
    document.getElementById('modal').classList.remove('hidden');
  }
}

function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  editingItemId = null;
}

function handleSubmitMenu() {
  const menuData = {
    name: document.getElementById('menuName').value,
    price: Number(document.getElementById('menuPrice').value),
    category: document.getElementById('menuCategory').value,
    image: document.getElementById('menuImage').value
  };
  
  if (!menuData.name || !menuData.price || !menuData.category || !menuData.image) {
    alert('Semua field harus diisi!');
    return;
  }
  
  if (menuData.price <= 0) {
    alert('Harga harus lebih dari 0!');
    return;
  }
  
  // TODO: Ganti dengan API call
  // if (editingItemId) {
  //   await fetch(`/api/menu/${editingItemId}`, {
  //     method: 'PUT',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(menuData)
  //   });
  // } else {
  //   await fetch('/api/menu', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(menuData)
  //   });
  // }
  
  if (editingItemId) {
    const index = menuItems.findIndex(item => item.id === editingItemId);
    if (index !== -1) {
      menuItems[index] = { ...menuItems[index], ...menuData };
    }
    alert('Menu berhasil diupdate!');
  } else {
    menuItems.push({
      id: Date.now(),
      ...menuData
    });
    alert('Menu berhasil ditambahkan!');
  }
  
  closeModal();
  renderMenuItems();
}

// ========================
// EVENT LISTENERS
// ========================
document.getElementById('username').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleLogin();
});

document.getElementById('password').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleLogin();
});

// Close modal when clicking outside
document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') {
    closeModal();
  }
});