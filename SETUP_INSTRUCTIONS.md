# 🍛 Warung Makan Sederhana - Sistem Pemesanan Online

Aplikasi web untuk manajemen pemesanan makanan di warung makan dengan fitur lengkap untuk user dan admin.

## ✨ Fitur Utama

### 👥 Fitur User
- ✅ **Registrasi & Login** - Daftar akun baru dan login
- 🍽️ **Lihat Menu** - Browse menu makanan yang tersedia
- 🛒 **Keranjang Belanja** - Tambah/hapus item ke keranjang
- 🎁 **Sistem Promo** - Gunakan kode promo untuk mendapat diskon
- 🔄 **Pesanan Berlangsung** - Lihat status pesanan yang sedang diproses
- 📜 **Riwayat Pesanan** - Lihat history pesanan yang sudah selesai/ditolak
- 🎉 **Lihat Promo** - Browse promo yang tersedia

### 👨‍💼 Fitur Admin
- 📋 **Kelola Menu** - Tambah, edit, hapus menu makanan
- 📦 **Kelola Pesanan** - Proses, tolak, atau selesaikan pesanan
- 🎁 **Kelola Promo** - CRUD promo dengan validasi dan toggle aktif/nonaktif

## 🛠️ Teknologi

- **Backend**: Laravel 10
- **Frontend**: Blade, TailwindCSS, Vanilla JavaScript
- **Database**: MySQL
- **API**: RESTful API

## 📦 Instalasi

### Persyaratan
- PHP >= 8.1
- Composer
- MySQL
- Laragon/XAMPP/WAMP atau web server lainnya

### Langkah Instalasi

1. **Clone atau extract project**
   ```bash
   cd c:\laragon\www\Project-Web
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Setup environment**
   ```bash
   copy .env.example .env
   ```

4. **Edit file `.env`** dan sesuaikan konfigurasi database:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=warteg_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Generate application key**
   ```bash
   php artisan key:generate
   ```

6. **Buat database**
   - Buat database baru dengan nama `warteg_db` (atau sesuai `.env`)

7. **Jalankan migrasi database**
   ```bash
   php artisan migrate:fresh
   ```

8. **Jalankan seeder untuk data awal**
   ```bash
   php artisan db:seed
   ```

9. **Jalankan server development**
   ```bash
   php artisan serve
   ```

10. **Akses aplikasi**
    - Buka browser: `http://localhost:8000/warteg`
    - Atau jika menggunakan Laragon: `http://project-web.test/warteg`

## 👤 Akun Demo

Setelah menjalankan seeder, Anda dapat login dengan:

**Admin**
- Username: `admin`
- Password: `admin123`

**User**
- Username: `user`
- Password: `user123`

## 📚 Struktur Database

### Table: users
- id
- name
- email
- username (unique)
- password (hashed)
- role (admin/user)
- timestamps

### Table: menu_items
- id
- name
- price
- category
- image (emoji)
- timestamps

### Table: orders
- id
- user_id (foreign key)
- items (JSON)
- total
- status (pending/processing/completed/rejected)
- timestamps

### Table: promos
- id
- code (unique)
- description
- discount_percentage
- min_purchase
- valid_from
- valid_until
- is_active
- timestamps

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - Registrasi user baru
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user

### Menu
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu (admin)
- `PUT /api/menu/{id}` - Update menu (admin)
- `DELETE /api/menu/{id}` - Delete menu (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/user/{userId}` - Get user orders
- `GET /api/orders/user/{userId}/ongoing` - Get ongoing orders
- `GET /api/orders/user/{userId}/history` - Get order history
- `PUT /api/orders/{id}/status` - Update order status
- `PUT /api/orders/{id}/process` - Process order
- `PUT /api/orders/{id}/complete` - Complete order
- `PUT /api/orders/{id}/reject` - Reject order

### Promos
- `GET /api/promos` - Get active promos
- `GET /api/promos/all` - Get all promos (admin)
- `POST /api/promos` - Create promo (admin)
- `PUT /api/promos/{id}` - Update promo (admin)
- `DELETE /api/promos/{id}` - Delete promo (admin)
- `PUT /api/promos/{id}/toggle` - Toggle promo status
- `POST /api/promos/validate` - Validate promo code

## 🎯 Cara Penggunaan

### Sebagai User

1. **Registrasi**
   - Klik "Daftar Akun Baru" di halaman login
   - Isi form registrasi dengan lengkap
   - Klik "Daftar"

2. **Login**
   - Masukkan username dan password
   - Klik "Login"

3. **Pesan Makanan**
   - Browse menu yang tersedia di tab "Menu"
   - Klik tombol "+ Keranjang" untuk menambahkan item
   - Review keranjang Anda
   - (Opsional) Masukkan kode promo untuk diskon
   - Klik "Buat Pesanan"

4. **Cek Status Pesanan**
   - Tab "Pesanan Berlangsung" untuk melihat pesanan yang sedang diproses
   - Tab "Riwayat" untuk melihat pesanan yang sudah selesai

5. **Lihat Promo**
   - Tab "Promo" untuk melihat promo yang tersedia
   - Klik "Salin Kode" untuk copy kode promo

### Sebagai Admin

1. **Login sebagai Admin**
   - Username: `admin`
   - Password: `admin123`

2. **Kelola Menu**
   - Tab "Kelola Menu"
   - Klik "+ Tambah Menu" untuk menambah menu baru
   - Klik "Edit" untuk mengubah menu
   - Klik "Hapus" untuk menghapus menu

3. **Kelola Pesanan**
   - Tab "Kelola Pesanan"
   - Status pesanan:
     - **Pending** → Klik "Proses" atau "Tolak"
     - **Processing** → Klik "Selesai"

4. **Kelola Promo**
   - Tab "Kelola Promo"
   - Klik "+ Tambah Promo" untuk membuat promo baru
   - Klik "Edit" untuk mengubah promo
   - Klik "Aktifkan/Nonaktifkan" untuk toggle status
   - Klik "Hapus" untuk menghapus promo

## 🔒 Keamanan

- Password di-hash menggunakan Laravel Hash (bcrypt)
- Validasi input di backend untuk semua form
- Protection terhadap SQL injection melalui Eloquent ORM
- CSRF protection untuk form submission

## 🐛 Troubleshooting

**Error: "Target class does not exist"**
- Pastikan namespace controller sudah benar
- Jalankan: `php artisan optimize:clear`

**Error: Database connection**
- Periksa konfigurasi database di `.env`
- Pastikan MySQL service sudah running
- Pastikan database sudah dibuat

**Error: "Route not found"**
- Periksa route di `routes/api.php` dan `routes/web.php`
- Jalankan: `php artisan route:clear`

**Menu/Data tidak muncul**
- Pastikan sudah menjalankan seeder: `php artisan db:seed`
- Check console browser untuk error JavaScript

## 📝 Catatan Pengembangan

- Aplikasi ini menggunakan RESTful API untuk komunikasi frontend-backend
- State management menggunakan vanilla JavaScript
- Styling menggunakan TailwindCSS CDN
- Responsive design untuk mobile dan desktop

## 👨‍💻 Developer

Project ini dikembangkan untuk sistem manajemen warung makan sederhana.

## 📄 License

Open source - bebas digunakan untuk pembelajaran dan pengembangan.
