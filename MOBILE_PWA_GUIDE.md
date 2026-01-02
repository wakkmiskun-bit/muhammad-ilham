# 📱 FastCopy Mobile/Android Guide

## ✨ Fitur Mobile & PWA yang Sudah Ditambahkan

### 1. **Progressive Web App (PWA)**
   - ✅ Bisa di-install di Android seperti aplikasi native
   - ✅ Offline functionality - bisa diakses tanpa internet
   - ✅ Push notifications support
   - ✅ Cache otomatis untuk performa lebih cepat
   - ✅ Adaptive icon untuk tampilan sempurna di semua device

### 2. **Mobile Optimization**
   - ✅ Responsive design untuk semua ukuran layar
   - ✅ Touch-friendly buttons (minimum 44x44px)
   - ✅ Safe area padding untuk notch/punch-hole
   - ✅ Optimized untuk landscape mode
   - ✅ Disabled hover effects pada mobile
   - ✅ Dark mode untuk OLED screens

### 3. **File-File Baru yang Ditambahkan**

#### `manifest.json` 
- Metadata untuk PWA
- Icon dan screenshot
- Shortcut ke halaman penting
- Konfigurasi display standalone

#### `service-worker.js`
- Cache management
- Offline support
- Network-first strategy
- Background sync untuk pembayaran

## 🚀 Cara Install di Android

### Metode 1: Melalui Notifikasi (Chrome Android)
1. Buka FastCopy di Chrome
2. Tunggu notifikasi "Install FastCopy"
3. Tap "Install"
4. Aplikasi akan appear di home screen

### Metode 2: Melalui Menu (Semua Browser)
1. Buka FastCopy di browser Android
2. Tap menu (⋮)
3. Pilih "Add to Home Screen" atau "Install App"
4. Confirm
5. Aplikasi siap digunakan

### Metode 3: Melalui Button (Di Header)
1. Akses FastCopy dari browser
2. Klik tombol "Install App" di header (jika ada notifikasi)
3. Follow prompt yang muncul

## 📋 File-File yang Dimodifikasi

### `index.html`
```html
<!-- Tambahan untuk PWA -->
<link rel="manifest" href="./manifest.json">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="theme-color" content="#06b6d4">
<!-- dll -->
```

### `style.css`
- Mobile-specific CSS rules
- Touch-friendly UI
- Safe area support
- Dark mode optimization
- Landscape mode support

### `manifest.json` (File Baru)
```json
{
  "name": "FastCopy - Fotocopy Profesional",
  "start_url": "./index.html",
  "display": "standalone",
  "theme_color": "#06b6d4",
  "icons": [...]
}
```

### `service-worker.js` (File Baru)
- Cache storage management
- Offline fallback
- Network interception

## ✅ Testing di Android

### Menggunakan Chrome DevTools
1. Buka Chrome → DevTools (F12)
2. Pergi ke Lighthouse tab
3. Pilih "Mobile" dan "PWA"
4. Jalankan audit
5. Seharusnya score tinggi ✅

### Testing Offline
1. Install PWA
2. Buka DevTools → Network
3. Set ke "Offline"
4. Aplikasi masih bisa diakses dari cache ✅

### Testing Notifikasi Install
1. Buka di Chrome Android
2. Tunggu beberapa detik
3. Ada notifikasi install di bawah ✅

## 🔧 Konfigurasi Tambahan (Opsional)

### 1. Menambah Icon Custom
Edit `manifest.json`, replace icon data:
```json
{
  "icons": [
    {
      "src": "/path/to/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

### 2. Menambah Background Color
Edit `manifest.json`:
```json
{
  "background_color": "#ffffff",
  "theme_color": "#06b6d4"
}
```

### 3. Push Notifications (Advanced)
Tambah di `script.js`:
```javascript
// Request notification permission
Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    // Send notification
    new Notification('FastCopy', {
      body: 'Pembayaran berhasil!',
      icon: './icon.png'
    });
  }
});
```

## 📊 Browser Support

| Browser | Android | iPhone | Desktop |
|---------|---------|--------|---------|
| Chrome  | ✅      | ❌     | ✅      |
| Firefox | ✅      | ❌     | ✅      |
| Safari  | ❌      | ⚠️     | ✅      |
| Samsung Internet | ✅ | ❌ | ✅ |
| Edge    | ✅      | ❌     | ✅      |

*✅ = Full support, ⚠️ = Partial support, ❌ = Not supported*

## 🎯 Fitur untuk Update Mendatang

- [ ] Push notifications untuk status pembayaran
- [ ] Background sync untuk pembayaran offline
- [ ] Biometric authentication (fingerprint)
- [ ] Share API integration
- [ ] Location-based services
- [ ] Camera access untuk dokumen scanning

## 📞 Troubleshooting

### Notifikasi Install Tidak Muncul
- Buka di HTTPS (required untuk PWA)
- Minimal 5KB untuk service worker
- User belum pernah install sebelumnya

### Offline Tidak Bekerja
- Check service worker di DevTools
- Pastikan cache policy sudah benar
- Clear cache dan refresh

### Icon Tidak Muncul
- Icon harus square (192x192, 512x512)
- Format: PNG atau SVG
- Pastikan path di manifest.json benar

---

**Developed by:** FastCopy Team  
**Last Updated:** 2 January 2026  
**PWA Version:** 1.0
