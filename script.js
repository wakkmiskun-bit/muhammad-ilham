// Produk Fotocopy
const products = [
    {
        id: 1,
        name: "Fotocopy B&W A4",
        price: "Rp 500 per lembar",
        category: "B&W Standard",
        image: "https://placehold.co/300x300/0f172a/60a5fa?text=Fotocopy+B%26W",
        desc: "Fotocopy hitam putih ukuran A4 dengan kualitas terbaik dan hasil yang tajam."
    },
    {
        id: 2,
        name: "Fotocopy Warna A4",
        price: "Rp 2.000 per lembar",
        category: "Color Copy",
        image: "https://placehold.co/300x300/0f172a/06b6d4?text=Fotocopy+Warna",
        desc: "Fotocopy berwarna A4 dengan hasil warna yang cerah dan jernih sempurna untuk dokumen marketing."
    },
    {
        id: 3,
        name: "Fotocopy B&W A3",
        price: "Rp 800 per lembar",
        category: "B&W Standard",
        image: "https://placehold.co/300x300/0f172a/60a5fa?text=Fotocopy+A3",
        desc: "Fotocopy hitam putih ukuran A3 untuk dokumen besar dengan kualitas cetak premium."
    },
    {
        id: 4,
        name: "Fotocopy Warna A3",
        price: "Rp 3.500 per lembar",
        category: "Color Copy",
        image: "https://placehold.co/300x300/0f172a/06b6d4?text=Fotocopy+Warna+A3",
        desc: "Fotocopy warna A3 dengan hasil yang vibrant untuk poster, gambar, dan desain grafis."
    },
    {
        id: 5,
        name: "Pembesaran Dokumen",
        price: "Rp 1.500 per lembar",
        category: "Enlargement",
        image: "https://placehold.co/300x300/0f172a/1e7e75?text=Pembesaran",
        desc: "Layanan pembesaran dokumen untuk membuat poster atau cetakan besar dari dokumen kecil."
    },
    {
        id: 6,
        name: "Binding & Spiral",
        price: "Rp 10.000 - 50.000",
        category: "Binding",
        image: "https://placehold.co/300x300/0f172a/1e7e75?text=Binding",
        desc: "Layanan penjilid dokumen dengan berbagai pilihan binding termasuk spiral untuk laporan profesional."
    },
    {
        id: 7,
        name: "Laminating",
        price: "Rp 2.000 - 10.000",
        category: "Laminating",
        image: "https://placehold.co/300x300/0f172a/1e7e75?text=Laminating",
        desc: "Layanan laminasi untuk melindungi dan memperpanjang umur dokumen penting Anda."
    },
    {
        id: 8,
        name: "Scanning Dokumen",
        price: "Rp 1.000 per halaman",
        category: "Scanning",
        image: "https://placehold.co/300x300/0f172a/60a5fa?text=Scanning",
        desc: "Layanan pemindaian dokumen ke format digital dengan resolusi tinggi untuk arsip digital."
    }
];

// Data Antrian
let queueData = [];
let queueCounter = 0;

// Nomor WhatsApp Admin (ganti dengan nomor admin Anda)
const ADMIN_PHONE = '6285191163819'; // Ganti dengan nomor WhatsApp admin

// Fungsi untuk format nomor WhatsApp
function formatPhoneNumber(phone) {
    // Hapus semua karakter selain angka
    phone = phone.replace(/\D/g, '');
    
    // Jika dimulai dengan 0, ganti dengan 62
    if (phone.startsWith('0')) {
        phone = '62' + phone.substring(1);
    }
    // Jika belum dimulai dengan 62, tambahkan 62
    else if (!phone.startsWith('62')) {
        phone = '62' + phone;
    }
    
    return phone;
}

