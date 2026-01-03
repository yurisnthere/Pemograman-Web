<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>Warung Makan Sederhana</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50">

<!-- ======================== -->
<!-- LOGIN PAGE -->
<!-- ======================== -->
<div id="loginPage" class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4" style="position: relative; z-index: 100;">
  <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md" style="position: relative; z-index: 101;">
    <div class="text-center mb-8">
      <div class="text-6xl mb-4">🍛</div>
      <h1 class="text-3xl font-bold text-orange-600 mb-2">Warung Makan Sederhana</h1>
      <p class="text-gray-600">Silakan login untuk melanjutkan</p>
    </div>

    <div id="loginForm" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
        <input type="text" id="loginUsername" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" autocomplete="username" placeholder="Masukkan username">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input type="password" id="loginPassword" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" autocomplete="current-password" placeholder="Masukkan password">
      </div>
      <button type="button" onclick="handleLogin()" class="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
        Login
      </button>
      <button type="button" onclick="showRegisterForm()" class="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
        Daftar Akun Baru
      </button>
    </div>

    <!-- Register Form -->
    <div id="registerForm" class="hidden space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
        <input type="text" id="registerName" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Nama lengkap Anda">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input type="email" id="registerEmail" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="email@example.com">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
        <input type="text" id="registerUsername" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Username untuk login">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Password (min 6 karakter)</label>
        <input type="password" id="registerPassword" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="Minimal 6 karakter">
      </div>
      <button type="button" onclick="handleRegister()" class="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
        Daftar
      </button>
      <button type="button" onclick="showLoginForm()" class="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition">
        Kembali ke Login
      </button>
    </div>
  </div>
</div>

