// LocalStorage Management
const Storage = {
    getUsers: () => JSON.parse(localStorage.getItem('roblox_trades_users') || '[]'),
    saveUser: (user) => {
        const users = Storage.getUsers();
        if (!users.find(u => u.username === user.username)) {
            users.push(user);
            localStorage.setItem('roblox_trades_users', JSON.stringify(users));
        }
    },
    getPosts: () => JSON.parse(localStorage.getItem('roblox_trades_posts') || '[]'),
    savePost: (post) => {
        const posts = Storage.getPosts();
        posts.unshift(post);
        localStorage.setItem('roblox_trades_posts', JSON.stringify(posts));
    },
    getCurrentUser: () => JSON.parse(localStorage.getItem('roblox_trades_current_user')),
    setCurrentUser: (user) => localStorage.setItem('roblox_trades_current_user', JSON.stringify(user)),
    logout: () => localStorage.removeItem('roblox_trades_current_user')
};

// Initialize Particles
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

// Tab Switching
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
    
    // Clear errors
    document.getElementById('login-error').classList.remove('show');
    document.getElementById('register-error').classList.remove('show');
}

// Avatar Preview
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

// Image Preview for Trade
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

// Handle Register
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

// Handle Login
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

// Enter Application
function enterApp(user) {
    document.getElementById('auth-section').classList.remove('active');
    document.getElementById('app-section').classList.add('active');
    
    document.getElementById('user-name').textContent = user.username;
    document.getElementById('user-avatar').src = user.avatar;
    
    loadTrades();
}

// Load Trades
function loadTrades() {
    const posts = Storage.getPosts();
    const grid = document.getElementById('trades-grid');
    const emptyState = document.getElementById('empty-state');
    
    grid.innerHTML = '';
    
    if (posts.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    posts.forEach((post, index) => {
        const card = createTradeCard(post, index);
        grid.appendChild(card);
    });
}

// Create Trade Card HTML
function createTradeCard(post, index) {
    const div = document.createElement('div');
    div.className = 'trade-card';
    div.style.animationDelay = (index * 0.1) + 's';
    
    const date = new Date(post.createdAt).toLocaleDateString('ar-SA');
    
    let tradeImageHtml = '';
    if (post.tradeImage) {
        tradeImageHtml = `<img src="${post.tradeImage}" class="trade-image-small" alt="المقابل">`;
    }
    
    let tiktokHtml = '';
    if (post.tiktokLink) {
        tiktokHtml = `<a href="${post.tiktokLink}" target="_blank" class="tiktok-btn" title="TikTok">🎵</a>`;
    }
    
    div.innerHTML = `
        <div class="card-header">
            <img src="${post.userAvatar}" alt="${post.username}">
            <div class="user-info-text">
                <div class="username">${post.username}</div>
                <div class="date">${date}</div>
            </div>
            ${tiktokHtml}
        </div>
        <div class="card-image">
            <img src="${post.itemImage}" alt="${post.itemName}">
            <span class="badge">متاح للتبادل</span>
        </div>
        <div class="card-body">
            <h4 class="item-name">${post.itemName}</h4>
            <div class="trade-info">
                <span class="label">المقابل:</span>
                <span class="value">${post.tradeFor}</span>
            </div>
            ${tradeImageHtml}
            <button class="view-btn">عرض التفاصيل</button>
        </div>
    `;
    
    return div;
}

// Modal Functions
function openModal() {
    document.getElementById('trade-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('trade-modal').classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    document.getElementById('trade-form').reset();
    document.getElementById('item-preview').classList.remove('show');
    document.getElementById('trade-preview').classList.remove('show');
    document.querySelectorAll('.upload-label').forEach(l => l.style.display = 'block');
}

// Create Trade
function createTrade(e) {
    e.preventDefault();
    
    const currentUser = Storage.getCurrentUser();
    if (!currentUser) return;
    
    const itemName = document.getElementById('item-name').value;
    const tradeFor = document.getElementById('trade-for').value;
    const tiktokLink = document.getElementById('tiktok-link').value;
    const itemImageInput = document.getElementById('item-image');
    const tradeImageInput = document.getElementById('trade-image');
    
    const processTrade = (itemImage, tradeImage) => {
        const newPost = {
            id: Date.now(),
            userId: currentUser.id,
            username: currentUser.username,
            userAvatar: currentUser.avatar,
            itemName: itemName,
            itemImage: itemImage,
            tradeFor: tradeFor,
            tradeImage: tradeImage,
            tiktokLink: tiktokLink,
            createdAt: new Date().toISOString()
        };
        
        Storage.savePost(newPost);
        closeModal();
        loadTrades();
    };
    
    // Read images
    if (itemImageInput.files && itemImageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const itemImage = e.target.result;
            
            if (tradeImageInput.files && tradeImageInput.files[0]) {
                const tradeReader = new FileReader();
                tradeReader.onload = function(e2) {
                    processTrade(itemImage, e2.target.result);
                };
                tradeReader.readAsDataURL(tradeImageInput.files[0]);
            } else {
                processTrade(itemImage, null);
            }
        };
        reader.readAsDataURL(itemImageInput.files[0]);
    }
}

// Logout
function logout() {
    Storage.logout();
    document.getElementById('app-section').classList.remove('active');
    document.getElementById('auth-section').classList.add('active');
    
    // Clear forms
    document.getElementById('login-form').reset();
    document.getElementById('register-form').reset();
    document.getElementById('avatar-preview').classList.remove('show');
    document.querySelector('.avatar-label').style.display = 'block';
}

// Close modal on outside click
document.getElementById('trade-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

// Check auth on load
document.addEventListener('DOMContentLoaded', function() {
    createParticles();
    
    const currentUser = Storage.getCurrentUser();
    if (currentUser) {
        enterApp(currentUser);
    }
});
