// إعدادات
const ADMIN_USERNAME = 'naserdel123';
const MOYASAR_KEY = 'pk_live_uMadyRRfpzd5PsvGgLBeCHLHbyHs5tH9Z43Ax3g7';

// منتجات افتراضية
const defaultProducts = [
    {
        id: 1,
        name: 'Dominus Infernus',
        price: 150,
        deliveryMethod: 'trade',
        image: 'https://tr.rbxcdn.com/30DAY-AvatarItem-8cce128c9e8e4e6b9e3c8b4d5f6a7b8c-420x420.png',
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        name: 'Golden Crown',
        price: 75,
        deliveryMethod: 'gift',
        image: 'https://tr.rbxcdn.com/30DAY-AvatarItem-9d9e9f9a9b9c9d9e9f9a9b9c9d9e9f9a-420x420.png',
        createdAt: new Date().toISOString()
    }
];

// تحميل المنتجات
function loadProducts() {
    let products = JSON.parse(localStorage.getItem('roblox_trades_products') || '[]');
    
    // إذا ما فيه منتجات، حط المنتجات الافتراضية
    if (products.length === 0) {
        products = defaultProducts;
        localStorage.setItem('roblox_trades_products', JSON.stringify(products));
    }
    
    const grid = document.getElementById('products-grid');
    const emptyState = document.getElementById('empty-state');
    
    grid.innerHTML = '';
    
    if (products.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    products.forEach((product, index) => {
        const card = createProductCard(product, index);
        grid.appendChild(card);
    });
}

// إنشاء بطاقة المنتج
function createProductCard(product, index) {
    const div = document.createElement('div');
    div.className = 'product-card';
    div.style.animationDelay = (index * 0.1) + 's';
    
    const deliveryIcons = {
        trade: '🔄',
        gift: '🎁',
        group: '👥'
    };
    
    const deliveryTexts = {
        trade: 'تريد في اللعبة',
        gift: 'هدية',
        group: 'مجموعة'
    };
    
    div.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x300/8b5cf6/ffffff?text=${encodeURIComponent(product.name)}'">
            <div class="price-tag">${product.price} ريال</div>
        </div>
        <div class="product-body">
            <h4 class="product-name">${product.name}</h4>
            <div class="delivery-method">
                <span class="icon">${deliveryIcons[product.deliveryMethod] || '🔄'}</span>
                <span>${deliveryTexts[product.deliveryMethod] || 'تريد'}</span>
            </div>
            <button class="buy-btn" onclick="buyProduct(${product.id})">شراء الآن</button>
        </div>
    `;
    
    return div;
}

// شراء منتج
function buyProduct(productId) {
    const products = JSON.parse(localStorage.getItem('roblox_trades_products') || '[]');
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // فتح نموذج Moyasar
    const amount = product.price * 100;
    
    // مسح النموذج القديم
    document.querySelector('.mysr-form').innerHTML = '';
    
    // تهيئة Moyasar
    Moyasar.init({
        element: '.mysr-form',
        amount: amount,
        currency: 'SAR',
        description: `شراء ${product.name}`,
        publishable_api_key: MOYASAR_KEY,
        callback_url: window.location.href,
        methods: ['creditcard'],
        on_completed: function(payment) {
            alert('✅ تم الدفع بنجاح! رقم العملية: ' + payment.id);
            // هنا ترسل الإيميل لـ naseradmmhmd12@gmail.com
        },
        on_failed: function(error) {
            alert('❌ فشل الدفع: ' + error.message);
        }
    });
    
    // عرض النافذة
    document.getElementById('payment-product-image').src = product.image;
    document.getElementById('payment-product-name').textContent = product.name;
    document.getElementById('payment-price').textContent = product.price + ' ريال';
    document.getElementById('payment-modal').classList.add('active');
}

// إغلاق النافذة
function closePaymentModal() {
    document.getElementById('payment-modal').classList.remove('active');
}

// Auth بسيط
function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    
    localStorage.setItem('roblox_trades_current_user', JSON.stringify({
        username: username,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
    }));
    
    enterApp();
}

function enterApp() {
    document.getElementById('auth-section').classList.remove('active');
    document.getElementById('app-section').classList.add('active');
    
    const user = JSON.parse(localStorage.getItem('roblox_trades_current_user'));
    document.getElementById('user-name').textContent = user.username;
    document.getElementById('user-avatar').src = user.avatar;
    
    if (user.username === ADMIN_USERNAME) {
        document.getElementById('admin-fab').classList.remove('hidden');
    }
    
    loadProducts();
}

function logout() {
    localStorage.removeItem('roblox_trades_current_user');
    location.reload();
}

// عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    // جسيمات متحركة
    const container = document.getElementById('particles');
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 10 + 's';
        container.appendChild(p);
    }
    
    // تبديل التبويبات
    window.switchTab = function(tab) {
        document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
        document.getElementById('register-form').classList.toggle('hidden', tab !== 'register');
        document.querySelectorAll('.tab-btn').forEach((btn, i) => {
            btn.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'register'));
        });
    };
    
    // تسجيل الدخول التلقائي إذا موجود
    const currentUser = localStorage.getItem('roblox_trades_current_user');
    if (currentUser) {
        enterApp();
    }
});
                                                     
