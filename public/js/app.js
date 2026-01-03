console.log("app.js loaded");

// ======================
// UTILITY FUNCTIONS
// ======================
function formatRupiah(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('id-ID', options);
}

// ======================
// STATE
// ======================
let currentUser = null;
let menuItems = [];
let cart = [];
let editingMenuId = null;
let editingPromoId = null;
let appliedPromo = null;
let currentTab = '';
let orderRefreshInterval = null;

// ======================
// AUTHENTICATION
// ======================
function showRegisterForm() {
  console.log('showRegisterForm called');
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('registerForm').classList.remove('hidden');
}

function showLoginForm() {
  console.log('showLoginForm called');
  document.getElementById('registerForm').classList.add('hidden');
  document.getElementById('loginForm').classList.remove('hidden');
}

async function handleRegister() {
  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const username = document.getElementById('registerUsername').value.trim();
  const password = document.getElementById('registerPassword').value.trim();

  if (!name || !email || !username || !password) {
    alert('Semua field wajib diisi');
    return;
  }

  if (password.length < 6) {
    alert('Password minimal 6 karakter');
    return;
  }

  try {
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, username, password })
    });

    const data = await res.json();

    if (!res.ok) {
      const errors = data.errors;
      if (errors) {
        const errorMessages = Object.values(errors).flat().join('\n');
        alert(errorMessages);
      } else {
        alert('Registrasi gagal');
      }
      return;
    }

    alert('Registrasi berhasil! Silakan login.');
    showLoginForm();
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan saat registrasi');
  }
}

async function handleLogin() {
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  console.log('=== LOGIN ATTEMPT ===');
  console.log('Username:', username);
  console.log('Password length:', password.length);

  if (!username || !password) {
    alert('Username dan password wajib diisi');
    return;
  }

  try {
    console.log('Sending request to /api/login...');

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    console.log('Response status:', res.status);
    console.log('Response ok:', res.ok);
    console.log('Response headers:', Object.fromEntries(res.headers.entries()));

    const data = await res.json();
    console.log('Response data:', data);

    if (!res.ok) {
      const errorMsg = data.error || data.message || 'Username atau password salah';
      console.error('Login failed:', errorMsg);
      alert(errorMsg);
      return;
    }

    if (data.user) {
      console.log('Login successful! User:', data.user);
      currentUser = data.user;
      showMainPage();
    } else {
      console.error('No user data in response');
      alert('Login gagal: Data user tidak ditemukan');
    }
  } catch (err) {
    console.error('Login error:', err);
    alert('Gagal login: ' + err.message);
  }
}

function handleLogout() {
  stopOrderAutoRefresh(); // Stop auto-refresh on logout
  currentUser = null;
  cart = [];
  appliedPromo = null;
  document.getElementById('mainPage').classList.add('hidden');
  document.getElementById('loginPage').classList.remove('hidden');
}

// ======================
// MAIN PAGE
// ======================
function showMainPage() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('mainPage').classList.remove('hidden');

  document.getElementById('currentUsername').textContent = currentUser.username || currentUser.name;
  document.getElementById('currentRole').textContent = currentUser.role;

  renderNavTabs();
  fetchMenu();

  if (currentUser.role === 'admin') {
    switchTab('adminMenu');
  } else {
    switchTab('menu');
  }
}

// ======================
// NAVIGATION TABS
// ======================
function renderNavTabs() {
  const navTabs = document.getElementById('navTabs');
  navTabs.innerHTML = '';

  const tabs = currentUser.role === 'admin'
    ? [
        { id: 'adminMenu', label: '📋 Kelola Menu' },
        { id: 'adminOrders', label: '📦 Kelola Pesanan' },
        { id: 'adminPromos', label: '🎁 Kelola Promo' }
      ]
    : [
        { id: 'menu', label: '🍽️ Menu' },
        { id: 'ongoing', label: '🔄 Pesanan Berlangsung' },
        { id: 'history', label: '📜 Riwayat' },
        { id: 'promos', label: '🎉 Promo' }
      ];

  tabs.forEach(tab => {
    const button = document.createElement('button');
    button.className = 'px-6 py-3 font-semibold border-b-2 transition';
    button.textContent = tab.label;
    button.onclick = () => switchTab(tab.id);
    button.setAttribute('data-tab', tab.id);
    navTabs.appendChild(button);
  });
}