<!-- ======================== -->
<!-- MAIN APP PAGE -->
<!-- ======================== -->
<div id="mainPage" class="hidden">
  <!-- Header -->
  <header class="bg-orange-600 text-white shadow-lg sticky top-0 z-40">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <span class="text-3xl">🍛</span>
          <div>
            <h1 class="text-2xl font-bold">Warung Makan Sederhana</h1>
            <p class="text-sm text-orange-100">Masakan rumahan yang lezat</p>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="text-right">
            <p class="text-sm text-orange-100">Login sebagai</p>
            <p class="font-semibold"><span id="currentUsername"></span> (<span id="currentRole"></span>)</p>
          </div>
          <button onclick="handleLogout()" class="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition">
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Navigation Tabs -->
  <div class="bg-white shadow-md">
    <div class="container mx-auto px-4">
      <div id="navTabs" class="flex space-x-1"></div>
    </div>
  </div>

  <div class="container mx-auto px-4 py-8">

    <!-- Admin Section: Kelola Menu -->
    <div id="adminMenuSection" class="bg-white rounded-xl shadow-md p-6 mb-8 hidden">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-800">📋 Kelola Menu</h2>
        <button onclick="openAddMenuModal()" class="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition">
          ➕ Tambah Menu
        </button>
      </div>
      <ul id="adminMenuList" class="divide-y divide-gray-200"></ul>
    </div>

    <!-- Admin Section: Kelola Pesanan -->
    <div id="adminOrderSection" class="bg-white rounded-xl shadow-md p-6 mb-8 hidden">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">📦 Kelola Pesanan</h2>
        <button onclick="fetchAdminOrders()" class="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition">
          🔄 Refresh
        </button>
      </div>
      <div id="adminOrderList" class="space-y-4"></div>
    </div>

    <!-- Admin Section: Kelola Promo -->
    <div id="adminPromoSection" class="bg-white rounded-xl shadow-md p-6 mb-8 hidden">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-800">🎁 Kelola Promo</h2>
        <button onclick="openAddPromoModal()" class="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition">
          ➕ Tambah Promo
        </button>
      </div>
      <div id="adminPromoList" class="space-y-4"></div>
    </div>

    <!-- User Section: Menu List -->
    <div id="menuSection" class="bg-white rounded-xl shadow-md p-6 mb-8 hidden">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">🍽️ Daftar Menu</h2>
      <div id="menuList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"></div>
    </div>

    <!-- User Section: Cart -->
    <div id="cartSection" class="bg-white rounded-xl shadow-md p-6 mb-8 hidden">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <span>🛒</span>
          <span>Keranjang Belanja</span>
        </h2>
        <span id="cartCount" class="bg-orange-600 text-white px-4 py-2 rounded-full font-bold">0 Item</span>
      </div>
      <div id="cartItems"></div>

      <!-- Promo Section in Cart -->
      <div id="promoSection" class="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 class="font-semibold text-gray-800 mb-3">🎁 Gunakan Kode Promo</h3>
        <div class="flex space-x-2">
          <input type="text" id="promoCode" placeholder="Masukkan kode promo" class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
          <button onclick="applyPromo()" class="bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700 transition">
            Gunakan
          </button>
        </div>
        <div id="promoResult" class="mt-2 text-sm"></div>
      </div>

      <div id="cartTotal" class="hidden border-t pt-4 mt-6">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <span class="text-lg font-semibold text-gray-800">Subtotal:</span>
            <span id="subtotalAmount" class="text-xl font-bold text-gray-600">Rp 0</span>
          </div>
          <div id="discountRow" class="hidden flex items-center justify-between text-green-600">
            <span class="text-lg font-semibold">Diskon:</span>
            <span id="discountAmount" class="text-xl font-bold">- Rp 0</span>
          </div>
          <div class="flex items-center justify-between border-t pt-2">
            <span class="text-xl font-bold text-gray-800">Total:</span>
            <span id="totalAmount" class="text-3xl font-bold text-orange-600">Rp 0</span>
          </div>
        </div>
        <button onclick="submitOrder()" class="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition">
          🛍️ Buat Pesanan
        </button>
      </div>
    </div>

    <!-- User Section: Ongoing Orders -->
    <div id="ongoingOrdersSection" class="bg-white rounded-xl shadow-md p-6 mb-8 hidden">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">🔄 Pesanan Berlangsung</h2>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500">⏱️ Auto-refresh setiap 5 detik</span>
          <button onclick="fetchOngoingOrders()" class="bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition">
            🔄 Refresh
          </button>
        </div>
      </div>
      <div id="ongoingOrdersList" class="space-y-4"></div>
    </div>

    <!-- User Section: Order History -->
    <div id="orderHistorySection" class="bg-white rounded-xl shadow-md p-6 mb-8 hidden">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">📜 Riwayat Pesanan</h2>
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-500">⏱️ Auto-refresh setiap 5 detik</span>
          <button onclick="fetchOrderHistory()" class="bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-orange-700 transition">
            🔄 Refresh
          </button>
        </div>
      </div>
      <div id="orderHistoryList" class="space-y-4"></div>
    </div>

    <!-- User Section: Available Promos -->
    <div id="userPromoSection" class="bg-white rounded-xl shadow-md p-6 mb-8 hidden">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">🎉 Promo Tersedia</h2>
      <div id="userPromoList" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
    </div>

  </div>
</div>

<!-- Payment Confirmation Modal -->
<div id="paymentModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  <div class="bg-white rounded-xl p-6 w-full max-w-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-4">💳 Konfirmasi Pembayaran</h2>
    <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
      <p class="text-sm text-gray-600 mb-2">Detail Pesanan:</p>
      <div class="space-y-1">
        <div class="flex justify-between">
          <span class="text-gray-700">Total Belanja:</span>
          <span class="font-semibold">Rp <span id="paymentTotalPrice">0</span></span>
        </div>
        <div class="flex justify-between" id="paymentDiscountRow" style="display: none;">
          <span class="text-gray-700">Diskon (<span id="paymentPromoCode"></span>):</span>
          <span class="text-green-600 font-semibold">- Rp <span id="paymentDiscount">0</span></span>
        </div>
        <div class="flex justify-between pt-2 border-t border-orange-200">
          <span class="font-bold text-gray-800">Total Bayar:</span>
          <span class="font-bold text-orange-600 text-xl">Rp <span id="paymentFinalAmount">0</span></span>
        </div>
      </div>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Metode Pembayaran</label>
        <div class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
          <span class="text-gray-800 font-medium">💵 Tunai (Cash)</span>
        </div>
      </div>

      <div id="paymentInstructions" class="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
        <p class="font-semibold text-blue-800 mb-1">Instruksi Pembayaran:</p>
        <p class="text-blue-700" id="paymentInstructionText">Bayar tunai saat pengambilan pesanan di kasir</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Catatan (Opsional)</label>
        <textarea id="paymentNotes" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" rows="2" placeholder="Contoh: Bayar saat pengambilan"></textarea>
      </div>

      <div class="flex space-x-3 pt-4">
        <button onclick="closePaymentModal()" class="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">
          Batal
        </button>
        <button onclick="confirmPayment()" class="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition">
          ✓ Konfirmasi
        </button>
      </div>
    </div>
  </div>
