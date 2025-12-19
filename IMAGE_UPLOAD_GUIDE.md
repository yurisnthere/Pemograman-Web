# 📸 Panduan Upload Gambar Menu

## 🎯 Fitur Upload Gambar

Aplikasi Warung Makan Sederhana sekarang mendukung upload gambar untuk menu makanan, menggantikan sistem emoji sebelumnya.

## ⚙️ Setup Awal

### 1. Pastikan Storage Link Sudah Dibuat
```bash
php artisan storage:link
```

Command ini membuat symbolic link dari `public/storage` ke `storage/app/public`, sehingga file yang diupload bisa diakses publik.

### 2. Struktur Folder
```
storage/
  app/
    public/
      menu/          ← Gambar menu disimpan di sini
        
public/
  storage/           ← Symbolic link ke storage/app/public
  images/
    no-image.svg     ← Placeholder untuk menu tanpa gambar
```

## 📤 Cara Upload Gambar (Admin)

### 1. Login sebagai Admin
- Username: `admin`
- Password: `admin123`

### 2. Ke Tab "Kelola Menu"

### 3. Tambah Menu Baru
- Klik tombol "Tambah Menu"
- Isi form:
  - Nama Menu
  - Harga
  - Kategori
  - **Gambar Menu** ← Klik untuk upload

### 4. Upload Gambar
- Klik input file
- Pilih gambar dari komputer
- **Preview akan muncul otomatis**
- Klik "Simpan" untuk upload

### 5. Edit Menu Existing
- Klik tombol "Edit" pada menu
- Ubah gambar jika perlu
- Klik "Simpan"

## ✅ Spesifikasi Gambar

### Validasi
- **Format**: JPEG, PNG, JPG, GIF
- **Ukuran Maksimal**: 2MB (2048KB)
- **Dimensi**: Bebas (akan otomatis di-resize di tampilan)

### Rekomendasi
- Rasio: 1:1 (square) atau 4:3
- Resolusi: 800x800px atau lebih
- Format: JPEG untuk foto, PNG untuk gambar dengan background transparan
- Ukuran file: < 500KB untuk performa optimal

## 🔍 Bagaimana Gambar Ditampilkan

### Di Menu User
- Ukuran: Full width card (h-40 = 160px)
- Object-fit: Cover (memenuhi container)
- Border radius: Rounded-lg

### Di Admin Menu List
- Ukuran: 64x64px (thumbnail)
- Object-fit: Cover
- Border radius: Rounded-lg

### Placeholder
Jika menu belum punya gambar atau gambar gagal load:
- Akan tampil placeholder: `no-image.svg`
- Icon piring dengan teks "No Image"

## 🛠️ Technical Details

### Backend (MenuController.php)

#### Store (Tambah Menu)
```php
$request->validate([
    'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    // ... validasi lainnya
]);

if ($request->hasFile('image')) {
    $imagePath = $request->file('image')->store('menu', 'public');
    $validatedData['image'] = $imagePath;
}
```

#### Update (Edit Menu)
```php
// Delete gambar lama jika ada
if ($request->hasFile('image') && $menuItem->image) {
    Storage::disk('public')->delete($menuItem->image);
}

// Upload gambar baru
if ($request->hasFile('image')) {
    $imagePath = $request->file('image')->store('menu', 'public');
    $validatedData['image'] = $imagePath;
}
```

#### Delete (Hapus Menu)
```php
// Auto-delete gambar saat hapus menu
if ($menuItem->image) {
    Storage::disk('public')->delete($menuItem->image);
}
```

### Frontend (app.js)

#### Image Preview
```javascript
// Event listener untuk preview gambar
imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    
    // Validasi ukuran (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file terlalu besar! Maksimal 2MB');
        return;
    }
    
    // Validasi tipe file
    if (!file.type.match('image.*')) {
        alert('File harus berupa gambar!');
        return;
    }
    
    // Generate preview
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImg.src = e.target.result;
        previewContainer.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
});
```

#### Submit dengan FormData
```javascript
// Gunakan FormData untuk multipart upload
const formData = new FormData();
formData.append('name', name);
formData.append('price', price);
formData.append('category', category);

// Append file jika ada
const imageFile = document.getElementById('menuImageFile').files[0];
if (imageFile) {
    formData.append('image', imageFile);
}

// Kirim ke server
await fetch('/api/menu', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${currentUser.id}`
    },
    body: formData // TIDAK pakai JSON.stringify
});
```

#### Render Gambar
```javascript
// Cek apakah path uploaded file atau placeholder
const imageUrl = item.image 
    ? (item.image.startsWith('menu/') 
        ? `/storage/${item.image}`  // Uploaded file
        : `/${item.image}`)          // Placeholder
    : '/images/no-image.svg';        // Default

// Tampilkan dengan fallback
<img src="${imageUrl}" 
     alt="${item.name}" 
     onerror="this.src='/images/no-image.svg'">
```

## 🐛 Troubleshooting

### ❌ Gambar tidak muncul
**Penyebab**: Storage link belum dibuat
**Solusi**:
```bash
php artisan storage:link
```

### ❌ Error 404 saat akses /storage/menu/...
**Penyebab**: File tidak ada atau path salah
**Solusi**:
- Cek folder `storage/app/public/menu/`
- Pastikan file ada di sana
- Re-upload gambar

### ❌ Upload gagal "The image field must be an image"
**Penyebab**: File bukan format gambar
**Solusi**:
- Gunakan format: JPEG, PNG, JPG, GIF
- Cek ekstensi file

### ❌ Upload gagal "The image may not be greater than 2048 kilobytes"
**Penyebab**: File lebih dari 2MB
**Solusi**:
- Compress gambar online (tinypng.com, compressor.io)
- Resize resolusi gambar
- Gunakan format JPEG dengan quality 80%

### ❌ Preview tidak muncul saat pilih gambar
**Penyebab**: JavaScript error atau file terlalu besar
**Solusi**:
- Buka Console (F12) untuk cek error
- Pastikan file < 2MB
- Refresh halaman dan coba lagi

## 📊 Database

### Struktur Table menu_items
```sql
CREATE TABLE menu_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    category VARCHAR(255) NULL,
    image VARCHAR(255) NULL,  ← Path ke gambar (contoh: menu/abc123.jpg)
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Contoh Data
```
| id | name        | price | category | image                          |
|----|-------------|-------|----------|--------------------------------|
| 1  | Nasi Putih  | 5000  | Nasi     | menu/1234567890.jpg            |
| 2  | Ayam Goreng | 15000 | Lauk     | menu/0987654321.png            |
| 3  | Es Teh      | 3000  | Minuman  | images/no-image.svg (default)  |
```

## 🚀 Performance Tips

1. **Compress Gambar Before Upload**
   - Gunakan tools online atau Photoshop
   - Target: < 500KB per gambar

2. **Lazy Loading (Future Enhancement)**
   - Implementasi lazy loading untuk gambar
   - Load gambar saat scroll

3. **CDN (Production)**
   - Upload ke CDN (Cloudinary, AWS S3)
   - Faster load time

4. **WebP Format (Future)**
   - Convert JPEG/PNG ke WebP
   - Lebih kecil ukuran file

## 📝 Notes

- Gambar lama **otomatis dihapus** saat update menu
- Gambar **otomatis dihapus** saat delete menu
- Placeholder digunakan jika menu belum ada gambar
- Storage symlink hanya perlu dibuat **1x saat setup**

---

**💡 Tips**: Upload gambar makanan yang menarik untuk meningkatkan user experience!
