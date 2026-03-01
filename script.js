// ============================================
// CONFIGURATION - الإعدادات
// ============================================

// اسم المستخدم الأدمن (أنت)
const ADMIN_USERNAME = 'naserdel123';

// إعدادات Moyasar (الدفع الحقيقي)
const MOYASAR_CONFIG = {
    // مفتاح النشر (Public Key) - المفتاح الحقيقي
    publishable_api_key: 'pk_live_uMadyRRfpzd5PsvGgLBeCHLHbyHs5tH9Z43Ax3g7',
    
    // رابط callback بعد الدفع - غير هذا لرابط موقعك
    callback_url: 'https://yourdomain.com/success',
    
    // الإيميل الخاص بك لاستلام الإشعارات
    admin_email: 'naseradmmhmd12@gmail.com'
};

// ============================================
// LocalStorage Management
// ============================================

const Storage = {
    getUsers: () => JSON.parse(localStorage.getItem('roblox_trades_users') || '[]'),
    saveUser: (user) => {
        const users = Storage.getUsers();
        if (!users.find(u => u.username === user.username)) {
            users.push(user);
            localStorage.setItem('roblox_trades_users', JSON.stringify(users));
        }
    },
    getProducts: () => JSON.parse(localStorage.getItem('roblox_trades_products') || '[]'),
    saveProduct: (product) => {
        const products = Storage.getProducts();
        products.unshift(product);
        localStorage.setItem('roblox_trades_products', JSON.stringify(products));
    },
    getCurrentUser: () => JSON.parse(localStorage.getItem('roblox_trades_current_user')),
    setCurrentUser: (user) => localStorage.setItem('roblox_trades_current_user', JSON.stringify(user)),
    logout: () => localStorage.removeItem('roblox_trades_current_user'),
    
    savePendingOrder: (order) => {
        const orders = JSON.parse(localStorage.getItem('roblox_trades_pending') || '[]');
        orders.push(order);
        localStorage.setItem('roblox_trades_pending', JSON.stringify(orders));
    },
    
    saveCompletedOrder: (order) => {
        const orders = JSON.parse(localStorage.getItem('roblox_trades_completed') || '[]');
        orders.push(order);
        localStorage.setItem('roblox_trades_completed', JSON.stringify(orders));
        notifyAdmin(order);
    }
};

// ============================================
// Notification System
// ============================================

function notifyAdmin(order) {
    console.log('📧 طلب جديد:', order);
    
    const templateParams = {
        to_email: MOYASAR_CONFIG.admin_email,
        product_name: order.productName,
        price: order.price + ' ريال',
        roblox_username: order.robloxUsername,
        order_id: order.id,
        order_date: new Date().toLocaleString('ar-SA'),
        payment_id: order.paymentId || 'N/A'
    };
    
    console.log('📧 سيتم إرسال إيميل إلى:', MOYASAR_CONFIG.admin_email);
    console.log('📧 تفاصيل الطلب:', templateParams);
    
    alert(`✅ تم إرسال طلبك!\n\nالمنتج: ${order.productName}\nالسعر: ${order.price} ريال\n\nسيتم التواصل معك خلال 24 ساعة على الإيميل: ${MOYASAR_CONFIG.admin_email}`);
}

// ============================================
// UI Functions
// ============================================

function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
}

function switchTab(tab) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const tabs = document.querySelectorAll('.tab-btn');
    
    tabs.forEach(t => t.classList.remove('active'));
    
    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        tabs[0].classList.add('active');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        tabs[1].classList.add('active');
    }
    
    document.getElementById('login-error').classList.remove('show');
    document.getElementById('register-error').classList.remove('show');
}

