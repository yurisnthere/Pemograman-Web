# 📮 Postman Collection Guide - Warung Makan Sederhana API

## 📥 Import Collection ke Postman

### Cara 1: Import File
1. Buka Postman
2. Klik **Import** (pojok kiri atas)
3. Drag & drop file `Warung_Makan_Sederhana.postman_collection.json`
4. Klik **Import**

### Cara 2: Import dari URL (jika sudah di GitHub)
1. Klik **Import**
2. Pilih tab **Link**
3. Paste URL ke file collection
4. Klik **Continue** → **Import**

## ⚙️ Setup Environment Variables

Collection sudah include 3 variables:
- `base_url`: http://127.0.0.1:8000 (default Laravel dev server)
- `user_id`: Auto-set saat login
- `user_role`: Auto-set saat login

### Mengubah Base URL
Jika server Laravel berjalan di port/host lain:
1. Klik collection **Warung Makan Sederhana API**
2. Tab **Variables**
3. Edit `base_url` (contoh: http://localhost:8000 atau http://project-web.test)
4. **Save**

## 🚀 Quick Start Testing

### 1️⃣ Login Sebagai Admin
```
Request: Authentication → Login
Method: POST
URL: {{base_url}}/api/login
Body:
{
    "username": "admin",
    "password": "admin123"
}
```

**Response akan auto-set environment variables:**
- `user_id` → ID user yang login
- `user_role` → Role user (admin/user)

### 2️⃣ Test Get Menu
```
Request: Menu Management → Get All Menu Items
Method: GET
URL: {{base_url}}/api/menu
```

### 3️⃣ Create Menu dengan Gambar
```
Request: Menu Management → Create Menu Item (with Image)
Method: POST
URL: {{base_url}}/api/menu
Headers: Authorization: Bearer {{user_id}}
Body: form-data
  - name: Ayam Bakar Madu
  - price: 35000
  - category: Lauk
  - image: [pilih file gambar]
```

## 📋 Request List

### 🔐 Authentication (4 requests)
- ✅ **Register User** - Daftar akun baru
- ✅ **Login** - Login sebagai admin
- ✅ **Login as User** - Login sebagai user biasa
- ✅ **Logout** - Logout dari sistem

### 🍽️ Menu Management (5 requests)
- ✅ **Get All Menu Items** - Lihat semua menu
- ✅ **Create Menu Item (JSON)** - Tambah menu tanpa gambar
- ✅ **Create Menu Item (with Image)** - Tambah menu dengan upload gambar
- ✅ **Update Menu Item** - Edit menu existing
- ✅ **Delete Menu Item** - Hapus menu

### 📦 Order Management (7 requests)
- ✅ **Get All Orders** - Lihat semua pesanan
- ✅ **Get Orders by User** - Filter pesanan by user
- ✅ **Create Order (No Promo)** - Buat pesanan tanpa promo
- ✅ **Create Order (With Promo)** - Buat pesanan dengan promo
- ✅ **Update Order Status - Process** - Set status processing
- ✅ **Update Order Status - Complete** - Set status completed
- ✅ **Update Order Status - Reject** - Set status rejected

### 🎁 Promo Management (7 requests)
- ✅ **Get All Promos** - Lihat semua promo
- ✅ **Get Active Promos Only** - Filter promo aktif saja
- ✅ **Validate Promo Code** - Cek validitas kode promo
- ✅ **Create Promo** - Tambah promo baru (Admin)
- ✅ **Update Promo** - Edit promo (Admin)
- ✅ **Toggle Promo Active Status** - Toggle aktif/nonaktif (Admin)
- ✅ **Delete Promo** - Hapus promo (Admin)

## 🎯 Testing Workflow

### Scenario 1: User Flow
```
1. Register User → Daftar akun
2. Login as User → Login
3. Get All Menu Items → Browse menu
4. Validate Promo Code → Cek promo
5. Create Order (With Promo) → Pesan dengan promo
6. Get Orders by User → Cek status pesanan
```

### Scenario 2: Admin Flow
```
1. Login → Login sebagai admin
2. Create Menu Item (with Image) → Tambah menu baru
3. Get All Orders → Lihat semua pesanan
4. Update Order Status - Process → Proses pesanan
5. Update Order Status - Complete → Selesaikan pesanan
6. Create Promo → Buat promo baru
7. Toggle Promo Active Status → Aktifkan/nonaktifkan promo
```

## 📝 Notes & Tips

### Authorization Header
Semua request yang memerlukan auth menggunakan:
```
Authorization: Bearer {{user_id}}
```

Variable `{{user_id}}` akan auto-set saat login.

### Upload Image (Menu)
- Format: `form-data` (bukan JSON)
- Max size: 2MB
- Allowed types: jpeg, png, jpg, gif
- Field name: `image`

### Order Items Format
```json
{
    "user_id": 1,
    "items": [
        {
            "menu_item_id": 1,
            "quantity": 2
        },
        {
            "menu_item_id": 3,
            "quantity": 1
        }
    ],
    "total_price": 30000
}
```

### Order Status Flow
```
pending → processing → completed
pending → rejected
```

### Promo Validation
- `valid_from` & `valid_until`: Format YYYY-MM-DD
- `discount_percentage`: 0-100
- `min_purchase`: Minimum transaksi dalam Rupiah
- `is_active`: true/false

## 🐛 Troubleshooting

### ❌ 401 Unauthorized
**Cause:** Belum login atau `user_id` tidak valid
**Fix:**
1. Login via request "Login" atau "Login as User"
2. Pastikan `{{user_id}}` ter-set di environment

### ❌ 422 Validation Error
**Cause:** Data request tidak valid
**Fix:**
- Cek required fields
- Pastikan format data benar (number, string, date)
- Cek validation rules di response error

### ❌ 404 Not Found
**Cause:** Endpoint atau resource ID tidak ditemukan
**Fix:**
- Cek URL path
- Pastikan ID exists di database
- Cek `base_url` di variables

### ❌ 500 Server Error
**Cause:** Error di backend
**Fix:**
- Cek Laravel logs: `storage/logs/laravel.log`
- Pastikan database connection OK
- Pastikan server running: `php artisan serve`

## 📊 Response Examples

### Success Response - Login
```json
{
    "message": "Login berhasil",
    "user": {
        "id": 1,
        "name": "Administrator",
        "email": "admin@warteg.com",
        "username": "admin",
        "role": "admin",
        "created_at": "2025-12-19T13:21:16.000000Z",
        "updated_at": "2025-12-19T13:21:16.000000Z"
    }
}
```

### Success Response - Get Menu
```json
[
    {
        "id": 1,
        "name": "Nasi Putih",
        "price": 5000,
        "category": "Nasi",
        "image": "menu/abc123.jpg",
        "created_at": "2025-12-19T13:21:16.000000Z",
        "updated_at": "2025-12-19T13:21:16.000000Z"
    }
]
```

### Error Response - Validation
```json
{
    "errors": {
        "username": [
            "The username field is required."
        ],
        "password": [
            "The password field is required."
        ]
    }
}
```

### Error Response - Unauthorized
```json
{
    "error": "Username atau password salah"
}
```

## 🔗 Related Files

- **Collection**: `Warung_Makan_Sederhana.postman_collection.json`
- **API Routes**: `routes/api.php`
- **Controllers**: `app/Http/Controllers/`
- **Documentation**: `README.md`, `SETUP_INSTRUCTIONS.md`

## 💡 Pro Tips

1. **Save Responses**: Klik **Save Response** untuk reference
2. **Use Tests**: Tab "Tests" sudah setup auto-set `user_id` saat login
3. **Environment**: Buat environment berbeda untuk dev/staging/production
4. **Pre-request Scripts**: Tambahkan untuk auto-refresh token
5. **Collection Runner**: Test semua endpoint sekaligus

---

**Happy Testing! 🚀**
