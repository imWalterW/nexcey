// Admin Login System
document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
});

// Default credentials (you can change these)
const DEFAULT_CREDENTIALS = {
    username: 'admin',
    password: 'nexcey2025'
};

function initializeLogin() {
    setupLoginForm();
    setupPasswordToggle();
    checkExistingSession();
    setupKeyboardShortcuts();
}

function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    
    loginForm.addEventListener('submit', handleLogin);
    
    // Real-time validation
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', clearErrorMessage);
        input.addEventListener('focus', clearErrorMessage);
    });
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    const loginBtn = document.getElementById('login-btn');
    
    // Show loading state
    showLoading(loginBtn);
    
    // Simulate authentication delay (remove in production for instant login)
    setTimeout(() => {
        if (authenticateUser(username, password)) {
            handleSuccessfulLogin(rememberMe);
        } else {
            handleFailedLogin(loginBtn);
        }
    }, 1000);
}

function authenticateUser(username, password) {
    // Get custom credentials from localStorage if they exist
    const savedCredentials = getSavedCredentials();
    
    return (username === savedCredentials.username && password === savedCredentials.password);
}

function getSavedCredentials() {
    const saved = localStorage.getItem('nexcey-admin-credentials');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (error) {
            console.error('Error parsing saved credentials:', error);
        }
    }
    return DEFAULT_CREDENTIALS;
}

function handleSuccessfulLogin(rememberMe) {
    const sessionData = {
        authenticated: true,
        timestamp: Date.now(),
        rememberMe: rememberMe
    };
    
    // Store session
    if (rememberMe) {
        localStorage.setItem('nexcey-admin-session', JSON.stringify(sessionData));
    } else {
        sessionStorage.setItem('nexcey-admin-session', JSON.stringify(sessionData));
    }
    
    // Show success animation
    showSuccessAnimation();
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

function handleFailedLogin(loginBtn) {
    hideLoading(loginBtn);
    showErrorMessage('Invalid username or password');
    
    // Shake animation for the card
    const loginCard = document.querySelector('.login-card');
    loginCard.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
        loginCard.style.animation = '';
    }, 500);
    
    // Clear password field
    document.getElementById('password').value = '';
    document.getElementById('password').focus();
}

function showLoading(button) {
    button.classList.add('loading');
    button.innerHTML = '<div class="spinner"></div> Logging in...';
    button.disabled = true;
}

function hideLoading(button) {
    button.classList.remove('loading');
    button.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    button.disabled = false;
}

function showSuccessAnimation() {
    const loginBtn = document.getElementById('login-btn');
    loginBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
    loginBtn.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
    
    // Add success animation to the whole card
    const loginCard = document.querySelector('.login-card');
    loginCard.style.transform = 'scale(1.02)';
    loginCard.style.boxShadow = '0 25px 50px rgba(40, 167, 69, 0.3)';
}

function showErrorMessage(message) {
    const errorDiv = document.getElementById('error-message');
    const errorText = errorDiv.querySelector('span');
    
    errorText.textContent = message;
    errorDiv.style.display = 'flex';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

function clearErrorMessage() {
    const errorDiv = document.getElementById('error-message');
    errorDiv.style.display = 'none';
}

function setupPasswordToggle() {
    const toggleBtn = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');
    
    toggleBtn.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        // Update icon
        const icon = toggleBtn.querySelector('i');
        icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
    });
}

function checkExistingSession() {
    const sessionData = getSessionData();
    
    if (sessionData && sessionData.authenticated) {
        // Check if session is still valid (24 hours for remembered sessions, 2 hours for regular)
        const maxAge = sessionData.rememberMe ? 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000;
        const isValid = Date.now() - sessionData.timestamp < maxAge;
        
        if (isValid) {
            // Redirect to dashboard immediately
            window.location.href = 'dashboard.html';
        } else {
            // Clear expired session
            clearSession();
        }
    }
}

function getSessionData() {
    // Check both localStorage and sessionStorage
    let sessionData = localStorage.getItem('nexcey-admin-session');
    if (!sessionData) {
        sessionData = sessionStorage.getItem('nexcey-admin-session');
    }
    
    if (sessionData) {
        try {
            return JSON.parse(sessionData);
        } catch (error) {
            console.error('Error parsing session data:', error);
            clearSession();
        }
    }
    
    return null;
}

function clearSession() {
    localStorage.removeItem('nexcey-admin-session');
    sessionStorage.removeItem('nexcey-admin-session');
}

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Enter key to submit (when not focused on submit button)
        if (e.key === 'Enter' && e.target.tagName !== 'BUTTON') {
            e.preventDefault();
            document.getElementById('login-form').dispatchEvent(new Event('submit'));
        }
        
        // Escape key to clear form
        if (e.key === 'Escape') {
            clearForm();
        }
    });
}

function clearForm() {
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('remember-me').checked = false;
    clearErrorMessage();
    document.getElementById('username').focus();
}

// Utility function to update credentials (for use in dashboard)
function updateCredentials(newUsername, newPassword) {
    const credentials = {
        username: newUsername,
        password: newPassword
    };
    
    localStorage.setItem('nexcey-admin-credentials', JSON.stringify(credentials));
    return true;
}

// Function to check if user is authenticated (for use in dashboard)
function isAuthenticated() {
    const sessionData = getSessionData();
    
    if (!sessionData || !sessionData.authenticated) {
        return false;
    }
    
    // Check if session is still valid
    const maxAge = sessionData.rememberMe ? 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000;
    const isValid = Date.now() - sessionData.timestamp < maxAge;
    
    if (!isValid) {
        clearSession();
        return false;
    }
    
    return true;
}

// Auto-logout function
function autoLogout() {
    clearSession();
    window.location.href = 'index.html';
}

// Focus on username input when page loads
window.addEventListener('load', () => {
    document.getElementById('username').focus();
});

// Add some visual enhancements
document.addEventListener('DOMContentLoaded', () => {
    // Add floating animation to background elements
    createFloatingElements();
});

function createFloatingElements() {
    const container = document.querySelector('.login-container');
    
    // Create floating circles
    for (let i = 0; i < 5; i++) {
        const circle = document.createElement('div');
        circle.style.cssText = `
            position: fixed;
            width: ${Math.random() * 100 + 50}px;
            height: ${Math.random() * 100 + 50}px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            pointer-events: none;
            z-index: 0;
            animation: float ${Math.random() * 10 + 10}s ease-in-out infinite;
            top: ${Math.random() * 100}vh;
            left: ${Math.random() * 100}vw;
        `;
        
        document.body.appendChild(circle);
    }
}

// Export functions for use in dashboard
window.adminAuth = {
    isAuthenticated,
    autoLogout,
    updateCredentials,
    clearSession
};

console.log('🔐 Nexcey Admin Login System loaded successfully!');
console.log('Default credentials: admin / nexcey2025');
