# Panduan Integrasi QRIS FastCopy

## Deskripsi Alur

Sistem FastCopy telah diubah untuk menggunakan alur **Pendaftaran + Pembayaran QRIS**:

### Alur Sebelumnya (Lama)
```
User → Isi Form Pesan → Konfirmasi via WhatsApp (Admin)
```

### Alur Baru (Sekarang)
```
User → Login/Daftar (Nama, WhatsApp, Email) 
  → Notifikasi ke Admin + User
  → Tampil Modal Pembayaran QRIS
  → Scan QR → Pembayaran Rp 50.000
  → Verifikasi Pembayaran
  → Akun Aktif + Notifikasi via WhatsApp
```

---

## Fitur Baru

✅ **Form Login/Pendaftaran**
- Input: Nama Lengkap, Nomor WhatsApp, Email
- Validasi nomor WhatsApp otomatis
- Data tersimpan di localStorage browser

✅ **Notifikasi Otomatis via WhatsApp**
- Saat user baru mendaftar → notifikasi ke admin
- Setelah pembayaran → notifikasi sukses ke user & admin

✅ **Modal Pembayaran QRIS**
- Menampilkan QR Code QRIS
- Nominal pembayaran: Rp 50.000
- Data pengguna terlihat jelas

✅ **Verifikasi Pembayaran**
- User klik tombol "Verifikasi" setelah scan QRIS
- Status user berubah menjadi AKTIF
- Disimpan di localStorage dengan timestamp

---

## Integrasi dengan QRIS Provider

### Pilihan Provider QRIS

1. **DOKU** (https://doku.com)
   - API untuk Generate QRIS
   - Webhook untuk verifikasi pembayaran
   
2. **Xendit** (https://xendit.co)
   - Library QR Code
   - Invoice payment tracking

3. **Midtrans/Verifone** (https://verifone.id)
   - QRIS Payment Gateway

4. **Custom QRIS** (jika sudah punya merchant)
   - Gunakan format QRIS standard
   - Reference: ISO 20022 Standard

---

## Setup QRIS dengan DOKU (Recommended)

### 1. Daftar Merchant DOKU
- Kunjungi https://doku.com/register
- Lengkapi data bisnis
- Dapatkan **Merchant ID** dan **API Key**

### 2. Update File `script.js`

Cari fungsi `generateQRISData()` di line ~265:

```javascript
function generateQRISData(user) {
    // Format: QRIS data untuk merchant Anda
    // Ganti dengan data merchant QRIS Anda yang sebenarnya
    const merchantId = 'YOUR_MERCHANT_ID'; // ← GANTI DISINI
    const amount = 50000; // Biaya dalam rupiah
    
    const qrisData = {
        merchantId: merchantId,
        amount: amount,
        userName: user.name,
        userPhone: user.phone,
        userEmail: user.email,
        reference: `FASTCOPY_${user.id}`,
        description: 'Biaya Pendaftaran FastCopy'
    };
    
    return qrisData;
}
```

**Ganti `YOUR_MERCHANT_ID` dengan ID merchant DOKU Anda**

### 3. Update Fungsi `generateQRCode()`

Replace fungsi di line ~280:

```javascript
function generateQRCode(data) {
    const container = document.getElementById('qrCodeContainer');
    container.innerHTML = ''; // Kosongkan container
    
    // Kirim request ke DOKU API untuk generate QRIS
    const dokyAPIURL = `https://api.doku.com/v1/qris/generate`;
    
    fetch(dokyAPIURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_API_KEY' // ← GANTI API KEY
        },
        body: JSON.stringify({
            merchantId: data.merchantId,
            amount: data.amount,
            reference: data.reference,
            description: data.description
        })
    })
    .then(response => response.json())
    .then(result => {
        // result.qrImage = URL gambar QR Code
        const qrImage = document.createElement('img');
        qrImage.src = result.qrImage;
        qrImage.alt = 'QR Code QRIS';
        qrImage.className = 'w-full';
        container.appendChild(qrImage);
        
        // Simpan transaction ID untuk webhook
        currentUser.transactionId = result.transactionId;
    })
    .catch(error => {
        console.error('Error generating QRIS:', error);
        alert('❌ Gagal generate QR Code QRIS');
    });
}
```

### 4. Setup Webhook DOKU (untuk Auto-Verify Pembayaran)

Di dashboard DOKU:
1. Settings → Webhook
2. Set URL: `https://yourdomain.com/webhook/verify-payment`
3. Event: `payment.success`

Di server Anda, buat endpoint webhook:

