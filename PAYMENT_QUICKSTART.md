# 💳 Quick Start: Payment System

## Untuk User (Customer)

### 1️⃣ Buat Pesanan
1. Login ke aplikasi
2. Pilih tab "🍽️ Menu"
3. Tambahkan menu ke keranjang
4. (Opsional) Gunakan kode promo
5. Klik "🛒 Pesan Sekarang"

### 2️⃣ Konfirmasi Pembayaran
Setelah klik "Pesan Sekarang", modal konfirmasi pembayaran akan muncul:

**Informasi yang ditampilkan:**
- Total Belanja
- Diskon (jika ada promo)
- Total Bayar

**Pilih Metode Pembayaran:**

#### 💵 Tunai (Cash)
- Pilih "💵 Tunai"
- Klik "✓ Konfirmasi"
- Bayar saat pengambilan pesanan di kasir

#### 🏦 Transfer Bank
- Pilih "🏦 Transfer Bank"
- Transfer ke: **BCA 1234567890 a.n. Warung Sederhana**
- Klik "✓ Konfirmasi"
- Upload bukti transfer (lihat langkah 3)

#### 📱 E-Wallet (GoPay/OVO/Dana)
- Pilih "📱 E-Wallet"
- Transfer ke: **081234567890**
- Klik "✓ Konfirmasi"
- Upload bukti transfer (lihat langkah 3)

#### 📲 QRIS
- Pilih "📲 QRIS"
- Scan QRIS di kasir atau gambar yang diunggah
- Klik "✓ Konfirmasi"
- Upload bukti pembayaran (lihat langkah 3)

**Catatan:**
- Anda bisa menambahkan catatan di field "Catatan"
- Contoh: "Bayar saat pengambilan", "Sudah transfer jam 10:00"

### 3️⃣ Upload Bukti Pembayaran (Non-Cash)
*Coming Soon - Fitur ini akan ditambahkan*

Saat ini setelah konfirmasi pembayaran:
1. Pesanan otomatis dibuat dengan status "pending"
2. Payment record dibuat dengan status "pending"
3. Admin akan review dan konfirmasi pembayaran

### 4️⃣ Cek Status Pesanan
1. Pilih tab "⏳ Pesanan Berlangsung"
2. Lihat status pesanan:
   - **Pending**: Menunggu konfirmasi admin
   - **Processing**: Sedang diproses
   - **Completed**: Selesai
   - **Rejected**: Ditolak

---

## Untuk Admin

### 1️⃣ Lihat Semua Payment
*Coming Soon - Admin Payment Management UI*

Saat ini payment bisa diakses via API:
```
GET http://127.0.0.1:8000/api/payments
```

### 2️⃣ Konfirmasi Payment
Via API atau Postman:
```
POST http://127.0.0.1:8000/api/payments/{id}/confirm
```

**Efek:**
- Payment status → "confirmed"
- paid_at → timestamp sekarang
- Order status → "processing"

### 3️⃣ Tolak Payment
Via API atau Postman:
```
POST http://127.0.0.1:8000/api/payments/{id}/fail
```

**Efek:**
- Payment status → "failed"
- Order tetap "pending"

---

## Testing dengan Postman

### Setup
1. Import collection: `Warung_Makan_Sederhana_v2.postman_collection.json`
2. Set variable `base_url` = `http://127.0.0.1:8000`
3. Login untuk set `user_id`

### Test Flow

#### A. Login User
```
POST {{base_url}}/api/login
Body:
{
  "username": "user1",
  "password": "password"
}
```

#### B. Create Order (Manual)
```
POST {{base_url}}/api/orders
Body:
{
  "user_id": {{user_id}},
  "items": [
    {"id": 1, "name": "Nasi Putih", "price": 5000},
    {"id": 2, "name": "Ayam Goreng", "price": 15000}
  ],
  "total": 20000
}
```

**Response:** Simpan `order_id` dari response

