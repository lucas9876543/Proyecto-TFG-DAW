const USERS_KEY = 'pokedex-users';

function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Login
document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        alert('Usuario o contraseña incorrectos');
    }
});

// Register
document.getElementById('register-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    const users = getUsers();
    if (users.some(u => u.username === username)) {
        alert('El usuario ya existe');
        return;
    }
    
    const newUser = { username, password };
    users.push(newUser);
    saveUsers(users);
    
    alert('Registro exitoso. Por favor inicia sesión.');
    window.location.href = 'login.html';
});

// Check if user is logged in
function checkAuth() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
        window.location.href = 'login.html';
    }
}

// Logout
function logout() {
    localStorage.removeItem('pokemon-favorites');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Update header with user info
function updateHeader() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const searchContainer = document.querySelector('.search-container');
        const userBtn = document.createElement('div');
        userBtn.className = 'user-menu';
        userBtn.innerHTML = `
            <button id="user-btn">${currentUser.username}</button>
            <div class="dropdown-content">
                <a href="#" id="logout-btn">Cerrar sesión</a>
            </div>
        `;
        searchContainer.appendChild(userBtn);
        
        document.getElementById('user-btn').addEventListener('click', function(e) {
            e.stopPropagation();
            document.querySelector('.dropdown-content').classList.toggle('show');
        });
        
        document.getElementById('logout-btn').addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
}

// Close dropdown when clicking outside
window.addEventListener('click', function() {
    const dropdown = document.querySelector('.dropdown-content');
    if (dropdown?.classList.contains('show')) {
        dropdown.classList.remove('show');
    }
});

// Initialize auth
checkAuth();