function switchTab(tabId) {
  // Stop auto-refresh when switching tabs
  stopOrderAutoRefresh();

  currentTab = tabId;

  // Update tab buttons
  document.querySelectorAll('[data-tab]').forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('border-orange-600', 'text-orange-600');
      btn.classList.remove('border-transparent', 'text-gray-600');
    } else {
      btn.classList.remove('border-orange-600', 'text-orange-600');
      btn.classList.add('border-transparent', 'text-gray-600');
    }
  });

  // Hide all sections
  document.querySelectorAll('[id$="Section"]').forEach(section => {
    section.classList.add('hidden');
  });

  // Show active section
  switch (tabId) {
    case 'adminMenu':
      document.getElementById('adminMenuSection').classList.remove('hidden');
      renderAdminMenuList();
      break;
    case 'adminOrders':
      document.getElementById('adminOrderSection').classList.remove('hidden');
      fetchAdminOrders();
      break;
    case 'adminPromos':
      document.getElementById('adminPromoSection').classList.remove('hidden');
      fetchAdminPromos();
      break;
    case 'menu':
      document.getElementById('menuSection').classList.remove('hidden');
      document.getElementById('cartSection').classList.remove('hidden');
      renderMenu();
      break;
    case 'ongoing':
      document.getElementById('ongoingOrdersSection').classList.remove('hidden');
      fetchOngoingOrders();
      startOrderAutoRefresh('ongoing');
      break;
    case 'history':
      document.getElementById('orderHistorySection').classList.remove('hidden');
      fetchOrderHistory();
      startOrderAutoRefresh('history');
      break;
    case 'promos':
      document.getElementById('userPromoSection').classList.remove('hidden');
      fetchUserPromos();
      break;
  }
}

// ======================
// MENU FUNCTIONS
// ======================
async function fetchMenu() {
  try {
    console.log('Fetching menu from /api/menu...');
    const res = await fetch('/api/menu');

    console.log('Response status:', res.status);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    menuItems = await res.json();
    console.log('Menu items loaded:', menuItems.length);

    if (currentUser.role === 'admin') {
      renderAdminMenuList();
    } else {
      renderMenu();
    }
  } catch (error) {
    console.error('Error fetching menu:', error);
    alert('Gagal memuat menu: ' + error.message);
    menuItems = [];
  }
}

function renderMenu() {
  const list = document.getElementById('menuList');
  list.innerHTML = '';

  if (menuItems.length === 0) {
    list.innerHTML = '<p class="col-span-3 text-center text-gray-500 py-8">Belum ada menu tersedia</p>';
    return;
  }

  menuItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'bg-white border rounded-lg shadow-sm hover:shadow-md transition p-4';

    // Check if image path starts with 'menu/' (uploaded files) or use direct path (placeholder)
    const imageUrl = item.image ? (item.image.startsWith('menu/') ? `/storage/${item.image}` : `/${item.image}`) : '/images/no-image.svg';

    div.innerHTML = `
      <div class="w-full h-40 mb-3 overflow-hidden rounded-lg bg-gray-100">
        <img src="${imageUrl}" alt="${item.name}" class="w-full h-full object-cover" onerror="this.src='/images/no-image.svg'">
      </div>
      <h3 class="font-bold text-lg text-gray-800 mb-1">${item.name}</h3>
      <p class="text-sm text-gray-500 mb-2">${item.category || 'Lainnya'}</p>
      <div class="flex items-center justify-between mt-3">
        <span class="text-orange-600 font-bold text-lg">Rp ${formatRupiah(item.price)}</span>
        <button onclick="addToCart(${item.id})" class="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition">
          + Keranjang
        </button>
      </div>
    `;

    list.appendChild(div);
  });
}