// Fungsi validasi nomor WhatsApp
function isValidPhoneNumber(phone) {
    phone = phone.replace(/\D/g, '');
    
    // Harus minimal 10 digit dan maksimal 15 digit
    if (phone.length < 10 || phone.length > 15) {
        return false;
    }
    
    // Jika dimulai dengan 0, akan menjadi 62 + sisa 9 digit = minimal 11 digit
    // Jika sudah 62, harus 11-15 digit total
    if (phone.startsWith('0')) {
        return phone.length >= 10 && phone.length <= 14; // Setelah diformat jadi 11-15
    } else {
        return phone.length >= 10 && phone.length <= 15;
    }
}

// Data pengguna yang login
let currentUser = null;

// Simpan data pengguna di localStorage
function saveUser(name, phone, email) {
    const user = {
        id: Date.now(),
        name: name,
        phone: phone,
        email: email,
        registeredAt: new Date().toLocaleString('id-ID'),
        verified: false
    };
    
    // Simpan di localStorage
    const users = JSON.parse(localStorage.getItem('fastcopyUsers')) || [];
    users.push(user);
    localStorage.setItem('fastcopyUsers', JSON.stringify(users));
    
    return user;
}

// Ambil data pengguna
function getUser(phone) {
    const users = JSON.parse(localStorage.getItem('fastcopyUsers')) || [];
    return users.find(u => u.phone === phone);
}

// Buka modal pesan (login/pendaftaran)
function openQueueForm(productId) {
    const modal = document.getElementById('queueModal');
    modal.classList.remove('hidden');
    document.getElementById('queueForm').reset();
}

// Tutup modal pesan
function closeQueueModal() {
    document.getElementById('queueModal').classList.add('hidden');
    document.getElementById('queueForm').reset();
}

// Tutup modal pembayaran
function closePaymentModal() {
    document.getElementById('paymentModal').classList.add('hidden');
}

// Submit login/pendaftaran
async function submitQueue(event) {
    event.preventDefault();
    
    const name = document.getElementById('queueName').value.trim();
    let phone = document.getElementById('queuePhone').value.trim();
    const email = document.getElementById('queueEmail').value.trim();
    
    // Validasi input
    if (!name) {
        alert('❌ Nama tidak boleh kosong');
        return;
    }
    
    if (!phone) {
        alert('❌ Nomor WhatsApp tidak boleh kosong');
        return;
    }
    
    if (!isValidPhoneNumber(phone)) {
        alert('❌ Nomor WhatsApp tidak valid!\n\nContoh format yang benar:\n• 0812345678\n• 628123456789\n• +628123456789');
        return;
    }

    if (!email) {
        alert('❌ Email tidak boleh kosong');
        return;
    }
    
    // Format nomor WhatsApp ke format internasional
    phone = formatPhoneNumber(phone);
    
    // Cek apakah user sudah terdaftar
    let user = getUser(phone);
    
    if (!user) {
        // User baru - simpan data
        user = saveUser(name, phone, email);
        
        // Kirim notifikasi ke admin via WhatsApp
        const adminMessage = `🎉 *USER BARU TERDAFTAR* 🎉

👤 *Data Pengguna:*
• Nama: ${name}
• WhatsApp: ${phone}
• Email: ${email}
• Waktu Daftar: ${new Date().toLocaleString('id-ID')}

✅ User telah siap untuk melakukan pembayaran!`;

        const encodedAdminMessage = encodeURIComponent(adminMessage);
        const adminWhatsappURL = `https://wa.me/${ADMIN_PHONE}?text=${encodedAdminMessage}`;
        
        // Buka WhatsApp admin di background
        window.open(adminWhatsappURL, '_blank');
        
        // Kirim pesan konfirmasi ke user
        setTimeout(() => {
            const userMessage = `👋 *Selamat datang di FastCopy!* 👋

📝 *Terima kasih telah mendaftar:*
• Nama: ${name}
• Email: ${email}

🎁 Silakan lanjutkan ke pembayaran untuk mengaktifkan akun Anda.

� Jika ada pertanyaan, hubungi admin kami.`;

            const formattedPhone = formatPhoneNumber(phone);
            const encodedUserMessage = encodeURIComponent(userMessage);
            const userWhatsappURL = `https://wa.me/${formattedPhone}?text=${encodedUserMessage}`;
            window.open(userWhatsappURL, '_blank');
        }, 1000);

        // AUTO: Kirim link pembayaran QRIS ke user setelah 2 detik
        setTimeout(() => {
            const paymentLink = generatePaymentLink(user);
            const qrisMessage = `💳 *LINK PEMBAYARAN QRIS* 💳

Halo ${name} 👋

📌 Berikut link pembayaran Anda:

${paymentLink}

💰 *Nominal: Rp 50.000*

⏱️ Harap lakukan pembayaran dalam 24 jam

Terima kasih! 🙏`;

            const formattedPhone2 = formatPhoneNumber(phone);
            const encodedQrisMessage = encodeURIComponent(qrisMessage);
            const paymentWhatsappURL = `https://wa.me/${formattedPhone2}?text=${encodedQrisMessage}`;
            window.open(paymentWhatsappURL, '_blank');
        }, 2000);
    }
    
    // Simpan user ke session dan buka halaman pembayaran
    currentUser = user;
    closeQueueModal();
    
    // Buka modal pembayaran
    setTimeout(() => {
        openPaymentModal(user);
    }, 1500);
}