```javascript
// Backend (Node.js/Express contoh)
app.post('/webhook/verify-payment', (req, res) => {
    const payment = req.body;
    
    if (payment.status === 'SUCCESS') {
        // Update user status di database/localStorage
        const users = JSON.parse(localStorage.getItem('fastcopyUsers')) || [];
        const userIndex = users.findIndex(u => u.id === payment.reference);
        
        if (userIndex !== -1) {
            users[userIndex].verified = true;
            users[userIndex].verifiedAt = new Date().toLocaleString('id-ID');
            localStorage.setItem('fastcopyUsers', JSON.stringify(users));
        }
        
        res.status(200).json({ status: 'OK' });
    }
});
```

---

## Integrasi Manual (Jika tidak ingin API)

Jika Anda hanya ingin menampilkan QR Code statis:

1. Generate QR Code dari: https://qr.dana.id
   - Input: Account/Merchant ID Anda

2. Download QR Code image

3. Upload ke folder project, misal: `/qr-codes/my-qris.png`

4. Update `generateQRCode()` function:

```javascript
function generateQRCode(data) {
    const container = document.getElementById('qrCodeContainer');
    container.innerHTML = ''; // Kosongkan container
    
    const qrImage = document.createElement('img');
    qrImage.src = '/qr-codes/my-qris.png'; // Path ke QR Code statis Anda
    qrImage.alt = 'QR Code QRIS';
    qrImage.className = 'w-full';
    container.appendChild(qrImage);
}
```

---

## Variable Penting

Temukan di `script.js`:

```javascript
const ADMIN_PHONE = '6285191163819'; // Nomor WhatsApp Admin
```

**Ganti dengan nomor WhatsApp Anda**

---

## Test Alur

1. **Buka aplikasi**: Buka `index.html` di browser
2. **Klik "Pesan Sekarang"** atau tombol floating button
3. **Isi form**:
   - Nama: Test User
   - WhatsApp: 08123456789 (atau nomor Anda)
   - Email: test@example.com
4. **Klik "Masuk"**
5. **WhatsApp akan dibuka**:
   - 1 notif ke admin
   - 1 notif ke user
6. **Modal pembayaran muncul** dengan QR Code
7. **Klik "Verifikasi"** (untuk test)
8. **WhatsApp akan dibuka lagi** dengan notif sukses
9. **Check localStorage**: Buka DevTools > Application > Local Storage > fastcopyUsers

---

## Troubleshooting

### QR Code tidak muncul
- Cek console (F12) ada error?
- Pastikan library QR Code sudah loaded
- Check internet connection untuk API QRIS

### WhatsApp tidak membuka
- Format nomor harus: `62XXXXXXXXX` (tanpa 0)
- Test manual link: `https://wa.me/62xxxxxxxxx?text=hello`

### Data user tidak tersimpan
- Buka DevTools → Application → Storage
- Check "Local Storage"
- Pastikan browser allow local storage

### Pembayaran tidak terverifikasi
- Jika manual: klik tombol "Verifikasi" (akan auto update)
- Jika API DOKU: check webhook logs di dashboard DOKU

---

## File-File yang Berubah

✅ `index.html`
- Hapus form "Pesan Sekarang" lama
- Tambah Modal Login/Daftar
- Tambah Modal Pembayaran QRIS
- Tambah library QR Code

✅ `script.js`
- Tambah `saveUser()`, `getUser()` - manage user data
- Ubah `submitQueue()` - jadi login/daftar
- Tambah `openPaymentModal()` - buka modal pembayaran
- Tambah `generateQRISData()` - format data QRIS
- Tambah `generateQRCode()` - display QR Code
- Tambah `confirmPayment()` - verifikasi pembayaran
- Hapus logika pesanan antrian (produk, qty, catatan)

---

## Fitur Tambahan (Optional)

Anda bisa menambahkan:

1. **Dashboard Admin**
   - Lihat semua user yang terdaftar
   - Status verifikasi
   - Tanggal daftar & verifikasi

2. **User Profile**
   - User bisa lihat status akun mereka
   - History pembayaran
   - Edit data profile

3. **Email Confirmation**
   - Kirim confirmation link ke email
   - User harus klik link sebelum bayar

4. **Pembayaran Ulang**
   - Jika pembayaran gagal, bisa retry
   - Track attempt count

---

## Support

Jika ada pertanyaan atau butuh help dengan QRIS API:

1. **DOKU Support**: https://support.doku.com
2. **Forum FastCopy**: [Create issue di repo]
3. **WhatsApp Admin**: Hubungi nomor di ADMIN_PHONE

---

**Last Updated**: 2 Januari 2026
**Version**: 2.0 (dengan QRIS Payment)