function renderAdminMenuList() {
  const list = document.getElementById('adminMenuList');
  list.innerHTML = '';

  if (menuItems.length === 0) {
    list.innerHTML = '<p class="text-center text-gray-500 py-4">Belum ada menu</p>';
    return;
  }

  menuItems.forEach(item => {
    const li = document.createElement('li');
    li.className = 'py-3 flex items-center justify-between';

    // Check if image path starts with 'menu/' (uploaded files) or use direct path (placeholder)
    const imageUrl = item.image ? (item.image.startsWith('menu/') ? `/storage/${item.image}` : `/${item.image}`) : '/images/no-image.svg';

    li.innerHTML = `
      <div class="flex items-center space-x-3">
        <img src="${imageUrl}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg" onerror="this.src='/images/no-image.svg'">
        <div>
          <p class="font-semibold">${item.name}</p>
          <p class="text-sm text-gray-500">${item.category || 'Lainnya'} - Rp ${formatRupiah(item.price)}</p>
        </div>
      </div>
      <div class="flex space-x-2">
        <button onclick="editMenu(${item.id})" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Edit</button>
        <button onclick="deleteMenu(${item.id})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Hapus</button>
      </div>
    `;

    list.appendChild(li);
  });
}

function openAddMenuModal() {
  editingMenuId = null;
  document.getElementById('menuModalTitle').textContent = 'Tambah Menu Baru';
  document.getElementById('menuName').value = '';
  document.getElementById('menuPrice').value = '';
  document.getElementById('menuCategory').value = 'Nasi';
  document.getElementById('menuImageFile').value = '';
  document.getElementById('menuImagePreview').classList.add('hidden');
  document.getElementById('menuModal').classList.remove('hidden');
}

function editMenu(id) {
  const item = menuItems.find(i => i.id === id);
  if (!item) return;

  editingMenuId = id;
  document.getElementById('menuModalTitle').textContent = 'Edit Menu';
  document.getElementById('menuName').value = item.name;
  document.getElementById('menuPrice').value = item.price;
  document.getElementById('menuCategory').value = item.category || 'Nasi';
  document.getElementById('menuImageFile').value = '';

  // Show existing image preview if available
  if (item.image) {
    const previewImg = document.getElementById('menuImagePreviewImg');
    previewImg.src = `/storage/${item.image}`;
    document.getElementById('menuImagePreview').classList.remove('hidden');
  } else {
    document.getElementById('menuImagePreview').classList.add('hidden');
  }

  document.getElementById('menuModal').classList.remove('hidden');
}

async function handleSubmitMenu() {
  const name = document.getElementById('menuName').value.trim();
  const price = parseInt(document.getElementById('menuPrice').value);
  const category = document.getElementById('menuCategory').value;
  const imageFile = document.getElementById('menuImageFile').files[0];

  if (!name || isNaN(price)) {
    alert('Nama dan harga wajib diisi');
    return;
  }

  // Use FormData for file upload
  const formData = new FormData();
  formData.append('name', name);
  formData.append('price', price);
  formData.append('category', category);

  if (imageFile) {
    formData.append('image', imageFile);
  }

  try {
    const url = editingMenuId ? `/api/menu/${editingMenuId}` : '/api/menu';
    const method = editingMenuId ? 'POST' : 'POST';

    // For PUT request simulation in Laravel
    if (editingMenuId) {
      formData.append('_method', 'PUT');
    }

    await fetch(url, {
      method: method,
      body: formData
      // Don't set Content-Type header, browser will set it with boundary
    });

    closeMenuModal();
    await fetchMenu();
  } catch (err) {
    console.error(err);
    alert('Gagal menyimpan menu');
  }
}

async function deleteMenu(id) {
  if (!confirm('Yakin hapus menu ini?')) return;

  try {
    await fetch(`/api/menu/${id}`, { method: 'DELETE' });
    await fetchMenu();
  } catch (err) {
    console.error(err);
    alert('Gagal menghapus menu');
  }
}

function closeMenuModal() {
  document.getElementById('menuModal').classList.add('hidden');
}

// ======================
// CART FUNCTIONS
// ======================
function addToCart(id) {
  const item = menuItems.find(m => m.id === id);
  if (!item) return;

  cart.push({ ...item });
  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  appliedPromo = null;
  renderCart();
}