// Generate link pembayaran QRIS
function generatePaymentLink(user) {
    // Opsi 1: Link DANA (jika sudah punya merchant DANA)
    // const danaLink = 'https://link.dana.id/...';
    
    // Opsi 2: Link QRIS generik (gunakan provider Anda)
    // Format: Merchant ID + reference + amount
    
    // Untuk sekarang, gunakan format default:
    // Ganti YOUR_MERCHANT_LINK dengan link actual Anda
    const merchantLink = 'https://link.dana.id/YOUR_MERCHANT_ID'; // ← GANTI DENGAN LINK MERCHANT QRIS ANDA
    
    // Atau generate dari data user
    const paymentLink = `${merchantLink}?ref=${user.id}&amount=50000&name=${encodeURIComponent(user.name)}&email=${user.email}`;
    
    return paymentLink;
}

// Buka modal pembayaran dengan QR Code QRIS
function openPaymentModal(user) {
    const modal = document.getElementById('paymentModal');
    
    // Generate QR Code QRIS (gunakan API atau library untuk real implementation)
    // Untuk sekarang, kita gunakan placeholder
    const qrisData = generateQRISData(user);
    
    // Update tampilan modal pembayaran
    document.getElementById('paymentName').textContent = user.name;
    document.getElementById('paymentEmail').textContent = user.email;
    document.getElementById('paymentAmount').textContent = 'Rp 50.000'; // Contoh: biaya pendaftaran
    
    // Generate QR Code
    generateQRCode(qrisData);
    
    modal.classList.remove('hidden');
}

