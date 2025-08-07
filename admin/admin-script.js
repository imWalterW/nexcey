// Custom Admin Dashboard with CMS File Saving
console.log('🔧 Admin CMS Dashboard Loading...');

// GitHub Configuration - Update these with your details
const GITHUB_CONFIG = {
    username: 'imWalterW',    // Replace with your GitHub username
    repo: 'nexcey',             // Replace with your repo name
    token: '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'          // We'll generate this
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Content Loaded');
    initializeAdmin();
});

function initializeAdmin() {
    console.log('🎯 Initializing CMS Admin...');
    setupNavigation();
    setupFormHandlers();
    setupImageUploads();
    setupDynamicLists();
    loadExistingData();
    setupColorPicker();
    addLogoutButton();
    setupGitHubIntegration();
    console.log('✅ CMS Admin Initialized Successfully!');
}

// Navigation between sections (keeping your existing code)
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            item.classList.add('active');
            
            const sectionId = item.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// Form handlers with CMS integration
function setupFormHandlers() {
    const saveAllBtn = document.getElementById('save-all');
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', saveToFiles);
    }

    // Auto-save locally (for backup)
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('change', autoSaveLocal);
        input.addEventListener('blur', autoSaveLocal);
    });
}

// GitHub Integration Setup
function setupGitHubIntegration() {
    // Check if we need to setup GitHub token
    if (!localStorage.getItem('github-token')) {
        showGitHubSetup();
    }
}