function renderCart() {
  const itemsContainer = document.getElementById('cartItems');
  const totalContainer = document.getElementById('cartTotal');
  const cartCount = document.getElementById('cartCount');

  itemsContainer.innerHTML = '';

  if (cart.length === 0) {
    totalContainer.classList.add('hidden');
    cartCount.textContent = '0 Item';
    document.getElementById('promoResult').innerHTML = '';
    return;
  }

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center border-b py-3';

    div.innerHTML = `
      <div>
        <p class="font-semibold">${item.name}</p>
        <p class="text-sm text-gray-500">Rp ${formatRupiah(item.price)}</p>
      </div>
      <button onclick="removeFromCart(${index})" class="text-red-600 hover:text-red-800 font-bold">
        ❌
      </button>
    `;

    itemsContainer.appendChild(div);
  });

  const subtotal = cart.reduce((sum, i) => sum + i.price, 0);
  let discount = 0;
  let total = subtotal;

  if (appliedPromo) {
    discount = Math.floor((subtotal * appliedPromo.discount_percentage) / 100);
    total = subtotal - discount;
  }

  cartCount.textContent = `${cart.length} Item`;
  document.getElementById('subtotalAmount').textContent = `Rp ${formatRupiah(subtotal)}`;
  document.getElementById('totalAmount').textContent = `Rp ${formatRupiah(total)}`;

  if (discount > 0) {
    document.getElementById('discountAmount').textContent = `- Rp ${formatRupiah(discount)}`;
    document.getElementById('discountRow').classList.remove('hidden');
  } else {
    document.getElementById('discountRow').classList.add('hidden');
  }

  totalContainer.classList.remove('hidden');
}

async function applyPromo() {
  const code = document.getElementById('promoCode').value.trim().toUpperCase();
  const promoResult = document.getElementById('promoResult');

  if (!code) {
    promoResult.innerHTML = '<p class="text-red-600">Masukkan kode promo</p>';
    return;
  }

  if (cart.length === 0) {
    promoResult.innerHTML = '<p class="text-red-600">Keranjang masih kosong</p>';
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price, 0);

  try {
    const res = await fetch('/api/promos/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, total: subtotal })
    });

    const data = await res.json();

    if (!res.ok) {
      promoResult.innerHTML = `<p class="text-red-600">${data.error}</p>`;
      appliedPromo = null;
      renderCart();
      return;
    }

    appliedPromo = data.promo;
    promoResult.innerHTML = `<p class="text-green-600">✅ Promo diterapkan! Hemat Rp ${formatRupiah(data.discount)}</p>`;
    renderCart();
  } catch (err) {
    console.error(err);
    promoResult.innerHTML = '<p class="text-red-600">Gagal memvalidasi promo</p>';
  }
}

async function submitOrder() {
  if (cart.length === 0) {
    alert('Keranjang kosong');
    return;
  }

  if (!currentUser || !currentUser.id) {
    alert('User tidak valid. Silakan login ulang.');
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price, 0);
  let discount = 0;
  let total = subtotal;

  if (appliedPromo) {
    discount = Math.floor((subtotal * appliedPromo.discount_percentage) / 100);
    total = subtotal - discount;
  }

  try {
    console.log('Creating order with data:', {
      user_id: currentUser.id,
      items: cart,
      total: total
    });

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: currentUser.id,
        items: cart,
        total: total
      })
    });

    const data = await res.json();
    console.log('Order response:', data);

    if (!res.ok) {
      const errorMsg = data.messages
        ? Object.values(data.messages).flat().join(', ')
        : (data.error || data.message || 'Unknown error');
      alert('Gagal membuat pesanan: ' + errorMsg);
      return;
    }

    // Show payment confirmation modal
    showPaymentModal(data.order.id, subtotal, discount, total);

  } catch (err) {
    console.error('Error creating order:', err);
    alert('Gagal membuat pesanan: ' + err.message);
  }
}

// ======================
// PAYMENT FUNCTIONS
// ======================
let currentOrderId = null;

