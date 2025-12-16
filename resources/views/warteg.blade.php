<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Warung Makan Sederhana</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-gray-50">

<!-- ======================== -->
<!-- LOGIN PAGE -->
<!-- ======================== -->
<div id="loginPage" class="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
  <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
    <div class="text-center mb-8">
      <div class="text-6xl mb-4">🍛</div>
      <h1 class="text-3xl font-bold text-orange-600 mb-2">Warung Makan Sederhana</h1>
      <p class="text-gray-600">Silakan login untuk melanjutkan</p>
    </div>

    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
        <input type="text" id="username" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input type="password" id="password" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
      </div>
      <button onclick="handleLogin()" class="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition">
        Login
      </button>
    </div>

    <div class="mt-6 p-4 bg-orange-50 rounded-lg text-sm">
      <p class="font-semibold text-orange-800 mb-2">Demo Akun:</p>
      <p class="text-gray-700">Admin: admin / admin123</p>
      <p class="text-gray-700">User: user / user123</p>
    </div>
  </div>
</div>

<!-- ======================== -->
<!-- MAIN APP PAGE -->
<!-- ======================== -->
<div id="mainPage" class="hidden">
  <!-- Header -->
  <header class="bg-orange-600 text-white shadow-lg">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <span class="text-3xl">📋</span>
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

<div id="adminSection" class="bg-white rounded-xl shadow-md p-6 mb-8 hidden">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-gray-800">Kelola Menu</h2>
        <button onclick="openAddModal()" class="bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-700 transition">
          ➕ Tambah Menu
        </button>
      </div>
        <ul id="adminList" class="divide-y divide-gray-200 mt-4">
            </ul>
    </div>


    <!-- Menu List -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Daftar Menu</h2>
      <div id="menu-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Menu items will be inserted here -->
      </div>
    </div>

    <!-- Cart (User only) -->
    <div id="cartSection" class="bg-white rounded-xl shadow-md p-6 mb-8 hidden">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-gray-800 flex items-center space-x-2">
          <span>🛒</span>
          <span>Keranjang Belanja</span>
        </h2>
        <span id="cartCount" class="bg-orange-600 text-white px-4 py-2 rounded-full font-bold">0 Item</span>
      </div>
      <div id="cartItems"></div>
      <div id="cartTotal" class="hidden border-t pt-4 mt-6">
        <div class="flex items-center justify-between mb-4">
          <span class="text-xl font-bold text-gray-800">Total:</span>
          <span id="totalAmount" class="text-3xl font-bold text-orange-600">Rp 0</span>
        </div>
        <button onclick="submitOrder()" class="w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition">
          Buat Pesanan
        </button>
      </div>
    </div>


<!-- ======================== -->
<!-- MODAL -->
<!-- ======================== -->
<div id="modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  <div class="bg-white rounded-xl p-6 w-full max-w-md">
    <h2 id="modalTitle" class="text-2xl font-bold text-gray-800 mb-4">Tambah Menu Baru</h2>
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
        <label class="block text-sm font-medium text-gray-700 mb-2">Emoji/Icon</label>
        <input type="text" id="menuImage" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" placeholder="🍛">
      </div>
      <div class="flex space-x-3 pt-4">
        <button onclick="closeModal()" class="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition">
          Batal
        </button>
        <button onclick="handleSubmitMenu()" class="flex-1 bg-orange-600 text-white py-2 rounded-lg font-semibold hover:bg-orange-700 transition">
          Simpan
        </button>
      </div>
    </div>
  </div>
</div>

<script src="/js/app.js"></script>
</body>
</html>