// Generate data QRIS
function generateQRISData(user) {
    // Format: QRIS data untuk merchant Anda
    // Ganti dengan data merchant QRIS Anda yang sebenarnya
    const merchantId = 'YOUR_MERCHANT_ID'; // Ganti dengan ID merchant Anda
    const amount = 50000; // Biaya dalam rupiah
    
    // Ini adalah format sederhana - sesuaikan dengan API provider QRIS Anda
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

// Generate QR Code (gunakan library seperti qrcode.js)
function generateQRCode(data) {
    // Anda perlu menambahkan library QR Code di HTML
    // <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    
    const container = document.getElementById('qrCodeContainer');
    container.innerHTML = ''; // Kosongkan container
    
    // Untuk demo, kami menggunakan placeholder image
    // Ganti dengan implementasi real QRIS API provider Anda
    const qrImage = document.createElement('img');
    qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(JSON.stringify(data))}`;
    qrImage.alt = 'QR Code QRIS';
    qrImage.className = 'w-full';
    container.appendChild(qrImage);
}

// Konfirmasi pembayaran
function confirmPayment() {
    if (!currentUser) {
        alert('❌ Data pengguna tidak ditemukan');
        return;
    }

    // Tandai user sebagai verified
    const users = JSON.parse(localStorage.getItem('fastcopyUsers')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);

    if (userIndex !== -1) {
        users[userIndex].verified = true;
        users[userIndex].verifiedAt = new Date().toLocaleString('id-ID');
        localStorage.setItem('fastcopyUsers', JSON.stringify(users));
        currentUser.verified = true;
    }

    // Kirim notifikasi pembayaran berhasil via WhatsApp ke user
    const successMessage = `✅ *PEMBAYARAN BERHASIL!* ✅

👤 Halo ${currentUser.name}

💳 Pembayaran sebesar Rp 50.000 telah berhasil diproses!

🎯 Status: AKTIF
🔑 User ID: ${currentUser.id}

📞 Anda sekarang bisa menggunakan layanan FastCopy!

Hubungi admin jika ada pertanyaan.`;

    const formattedUserPhone = formatPhoneNumber(currentUser.phone);
    const encodedMessage = encodeURIComponent(successMessage);
    const whatsappURL = `https://wa.me/${formattedUserPhone}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank');

    // Kirim notifikasi ke admin DENGAN NOMOR USER (di-format dengan benar)
    const formattedAdminUserPhone = formatPhoneNumber(currentUser.phone);
    const adminNotif = `🎉 *PEMBAYARAN DITERIMA* 🎉

👤 Pengguna: ${currentUser.name}
📱 WhatsApp User: ${formattedAdminUserPhone}
📧 Email: ${currentUser.email}
💰 Nominal: Rp 50.000
🕐 Waktu: ${new Date().toLocaleString('id-ID')}

✅ User telah aktif dan siap menggunakan layanan!`;

    const encodedAdminNotif = encodeURIComponent(adminNotif);
    const adminURL = `https://wa.me/${ADMIN_PHONE}?text=${encodedAdminNotif}`;
    window.open(adminURL, '_blank');

    // Tampilkan pesan sukses
    alert('✅ Pembayaran berhasil! Terima kasih telah mendaftar di FastCopy.');

    // Tutup modal
    closePaymentModal();

    // Redirect ke halaman home
    setTimeout(() => {
        showHome();
    }, 2000);
}

// Render semua produk
function renderProducts() {
    const grid = document.getElementById('productGrid');
    grid.innerHTML = '';
    products.forEach(p => {
        grid.innerHTML += `
            <div class="product-card p-4 cursor-pointer" onclick="showDetail(${p.id})">
                <img src="${p.image}" class="w-full h-48 object-cover mb-3 rounded-lg hover:scale-110 transition duration-300">
                <div class="p-2">
                    <h3 class="text-sm text-gray-100 font-semibold line-clamp-2 h-10 leading-5">${p.name}</h3>
                    <p class="text-cyan-400 font-bold text-lg mt-2">${p.price}</p>
                    <div class="mt-3 text-[11px] badge-min-order px-2 py-1 rounded-full inline-block font-bold">
                        ${p.category}
                    </div>
                </div>
            </div>
        `;
    });
}