function showPaymentModal(orderId, subtotal, discount, total) {
  console.log('showPaymentModal called with:', { orderId, subtotal, discount, total });
  currentOrderId = orderId;

  const paymentTotalPrice = document.getElementById('paymentTotalPrice');
  const paymentFinalAmount = document.getElementById('paymentFinalAmount');
  const paymentDiscount = document.getElementById('paymentDiscount');
  const paymentPromoCode = document.getElementById('paymentPromoCode');
  const paymentDiscountRow = document.getElementById('paymentDiscountRow');
  const paymentModal = document.getElementById('paymentModal');

  if (!paymentTotalPrice || !paymentFinalAmount || !paymentModal) {
    console.error('Payment modal elements not found!');
    alert('Error: Payment modal tidak ditemukan. Refresh halaman.');
    return;
  }

  paymentTotalPrice.textContent = formatRupiah(subtotal);
  paymentFinalAmount.textContent = formatRupiah(total);

  if (discount > 0 && appliedPromo && paymentDiscount && paymentPromoCode && paymentDiscountRow) {
    paymentDiscount.textContent = formatRupiah(discount);
    paymentPromoCode.textContent = appliedPromo.code;
    paymentDiscountRow.style.display = 'flex';
  } else if (paymentDiscountRow) {
    paymentDiscountRow.style.display = 'none';
  }

  paymentModal.classList.remove('hidden');
}

function closePaymentModal() {
  document.getElementById('paymentModal').classList.add('hidden');
  document.getElementById('paymentNotes').value = '';
}

function updatePaymentInstructions(method) {
  // Payment method is always cash, no need to update instructions
  return;
}

async function confirmPayment() {
  const paymentMethod = 'cash'; // Fixed to cash only
  const notes = document.getElementById('paymentNotes').value.trim();
  const total = parseInt(document.getElementById('paymentFinalAmount').textContent.replace(/\./g, ''));

  if (!currentOrderId) {
    alert('Order ID tidak ditemukan');
    return;
  }

  try {
    const res = await fetch('/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: currentOrderId,
        user_id: currentUser.id,
        amount: total,
        payment_method: paymentMethod,
        notes: notes
      })
    });

    const data = await res.json();

    if (!res.ok) {
      alert('Gagal membuat pembayaran: ' + (data.error || 'Unknown error'));
      return;
    }

    alert('✅ Pembayaran berhasil dikonfirmasi!\n\nPesanan Anda sedang diproses.');

    // Clear cart and close modal
    cart = [];
    appliedPromo = null;
    currentOrderId = null;
    document.getElementById('promoCode').value = '';
    document.getElementById('promoResult').innerHTML = '';
    renderCart();
    closePaymentModal();

    // Refresh ongoing orders if on that tab
    if (currentTab === 'ongoing') {
      fetchOngoingOrders();
    }
  } catch (err) {
    console.error(err);
    alert('Gagal membuat pesanan');
  }
}

// ======================
// ORDER FUNCTIONS (USER)
// ======================
function startOrderAutoRefresh(type) {
  // Clear existing interval
  stopOrderAutoRefresh();

  // Refresh every 5 seconds
  orderRefreshInterval = setInterval(() => {
    console.log('Auto-refreshing orders...');
    if (type === 'ongoing') {
      fetchOngoingOrders();
    } else if (type === 'history') {
      fetchOrderHistory();
    }
  }, 5000); // 5 seconds

  console.log('Auto-refresh started for', type);
}

function stopOrderAutoRefresh() {
  if (orderRefreshInterval) {
    clearInterval(orderRefreshInterval);
    orderRefreshInterval = null;
    console.log('Auto-refresh stopped');
  }
}

async function fetchOngoingOrders() {
  try {
    console.log('Fetching ongoing orders for user:', currentUser.id);
    const res = await fetch(`/api/orders/user/${currentUser.id}/ongoing`);
    const orders = await res.json();
    console.log('Ongoing orders received:', orders);
    renderOrders(orders, 'ongoingOrdersList', true);
  } catch (err) {
    console.error('Error fetching ongoing orders:', err);
  }
}

async function fetchOrderHistory() {
  try {
    console.log('Fetching order history for user:', currentUser.id);
    const res = await fetch(`/api/orders/user/${currentUser.id}/history`);
    const orders = await res.json();
    console.log('Order history received:', orders);
    renderOrders(orders, 'orderHistoryList', false);
  } catch (err) {
    console.error('Error fetching order history:', err);
  }
}