function showGitHubSetup() {
    const setupHTML = `
        <div id="github-setup-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center;">
            <div style="background: white; padding: 2rem; border-radius: 15px; max-width: 500px; width: 90%;">
                <h3 style="color: var(--primary-color); margin-bottom: 1rem;">🔐 GitHub Integration Setup</h3>
                <p style="margin-bottom: 1.5rem;">To make your changes go live, we need a GitHub token:</p>
                
                <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                    <h4>📝 Steps:</h4>
                    <ol style="margin: 0.5rem 0 0 1.5rem;">
                        <li>Go to <a href="https://github.com/settings/tokens" target="_blank">GitHub Settings → Tokens</a></li>
                        <li>Click "Generate new token (classic)"</li>
                        <li>Give it a name like "Nexcey CMS"</li>
                        <li>Select "repo" permissions</li>
                        <li>Click "Generate token"</li>
                        <li>Copy the token and paste it below</li>
                    </ol>
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label>GitHub Username:</label>
                    <input type="text" id="github-username" placeholder="your-username" style="width: 100%; padding: 8px; margin-top: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 1rem;">
                    <label>Repository Name:</label>
                    <input type="text" id="github-repo" placeholder="your-repo-name" style="width: 100%; padding: 8px; margin-top: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <label>GitHub Token:</label>
                    <input type="password" id="github-token" placeholder="ghp_xxxxxxxxxxxx" style="width: 100%; padding: 8px; margin-top: 0.5rem; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div style="display: flex; gap: 1rem;">
                    <button onclick="saveGitHubConfig()" style="flex: 1; background: var(--primary-color); color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer;">Save Configuration</button>
                    <button onclick="skipGitHubSetup()" style="flex: 1; background: #6c757d; color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer;">Skip (Local Only)</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', setupHTML);
}

function saveGitHubConfig() {
    const username = document.getElementById('github-username').value.trim();
    const repo = document.getElementById('github-repo').value.trim();
    const token = document.getElementById('github-token').value.trim();
    
    if (!username || !repo || !token) {
        alert('Please fill in all fields');
        return;
    }
    
    // Save configuration
    localStorage.setItem('github-username', username);
    localStorage.setItem('github-repo', repo);
    localStorage.setItem('github-token', token);
    
    // Update global config
    GITHUB_CONFIG.username = username;
    GITHUB_CONFIG.repo = repo;
    GITHUB_CONFIG.token = token;
    
    // Remove setup modal
    document.getElementById('github-setup-modal').remove();
    
    showToast('GitHub integration configured! Your changes will now go live.', 'success');
}

function skipGitHubSetup() {
    document.getElementById('github-setup-modal').remove();
    showToast('Running in local mode. Changes won\'t go live until GitHub is configured.', 'warning');
}

// Save changes to actual files
async function saveToFiles() {
    const saveBtn = document.getElementById('save-all');
    const originalText = saveBtn.innerHTML;
    
    // Show loading state
    saveBtn.innerHTML = '<div class="spinner"></div> Saving to Website...';
    saveBtn.disabled = true;
    
    try {
        // Collect form data
        const formData = collectFormData();
        
        // Check if GitHub is configured
        const username = localStorage.getItem('github-username') || GITHUB_CONFIG.username;
        const repo = localStorage.getItem('github-repo') || GITHUB_CONFIG.repo;
        const token = localStorage.getItem('github-token') || GITHUB_CONFIG.token;
        
        if (username === 'YOUR_GITHUB_USERNAME' || !token) {
            // Save locally only
            localStorage.setItem('nexcey-admin-data', JSON.stringify(formData));
            showToast('Saved locally! Configure GitHub integration to make changes go live.', 'warning');
        } else {
            // Save to GitHub and update live website
            await saveToGitHub(formData, username, repo, token);
            
            // Also save locally as backup
            localStorage.setItem('nexcey-admin-data', JSON.stringify(formData));
            
            showToast('✅ Changes saved and deployed live!', 'success');
        }
        
    } catch (error) {
        console.error('Save error:', error);
        showToast('Error saving changes: ' + error.message, 'error');
    } finally {
        // Reset button
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }, 2000);
    }
}

// Save data directly to website files via GitHub API
async function saveToGitHub(formData, username, repo, token) {
    const files = prepareFilesForGitHub(formData);
    
    // Update each file
    for (const file of files) {
        await updateGitHubFile(file.path, file.content, username, repo, token);
    }
    
    // Trigger Netlify rebuild (if using Netlify)
    await triggerNetlifyRebuild();
}

function prepareFilesForGitHub(data) {
    const files = [];
    
    // Update index.html with new content
    const indexContent = generateUpdatedIndexHTML(data);
    files.push({
        path: 'index.html',
        content: indexContent
    });
    
    // Create CSS with new colors
    if (data['primary-color']) {
        const cssContent = generateUpdatedCSS(data['primary-color']);
        files.push({
            path: 'style.css',
            content: cssContent
        });
    }
    
    return files;
}

function generateUpdatedIndexHTML(data) {
    // This is a simplified version - you'd want to load your current index.html
    // and replace specific content sections
    
    return `<!-- This would be your full index.html with updated content -->
    <!-- Hero section -->
    <h1>${data['hero-title'] || 'Web Design that Drives Results'}</h1>
    <p>${data['hero-subtitle'] || 'Modern, responsive websites tailored to your brand.'}</p>
    
    <!-- About section -->  
    <h2>${data['about-title'] || 'About Nexcey'}</h2>
    <p>${data['about-text'] || 'Nexcey is a modern web design studio...'}</p>
    
    <!-- Contact info -->
    <span id="contact-email">${data['contact-email'] || 'info@nexcey.com'}</span>
    <span id="contact-phone">${data['contact-phone'] || '+94 72 445 2222'}</span>
    <span id="contact-address">${data['contact-address'] || '203, Somananda MW, Udahamulla, Panadura, Sri Lanka'}</span>
    
    <!-- And so on for all sections... -->`;
}

function generateUpdatedCSS(primaryColor) {
    return `:root {
        --primary-color: ${primaryColor};
        --primary-light: ${adjustBrightness(primaryColor, 40)};
        --primary-dark: ${adjustBrightness(primaryColor, -40)};
        /* ... rest of your CSS ... */
    }`;
}

async function updateGitHubFile(path, content, username, repo, token) {
    // First, get the current file SHA (required for updates)
    let sha = null;
    try {
        const getResponse = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (getResponse.ok) {
            const fileData = await getResponse.json();
            sha = fileData.sha;
        }
    } catch (error) {
        // File might not exist yet
    }
    
    // Update or create the file
    const updateResponse = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Update ${path} via Admin Dashboard`,
            content: btoa(unescape(encodeURIComponent(content))), // Base64 encode
            sha: sha // Include SHA if file exists
        })
    });
    
    if (!updateResponse.ok) {
        throw new Error(`Failed to update ${path}: ${updateResponse.statusText}`);
    }
}

async function triggerNetlifyRebuild() {
    // If you have Netlify build hooks, trigger a rebuild
    // This is optional - Netlify usually rebuilds automatically on GitHub changes
    try {
        const buildHookUrl = localStorage.getItem('netlify-build-hook');
        if (buildHookUrl) {
            await fetch(buildHookUrl, { method: 'POST' });
        }
    } catch (error) {
        console.log('Netlify rebuild trigger failed (this is usually okay)');
    }
}

