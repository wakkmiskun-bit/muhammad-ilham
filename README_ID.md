# ✅ QUICK START CHECKLIST

## 🚀 Langkah Setup (5 menit)

### Step 1: Update Nomor Admin
- [ ] Buka `script.js`
- [ ] Cari line ~74: `const ADMIN_PHONE = '6285191163819';`
- [ ] Ganti dengan nomor WhatsApp admin Anda
- [ ] Format: `62` + nomor tanpa `0`
- [ ] Contoh: `6281234567890`

### Step 2: Setup QR Code QRIS
- [ ] Buka DANA/provider QRIS
- [ ] Download atau capture QR Code QRIS Anda
- [ ] Pilih salah satu opsi:
  - [ ] **Opsi A (Mudah)**: Upload ke `/qr-codes/my-qris.png` dan update path di `generateQRCode()`
  - [ ] **Opsi B (Advanced)**: Setup DOKU API dan update credentials

### Step 3: Optional - Update Harga
- [ ] Harga default: Rp 50.000
- [ ] Untuk ganti, edit di `script.js`:
  - Line ~187: `'Rp X.XXX'`
  - Line ~260: `XXXXX`

---

## 🧪 Testing (2 menit)

1. [ ] Buka website di browser
2. [ ] Klik "Pesan Sekarang"
3. [ ] Isi form:
   - Nama: Test User
   - WhatsApp: Nomor Anda
   - Email: test@example.com
4. [ ] Klik "Masuk"
5. [ ] Verifikasi:
   - [ ] 2 tab WhatsApp terbuka
   - [ ] Modal pembayaran muncul
   - [ ] QR Code terlihat
6. [ ] Klik "Verifikasi"
7. [ ] Verifikasi:
   - [ ] 2 tab WhatsApp terbuka
   - [ ] Pesan sukses tampil
   - [ ] Redirect ke home

---

## 📊 Verifikasi Data

1. [ ] Buka DevTools (F12)
2. [ ] Application → Local Storage
3. [ ] Cari `fastcopyUsers`
4. [ ] Data user harus ada dengan struktur:
```json
{
  "id": 1704096000000,
  "name": "Test User",
  "phone": "6281234567890",
  "email": "test@example.com",
  "registeredAt": "2/1/2026, 10:00:00 AM",
  "verified": false,
  "verifiedAt": "2/1/2026, 10:05:00 AM"
}
```

---

## 📝 Notes

- ✅ Sistem berjalan 100% client-side (tidak perlu backend)
- ⚠️ Data disimpan di localStorage (akan hilang jika clear cache)
- 🔗 WhatsApp links hanya berfungsi jika ada internet
- 💡 Untuk production: migrate ke database backend

---

## 🆘 Jika Ada Error

1. Buka DevTools (F12)
2. Pergi ke Console tab
3. Cari error message
4. Perbaiki sesuai error
5. Reload page (Ctrl+R)

**Error Umum:**
- "formatPhoneNumber is not defined" → Function ada di script.js
- "QR Code not found" → Check path gambar QR
- "WhatsApp not opening" → Check internet & format nomor

---

## 📚 File Dokumentasi

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Setup lengkap & detail
- [QRIS_INTEGRATION_GUIDE.md](./QRIS_INTEGRATION_GUIDE.md) - QRIS API integration
- [CHANGELOG.md](./CHANGELOG.md) - Perubahan detail sistem

---

## ✨ Selesai!

Website FastCopy Anda sudah siap dengan:
- ✅ Pendaftaran user via WhatsApp
- ✅ Pembayaran QRIS otomatis
- ✅ Notifikasi real-time
- ✅ Data user tersimpan

Selamat menggunakan! 🎉

---

**Version**: 2.0  
**Last Updated**: 2 Januari 2026
