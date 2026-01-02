# 🍽️ Warung Makan Sederhana - Food Ordering System

![Laravel](https://img.shields.io/badge/Laravel-10.x-red?style=flat-square&logo=laravel)
![PHP](https://img.shields.io/badge/PHP-8.1+-blue?style=flat-square&logo=php)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=flat-square&logo=mysql)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38bdf8?style=flat-square&logo=tailwindcss)

Sistem pemesanan makanan warung sederhana berbasis web dengan fitur lengkap untuk user dan admin.

---

## ✨ Features

### 👤 User Features
- ✅ **Registration & Login** - Sistem autentikasi dengan validasi
- 🍽️ **Menu Browsing** - Lihat menu dengan gambar makanan
- 🛒 **Shopping Cart** - Tambah/hapus item ke keranjang
- 🎟️ **Promo System** - Gunakan kode promo untuk diskon
- 💳 **Payment Confirmation** - Pilih metode pembayaran (Cash/Transfer/E-Wallet/QRIS)
- ⏳ **Ongoing Orders** - Lihat pesanan yang sedang berlangsung
- 📜 **Order History** - Riwayat pesanan selesai/ditolak
- 📱 **Responsive Design** - Akses dari desktop/mobile

### 👨‍💼 Admin Features
- 🍔 **Menu Management** - CRUD menu dengan upload gambar
- 📦 **Order Management** - Proses/tolak/selesaikan pesanan
- 🎁 **Promo Management** - CRUD promo dengan toggle aktif/nonaktif
- 💰 **Payment Management** - Konfirmasi/tolak pembayaran (API ready)
- 📊 **Real-time Updates** - Status pesanan update otomatis

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.1 or higher
- Composer
- MySQL 8.0 or higher
- Laragon (recommended) or XAMPP

### Installation

1. **Clone Repository**
   ```bash
   cd c:\laragon\www
   git clone <repository-url> Project-Web
   cd Project-Web
   ```

2. **Install Dependencies**
   ```bash
   composer install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database Configuration**
   Edit `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=warteg_db
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Create Database**
   ```sql
   CREATE DATABASE warteg_db;
   ```

6. **Run Migrations & Seeders**
   ```bash
   php artisan migrate
   php artisan db:seed
   ```

7. **Storage Link**
   ```bash
   php artisan storage:link
   ```

8. **Start Server**
   ```bash
   php artisan serve
   ```

9. **Access Application**
   ```
   http://127.0.0.1:8000/warteg
   ```

### Default Accounts
```
Admin:
Username: admin
Password: admin123

User:
Username: user1
Password: password
```

---

## 💳 Payment System

### Supported Payment Methods

#### 💵 Cash (Tunai)
Bayar tunai saat pengambilan pesanan di kasir

#### 🏦 Transfer Bank
```
Bank: BCA
Account: 1234567890
Name: Warung Sederhana
```

#### 📱 E-Wallet
```
GoPay/OVO/Dana
Number: 081234567890
```

#### 📲 QRIS
Scan QRIS code di kasir

### Payment Flow
1. Customer membuat pesanan
2. Modal konfirmasi pembayaran muncul
3. Customer pilih metode pembayaran
4. Customer konfirmasi pembayaran
5. Payment record dibuat (status: pending)
6. Admin konfirmasi pembayaran
7. Order status update ke "processing"

**Documentation:** See [PAYMENT_SYSTEM.md](PAYMENT_SYSTEM.md) for complete guide

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SETUP_INSTRUCTIONS.md](SETUP_INSTRUCTIONS.md) | Complete setup guide |
| [PAYMENT_SYSTEM.md](PAYMENT_SYSTEM.md) | Payment system documentation |
| [PAYMENT_QUICKSTART.md](PAYMENT_QUICKSTART.md) | Payment quick start guide |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Implementation details |
| [CHANGELOG.md](CHANGELOG.md) | Version history & changes |
| [IMAGE_UPLOAD_GUIDE.md](IMAGE_UPLOAD_GUIDE.md) | Image upload guide |
| [LOGIN_TROUBLESHOOTING.txt](LOGIN_TROUBLESHOOTING.txt) | Login issues guide |
| [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md) | API testing guide |

---

## 🔌 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - User login

### Menu Management
- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Create menu (Admin)
- `PUT /api/menu/{id}` - Update menu (Admin)
- `DELETE /api/menu/{id}` - Delete menu (Admin)

### Order Management
- `GET /api/orders/user/{userId}/ongoing` - Get ongoing orders
- `GET /api/orders/user/{userId}/history` - Get order history
- `POST /api/orders` - Create order
- `GET /api/orders/pending` - Get pending orders (Admin)
- `POST /api/orders/{id}/process` - Process order (Admin)
- `POST /api/orders/{id}/complete` - Complete order (Admin)
- `POST /api/orders/{id}/reject` - Reject order (Admin)

### Promo Management
- `GET /api/promos/active` - Get active promos
- `POST /api/promos/validate` - Validate promo code
- `GET /api/promos` - Get all promos (Admin)
- `POST /api/promos` - Create promo (Admin)
- `PUT /api/promos/{id}` - Update promo (Admin)
- `POST /api/promos/{id}/toggle` - Toggle promo status (Admin)
- `DELETE /api/promos/{id}` - Delete promo (Admin)

### Payment Management
- `GET /api/payments` - Get all payments
- `GET /api/payments?user_id={id}` - Get user payments
- `GET /api/payments/order/{orderId}` - Get payment by order
- `POST /api/payments` - Create payment
- `POST /api/payments/{id}/upload-proof` - Upload payment proof
- `POST /api/payments/{id}/confirm` - Confirm payment (Admin)
- `POST /api/payments/{id}/fail` - Reject payment (Admin)
- `DELETE /api/payments/{id}` - Delete payment

**Postman Collection:** Import `Warung_Makan_Sederhana_v2.postman_collection.json`

---

## 🗄️ Database Schema

### Tables
1. **users** - User accounts (admin/customer)
2. **menu_items** - Menu dengan gambar
3. **orders** - Order records
4. **promos** - Promo codes
5. **payments** - Payment records (NEW in v3.0)

### Entity Relationships
```
users (1) ─── (N) orders (1) ─── (1) payments
                │
                └─── (N) order_items
                
users (1) ─── (N) payments

menu_items (1) ─── (N) order_items

promos (1) ─── (N) orders
```

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Laravel 10.x
- **Language:** PHP 8.1+
- **Database:** MySQL 8.0
- **ORM:** Eloquent
- **Auth:** Custom implementation

### Frontend
- **Template Engine:** Blade
- **CSS Framework:** TailwindCSS 3.x (CDN)
- **JavaScript:** Vanilla ES6+
- **Architecture:** SPA-like (Single Page Application)

### Storage
- **File Upload:** Laravel Storage
- **Image Storage:** `storage/app/public/menu` & `storage/app/public/payments`
- **Public Access:** Via storage symlink

---

## 📦 Project Structure

```
Project-Web/
├── app/
│   ├── Http/Controllers/
│   │   ├── AuthController.php
│   │   ├── MenuController.php
│   │   ├── OrderController.php
│   │   ├── PromoController.php
│   │   └── PaymentController.php (NEW)
│   └── Models/
│       ├── User.php
│       ├── MenuItem.php
│       ├── Order.php
│       ├── Promo.php
│       └── Payment.php (NEW)
├── database/
│   ├── migrations/
│   │   ├── ..._create_users_table.php
│   │   ├── ..._create_menu_items_table.php
│   │   ├── ..._create_orders_table.php
│   │   ├── ..._create_promos_table.php
│   │   └── ..._create_payments_table.php (NEW)
│   └── seeders/
│       └── DatabaseSeeder.php
├── public/
│   ├── js/
│   │   └── app.js (1139 lines)
│   └── css/
│       └── style.css
├── resources/views/
│   └── warteg.blade.php
├── routes/
│   ├── api.php
│   └── web.php
└── storage/
    └── app/public/
        ├── menu/
        └── payments/ (NEW)
```

---

## 🧪 Testing

### Manual Testing
1. Login sebagai user/admin
2. Test semua fitur CRUD
3. Test payment flow end-to-end
4. Verify order status updates

### API Testing (Postman)
1. Import collection
2. Set `base_url` = `http://127.0.0.1:8000`
3. Login untuk set `user_id`
4. Test semua endpoints

**Guide:** See [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md)

---

## 🐛 Troubleshooting

### Common Issues

#### Login Failed
- Clear browser cache (Ctrl+Shift+Del)
- Hard refresh (Ctrl+Shift+R)
- Check credentials
- See: [LOGIN_TROUBLESHOOTING.txt](LOGIN_TROUBLESHOOTING.txt)

#### Payment Modal Not Showing
- Check browser console for errors
- Verify modal HTML exists
- Clear cache and refresh

#### Image Upload Failed
- Check file size (max 2MB)
- Verify file type (jpg, png, gif)
- Run `php artisan storage:link`
- Check directory permissions

#### Database Connection Error
- Verify MySQL is running
- Check `.env` credentials
- Create database if not exists

---

## 📈 Version History

| Version | Date | Changes |
|---------|------|---------|
| v3.0 | Dec 19, 2025 | **Payment System** - Konfirmasi pembayaran dengan 4 metode |
| v2.0 | Dec 18, 2025 | **Image Upload** - Upload gambar menu |
| v1.5 | Dec 17, 2025 | **Bug Fixes** - Login issues, cache busting |
| v1.0 | Dec 16, 2025 | **Initial Release** - User/Admin features, Promo system |

**Full Changelog:** [CHANGELOG.md](CHANGELOG.md)

---

## 🔮 Roadmap

### Short Term (v3.1)
- [ ] Admin payment dashboard UI
- [ ] Payment proof upload from frontend
- [ ] Payment history for users
- [ ] Payment analytics

### Mid Term (v4.0)
- [ ] Payment gateway integration (Midtrans/Xendit)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Auto QRIS generation

### Long Term (v5.0)
- [ ] Mobile app (Flutter/React Native)
- [ ] Real-time notifications (WebSocket)
- [ ] Multi-branch support
- [ ] Loyalty program

---

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

**GitHub Copilot**  
Built with Laravel 10 & ❤️

---

## 🙏 Acknowledgments

- Laravel Framework
- TailwindCSS
- Font Awesome (emojis)
- Postman for API testing

---

## 📞 Support

**Need help?**
- 📖 Read the documentation
- 🐛 Open an issue
- 📧 Contact: wartegadmin@example.com

---

**⭐ Star this repo if you find it helpful!**

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[WebReinvent](https://webreinvent.com/)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Jump24](https://jump24.co.uk)**
- **[Redberry](https://redberry.international/laravel/)**
- **[Active Logic](https://activelogic.com)**
- **[byte5](https://byte5.de)**
- **[OP.GG](https://op.gg)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