// Tampilkan detail produk
function showDetail(id) {
    const p = products.find(prod => prod.id === id);
    document.getElementById('homePage').classList.add('hidden');
    document.getElementById('detailPage').classList.remove('hidden');
    
    document.getElementById('detailContent').innerHTML = `
        <div class="bg-gray-900 p-8 rounded-lg shadow-lg flex flex-col md:flex-row gap-8 border border-blue-400">
            <div class="md:w-1/3">
                <img src="${p.image}" class="w-full border-2 border-blue-400 rounded-lg shadow-md hover:shadow-lg transition duration-300">
            </div>
            <div class="md:w-2/3">
                <h1 class="text-3xl font-bold text-white">${p.name}</h1>
                <p class="text-4xl font-bold text-cyan-400 my-4">${p.price}</p>
                <div class="bg-gray-800 border-l-4 border-blue-400 p-4 rounded-lg text-base text-gray-200 mb-6">
                    ${p.desc}
                </div>
                <div class="grid grid-cols-2 gap-4 text-sm mb-8">
                    <div class="bg-gray-800 p-3 rounded-lg border border-blue-400">
                        <b class="text-cyan-300">Kategori:</b>
                        <p class="text-gray-200 mt-1">${p.category}</p>
                    </div>
                    <div class="bg-gray-800 p-3 rounded-lg border border-blue-400">
                        <b class="text-cyan-300">Harga:</b>
                        <p class="text-cyan-400 font-bold mt-1">${p.price}</p>
                    </div>
                </div>
                <div class="flex gap-4">
                    <button class="flex-1 bg-white border-2 border-blue-400 text-black py-3 rounded-lg font-bold hover:bg-gray-200 transition duration-200 transform hover:scale-105" onclick="showHome()">
                        <i class="fa fa-arrow-left mr-2"></i> Kembali
                    </button>
                    <button class="flex-1 bg-gradient-to-r from-blue-400 to-cyan-400 text-black py-3 rounded-lg font-bold hover:from-blue-500 hover:to-cyan-500 transition duration-200 shadow-md hover:shadow-lg transform hover:scale-105" onclick="showHome(); openQueueForm(${p.id})">
                        <i class="fas fa-hourglass-end mr-2"></i> Pesan
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Tampilkan halaman beranda
function showHome() {
    document.getElementById('homePage').classList.remove('hidden');
    document.getElementById('detailPage').classList.add('hidden');
    showCategory('produk');
}

// Tampilkan kategori
function showCategory(category) {
    const productSection = document.getElementById('productSection');
    const queueSection = document.getElementById('queueSection');
    
    if (category === 'produk') {
        productSection.classList.remove('hidden');
        queueSection.classList.add('hidden');
    } else if (category === 'antrian') {
        productSection.classList.add('hidden');
        queueSection.classList.remove('hidden');
        renderQueue();
    }
}

// Buka modal pesan
function openQueueForm(productId) {
    const modal = document.getElementById('queueModal');
    modal.classList.remove('hidden');
    
    // Isi dropdown produk
    const select = document.getElementById('queueProduct');
    select.innerHTML = '<option value="">-- Pilih Layanan --</option>';
    products.forEach(p => {
        select.innerHTML += `<option value="${p.id}" ${p.id === productId ? 'selected' : ''}>${p.name} (${p.price})</option>`;
    });
}

// Tutup modal pesan
function closeQueueModal() {
    document.getElementById('queueModal').classList.add('hidden');
    document.getElementById('queueForm').reset();
}

// Render antrian
function renderQueue() {
    const queueList = document.getElementById('queueList');
    
    if (queueData.length === 0) {
        queueList.innerHTML = '<p class="text-center text-gray-500 py-8">Belum ada pesanan di antrian</p>';
        return;
    }
    
    queueList.innerHTML = '';
    queueData.forEach((item, index) => {
        queueList.innerHTML += `
            <div class="bg-gray-800 border border-blue-400 rounded-lg p-4 hover:shadow-lg transition duration-200">
                <div class="flex items-start justify-between mb-3">
                    <div>
                        <h3 class="text-xl font-bold text-cyan-400">
                            <i class="fas fa-hourglass-end mr-2"></i>Antrian #${item.no}
                        </h3>
                        <p class="text-sm text-gray-500 mt-1">
                            <i class="fas fa-clock mr-1"></i>${item.time}
                        </p>
                    </div>
                    <button onclick="deleteQueue(${index})" class="text-red-400 hover:text-red-300 text-xl transition">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div class="border-l-2 border-blue-400 pl-3">
                        <p class="text-gray-500">Nama</p>
                        <p class="text-white font-semibold">${item.name}</p>
                    </div>
                    <div class="border-l-2 border-blue-400 pl-3">
                        <p class="text-gray-500">Nomor WhatsApp</p>
                        <p class="text-white font-semibold">${item.phone}</p>
                    </div>
                    <div class="border-l-2 border-blue-400 pl-3">
                        <p class="text-gray-500">Layanan</p>
                        <p class="text-white font-semibold">${item.product}</p>
                    </div>
                    <div class="border-l-2 border-blue-400 pl-3">
                        <p class="text-gray-500">Jumlah</p>
                        <p class="text-white font-semibold">${item.quantity}x</p>
                    </div>
                </div>
                
                ${item.note ? `
                    <div class="mt-3 border-t border-gray-700 pt-3">
                        <p class="text-gray-500 text-sm">Catatan</p>
                        <p class="text-gray-200 text-sm italic">"${item.note}"</p>
                    </div>
                ` : ''}
            </div>
        `;
    });
}

// Hapus pesanan dari antrian
function deleteQueue(index) {
    if (confirm('Hapus pesanan ini dari antrian?')) {
        queueData.splice(index, 1);
        renderQueue();
    }
}

// Tutup modal saat klik di luar
document.addEventListener('click', function(event) {
    const modal = document.getElementById('queueModal');
    if (event.target === modal) {
        closeQueueModal();
    }
});

// Welcome animation
window.addEventListener('load', function() {
    setTimeout(() => {
        const welcomeAnimation = document.getElementById('welcomeAnimation');
        welcomeAnimation.classList.add('fade-out');
        setTimeout(() => {
            welcomeAnimation.classList.add('hidden');
        }, 1000);
    }, 2500);
});

// Fungsi untuk export nomor WhatsApp ke file
function exportWhatsAppNumbers() {
    if (queueData.length === 0) {
        alert('❌ Tidak ada nomor WhatsApp dalam antrian');
        return;
    }

    // Buat konten file CSV
    let csvContent = 'No,Nama,Nomor WhatsApp,Layanan,Jumlah,Harga,Catatan,Waktu\n';

    queueData.forEach((item, index) => {
        csvContent += `${item.no},"${item.name}","${item.phone}","${item.product}",${item.quantity},"${item.price}","${item.note || ''}","${item.time}"\n`;
    });

    // Buat blob dan download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `nomor_whatsapp_fastcopy_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    alert('✅ File nomor WhatsApp berhasil diunduh!');
}