function previewAvatar(input) {
    const preview = document.getElementById('avatar-preview');
    const label = document.querySelector('.avatar-label');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.classList.add('show');
            label.style.display = 'none';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    const label = input.parentElement.querySelector('.upload-label');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.classList.add('show');
            label.style.display = 'none';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ============================================
// Auth Functions
// ============================================

function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const avatarInput = document.getElementById('reg-avatar');
    const errorDiv = document.getElementById('register-error');
    
    if (username.length < 3) {
        errorDiv.textContent = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
        errorDiv.classList.add('show');
        return;
    }
    
    if (password.length < 6) {
        errorDiv.textContent = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
        errorDiv.classList.add('show');
        return;
    }
    
    const users = Storage.getUsers();
    if (users.find(u => u.username === username)) {
        errorDiv.textContent = 'اسم المستخدم موجود مسبقاً';
        errorDiv.classList.add('show');
        return;
    }
    
    let avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    if (avatarInput.files && avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            avatar = e.target.result;
            saveAndLogin(username, password, avatar);
        };
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        saveAndLogin(username, password, avatar);
    }
}

function saveAndLogin(username, password, avatar) {
    const newUser = {
        id: Date.now(),
        username: username,
        password: password,
        avatar: avatar
    };
    
    Storage.saveUser(newUser);
    Storage.setCurrentUser(newUser);
    enterApp(newUser);
}

function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const errorDiv = document.getElementById('login-error');
    
    const users = Storage.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        Storage.setCurrentUser(user);
        enterApp(user);
    } else {
        errorDiv.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        errorDiv.classList.add('show');
    }
}

function enterApp(user) {
    document.getElementById('auth-section').classList.remove('active');
    document.getElementById('app-section').classList.add('active');
    
    document.getElementById('user-name').textContent = user.username;
    document.getElementById('user-avatar').src = user.avatar;
    
    if (user.username === ADMIN_USERNAME) {
        document.getElementById('admin-fab').classList.remove('hidden');
    } else {
        document.getElementById('admin-fab').classList.add('hidden');
    }
    
    loadProducts();
}

// ============================================
// Product Functions
// ============================================