function renderOrders(orders, containerId, isOngoing) {
  const container = document.getElementById(containerId);

  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }

  container.innerHTML = '';

  if (orders.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500 py-8">Tidak ada pesanan</p>';
    return;
  }

  console.log('Rendering orders to:', containerId, 'Count:', orders.length);

  orders.forEach(order => {
    const div = document.createElement('div');
    div.className = 'border rounded-lg p-4 bg-gray-50';

    const statusColor = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    const statusText = {
      pending: '⏳ Menunggu',
      processing: '🔄 Diproses',
      completed: '✅ Selesai',
      rejected: '❌ Ditolak'
    };

    // Handle items as string or array
    let items = [];
    try {
      if (typeof order.items === 'string') {
        items = JSON.parse(order.items);
      } else if (Array.isArray(order.items)) {
        items = order.items;
      }
    } catch (e) {
      console.error('Error parsing items for order', order.id, e);
      items = [];
    }

    const itemsList = items.map(item => `<li>${item.name} - Rp ${formatRupiah(item.price)}</li>`).join('');

    div.innerHTML = `
      <div class="flex justify-between items-start mb-3">
        <div>
          <p class="text-sm text-gray-500">Order #${order.id}</p>
          <p class="text-xs text-gray-400">${formatDate(order.created_at)}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusColor[order.status]}">
          ${statusText[order.status]}
        </span>
      </div>
      <ul class="text-sm mb-3 space-y-1">${itemsList}</ul>
      <p class="font-bold text-orange-600">Total: Rp ${formatRupiah(order.total)}</p>
    `;

    container.appendChild(div);
  });
}

// ======================
// ADMIN ORDER FUNCTIONS
// ======================
async function fetchAdminOrders() {
  try {
    console.log('Fetching all orders for admin...');
    const res = await fetch('/api/orders');
    const orders = await res.json();
    console.log('Admin orders received:', orders.length, 'orders');
    renderAdminOrders(orders);
  } catch (err) {
    console.error('Error fetching admin orders:', err);
  }
}

function renderAdminOrders(orders) {
  const container = document.getElementById('adminOrderList');

  if (!container) {
    console.error('Admin order container not found!');
    return;
  }

  container.innerHTML = '';

  if (orders.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500 py-8">Belum ada pesanan</p>';
    return;
  }

  console.log('Rendering admin orders, count:', orders.length);

  orders.forEach(order => {
    const div = document.createElement('div');
    div.className = 'border rounded-lg p-4 bg-gray-50';

    const statusColor = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };

    // Handle items as string or array
    let items = [];
    try {
      if (typeof order.items === 'string') {
        items = JSON.parse(order.items);
      } else if (Array.isArray(order.items)) {
        items = order.items;
      }
    } catch (e) {
      console.error('Error parsing items for admin order', order.id, e);
      items = [];
    }

    const itemsList = items.map(item => `<li>${item.name} - Rp ${formatRupiah(item.price)}</li>`).join('');

    const userName = order.user ? order.user.name || order.user.username : 'Unknown';

    div.innerHTML = `
      <div class="flex justify-between items-start mb-3">
        <div>
          <p class="font-semibold">Order #${order.id} - ${userName}</p>
          <p class="text-xs text-gray-500">${formatDate(order.created_at)}</p>
        </div>
        <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusColor[order.status]}">
          ${order.status}
        </span>
      </div>
      <ul class="text-sm mb-3 space-y-1">${itemsList}</ul>
      <p class="font-bold text-orange-600 mb-3">Total: Rp ${formatRupiah(order.total)}</p>

      ${order.status === 'pending' ? `
        <div class="flex space-x-2">
          <button onclick="updateOrderStatus(${order.id}, 'processing')" class="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700">
            🔄 Proses
          </button>
          <button onclick="updateOrderStatus(${order.id}, 'rejected')" class="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700">
            ❌ Tolak
          </button>
        </div>
      ` : ''}

      ${order.status === 'processing' ? `
        <button onclick="updateOrderStatus(${order.id}, 'completed')" class="w-full bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700">
          ✅ Selesai
        </button>
      ` : ''}
    `;

    container.appendChild(div);
  });
}

async function updateOrderStatus(orderId, status) {
  try {
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });

    await fetchAdminOrders();
  } catch (err) {
    console.error(err);
    alert('Gagal mengupdate status pesanan');
  }
}

// ======================
// PROMO FUNCTIONS (USER)
// ======================
async function fetchUserPromos() {
  try {
    const res = await fetch('/api/promos');
    const promos = await res.json();
    renderUserPromos(promos);
  } catch (err) {
    console.error(err);
  }
}

