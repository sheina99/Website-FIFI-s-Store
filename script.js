// DATA PRODUK (9 Kalung, 2 Gelang, 3 One Set - Total 14 Produk)
const productsData = [
    // --- KATEGORI KALUNG (1-9) ---
    { id: 1, name: "Kalung Goth Hati", cat: "kalung", price: 75000, desc: "Kalung liontin hati gaya goth berbahan kualitas tinggi.", img: "image/kalung goth 1.jpg" },
    { id: 2, name: "Kalung Goth Manik Hitam", cat: "kalung", price: 80000, desc: "Kalung manik hitam elegan dan menawan.", img: "image/kalung goth 2.jpg" },
    { id: 3, name: "Kalung Goth Moon", cat: "kalung", price: 85000, desc: "Kalung liontin bulan estetik bernuansa misterius.", img: "image/kalung goth 3.jpg" },
    { id: 4, name: "Kalung Goth Manik Merah", cat: "kalung", price: 82000, desc: "Kalung manik merah dengan sentuhan gothic unik.", img: "image/kalung goth 4.jpg" },
    { id: 5, name: "Kalung Goth Simple", cat: "kalung", price: 70000, desc: "Kalung gaya gothic simpel untuk tampilan kasual.", img: "image/kalung goth 5.jpg" },
    { id: 6, name: "Kalung Liontin Bintang Pink", cat: "kalung", price: 65000, desc: "Kalung manis dengan liontin bintang warna pink.", img: "image/kalung lucu 1.jpg" },
    { id: 7, name: "Kalung Liontin Bintang Biru", cat: "kalung", price: 65000, desc: "Kalung imut liontin bintang warna biru cerah.", img: "image/kalung lucu 2.jpg" },
    { id: 8, name: "Kalung Manik Biru Lucu", cat: "kalung", price: 58000, desc: "Kalung manik-manik estetik bernuansa biru pastel.", img: "image/kalung lucu 3.jpg" },
    { id: 9, name: "Kalung Rantai Manik Biru", cat: "kalung", price: 62000, desc: "Kalung paduan rantai dan manik biru yang trendi.", img: "image/kalung lucu 4.jpg" },

    // --- KATEGORI GELANG (10-11) ---
    { id: 10, name: "One Set Gelang Simple", cat: "gelang", price: 65000, desc: "Gelang cantik simpel untuk sehari-hari.", img: "image/set gelang.jpg" },
    { id: 11, name: "One Set Gelang Double Layer", cat: "gelang", price: 72000, desc: "Gelang dua lapis manis dan tahan lama.", img: "image/set gelang 2.jpg" },

    // --- KATEGORI ONE SET (12-14) ---
    { id: 12, name: "One Set Classic Elegant", cat: "set", price: 125000, desc: "Paket komplit perhiasan kalung & gelang elegan.", img: "image/set 2.jpg" },
    { id: 13, name: "One Set Blue Charm", cat: "set", price: 135000, desc: "Set perhiasan bertema warna biru laut yang anggun.", img: "image/set 1.jpg" },
    { id: 14, name: "One Set Special Edition", cat: "set", price: 145000, desc: "Paket lengkap aksesoris eksklusif untuk acara istimewa.", img: "image/set 3.jpg" }
];

let cart = JSON.parse(localStorage.getItem('fifi_cart')) || [];
let activeUser = JSON.parse(localStorage.getItem('fifi_user')) || null;

// NOTIFIKASI KUSTOM (Ganti Alert Native)
function showToast(message) {
    let toast = document.getElementById('custom-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'custom-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #375d87;
            color: #ffffff;
            padding: 12px 20px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    
    setTimeout(() => {
        toast.style.opacity = '0';
    }, 2500);
}

// INISIALISASI SAAT HALAMAN DIMUAT
document.addEventListener("DOMContentLoaded", function() {
    updateCartUI();
    updateUserUI();

    // Render Produk di Beranda
    if (document.getElementById('home-products')) {
        renderProducts(productsData.slice(0, 4), 'home-products');
    }

    // Render Produk di Halaman Produk & Filter Parameter URL
    if (document.getElementById('all-products')) {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('cat');
        
        if (categoryParam) {
            filterCategory(categoryParam);
        } else {
            renderProducts(productsData, 'all-products');
        }
    }

    // Event Overlay Click (Tutup Modal jika area luar diklik)
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeCartModal();
                closeAuthModal();
            }
        });
    });
});

