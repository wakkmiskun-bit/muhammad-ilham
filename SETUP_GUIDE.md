# 📱 FastCopy - QRIS Payment Integration

## ✅ Perubahan yang Telah Dilakukan

### 1. **Alur Sistem Berubah**

**SEBELUM:**
```
User → Input Nama, WA, Produk, Qty → Kirim ke Admin via WA
```

**SESUDAH:**
```
User → Input Nama, WA, Email (Pendaftaran)
      → Notifikasi ke Admin & User
      → Tampil Modal Pembayaran QRIS
      → User Scan & Bayar via QRIS
      → Verifikasi Pembayaran
      → Akun User AKTIF
```

---

## 🔧 Setup & Konfigurasi

### Step 1: Update Nomor Admin WhatsApp

Buka `script.js`, cari line ~74:

```javascript
const ADMIN_PHONE = '6285191163819'; // ← GANTI DENGAN NOMOR ANDA
```

Ganti dengan nomor WhatsApp admin (format: 62XXXXXXXXX)

---

### Step 2: Pilih Provider QRIS

Pilih salah satu opsi:

#### **Opsi A: Menggunakan QRIS Statis (Mudah, Tanpa API)**

1. Daftar QRIS di DANA (www.dana.id) atau provider lokal lain
2. Download QR Code QRIS Anda
3. Upload ke folder: `/qr-codes/my-qris.png`
4. Update fungsi `generateQRCode()` di `script.js` (line ~285):

```javascript
function generateQRCode(data) {
    const container = document.getElementById('qrCodeContainer');
    container.innerHTML = '';
    
    const qrImage = document.createElement('img');
    qrImage.src = '/qr-codes/my-qris.png'; // ← Path ke QR Code Anda
    qrImage.alt = 'QR Code QRIS';
    qrImage.className = 'w-full';
    container.appendChild(qrImage);
}
```

#### **Opsi B: Menggunakan DOKU API (Lebih Advanced)**

1. Daftar merchant di https://doku.com
2. Dapatkan **Merchant ID** dan **API Key**
3. Update fungsi `generateQRISData()` (line ~260):

```javascript
const merchantId = 'GANTI_DENGAN_ID_DOKU'; // ← Ganti ID Anda
```

4. Update fungsi `generateQRCode()` (line ~285) - lihat file QRIS_INTEGRATION_GUIDE.md

---

### Step 3: Update Harga Pendaftaran (Opsional)

Harga default: **Rp 50.000**

Untuk mengubah, cari di `script.js`:
- Line ~187: `document.getElementById('paymentAmount').textContent = 'Rp 50.000';`
- Line ~260: `const amount = 50000;`

Ganti angka sesuai keinginan.

---

## 🧪 Test Alur

### Cara Testing

1. **Buka website** di browser (atau live server)
2. **Klik tombol "Pesan Sekarang"** (floating button atau menu)
3. **Isi Form Login:**
   - Nama: Tester Baru
   - WhatsApp: 08123456789 (nomor test Anda)
   - Email: test@example.com
4. **Klik "Masuk"**
5. **Berikut yang terjadi:**
   - ✅ 2 jendela WhatsApp akan dibuka:
     - 1 ke Admin (notif user baru)
     - 1 ke User (selamat datang)
   - ✅ Modal Pembayaran QRIS akan ditampilkan
6. **Klik "Verifikasi"** (untuk test)
7. **Berikut yang terjadi:**
   - ✅ 2 jendela WhatsApp akan dibuka lagi:
     - 1 ke Admin (notif pembayaran sukses)
     - 1 ke User (akun sudah aktif)
   - ✅ Redirect ke homepage

### Cek Data User Tersimpan

1. Buka **DevTools** (F12 atau Right Click → Inspect)
2. Pergi ke **Application** tab
3. Pilih **Local Storage**
4. Klik domain website Anda
5. Cari key: `fastcopyUsers`
6. Seharusnya ada array berisi data user yang terdaftar

---

## 📝 File-File yang Berubah