</div>

<!-- ======================== -->
<!-- MODALS -->
<!-- ======================== -->

<!-- Add/Edit Menu Modal -->
<div id="menuModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  <div class="bg-white rounded-xl p-6 w-full max-w-md">
    <h2 id="menuModalTitle" class="text-2xl font-bold text-gray-800 mb-4">Tambah Menu Baru</h2>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Nama Menu</label>
        <input type="text" id="menuName" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Harga</label>
        <input type="number" id="menuPrice" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
        <select id="menuCategory" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
          <option value="Nasi">Nasi</option>
          <option value="Lauk">Lauk</option>
          <option value="Sayur">Sayur</option>
          <option value="Minuman">Minuman</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Gambar Menu</label>
        <input type="file" id="menuImageFile" accept="image/*" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
        <p class="text-xs text-gray-500 mt-1">Format: JPG, PNG, GIF (Max: 2MB)</p>
        <div id="menuImagePreview" class="hidden mt-2">
          <img id="menuImagePreviewImg" src="" alt="Preview" class="w-32 h-32 object-cover rounded-lg">
        </div>
      </div>
      <div class="flex space-x-3 pt-4">
        <button onclick="closeMenuModal()" class="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">
          Batal
        </button>
        <button onclick="handleSubmitMenu()" class="flex-1 bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition">
          Simpan
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Add/Edit Promo Modal -->
<div id="promoModal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  <div class="bg-white rounded-xl p-6 w-full max-w-md">
    <h2 id="promoModalTitle" class="text-2xl font-bold text-gray-800 mb-4">Tambah Promo Baru</h2>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Kode Promo</label>
        <input type="text" id="promoCodeInput" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="PROMO123">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Deskripsi</label>
        <textarea id="promoDescription" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" rows="2"></textarea>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Diskon (%)</label>
        <input type="number" id="promoDiscount" min="1" max="100" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Minimal Pembelian (Rp)</label>
        <input type="number" id="promoMinPurchase" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Berlaku Dari</label>
        <input type="date" id="promoValidFrom" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Berlaku Sampai</label>
        <input type="date" id="promoValidUntil" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
      </div>
      <div class="flex space-x-3 pt-4">
        <button onclick="closePromoModal()" class="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">
          Batal
        </button>
        <button onclick="handleSubmitPromo()" class="flex-1 bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition">
          Simpan
        </button>
      </div>
    </div>
  </div>
</div>

<script src="/js/app.js?v={{ time() }}"></script>
<script>
// Ensure all modals are hidden on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM Content Loaded - Initializing page...');

  // Hide modals
  document.getElementById('menuModal').classList.add('hidden');
  document.getElementById('promoModal').classList.add('hidden');
  document.getElementById('mainPage').classList.add('hidden');
  document.getElementById('loginPage').classList.remove('hidden');

  // Make sure inputs are enabled
  document.querySelectorAll('input, button').forEach(el => {
    el.disabled = false;
    el.style.pointerEvents = 'auto';
  });

  // Test if buttons work
  const loginBtn = document.querySelector('#loginForm button[onclick="handleLogin()"]');
  if (loginBtn) {
    console.log('Login button found, adding click test listener');
    loginBtn.addEventListener('click', function() {
      console.log('Login button clicked via event listener');
    });
  } else {
    console.error('Login button not found!');
  }

  console.log('Page initialized - login page visible, buttons enabled');