// RENDER PRODUK DENGAN CARD
function renderProducts(items, targetId) {
    const container = document.getElementById(targetId);
    if (!container) return;

    container.innerHTML = '';

    if (items.length === 0) {
        container.innerHTML = '<p style="font-size:13px; color:#64748b; padding:15px 0;">Produk tidak ditemukan.</p>';
        return;
    }

    items.forEach(p => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div>
                <span class="card-badge">${p.cat.toUpperCase()}</span>
                <img src="${p.img}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
            </div>
            <div>
                <div class="card-price">Rp${p.price.toLocaleString('id-ID')}</div>
                <div style="display:flex; gap:6px; flex-direction:column;">
                    <button type="button" onclick="buyNow(${p.id})" style="background:var(--primary-dark);">Beli Langsung</button>
                    <button type="button" onclick="addToCart(${p.id})" style="background:var(--light-blue); color:var(--primary-blue); border:1px solid #d0e1f0;">+ Keranjang</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// FUNGSI BELI LANGSUNG (Langsung Buka Checkout Modal)
function buyNow(id) {
    addToCart(id);
    openCartModal();
    toggleCheckoutStep(true);
}

// FILTER KATEGORI PRODUK
function filterCategory(cat) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    
    const activeBtn = document.getElementById(`btn-${cat}`);
    if (activeBtn) activeBtn.classList.add('active');

    if (cat === 'all') {
        renderProducts(productsData, 'all-products');
    } else {
        const filtered = productsData.filter(p => p.cat === cat);
        renderProducts(filtered, 'all-products');
    }
}

// MANAGEMENT KERANJANG
function addToCart(id) {
    const prod = productsData.find(p => p.id === id);
    if (!prod) return;

    const exist = cart.find(item => item.id === id);

    if (exist) {
        exist.qty += 1;
    } else {
        cart.push({ ...prod, qty: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`"${prod.name}" berhasil ditambahkan!`);
}

function saveCart() {
    localStorage.setItem('seize_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const countEl = document.getElementById('cart-count');
    if (countEl) {
        const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
        countEl.textContent = totalQty;
    }

    const listEl = document.getElementById('cart-items-list');
    const totalPriceEl = document.getElementById('cart-total-price');

    if (listEl) {
        listEl.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            listEl.innerHTML = '<p style="font-size:13px; color:#64748b; text-align:center; padding:15px 0;">Keranjang Anda kosong.</p>';
        } else {
            cart.forEach(item => {
                total += item.price * item.qty;
                const row = document.createElement('div');
                row.style.cssText = 'display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; font-size:13px; border-bottom:1px solid #f1f5f9; padding-bottom:8px;';
                row.innerHTML = `
                    <div>
                        <strong>${item.name}</strong>
                        <div style="color:#64748b; font-size:11px;">Rp${item.price.toLocaleString('id-ID')} x ${item.qty}</div>
                    </div>
                    <div style="font-weight:bold; color:var(--primary-blue);">
                        Rp${(item.price * item.qty).toLocaleString('id-ID')}
                    </div>
                `;
                listEl.appendChild(row);
            });
        }

        if (totalPriceEl) {
            totalPriceEl.textContent = `Rp${total.toLocaleString('id-ID')}`;
        }
    }
}

function openCartModal() {
    const modal = document.getElementById('modal-cart');
    if (modal) {
        modal.classList.add('active');
        toggleCheckoutStep(false);
    }
}

function closeCartModal() {
    const modal = document.getElementById('modal-cart');
    if (modal) {
        modal.classList.remove('active');
    }
}

function toggleCheckoutStep(isCheckout) {
    const formBox = document.getElementById('checkout-form-box');
    const btnNext = document.getElementById('btn-next-checkout');
    const btnPay = document.getElementById('btn-finish-pay');

    if (isCheckout) {
        if (cart.length === 0) {
            showToast('Keranjang Anda masih kosong!');
            return;
        }
        if (formBox) formBox.classList.remove('hidden');
        if (btnNext) btnNext.classList.add('hidden');
        if (btnPay) btnPay.classList.remove('hidden');
    } else {
        if (formBox) formBox.classList.add('hidden');
        if (btnNext) btnNext.classList.remove('hidden');
        if (btnPay) btnPay.classList.add('hidden');
    }
}

function processPayment() {
    const namaEl = document.getElementById('co-nama');
    const alamatEl = document.getElementById('co-alamat');
    const bayarEl = document.getElementById('co-bayar');

    const nama = namaEl ? namaEl.value.trim() : '';
    const alamat = alamatEl ? alamatEl.value.trim() : '';
    const bayar = bayarEl ? bayarEl.value : 'qris';

    if (!nama || !alamat) {
        showToast('Lengkapi nama dan alamat pengiriman!');
        return;
    }

    showToast(`Pesanan berhasil! Metode: ${bayar.toUpperCase()}`);
    cart = [];
    saveCart();
    updateCartUI();
    
    if (namaEl) namaEl.value = '';
    if (alamatEl) alamatEl.value = '';

    closeCartModal();
}

// KONTAK FORM
function submitContact(e) {
    e.preventDefault();
    const namaEl = document.getElementById('c-nama');
    const pesanEl = document.getElementById('c-pesan');

    if (!namaEl || !pesanEl) return;

    const historyBox = document.getElementById('contact-history');
    const list = document.getElementById('contact-list');

    if (historyBox && list) {
        historyBox.style.display = 'block';
        const item = document.createElement('div');
        item.style.cssText = 'background:#f1f5f9; padding:8px 12px; border-radius:6px; font-size:12px;';
        item.innerHTML = `<strong>${namaEl.value}:</strong> ${pesanEl.value}`;
        list.appendChild(item);
    }

    showToast('Pesan berhasil dikirim!');
    const form = document.getElementById('contactForm');
    if (form) form.reset();
}

// AKUN & LOGIN
function openAuthModal() {
    const modal = document.getElementById('modal-auth');
    if (modal) {
        modal.classList.add('active');
    }
}

function closeAuthModal() {
    const modal = document.getElementById('modal-auth');
    if (modal) {
        modal.classList.remove('active');
    }
}

function userLogin(e) {
    e.preventDefault();
    const emailEl = document.getElementById('acc-email');
    const email = emailEl && emailEl.value ? emailEl.value : 'pembeli@gmail.com';
    
    activeUser = { email: email, name: email.split('@')[0] };

    localStorage.setItem('fifi_user', JSON.stringify(activeUser));
    updateUserUI();

    closeAuthModal();
    showToast(`Selamat datang, ${activeUser.name}!`);
}

function updateUserUI() {
    const userLabel = document.getElementById('user-label');
    const loginForm = document.getElementById('loginForm');
    const loggedBox = document.getElementById('auth-status-logged');
    const nameDisplay = document.getElementById('user-display-name');
    const emailDisplay = document.getElementById('user-display-email');

    if (activeUser) {
        if (userLabel) userLabel.textContent = activeUser.name;
        if (loginForm) loginForm.classList.add('hidden');
        if (loggedBox) loggedBox.classList.remove('hidden');
        if (nameDisplay) nameDisplay.textContent = activeUser.name;
        if (emailDisplay) emailDisplay.textContent = activeUser.email;
    } else {
        if (userLabel) userLabel.textContent = 'Akun';
        if (loginForm) loginForm.classList.remove('hidden');
        if (loggedBox) loggedBox.classList.add('hidden');
    }
}

function userLogout() {
    activeUser = null;
    localStorage.removeItem('fifi_user');
    updateUserUI();
    closeAuthModal();
    showToast('Anda telah logout.');
}