function renderUserPromos(promos) {
  const container = document.getElementById('userPromoList');
  container.innerHTML = '';

  if (promos.length === 0) {
    container.innerHTML = '<p class="col-span-3 text-center text-gray-500 py-8">Tidak ada promo tersedia</p>';
    return;
  }

  promos.forEach(promo => {
    const div = document.createElement('div');
    div.className = 'bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg p-4 shadow-md';

    div.innerHTML = `
      <div class="text-2xl font-bold mb-2">${promo.code}</div>
      <p class="text-sm mb-3 opacity-90">${promo.description}</p>
      <div class="text-3xl font-bold mb-2">${promo.discount_percentage}% OFF</div>
      <p class="text-xs opacity-75">Min. pembelian: Rp ${formatRupiah(promo.min_purchase)}</p>
      <p class="text-xs opacity-75">Berlaku: ${formatDate(promo.valid_from)} - ${formatDate(promo.valid_until)}</p>
      <div class="mt-3 flex gap-2">
        <button onclick="usePromoDirectly('${promo.code}')" class="flex-1 bg-white text-orange-600 px-3 py-2 rounded font-semibold hover:bg-gray-100 transition">
          ✨ Gunakan Promo
        </button>
        <button onclick="copyPromoCode('${promo.code}')" class="bg-white bg-opacity-80 text-orange-600 px-3 py-2 rounded font-semibold hover:bg-opacity-100 transition" title="Salin Kode">
          📋
        </button>
      </div>
    `;

    container.appendChild(div);
  });
}

function copyPromoCode(code) {
  navigator.clipboard.writeText(code);
  alert(`Kode promo "${code}" berhasil disalin!`);
}

