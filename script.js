// ============================================
// CONFIGURATION
// ============================================

const ADMIN_USERNAME = 'naserdel123';
const MOYASAR_CONFIG = {
    publishable_api_key: 'pk_live_uMadyRRfpzd5PsvGgLBeCHLHbyHs5tH9Z43Ax3g7',
    callback_url: window.location.href,
    admin_email: 'naseradmmhmd12@gmail.com'
};

// ============================================
// Storage
// ============================================

const Storage = {
    getUsers: function() {
        return JSON.parse(localStorage.getItem('roblox_trades_users') || '[]');
    },
    
    saveUser: function(user) {
        const users = this.getUsers();
        if (!users.find(function(u) { return u.username === user.username; })) {
            users.push(user);
            localStorage.setItem('roblox_trades_users', JSON.stringify(users));
        }
    },
    
    getProducts: function() {
        return JSON.parse(localStorage.getItem('roblox_trades_products') || '[]');
    },
    
    saveProduct: function(product) {
        const products = this.getProducts();
        products.unshift(product);
        localStorage.setItem('roblox_trades_products', JSON.stringify(products));
    },
    
    getCurrentUser: function() {
        return JSON.parse(localStorage.getItem('roblox_trades_current_user'));
    },
    
    setCurrentUser: function(user) {
        localStorage.setItem('roblox_trades_current_user', JSON.stringify(user));
    },
    
    logout: function() {
        localStorage.removeItem('roblox_trades_current_user');
    },
    
    saveOrder: function(order) {
        const orders = JSON.parse(localStorage.getItem('roblox_trades_orders') || '[]');
        orders.push(order);
        localStorage.setItem('roblox_trades_orders', JSON.stringify(orders));
    }
};

// ============================================
// Default Products
// ============================================

const defaultProducts = [
    {
        id: 1,
        name: 'Dominus Infernus',
        price: 150,
        deliveryMethod: 'trade',
        image: 'https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Dominus+Infernus',
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        name: 'Golden Crown',
        price: 75,
        deliveryMethod: 'gift',
        image: 'https://via.placeholder.com/400x400/f59e0b/ffffff?text=Golden+Crown',
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        name: 'Dark Matter Gun',
        price: 200,
        deliveryMethod: 'group',
        image: 'https://via.placeholder.com/400x400/3b82f6/ffffff?text=Dark+Matter+Gun',
        createdAt: new Date().toISOString()
    }
];

// ============================================
// UI Functions
// ============================================

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    for (let i = 0; i < 20; i++) {
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
    
    if (!loginForm || !registerForm) return;
    
    if (tab === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    } else {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    }
    
    tabs.forEach(function(btn, index) {
        btn.classList.toggle('active', (index === 0 && tab === 'login') || (index === 1 && tab === 'register'));
    });
    
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');
    if (loginError) loginError.classList.remove('show');
    if (registerError) registerError.classList.remove('show');
}

