# ⚡ CHEAT SHEET - FastCopy v2.0 Features

## 🌙 Dark Mode
**Toggle**: Header → Moon icon  
**Keyboard**: Bisa dari browser menu  
**Storage**: localStorage['darkMode']  
**Reset**: localStorage.removeItem('darkMode')

```javascript
// Manual toggle
toggleDarkMode();

// Check current mode
isDarkMode; // true = light mode, false = dark mode
```

---

## ⭐ Review & Rating
**Button**: Yellow star button (bottom-right)  
**Rating**: 1-5 stars  
**Review**: 10-300 characters  
**Storage**: localStorage['fastcopyReviews']

```javascript
// Submit review
submitReview();

// Get all reviews
JSON.parse(localStorage.getItem('fastcopyReviews'));

// Get average rating
getAverageRating(); // Returns string like "4.8"

// Show stats in console
showRatingStats(); // {average: "4.8", total: 25}

// Clear all reviews
localStorage.removeItem('fastcopyReviews');
```

---

## 📱 PWA Installation

### Android Chrome
1. Menu (⋮) → "Add to Home screen"
2. Or wait for "Install" notification

### Android Firefox
1. Menu (≡) → "Add to Home screen"

### Offline Check
```javascript
// Check if online
navigator.onLine; // true/false

// Check service worker
navigator.serviceWorker.getRegistrations();

// Check cache
caches.keys();
```

---

## 🔧 Console Commands

### Dark Mode Debug
```javascript
// Current status
console.log(isDarkMode);

// Apply mode
applyDarkMode();

// Toggle
toggleDarkMode();
```

### Reviews Debug
```javascript
// Get all reviews
console.log(reviews);

// Get stored reviews
JSON.parse(localStorage.getItem('fastcopyReviews'));

// Count reviews
reviews.length;

// Get ratings only
reviews.map(r => r.rating);

// Get average
getAverageRating();
```

### PWA Debug
```javascript
// Service workers active
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => console.log(reg));
});

// Cache size
caches.keys().then(names => console.log(names));

// Open specific cache
caches.open('fastcopy-v1').then(cache => {
  cache.keys().then(requests => console.log(requests));
});

// Clear all cache
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});

// Unregister service worker
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
});
```

---

## 🖥️ Browser DevTools

### Application Tab
- **Service Workers**: Check registration status
- **Manifest**: Verify PWA manifest
- **Storage**: Check localStorage
- **Cache Storage**: View cached files

### Lighthouse Tab
1. Select "Mobile"
2. Select "PWA"
3. Run Audit
4. Target: Score > 90

### Network Tab
1. Check manifest.json (200 OK)
2. Check service-worker.js (200 OK)
3. Set throttling: "Slow 4G"
4. Test performance

### Console Tab
- Run all JavaScript commands
- Debug errors
- Check logs

---

## 📊 Feature Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| ✅ | Working fine | Dark mode toggle ✅ |
| ⚠️ | Needs attention | PWA install ⚠️ (needs HTTPS) |
| ❌ | Not working | Review modal ❌ (localStorage full) |
| 🔄 | Syncing | WhatsApp notification 🔄 |

---

## 🆘 Quick Fix Commands

### Dark Mode Bug
```javascript
// Reset dark mode
localStorage.removeItem('darkMode');
location.reload();
```

### Review Not Saving
```javascript
// Check localStorage
console.log(localStorage.getItem('fastcopyReviews'));

// Clear and retry
localStorage.removeItem('fastcopyReviews');
```

### PWA Not Installing
```
1. Check HTTPS: Must be https://
2. Check manifest: Reload page
3. Check SW: F12 → Application → Service Workers
4. Clear cache: Ctrl+Shift+Delete
5. Hard reload: Ctrl+Shift+R
6. Wait 30s and try again
```

### WhatsApp Not Opening
```javascript
// Check admin phone number
console.log(ADMIN_PHONE); // Should be "628..."

// Test message
const msg = "Test message";
window.open(`https://wa.me/6283194614784?text=${encodeURIComponent(msg)}`);
```

---

## 🎨 Key File Locations

| Feature | File | Lines |
|---------|------|-------|
| Dark mode functions | script.js | 550-600 |
| Review functions | script.js | 605-750 |
| Dark mode CSS | style.css | 450-480 |
| Review styles | style.css | 485-530 |
| Review modal HTML | index.html | 275-320 |
| Dark mode button | index.html | 63-66 |
| Service worker | service-worker.js | - |
| PWA manifest | manifest.json | - |

---

## 📈 Monitoring URLs

### Test Pages
- Local: `http://localhost:8000`
- Production: `https://your-domain.com`
- Staging: `https://staging.your-domain.com`

### Admin Notifications
- WhatsApp: `https://wa.me/[PHONE]?text=[MESSAGE]`
- Replace [PHONE]: `6283194614784`
- Replace [MESSAGE]: URL encoded message

---

## 🔐 Security Notes

- ✅ All data stored client-side (localStorage)
- ✅ No sensitive data in reviews
- ✅ No authentication required for reviews
- ⚠️ localStorage vulnerable to XSS
- ⚠️ Phone numbers sent plain text to WhatsApp

---

## 📱 Responsive Breakpoints

```css
Mobile:    < 640px
Tablet:    641px - 1024px
Desktop:   > 1024px
```

---

## ⏱️ Performance Targets

| Metric | Target | Test Method |
|--------|--------|------------|
| LCP | < 2.5s | Lighthouse |
| FID | < 100ms | DevTools |
| CLS | < 0.1 | Lighthouse |
| PWA Score | > 90 | Lighthouse |

---

## 🚀 Deployment Quick Steps

```bash
# 1. SSH to server
ssh user@domain.com

# 2. Navigate to web root
cd /var/www/html/fastcopy

# 3. Pull latest files
git pull origin main
# or upload via FTP

# 4. Verify HTTPS
# Check SSL certificate

# 5. Test service worker
curl -I https://domain.com/service-worker.js

# 6. Test manifest
curl https://domain.com/manifest.json

# 7. Run Lighthouse
# Desktop: F12 → Lighthouse → Run Audit
```

---

## 📞 Emergency Contacts

**Issues**:
1. Clear localStorage: `localStorage.clear()`
2. Hard reload: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
3. Check console: `F12 → Console`
4. Restart browser
5. Restart device

**Last Resort**:
```bash
# Complete cache clear
caches.keys().then(names => names.forEach(n => caches.delete(n)));
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## 📚 Documentation Quick Links

- **Full PWA Guide**: `PWA_ANDROID_TESTING_GUIDE.md`
- **Feature Guide**: `QUICK_START_FEATURES.md`
- **Deployment**: `DEPLOYMENT_CHECKLIST.md`
- **Version History**: `VERSION_2_0_SUMMARY.md`

---

## ✨ Version Reference

| Feature | v1.0 | v1.5 | v2.0 |
|---------|------|------|------|
| Order System | ✅ | ✅ | ✅ |
| PWA Base | ❌ | ✅ | ✅ |
| Dark Mode | ❌ | ❌ | ✅ |
| Reviews | ❌ | ❌ | ✅ |
| Offline | ❌ | ✅ | ✅ |
| Notifications | ✅ | ✅ | ✅ |

---

**Last Updated**: 3 January 2026  
**Version**: 2.0 (Production)  
**Status**: ✅ Ready for Use