### `index.html`
- ❌ Dihapus: Modal "Pesan Sekarang" lama (dengan pilihan produk, qty)
- ✅ Ditambah: Modal "Masuk / Daftar" (form login)
- ✅ Ditambah: Modal "Pembayaran QRIS" (QR Code)
- ✅ Ditambah: Library QR Code (script CDN)

### `script.js`
- ❌ Dihapus: Fungsi `submitQueue()` lama
- ❌ Dihapus: System Antrian (queueData, queueCounter)
- ✅ Ditambah: `saveUser()` - simpan data user
- ✅ Ditambah: `getUser()` - ambil data user
- ✅ Ditambah: `submitQueue()` BARU - login/daftar
- ✅ Ditambah: `openPaymentModal()` - buka modal pembayaran
- ✅ Ditambah: `closePaymentModal()` - tutup modal pembayaran
- ✅ Ditambah: `generateQRISData()` - format data QRIS
- ✅ Ditambah: `generateQRCode()` - tampil QR Code
- ✅ Ditambah: `confirmPayment()` - verifikasi pembayaran
- ✅ Ditambah: `currentUser` variable - simpan user saat ini

### `style.css`
- ✅ Tidak ada perubahan (kompatibel)

---

## 📊 Data User di LocalStorage

Format data yang disimpan:

```json
{
  "id": 1704096000000,
  "name": "John Doe",
  "phone": "6281234567890",
  "email": "john@example.com",
  "registeredAt": "2/1/2026, 10:00:00 AM",
  "verified": false,
  "verifiedAt": "2/1/2026, 10:05:00 AM"
}
```

---

## ⚠️ Catatan Penting

### 1. **WhatsApp Link**
- Format nomor harus: `62XXXXXXXXX` (tanpa 0)
- Akan membuka chat baru (atau app jika sudah install)

### 2. **LocalStorage**
- Data user disimpan di browser LOCAL saja
- Jika clear browser cache → data hilang
- **Rekomendasi:** Untuk production, gunakan database (MongoDB, Firebase, dll)

### 3. **QRIS Payment**
- Saat ini: Manual verification (user klik tombol "Verifikasi")
- Untuk production: Setup Webhook dengan provider QRIS
- Lihat file `QRIS_INTEGRATION_GUIDE.md` untuk detail

### 4. **Pembayaran Berganda**
- User bisa bayar berkali-kali (verifikasi otomatis update ke active)
- Untuk prevent ini: tambah check `if (user.verified)` sebelum show payment

---

## 🔗 Quick Links

- 📖 **Panduan Lengkap QRIS**: [QRIS_INTEGRATION_GUIDE.md](./QRIS_INTEGRATION_GUIDE.md)
- 🎨 **Style Reference**: [style.css](./style.css)
- 📝 **Products Data**: Line 1-67 di `script.js`
- 🔐 **User Management**: Line 115-150 di `script.js`

---

## 🚀 Next Steps (Opsional)

1. **Database Backend**
   - Ganti localStorage dengan server database
   - API endpoint untuk save/get user

2. **Email Verification**
   - Kirim email konfirmasi
   - Require klik link sebelum bayar

3. **Payment Confirmation**
   - Setup webhook QRIS provider
   - Auto update status pembayaran

4. **User Dashboard**
   - User bisa login & lihat profile
   - History pembayaran
   - Edit data profile

5. **Admin Dashboard**
   - Lihat semua user terdaftar
   - Filter by status pembayaran
   - Export data user

---

## 💬 Support

Jika ada pertanyaan atau error:

1. **Check Console**: F12 → Console tab → lihat error message
2. **Check localStorage**: F12 → Application → Local Storage
3. **Test WhatsApp Link**: Paste di browser: `https://wa.me/6281234567890?text=hello`
4. **Contact Admin**: Hubungi nomor di `ADMIN_PHONE` variable

---

**Created**: 2 Januari 2026  
**Version**: 2.0 (With QRIS Payment Integration)  
**Status**: ✅ Ready to Use