function previewAvatar(input) {
    const preview = document.getElementById('avatar-preview');
    const label = document.querySelector('.avatar-label');
    
    if (!preview || !label) return;
    
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
    if (!preview) return;
    
    const label = input.parentElement.querySelector('.upload-label');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.src = e.target.result;
            preview.classList.add('show');
            if (label) label.style.display = 'none';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ============================================
// Auth Functions
// ============================================

function handleLogin(e) {
    e.preventDefault();
    
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const errorDiv = document.getElementById('login-error');
    
    if (!usernameInput || !passwordInput) return;
    
    const username = usernameInput.value;
    const password = passwordInput.value;
    
    const users = Storage.getUsers();
    const user = users.find(function(u) {
        return u.username === username && u.password === password;
    });
    
    if (user) {
        Storage.setCurrentUser(user);
        enterApp();
    } else {
        if (errorDiv) {
            errorDiv.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
            errorDiv.classList.add('show');
        }
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const usernameInput = document.getElementById('reg-username');
    const passwordInput = document.getElementById('reg-password');
    const avatarInput = document.getElementById('reg-avatar');
    const errorDiv = document.getElementById('register-error');
    
    if (!usernameInput || !passwordInput) return;
    
    const username = usernameInput.value;
    const password = passwordInput.value;
    
    if (errorDiv) errorDiv.classList.remove('show');
    
    if (username.length < 3) {
        if (errorDiv) {
            errorDiv.textContent = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
            errorDiv.classList.add('show');
        }
        return;
    }
    
    if (password.length < 6) {
        if (errorDiv) {
            errorDiv.textContent = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
            errorDiv.classList.add('show');
        }
        return;
    }
    
    const users = Storage.getUsers();
    if (users.find(function(u) { return u.username === username; })) {
        if (errorDiv) {
            errorDiv.textContent = 'اسم المستخدم موجود مسبقاً';
            errorDiv.classList.add('show');
        }
        return;
    }
    
    let avatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + username;
    
    if (avatarInput && avatarInput.files && avatarInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            avatar = e.target.result;
            const newUser = {
                id: Date.now(),
                username: username,
                password: password,
                avatar: avatar
            };
            Storage.saveUser(newUser);
            Storage.setCurrentUser(newUser);
            enterApp();
        };
        reader.readAsDataURL(avatarInput.files[0]);
    } else {
        const newUser = {
            id: Date.now(),
            username: username,
            password: password,
            avatar: avatar
        };
        Storage.saveUser(newUser);
        Storage.setCurrentUser(newUser);
        enterApp();
    }
}

function enterApp() {
    const authSection = document.getElementById('auth-section');
    const appSection = document.getElementById('app-section');
    const userNameEl = document.getElementById('user-name');
    const userAvatarEl = document.getElementById('user-avatar');
    const adminFab = document.getElementById('admin-fab');
    
    if (authSection) authSection.classList.remove('active');
    if (appSection) appSection.classList.add('active');
    
    const user = Storage.getCurrentUser();
    if (!user) return;
    
    if (userNameEl) userNameEl.textContent = user.username;
    if (userAvatarEl) userAvatarEl.src = user.avatar;
    
    if (adminFab) {
        if (user.username === ADMIN_USERNAME) {
            adminFab.classList.remove('hidden');
        } else {
            adminFab.classList.add('hidden');
        }
    }
    
    loadProducts();
}

function logout() {
    Storage.logout();
    location.reload();
}

// ============================================
// Product Functions
// ============================================

function loadProducts() {
    let products = Storage.getProducts();
    const grid = document.getElementById('products-grid');
    const emptyState = document.getElementById('empty-state');
    
    if (products.length === 0) {
        products = defaultProducts;
        localStorage.setItem('roblox_trades_products', JSON.stringify(products));
    }
    
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (products.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    
    if (emptyState) emptyState.classList.add('hidden');
    
    products.forEach(function(product, index) {
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
    
    const icon = deliveryIcons[product.deliveryMethod] || '🔄';
    const text = deliveryTexts[product.deliveryMethod] || 'تريد';
    
    div.innerHTML = [
        '<div class="product-image">',
        '    <img src="' + product.image + '" alt="' + product.name + '" onerror="this.src=\'https://via.placeholder.com/400x400/8b5cf6/ffffff?text=' + encodeURIComponent(product.name) + '\'">',
        '    <div class="price-tag">' + product.price + ' ريال</div>',
        '</div>',
        '<div class="product-body">',
        '    <h4 class="product-name">' + product.name + '</h4>',
        '    <div class="delivery-method">',
        '        <span class="icon">' + icon + '</span>',
        '        <span>' + text + '</span>',
        '    </div>',
        '    <button class="buy-btn" onclick="initiatePayment(' + product.id + ')">شراء الآن</button>',
        '</div>'
    ].join('');
    
    return div;
}

function openModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    const form = document.getElementById('product-form');
    const preview = document.getElementById('product-preview');
    const label = document.querySelector('#product-form .upload-label');
    
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (form) form.reset();
    if (preview) {
        preview.src = '';
        preview.classList.remove('show');
    }
    if (label) label.style.display = 'block';
}

function createProduct(e) {
    e.preventDefault();
    
    const currentUser = Storage.getCurrentUser();
    if (!currentUser || currentUser.username !== ADMIN_USERNAME) {
        alert('غير مصرح لك بإضافة منتجات');
        return;
    }
    
    const nameInput = document.getElementById('product-name');
    const priceInput = document.getElementById('product-price');
    const deliveryInput = document.getElementById('delivery-method');
    const imageInput = document.getElementById('product-image');
    
    if (!nameInput || !priceInput || !deliveryInput || !imageInput) return;
    
    const name = nameInput.value;
    const price = parseFloat(priceInput.value);
    const deliveryMethod = deliveryInput.value;
    
    if (!imageInput.files || !imageInput.files[0]) {
        alert('يرجى اختيار صورة المنتج');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const newProduct = {
            id: Date.now(),
            name: name,
            price: price,
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
// Payment Functions
// ============================================

let currentProduct = null;
let currentPaymentId = null;

function initiatePayment(productId) {
    const products = Storage.getProducts();
    currentProduct = products.find(function(p) { return p.id === productId; });
    
    if (!currentProduct) return;
    
    const paymentImage = document.getElementById('payment-product-image');
    const paymentName = document.getElementById('payment-product-name');
    const paymentPrice = document.getElementById('payment-price');
    const modal = document.getElementById('payment-modal');
    
    if (paymentImage) paymentImage.src = currentProduct.image;
    if (paymentName) paymentName.textContent = currentProduct.name;
    if (paymentPrice) paymentPrice.textContent = currentProduct.price + ' ريال';
    
    if (modal) {
        modal.classList.add('active');
        initializeMoyasarForm(currentProduct);
    }
}

function initializeMoyasarForm(product) {
    const container = document.querySelector('.mysr-form');
    if (!container) return;
    
    container.innerHTML = '';
    
    const amountInHalalas = Math.round(product.price * 100);
    
    try {
        Moyasar.init({
            element: '.mysr-form',
            amount: amountInHalalas,
            currency: 'SAR',
            description: 'شراء ' + product.name + ' - تريدات روبلوكس',
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
    } catch (err) {
        console.error('Moyasar init error:', err);
        container.innerHTML = '<p style="color: #ef4444; text-align: center;">حدث خطأ في تحميل نموذج الدفع</p>';
    }
}

function handleSuccessfulPayment(payment) {
    console.log('Payment success:', payment);
    
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
    
    Storage.saveOrder(pendingOrder);
    closePaymentModal();
    openRobloxModal();
}

function handleFailedPayment(error) {
    console.error('Payment failed:', error);
    alert('❌ فشلت عملية الدفع. يرجى المحاولة مرة أخرى.');
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    const container = document.querySelector('.mysr-form');
    
    if (modal) modal.classList.remove('active');
    if (container) container.innerHTML = '';
}

// ============================================
// Roblox Modal Functions
// ============================================

function openRobloxModal() {
    const modal = document.getElementById('roblox-modal');
    if (modal) modal.classList.add('active');
}

function closeRobloxModal() {
    const modal = document.getElementById('roblox-modal');
    const form = document.getElementById('roblox-form');
    
    if (modal) modal.classList.remove('active');
    if (form) form.reset();
}

function submitRobloxName(e) {
    e.preventDefault();
    
    const usernameInput = document.getElementById('roblox-username');
    if (!usernameInput) return;
    
    const robloxUsername = usernameInput.value;
    
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
        createdAt: new Date().toISOString()
    };
    
    Storage.saveOrder(finalOrder);
    
    alert('✅ تم إرسال طلبك بنجاح!\n\nالمنتج: ' + currentProduct.name + '\nسيتم التواصل معك خلال 24 ساعة');
    
    closeRobloxModal();
    currentProduct = null;
    currentPaymentId = null;
}

// ============================================
// Event Listeners
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    
    // Modal close on outside click
    document.querySelectorAll('.modal').forEach(function(modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                if (this.id === 'product-modal') closeModal();
                else if (this.id === 'payment-modal') closePaymentModal();
                else if (this.id === 'roblox-modal') closeRobloxModal();
            }
        });
    });
    
    // Check for existing session
    const currentUser = Storage.getCurrentUser();
    if (currentUser) {
        enterApp();
    }
});
                                 