// Keep all your existing functions (setupImageUploads, setupDynamicLists, etc.)
function setupImageUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', handleImageUpload);
    });
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        
        const preview = event.target.parentNode.querySelector('.image-preview');
        if (preview) {
            preview.style.backgroundImage = `url(${imageData})`;
            preview.classList.add('has-image');
            preview.textContent = '';
        }

        // TODO: Upload image to GitHub repository
        uploadImageToGitHub(file, event.target.id);
    };
    
    reader.readAsDataURL(file);
}

async function uploadImageToGitHub(file, inputId) {
    // This would upload the image file to your GitHub repository
    // Implementation depends on your file structure preferences
}

// Keep your existing dynamic list functions
function setupDynamicLists() {
    setupServicesManagement();
    setupPricingManagement();
    setupClientsManagement();
    setupTestimonialsManagement();
}

function setupServicesManagement() {
    const addServiceBtn = document.getElementById('add-service');
    if (addServiceBtn) {
        addServiceBtn.addEventListener('click', addNewService);
    }

    document.querySelectorAll('.service-item-admin .btn-danger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.service-item-admin').remove();
        });
    });
}

function addNewService() {
    const servicesList = document.querySelector('.services-list');
    const serviceTemplate = `
        <div class="service-item-admin">
            <input type="text" placeholder="Service Title" value="">
            <textarea placeholder="Service Description"></textarea>
            <button class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = serviceTemplate;
    const newService = tempDiv.firstElementChild;
    
    newService.querySelector('.btn-danger').addEventListener('click', (e) => {
        e.target.closest('.service-item-admin').remove();
    });
    
    servicesList.appendChild(newService);
}

// Include all your other existing functions...
// (setupPricingManagement, setupClientsManagement, setupTestimonialsManagement, etc.)

function collectFormData() {
    const data = {};
    
    // Collect all form inputs
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.type === 'file') return;
        
        const id = input.id || input.name;
        if (id) {
            if (input.type === 'checkbox') {
                data[id] = input.checked;
            } else {
                data[id] = input.value;
            }
        }
    });
    
    // Collect services, pricing, clients, testimonials
    // (Your existing collection logic)
    
    return data;
}

function autoSaveLocal() {
    const formData = collectFormData();
    localStorage.setItem('nexcey-admin-data', JSON.stringify(formData));
}

function loadExistingData() {
    const savedData = localStorage.getItem('nexcey-admin-data');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            populateFormData(data);
        } catch (error) {
            console.error('Error loading saved data:', error);
        }
    }
}

function populateFormData(data) {
    Object.keys(data).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = data[key];
            } else {
                element.value = data[key];
            }
        }
    });
    
    if (data['primary-color']) {
        updatePreviewColor(data['primary-color']);
    }
}

// Keep all your existing utility functions
function setupColorPicker() {
    const colorPicker = document.getElementById('primary-color');
    if (colorPicker) {
        colorPicker.addEventListener('change', (e) => {
            const newColor = e.target.value;
            updatePreviewColor(newColor);
        });
    }
}

function updatePreviewColor(color) {
    document.documentElement.style.setProperty('--primary-color', color);
    
    const primaryLight = adjustBrightness(color, 40);
    const primaryDark = adjustBrightness(color, -40);
    
    document.documentElement.style.setProperty('--primary-light', primaryLight);
    document.documentElement.style.setProperty('--primary-dark', primaryDark);
}

function adjustBrightness(hex, percent) {
    hex = hex.replace('#', '');
    const num = parseInt(hex, 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    const toastContent = toast.querySelector('.toast-content span');
    const toastIcon = toast.querySelector('.toast-content i');
    
    toastContent.textContent = message;
    
    toast.className = `toast ${type}`;
    switch (type) {
        case 'success':
            toastIcon.className = 'fas fa-check-circle';
            break;
        case 'error':
            toastIcon.className = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            toastIcon.className = 'fas fa-exclamation-triangle';
            break;
        default:
            toastIcon.className = 'fas fa-info-circle';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 5000);
}

function addLogoutButton() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;
    
    const logoutBtn = document.createElement('button');
    logoutBtn.className = 'btn btn-danger';
    logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('nexcey-admin-session');
            sessionStorage.removeItem('nexcey-admin-session');
            window.location.href = 'index.html';
        }
    });
    headerActions.appendChild(logoutBtn);
}

console.log('✅ Nexcey CMS Admin Dashboard loaded successfully!');