function loadProducts() {
    const products = Storage.getProducts();
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
            <img src="${product.image}" alt="${product.name}">
            <div class="price-tag">${product.price} ريال</div>
        </div>
        <div class="product-body">
            <h4 class="product-name">${product.name}</h4>
            <div class="delivery-method">
                <span class="icon">${deliveryIcons[product.deliveryMethod]}</span>
                <span>${deliveryTexts[product.deliveryMethod]}</span>
            </div>
            <button class="buy-btn" onclick="initiatePayment(${product.id})">شراء الآن</button>
        </div>
    `;
    
    return div;
}

function openModal() {
    document.getElementById('product-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('product-modal').classList.remove('active');
    document.body.style.overflow = '';
    
    document.getElementById('product-form').reset();
    document.getElementById('product-preview').classList.remove('show');
    document.querySelector('#product-form .upload-label').style.display = 'block';
}

function createProduct(e) {
    e.preventDefault();
    
    const currentUser = Storage.getCurrentUser();
    if (!currentUser || currentUser.username !== ADMIN_USERNAME) {
        alert('غير مصرح لك بإضافة منتجات');
        return;
    }
    
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const deliveryMethod = document.getElementById('delivery-method').value;
    const imageInput = document.getElementById('product-image');
    
    if (!imageInput.files || !imageInput.files[0]) {
        alert('يرجى اختيار صورة المنتج');
        document.querySelector('#product-form .upload-box').classList.add('error');
        setTimeout(() => {
            document.querySelector('#product-form .upload-box').classList.remove('error');
        }, 1000);
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const newProduct = {
            id: Date.now(),
            name: name,
            price: parseFloat(price),
            deliveryMethod: deliveryMethod,
            image: e.target.result,
            createdAt: new Date().toISOString()
        };
        
        Storage.saveProduct(newProduct);
        closeModal();
        loadProducts();
    };
    reader.readAsDataURL(imageInput.files[0]);
}

// ============================================
// PAYMENT SYSTEM - MOYASAR (الدفع الحقيقي)
// ============================================

let currentProduct = null;
let currentPaymentId = null;

function initiatePayment(productId) {
    const products = Storage.getProducts();
    currentProduct = products.find(p => p.id === productId);
    
    if (!currentProduct) return;
    
    document.getElementById('payment-product-image').src = currentProduct.image;
    document.getElementById('payment-product-name').textContent = currentProduct.name;
    document.getElementById('payment-price').textContent = currentProduct.price + ' ريال';
    
    document.getElementById('payment-modal').classList.add('active');
    
    initializeMoyasarForm(currentProduct);
}

function initializeMoyasarForm(product) {
    const container = document.querySelector('.mysr-form');
    container.innerHTML = '';
    
    const amountInHalalas = product.price * 100;
    
    Moyasar.init({
        element: '.mysr-form',
        amount: amountInHalalas,
        currency: 'SAR',
        description: `شراء ${product.name} - تريدات روبلوكس`,
        publishable_api_key: MOYASAR_CONFIG.publishable_api_key,
        callback_url: MOYASAR_CONFIG.callback_url,
        methods: ['creditcard'],
        
        on_completed: function(payment) {
            handleSuccessfulPayment(payment);
        },
        
        on_failed: function(error) {
            handleFailedPayment(error);
        }
    });
}

function handleSuccessfulPayment(payment) {
    console.log('✅ تم الدفع بنجاح:', payment);
    
    currentPaymentId = payment.id;
    
    const pendingOrder = {
        id: Date.now(),
        productId: currentProduct.id,
        productName: currentProduct.name,
        price: currentProduct.price,
        paymentId: payment.id,
        paymentStatus: 'completed',
        createdAt: new Date().toISOString()
    };
    
    Storage.savePendingOrder(pendingOrder);
    
    closePaymentModal();
    openRobloxModal();
}

function handleFailedPayment(error) {
    console.error('❌ فشل الدفع:', error);
    alert('❌ فشلت عملية الدفع. يرجى المحاولة مرة أخرى.');
}

function closePaymentModal() {
    document.getElementById('payment-modal').classList.remove('active');
    const container = document.querySelector('.mysr-form');
    if (container) container.innerHTML = '';
}

// ============================================
// Roblox Username Modal
// ============================================

function openRobloxModal() {
    document.getElementById('roblox-modal').classList.add('active');
}

function closeRobloxModal() {
    document.getElementById('roblox-modal').classList.remove('active');
    document.getElementById('roblox-form').reset();
}

function submitRobloxName(e) {
    e.preventDefault();
    
    const robloxUsername = document.getElementById('roblox-username').value;
    
    if (!currentProduct) return;
    
    const finalOrder = {
        id: Date.now(),
        productId: currentProduct.id,
        productName: currentProduct.name,
        price: currentProduct.price,
        robloxUsername: robloxUsername,
        paymentId: currentPaymentId,
        paymentStatus: 'completed',
        status: 'pending_delivery',
        createdAt: new Date().toISOString(),
        adminEmail: MOYASAR_CONFIG.admin_email
    };
    
    Storage.saveCompletedOrder(finalOrder);
    
    closeRobloxModal();
    currentProduct = null;
    currentPaymentId = null;
}

// ============================================
// Logout
// ============================================

function logout() {
    Storage.logout();
    document.getElementById('app-section').classList.remove('active');
    document.getElementById('auth-section').classList.add('active');
    
    document.getElementById('login-form').reset();
    document.getElementById('register-form').reset();
    document.getElementById('avatar-preview').classList.remove('show');
    document.querySelector('.avatar-label').style.display = 'block';
}

// ============================================
// Event Listeners
// ============================================

document.getElementById('product-modal').addEventListener('click', function(e) {
    if (e.target === this) closeModal();
});

document.getElementById('payment-modal').addEventListener('click', function(e) {
    if (e.target === this) closePaymentModal();
});

document.getElementById('roblox-modal').addEventListener('click', function(e) {
    if (e.target === this) closeRobloxModal();
});

document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    
    const currentUser = Storage.getCurrentUser();
    if (currentUser) {
        enterApp(currentUser);
    }
});