// ===== DARK MODE SYSTEM =====
let isDarkMode = localStorage.getItem('darkMode') === 'true';

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', isDarkMode);
    applyDarkMode();
}

function applyDarkMode() {
    const htmlElement = document.documentElement;
    const icon = document.getElementById('darkModeIcon');
    
    if (isDarkMode) {
        // Light mode
        htmlElement.style.colorScheme = 'light';
        document.body.style.backgroundColor = '#f5f5f5';
        document.body.style.color = '#000000';
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        icon.className = 'fas fa-sun';
    } else {
        // Dark mode
        htmlElement.style.colorScheme = 'dark';
        document.body.style.backgroundColor = '#000000';
        document.body.style.color = '#ffffff';
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        icon.className = 'fas fa-moon';
    }
}

// ===== REVIEW & RATING SYSTEM =====
let currentRating = 0;
let reviews = JSON.parse(localStorage.getItem('fastcopyReviews')) || [];

function openReviewModal() {
    document.getElementById('reviewModal').classList.remove('hidden');
    renderReviews();
}

function closeReviewModal() {
    document.getElementById('reviewModal').classList.add('hidden');
    resetReviewForm();
}

function setRating(rating) {
    currentRating = rating;
    const stars = document.querySelectorAll('#starRating i');
    const ratingTexts = ['', 'Buruk', 'Kurang Baik', 'Cukup', 'Bagus', 'Sangat Bagus'];
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('text-yellow-400');
            star.classList.remove('text-gray-600');
        } else {
            star.classList.remove('text-yellow-400');
            star.classList.add('text-gray-600');
        }
    });
    
    document.getElementById('ratingText').textContent = `${rating} bintang - ${ratingTexts[rating]}`;
}

