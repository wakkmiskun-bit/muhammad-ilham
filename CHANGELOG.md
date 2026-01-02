# 📋 RINGKASAN PERUBAHAN SISTEM FastCopy

## 🎯 Tujuan Perubahan

✅ **Sebelumnya:** User langsung pesan fotocopy → data dikirim ke admin via WhatsApp  
✅ **Sekarang:** User harus daftar & bayar terlebih dahulu → baru bisa menggunakan layanan

---

## 📊 ALUR BARU

```
┌─────────────────┐
│  BUKA WEBSITE   │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ KLIK "PESAN SEKARANG"│
└────────┬─────────────┘
         │
         ▼
┌──────────────────────────────────┐
│    FORM PENDAFTARAN              │
│  • Nama Lengkap                  │
│  • Nomor WhatsApp                │
│  • Email                         │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  NOTIFIKASI VIA WHATSAPP         │
│  • Ke Admin: "User baru terdaftar"
│  • Ke User: "Selamat datang"     │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  MODAL PEMBAYARAN QRIS           │
│  • Display QR Code QRIS          │
│  • Nominal: Rp 50.000            │
│  • Tombol: "Verifikasi"          │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  USER SCAN QR & BAYAR            │
│  (Menggunakan app pembayaran)    │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  USER KLIK "VERIFIKASI"          │
│  • Status: AKTIF                 │
│  • Simpan di localStorage        │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  NOTIFIKASI VIA WHATSAPP         │
│  • Ke Admin: "Pembayaran diterima"
│  • Ke User: "Akun aktif!"        │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  USER BISA MULAI PESAN LAYANAN   │
│  (Fitur ini akan ditambah)       │
└──────────────────────────────────┘
```

---

## 🔄 PERBANDINGAN DETAIL

### SEBELUMNYA (Lama)

**Form Modal:**
```
□ Nama Lengkap
□ Nomor WhatsApp
□ Pilih Layanan
□ Jumlah
□ Catatan
━━━━━━━━━━━━
[Batal] [Pesan]
```

**Data Tersimpan:**
- queueData (hanya saat session, hilang refresh)
- queueCounter

**Proses:**
1. Isi form
2. Klik "Pesan"
3. WhatsApp terbuka ke admin
4. Antrian disimpan di queueData (temporary)

---

### SEKARANG (Baru)

**Form Modal 1 - Pendaftaran:**
```
□ Nama Lengkap
□ Nomor WhatsApp
□ Email
━━━━━━━━━━━━
[Batal] [Masuk]
```

**Form Modal 2 - Pembayaran:**
```
┌─────────────────────┐
│    QR CODE QRIS     │
│                     │
│     [QR Image]      │
│                     │
└─────────────────────┘

Nominal: Rp 50.000
Atas nama: [User Name]
Email: [User Email]

[Batal] [Verifikasi]
```

**Data Tersimpan:**
- fastcopyUsers (localStorage, permanent)
  - id, name, phone, email, registeredAt, verified, verifiedAt

**Proses:**
1. Isi form pendaftaran
2. Klik "Masuk"
3. WhatsApp (notif ke admin & user)
4. Modal pembayaran muncul
5. User scan QR & bayar
6. Klik "Verifikasi"
7. WhatsApp (notif sukses)
8. Akun jadi AKTIF
9. Data disimpan permanent di localStorage

---

## 📝 PERUBAHAN FILE

### `index.html`

#### ❌ DIHAPUS:
- Elemen `<select id="queueProduct">` dengan list produk
- Input `<input id="queueQuantity">`
- Textarea `<textarea id="queueNote">`
- Button "Pesan" yang lama

#### ✅ DITAMBAH:
- Input `<input id="queueEmail">`
- Button "Masuk" (ganti "Pesan")
- Modal pembayaran QRIS baru lengkap
- Library QR Code: `https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js`

---

### `script.js`

#### ❌ DIHAPUS:

**Variable:**
```javascript
let queueData = [];        // Antrian temporary
let queueCounter = 0;      // Counter antrian
```

**Function:**
```javascript
function openQueueForm(productId) { ... }
// Versi lama yang mengisi dropdown produk

function submitQueue(event) { ... }
// Versi lama untuk pesanan dengan produk

function renderQueue() { ... }
// Menampilkan antrian

function deleteQueue(index) { ... }
// Hapus dari antrian

function exportWhatsAppNumbers() { ... }
// Export antrian ke CSV
```