#### C. Create Payment
```
POST {{base_url}}/api/payments
Body:
{
  "order_id": 1,
  "user_id": {{user_id}},
  "amount": 20000,
  "payment_method": "cash",
  "notes": "Bayar saat ambil pesanan"
}
```

#### D. Get Payment by Order
```
GET {{base_url}}/api/payments/order/1
```

#### E. Confirm Payment (as Admin)
```
POST {{base_url}}/api/payments/1/confirm
```

#### F. Check Order Status
```
GET {{base_url}}/api/orders/user/{{user_id}}/ongoing
```

Order status seharusnya berubah menjadi "processing"

---

## Troubleshooting

### ❌ Modal Pembayaran Tidak Muncul
**Penyebab:**
- JavaScript error
- Modal HTML tidak ada
- submitOrder() tidak memanggil showPaymentModal()

**Solusi:**
1. Buka Browser Console (F12)
2. Cek error di Console tab
3. Refresh halaman dengan Ctrl+Shift+R (hard refresh)
4. Pastikan modal ada di HTML dengan ID "paymentModal"

### ❌ Payment Creation Failed
**Error:** "Order already has a payment record"

**Penyebab:**
- Order sudah punya payment
- Tidak bisa create payment duplikat

**Solusi:**
1. Cek payment yang ada:
   ```
   GET /api/payments/order/{orderId}
   ```
2. Jika perlu, delete payment lama:
   ```
   DELETE /api/payments/{paymentId}
   ```
3. Create payment baru

### ❌ Amount Tidak Sesuai
**Penyebab:**
- Amount di payment berbeda dengan total di order
- Format number salah

**Solusi:**
1. Pastikan amount adalah number, bukan string
2. Cek total di order:
   ```
   GET /api/orders/{orderId}
   ```
3. Gunakan total yang sama untuk payment

### ❌ Payment Method Invalid
**Error:** "The selected payment method is invalid"

**Penyebab:**
- payment_method tidak sesuai enum

**Solusi:**
Gunakan salah satu dari:
- `cash`
- `transfer`
- `ewallet`
- `qris`

**BUKAN:**
- `tunai` ❌
- `bank` ❌
- `gopay` ❌

---

## Tips & Best Practices

### Untuk Customer
1. ✅ Pilih metode pembayaran dengan cermat
2. ✅ Tambahkan catatan jika perlu (contoh: nomor meja, jam pengambilan)
3. ✅ Simpan bukti pembayaran (untuk non-cash)
4. ✅ Cek status pesanan secara berkala
5. ✅ Konfirmasi dengan kasir jika pembayaran belum dikonfirmasi

### Untuk Admin
1. ✅ Review payment secepat mungkin
2. ✅ Verifikasi bukti pembayaran sebelum konfirmasi
3. ✅ Komunikasi dengan customer jika ada masalah
4. ✅ Update order status setelah payment confirmed
5. ✅ Backup data payment secara berkala

---

## Next Steps

### Fitur yang Akan Datang
1. **Admin Payment Dashboard**
   - Tab khusus untuk manage payments
   - Filter by status, method, date
   - Bulk confirmation

2. **Payment Proof Upload UI**
   - Upload langsung dari frontend
   - Preview bukti pembayaran
   - Gallery view untuk admin

3. **Payment Notifications**
   - Email notification saat payment confirmed
   - SMS notification (optional)

4. **Payment Analytics**
   - Revenue statistics
   - Payment method distribution
   - Success rate tracking

5. **Payment Gateway Integration**
   - Midtrans integration
   - Xendit integration
   - Auto-confirmation via webhook

---

## Support

**Masalah teknis?**
1. Cek dokumentasi lengkap: `PAYMENT_SYSTEM.md`
2. Review CHANGELOG: `CHANGELOG.md`
3. Test dengan Postman collection
4. Cek error logs: `storage/logs/laravel.log`

**Need help?**
Contact: wartegadmin@example.com

---

**Version:** 1.0  
**Last Updated:** December 19, 2025