function usePromoDirectly(code) {
  // Switch to menu tab jika belum
  if (currentTab !== 'menu') {
    switchTab('menu');
  }

  // Scroll ke bagian cart
  setTimeout(() => {
    const cartSection = document.getElementById('cartSection');
    if (cartSection) {
      cartSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Isi kode promo
    document.getElementById('promoCode').value = code;

    // Auto apply promo jika ada item di cart
    if (cart.length > 0) {
      applyPromo();
    } else {
      alert(`Kode promo "${code}" sudah dimasukkan! Silakan tambahkan item ke keranjang terlebih dahulu.`);
      // Highlight promo input
      document.getElementById('promoCode').classList.add('ring-2', 'ring-green-500');
      setTimeout(() => {
        document.getElementById('promoCode').classList.remove('ring-2', 'ring-green-500');
      }, 2000);
    }
  }, 300);
}

// ======================
// ADMIN PROMO FUNCTIONS
// ======================
async function fetchAdminPromos() {
  try {
    const res = await fetch('/api/promos/all');
    const promos = await res.json();
    renderAdminPromos(promos);
  } catch (err) {
    console.error(err);
  }
}

function renderAdminPromos(promos) {
  const container = document.getElementById('adminPromoList');
  container.innerHTML = '';

  if (promos.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500 py-8">Belum ada promo</p>';
    return;
  }

  promos.forEach(promo => {
    const div = document.createElement('div');
    div.className = 'border rounded-lg p-4 bg-gray-50';

    const statusBadge = promo.is_active
      ? '<span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Aktif</span>'
      : '<span class="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded">Nonaktif</span>';

    div.innerHTML = `
      <div class="flex justify-between items-start mb-3">
        <div>
          <p class="font-bold text-lg">${promo.code}</p>
          <p class="text-sm text-gray-600">${promo.description}</p>
        </div>
        ${statusBadge}
      </div>
      <div class="grid grid-cols-2 gap-2 text-sm mb-3">
        <p><strong>Diskon:</strong> ${promo.discount_percentage}%</p>
        <p><strong>Min. Beli:</strong> Rp ${formatRupiah(promo.min_purchase)}</p>
        <p><strong>Dari:</strong> ${formatDate(promo.valid_from)}</p>
        <p><strong>Sampai:</strong> ${formatDate(promo.valid_until)}</p>
      </div>
      <div class="flex space-x-2">
        <button onclick="editPromo(${promo.id})" class="flex-1 bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600">
          Edit
        </button>
        <button onclick="togglePromo(${promo.id})" class="flex-1 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600">
          ${promo.is_active ? 'Nonaktifkan' : 'Aktifkan'}
        </button>
        <button onclick="deletePromo(${promo.id})" class="flex-1 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600">
          Hapus
        </button>
      </div>
    `;

    container.appendChild(div);
  });
}

function openAddPromoModal() {
  editingPromoId = null;
  document.getElementById('promoModalTitle').textContent = 'Tambah Promo Baru';
  document.getElementById('promoCodeInput').value = '';
  document.getElementById('promoDescription').value = '';
  document.getElementById('promoDiscount').value = '';
  document.getElementById('promoMinPurchase').value = '';
  document.getElementById('promoValidFrom').value = '';
  document.getElementById('promoValidUntil').value = '';
  document.getElementById('promoModal').classList.remove('hidden');
}

async function editPromo(id) {
  try {
    const res = await fetch('/api/promos/all');
    const promos = await res.json();
    const promo = promos.find(p => p.id === id);

    if (!promo) return;

    editingPromoId = id;
    document.getElementById('promoModalTitle').textContent = 'Edit Promo';
    document.getElementById('promoCodeInput').value = promo.code;
    document.getElementById('promoDescription').value = promo.description;
    document.getElementById('promoDiscount').value = promo.discount_percentage;
    document.getElementById('promoMinPurchase').value = promo.min_purchase;
    document.getElementById('promoValidFrom').value = promo.valid_from;
    document.getElementById('promoValidUntil').value = promo.valid_until;
    document.getElementById('promoModal').classList.remove('hidden');
  } catch (err) {
    console.error(err);
  }
}

async function handleSubmitPromo() {
  const code = document.getElementById('promoCodeInput').value.trim().toUpperCase();
  const description = document.getElementById('promoDescription').value.trim();
  const discount_percentage = parseInt(document.getElementById('promoDiscount').value);
  const min_purchase = parseInt(document.getElementById('promoMinPurchase').value);
  const valid_from = document.getElementById('promoValidFrom').value;
  const valid_until = document.getElementById('promoValidUntil').value;

  if (!code || !description || !discount_percentage || !valid_from || !valid_until) {
    alert('Semua field wajib diisi');
    return;
  }

  const payload = {
    code,
    description,
    discount_percentage,
    min_purchase: min_purchase || 0,
    valid_from,
    valid_until,
    is_active: true
  };

  try {
    if (editingPromoId) {
      await fetch(`/api/promos/${editingPromoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch('/api/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }

    closePromoModal();
    await fetchAdminPromos();
  } catch (err) {
    console.error(err);
    alert('Gagal menyimpan promo');
  }
}

async function togglePromo(id) {
  try {
    await fetch(`/api/promos/${id}/toggle`, { method: 'PUT' });
    await fetchAdminPromos();
  } catch (err) {
    console.error(err);
    alert('Gagal mengubah status promo');
  }
}

async function deletePromo(id) {
  if (!confirm('Yakin hapus promo ini?')) return;

  try {
    await fetch(`/api/promos/${id}`, { method: 'DELETE' });
    await fetchAdminPromos();
  } catch (err) {
    console.error(err);
    alert('Gagal menghapus promo');
  }
}

function closePromoModal() {
  document.getElementById('promoModal').classList.add('hidden');
}

// ======================
// INITIALIZATION
// ======================
// IMAGE PREVIEW & EVENT LISTENERS
// ======================
// Add event listener for image preview when file is selected
document.addEventListener('DOMContentLoaded', function() {
  // Image preview for menu upload
  const imageInput = document.getElementById('menuImageFile');
  if (imageInput) {
    imageInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
          alert('Ukuran file terlalu besar! Maksimal 2MB');
          e.target.value = '';
          return;
        }

        // Validate file type
        if (!file.type.match('image.*')) {
          alert('File harus berupa gambar!');
          e.target.value = '';
          return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
          const previewImg = document.getElementById('menuImagePreviewImg');
          previewImg.src = e.target.result;
          document.getElementById('menuImagePreview').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Enter key support for login
  const loginUsername = document.getElementById('loginUsername');
  const loginPassword = document.getElementById('loginPassword');

  if (loginUsername) {
    loginUsername.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleLogin();
      }
    });
  }

  if (loginPassword) {
    loginPassword.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        handleLogin();
      }
    });
  }

  // Payment method is fixed to cash, no event listener needed
});