function updateCharCount() {
    const text = document.getElementById('reviewText').value;
    document.getElementById('charCount').textContent = text.length;
}

function submitReview() {
    const name = document.getElementById('reviewName').value.trim();
    const text = document.getElementById('reviewText').value.trim();
    
    // Validation
    if (!name) {
        alert('❌ Nama tidak boleh kosong');
        return;
    }
    
    if (text.length < 10) {
        alert('❌ Ulasan minimal 10 karakter');
        return;
    }
    
    if (currentRating === 0) {
        alert('❌ Pilih rating terlebih dahulu');
        return;
    }
    
    // Create review object
    const review = {
        id: Date.now(),
        name: name,
        rating: currentRating,
        text: text,
        date: new Date().toLocaleDateString('id-ID'),
        verified: true
    };
    
    // Add to array
    reviews.unshift(review);
    
    // Save to localStorage
    localStorage.setItem('fastcopyReviews', JSON.stringify(reviews));
    
    // Show success message
    alert('✅ Terima kasih! Ulasan Anda telah disimpan.');
    
    // Reset form
    resetReviewForm();
    
    // Render updated reviews
    renderReviews();
    
    // Send to admin via WhatsApp
    const reviewMessage = `⭐ *ULASAN BARU* ⭐

👤 Nama: ${name}
⭐ Rating: ${'⭐'.repeat(currentRating)}
💬 Ulasan: ${text}
📅 Tanggal: ${new Date().toLocaleString('id-ID')}

Terima kasih telah menggunakan FastCopy!`;
    
    const encodedReviewMessage = encodeURIComponent(reviewMessage);
    const adminReviewURL = `https://wa.me/${ADMIN_PHONE}?text=${encodedReviewMessage}`;
    window.open(adminReviewURL, '_blank');
}

function resetReviewForm() {
    currentRating = 0;
    document.getElementById('reviewName').value = '';
    document.getElementById('reviewText').value = '';
    document.getElementById('charCount').textContent = '0';
    document.getElementById('ratingText').textContent = 'Pilih rating (1-5 bintang)';
    
    // Reset stars
    const stars = document.querySelectorAll('#starRating i');
    stars.forEach(star => {
        star.classList.remove('text-yellow-400');
        star.classList.add('text-gray-600');
    });
}

function renderReviews() {
    const reviewsList = document.getElementById('reviewsList');
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-inbox text-gray-600 text-4xl mb-3"></i>
                <p class="text-gray-400">Belum ada ulasan. Jadilah yang pertama! 👇</p>
            </div>
        `;
        return;
    }
    
    reviewsList.innerHTML = reviews.map(review => `
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-cyan-400 transition">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <h4 class="text-white font-bold">${review.name}</h4>
                    <p class="text-xs text-gray-500">${review.date}</p>
                </div>
                <div class="text-yellow-400">
                    ${'⭐'.repeat(review.rating)}
                </div>
            </div>
            <p class="text-gray-300 text-sm">${review.text}</p>
            ${review.verified ? '<p class="text-xs text-green-400 mt-2">✅ Pelanggan Terverifikasi</p>' : ''}
        </div>
    `).join('');
}

// Calculate average rating
function getAverageRating() {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
}

// Show rating stats
function showRatingStats() {
    const avg = getAverageRating();
    const total = reviews.length;
    console.log(`📊 FastCopy Rating: ${avg}⭐ (${total} ulasan)`);
    return { average: avg, total: total };
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    showCategory('produk');
    
    // Apply dark mode on load
    applyDarkMode();
    
    // Load reviews on load
    renderReviews();
    
    // Add character counter listener
    document.getElementById('reviewText')?.addEventListener('input', updateCharCount);
});