#### ✅ DITAMBAH:

**Variable:**
```javascript
let currentUser = null;  // User yang sedang login
```

**Function:**
```javascript
// User Management
function saveUser(name, phone, email) { ... }
function getUser(phone) { ... }

// Modal Management
function openQueueForm(productId) { ... }      // BARU - cukup buka modal
function closeQueueModal() { ... }
function closePaymentModal() { ... }

// Form Submission
function submitQueue(event) { ... }            // BARU - login/daftar

// Payment
function openPaymentModal(user) { ... }
function generateQRISData(user) { ... }
function generateQRCode(data) { ... }
function confirmPayment() { ... }
```

---

### `style.css`

✅ **Tidak ada perubahan** - CSS lama masih kompatibel

---

## 🔑 KONFIGURASI YANG DIPERLUKAN

### 1. **Nomor Admin WhatsApp** (WAJIB)

Lokasi: `script.js` line ~74

```javascript
const ADMIN_PHONE = '6285191163819'; // ← GANTI DENGAN NOMOR ANDA
```

Format: `62` + nomor tanpa `0`
- ✅ Benar: `628123456789`
- ❌ Salah: `08123456789` atau `+628123456789`

### 2. **QR Code QRIS** (WAJIB)

Pilih salah satu:

**Opsi A - Static QR Code (Mudah)**
- Download QR Code dari DANA/provider
- Upload ke `/qr-codes/my-qris.png`
- Update path di `generateQRCode()` function

**Opsi B - Dynamic QR Code (API)**
- Daftar di DOKU atau provider lain
- Dapatkan Merchant ID & API Key
- Update `generateQRISData()` dan `generateQRCode()`

### 3. **Harga Pendaftaran** (Opsional)

Default: Rp 50.000

Lokasi untuk ganti:
- `script.js` line ~187: `'Rp 50.000'`
- `script.js` line ~260: `50000`

---

## 📱 TEKNOLOGI YANG DIGUNAKAN

| Aspek | Teknologi | Catatan |
|-------|-----------|---------|
| **Frontend** | HTML, CSS, JavaScript | Tailwind CSS untuk styling |
| **Storage** | LocalStorage Browser | Data user tersimpan di client |
| **API** | WhatsApp Web API | wa.me protocol untuk kirim pesan |
| **QR Code** | QRCode.js Library | Generate/display QR Code |
| **Payment** | QRIS (Optional API) | Bisa manual atau integrated |

---

## 🧪 TESTING CHECKLIST

- [ ] Form pendaftaran bisa diisi
- [ ] Validasi nomor WhatsApp working
- [ ] WhatsApp terbuka ke admin saat klik "Masuk"
- [ ] Modal pembayaran muncul
- [ ] QR Code ditampilkan
- [ ] Verifikasi button working
- [ ] WhatsApp terbuka ke user saat klik "Verifikasi"
- [ ] Data user tersimpan di localStorage
- [ ] User baru bisa register lagi tanpa error
- [ ] Verifikasi status saved di localStorage

---

## ⚡ FITUR YANG BISA DITAMBAH

### Phase 1 (Now) ✅
- [x] Pendaftaran user
- [x] Pembayaran QRIS (display)
- [x] Notifikasi WhatsApp

### Phase 2 (Next)
- [ ] Login user (check verified status)
- [ ] Pesan layanan (untuk verified users only)
- [ ] Dashboard user
- [ ] Riwayat pembayaran

### Phase 3 (Later)
- [ ] Admin dashboard
- [ ] Webhook payment confirmation
- [ ] Email verification
- [ ] Database backend
- [ ] Multiple payment methods

---

## 🐛 TROUBLESHOOTING

| Problem | Solution |
|---------|----------|
| WhatsApp tidak buka | Format nomor harus `62XXXXXXXXX` |
| QR Code tidak muncul | Check library sudah load, internet aktif |
| Data user hilang | Clear browser cache atau ganti localStorage |
| Form tidak submit | Check console (F12) ada error? |
| Nomor WA tidak valid | Masukkan 10-15 digit, cukup nomor saja |

---

## 📞 DOKUMENTASI LENGKAP

- 📖 [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Panduan setup & konfigurasi
- 🔧 [QRIS_INTEGRATION_GUIDE.md](./QRIS_INTEGRATION_GUIDE.md) - Detail integrasi QRIS

---

**Created**: 2 Januari 2026  
**Last Updated**: 2 Januari 2026  
**Version**: 2.0
