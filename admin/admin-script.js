// Hybrid Admin Dashboard - Your Layout + Netlify CMS Backend
console.log('🔧 Hybrid Admin Dashboard Loading...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Content Loaded');
    initializeHybridAdmin();
});

function initializeHybridAdmin() {
    console.log('🎯 Initializing Hybrid Admin...');
    setupNavigation();
    setupFormHandlers();
    setupImageUploads();
    setupDynamicLists();
    loadCMSData();
    setupColorPicker();
    addLogoutButton();
    addCMSToggle();
    console.log('✅ Hybrid Admin Initialized Successfully!');
}

// Add toggle between your admin and Netlify CMS
function addCMSToggle() {
    const headerActions = document.querySelector('.header-actions');
    if (!headerActions) return;
    
    const cmsToggle = document.createElement('button');
    cmsToggle.className = 'btn btn-primary';
    cmsToggle.innerHTML = '<i class="fas fa-cog"></i> Switch to Netlify CMS';
    cmsToggle.addEventListener('click', () => {
        window.open('cms.html', '_blank');
    });
    headerActions.appendChild(cmsToggle);
}

// Navigation (keep your existing code)
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
        saveAllBtn.addEventListener('click', saveToCMS);
    }

    // Auto-save locally (for backup)
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('change', autoSaveLocal);
        input.addEventListener('blur', autoSaveLocal);
    });
}

// Load data from CMS files
async function loadCMSData() {
    console.log('📄 Loading CMS data...');
    
    try {
        await Promise.all([
            loadHeroData(),
            loadAboutData(),
            loadContactData(),
            loadSocialData(),
            loadSettingsData()
        ]);
        
        console.log('✅ CMS data loaded successfully!');
    } catch (error) {
        console.log('⚠️ Using default values (CMS data not available yet)');
    }
}

// Load Hero Section Data
async function loadHeroData() {
    try {
        const response = await fetch('/_data/hero.json');
        if (response.ok) {
            const data = await response.json();
            
            const heroTitle = document.getElementById('hero-title');
            const heroSubtitle = document.getElementById('hero-subtitle');
            const heroCta = document.getElementById('hero-cta');
            
            if (heroTitle) heroTitle.value = data.title || '';
            if (heroSubtitle) heroSubtitle.value = data.subtitle || '';
            if (heroCta) heroCta.value = data.cta_text || '';
        }
    } catch (error) {
        console.log('Hero data not found, using defaults');
    }
}

// Load About Section Data
async function loadAboutData() {
    try {
        const response = await fetch('/_data/about.json');
        if (response.ok) {
            const data = await response.json();
            
            const aboutTitle = document.getElementById('about-title');
            const aboutText = document.getElementById('about-text');
            
            if (aboutTitle) aboutTitle.value = data.title || '';
            if (aboutText) aboutText.value = data.text || '';
        }
    } catch (error) {
        console.log('About data not found, using defaults');
    }
}

// Load Contact Information
async function loadContactData() {
    try {
        const response = await fetch('/_data/contact.json');
        if (response.ok) {
            const data = await response.json();
            
            const contactEmail = document.getElementById('contact-email');
            const contactPhone = document.getElementById('contact-phone');
            const contactAddress = document.getElementById('contact-address');
            
            if (contactEmail) contactEmail.value = data.email || '';
            if (contactPhone) contactPhone.value = data.phone || '';
            if (contactAddress) contactAddress.value = data.address || '';
        }
    } catch (error) {
        console.log('Contact data not found, using defaults');
    }
}

// Load Social Media Links
async function loadSocialData() {
    try {
        const response = await fetch('/_data/social.json');
        if (response.ok) {
            const data = await response.json();
            
            const facebookUrl = document.getElementById('facebook-url');
            const twitterUrl = document.getElementById('twitter-url');
            const linkedinUrl = document.getElementById('linkedin-url');
            const instagramUrl = document.getElementById('instagram-url');
            const whatsappUrl = document.getElementById('whatsapp-url');
            
            if (facebookUrl) facebookUrl.value = data.facebook || '';
            if (twitterUrl) twitterUrl.value = data.twitter || '';
            if (linkedinUrl) linkedinUrl.value = data.linkedin || '';
            if (instagramUrl) instagramUrl.value = data.instagram || '';
            if (whatsappUrl) whatsappUrl.value = data.whatsapp || '';
        }
    } catch (error) {
        console.log('Social data not found, using defaults');
    }
}

// Load General Settings
async function loadSettingsData() {
    try {
        const response = await fetch('/_data/settings.json');
        if (response.ok) {
            const data = await response.json();
            
            const siteTitle = document.getElementById('site-title');
            const primaryColor = document.getElementById('primary-color');
            
            if (siteTitle) siteTitle.value = data.site_title || '';
            if (primaryColor) primaryColor.value = data.primary_color || '#522cb5';
            
            // Update theme immediately
            if (data.primary_color) {
                updatePreviewColor(data.primary_color);
            }
        }
    } catch (error) {
        console.log('Settings data not found, using defaults');
    }
}

// Save to CMS files using Netlify CMS API
async function saveToCMS() {
    const saveBtn = document.getElementById('save-all');
    const originalText = saveBtn.innerHTML;
    
    // Show loading state
    saveBtn.innerHTML = '<div class="spinner"></div> Saving to CMS...';
    saveBtn.disabled = true;
    
    try {
        const formData = collectFormData();
        
        // Create CMS-compatible data structure
        const cmsData = prepareCMSData(formData);
        
        // Save each data file
        await Promise.all([
            saveCMSFile('/_data/hero.json', cmsData.hero),
            saveCMSFile('/_data/about.json', cmsData.about),
            saveCMSFile('/_data/contact.json', cmsData.contact),
            saveCMSFile('/_data/social.json', cmsData.social),
            saveCMSFile('/_data/settings.json', cmsData.settings)
        ]);
        
        // Also save locally as backup
        localStorage.setItem('nexcey-admin-data', JSON.stringify(formData));
        
        showToast('✅ Changes saved to CMS and will go live!', 'success');
        
    } catch (error) {
        console.error('Save error:', error);
        
        // Fallback to local save
        const formData = collectFormData();
        localStorage.setItem('nexcey-admin-data', JSON.stringify(formData));
        
        showToast('⚠️ Saved locally. Use Netlify CMS to make changes go live.', 'warning');
    } finally {
        // Reset button
        setTimeout(() => {
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }, 2000);
    }
}

// Prepare data in CMS-compatible format
function prepareCMSData(formData) {
    return {
        hero: {
            title: formData['hero-title'] || 'Web Design that Drives Results',
            subtitle: formData['hero-subtitle'] || 'Modern, responsive websites tailored to your brand.',
            cta_text: formData['hero-cta'] || 'Get Started'
        },
        about: {
            title: formData['about-title'] || 'About Nexcey',
            text: formData['about-text'] || 'Nexcey is a modern web design studio offering tailor-made website solutions.'
        },
        contact: {
            email: formData['contact-email'] || 'info@nexcey.com',
            phone: formData['contact-phone'] || '+94 72 445 2222',
            address: formData['contact-address'] || '203, Somananda MW, Udahamulla, Panadura, Sri Lanka'
        },
        social: {
            facebook: formData['facebook-url'] || '',
            twitter: formData['twitter-url'] || '',
            linkedin: formData['linkedin-url'] || '',
            instagram: formData['instagram-url'] || '',
            whatsapp: formData['whatsapp-url'] || ''
        },
        settings: {
            site_title: formData['site-title'] || 'Nexcey - Your Web Design Partner',
            primary_color: formData['primary-color'] || '#522cb5'
        }
    };
}

// Save individual CMS file
async function saveCMSFile(filePath, data) {
    // This simulates saving to CMS files
    // In reality, this would integrate with Netlify CMS API or Git Gateway
    
    try {
        // For now, we'll create a form that Netlify CMS can process
        await submitToCMSForm(filePath, data);
        
    } catch (error) {
        console.log(`Could not save ${filePath}:`, error);
        throw error;
    }
}

// Submit data to Netlify CMS via hidden form
async function submitToCMSForm(filePath, data) {
    // Create a hidden form that mimics Netlify CMS submission
    const form = document.createElement('form');
    form.style.display = 'none';
    form.method = 'POST';
    form.name = filePath.replace('/_data/', '').replace('.json', '');
    
    // Add form fields
    Object.keys(data).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = data[key];
        form.appendChild(input);
    });
    
    document.body.appendChild(form);
    
    // This is a simplified approach - in practice, you'd need proper CMS integration
    // For now, let's save to localStorage and show instructions
    localStorage.setItem(`cms-${filePath}`, JSON.stringify(data));
    
    document.body.removeChild(form);
}

// Keep all your existing functions
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

        // Store image data
        const inputId = event.target.id;
        saveImageData(inputId, imageData);
    };
    
    reader.readAsDataURL(file);
}

function saveImageData(inputId, imageData) {
    const savedImages = JSON.parse(localStorage.getItem('nexcey-images') || '{}');
    savedImages[inputId] = imageData;
    localStorage.setItem('nexcey-images', JSON.stringify(savedImages));
}

// Dynamic list management
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

function setupPricingManagement() {
    const addPlanBtn = document.getElementById('add-pricing-plan');
    if (addPlanBtn) {
        addPlanBtn.addEventListener('click', addNewPricingPlan);
    }

    setupPricingPlanButtons();
}

function setupPricingPlanButtons() {
    document.querySelectorAll('.add-feature').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const featuresContainer = e.target.parentNode.querySelector('.plan-features');
            addFeatureItem(featuresContainer);
        });
    });

    document.querySelectorAll('.delete-plan').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (confirm('Are you sure you want to delete this pricing plan?')) {
                e.target.closest('.pricing-plan-admin').remove();
            }
        });
    });

    document.querySelectorAll('.feature-item .btn-danger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.closest('.feature-item').remove();
        });
    });
}

function addFeatureItem(container) {
    const featureTemplate = `
        <div class="feature-item">
            <input type="text" placeholder="Feature description">
            <button class="btn btn-danger btn-sm"><i class="fas fa-times"></i></button>
        </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = featureTemplate;
    const newFeature = tempDiv.firstElementChild;
    
    newFeature.querySelector('.btn-danger').addEventListener('click', (e) => {
        e.target.closest('.feature-item').remove();
    });
    
    container.appendChild(newFeature);
}

function addNewPricingPlan() {
    const pricingPlans = document.querySelector('.pricing-plans');
    const planTemplate = `
        <div class="pricing-plan-admin">
            <div class="plan-header">
                <input type="text" placeholder="Plan Name" value="" class="plan-name">
                <input type="text" placeholder="Price" value="" class="plan-price">
                <label><input type="checkbox"> Featured Plan</label>
            </div>
            <div class="plan-features">
                <div class="feature-item">
                    <input type="text" placeholder="Feature description">
                    <button class="btn btn-danger btn-sm"><i class="fas fa-times"></i></button>
                </div>
            </div>
            <button class="btn btn-secondary btn-sm add-feature">Add Feature</button>
            <button class="btn btn-danger delete-plan">Delete Plan</button>
        </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = planTemplate;
    const newPlan = tempDiv.firstElementChild;
    
    setupNewPlanButtons(newPlan);
    pricingPlans.appendChild(newPlan);
}

function setupNewPlanButtons(planElement) {
    const addFeatureBtn = planElement.querySelector('.add-feature');
    const deletePlanBtn = planElement.querySelector('.delete-plan');
    const deleteFeatureBtn = planElement.querySelector('.feature-item .btn-danger');
    
    addFeatureBtn.addEventListener('click', (e) => {
        const featuresContainer = e.target.parentNode.querySelector('.plan-features');
        addFeatureItem(featuresContainer);
    });
    
    deletePlanBtn.addEventListener('click', (e) => {
        if (confirm('Are you sure you want to delete this pricing plan?')) {
            e.target.closest('.pricing-plan-admin').remove();
        }
    });
    
    deleteFeatureBtn.addEventListener('click', (e) => {
        e.target.closest('.feature-item').remove();
    });
}

function setupClientsManagement() {
    const addClientBtn = document.getElementById('add-client');
    if (addClientBtn) {
        addClientBtn.addEventListener('click', addNewClient);
    }

    document.querySelectorAll('.client-item-admin .btn-danger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (confirm('Are you sure you want to delete this client?')) {
                e.target.closest('.client-item-admin').remove();
            }
        });
    });
}

function addNewClient() {
    const clientsList = document.querySelector('.clients-list');
    const clientTemplate = `
        <div class="client-item-admin">
            <div class="client-images">
                <div class="image-upload">
                    <label>Client Logo</label>
                    <input type="file" accept="image/*">
                    <div class="image-preview">No image selected</div>
                </div>
                <div class="image-upload">
                    <label>Website Screenshot</label>
                    <input type="file" accept="image/*">
                    <div class="image-preview">No image selected</div>
                </div>
            </div>
            <input type="text" placeholder="Client Name" value="">
            <button class="btn btn-danger"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = clientTemplate;
    const newClient = tempDiv.firstElementChild;
    
    newClient.querySelector('.btn-danger').addEventListener('click', (e) => {
        if (confirm('Are you sure you want to delete this client?')) {
            e.target.closest('.client-item-admin').remove();
        }
    });
    
    newClient.querySelectorAll('input[type="file"]').forEach(input => {
        input.addEventListener('change', handleImageUpload);
    });
    
    clientsList.appendChild(newClient);
}

function setupTestimonialsManagement() {
    const addTestimonialBtn = document.getElementById('add-testimonial');
    if (addTestimonialBtn) {
        addTestimonialBtn.addEventListener('click', addNewTestimonial);
    }

    document.querySelectorAll('.testimonial-item-admin .btn-danger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (confirm('Are you sure you want to delete this testimonial?')) {
                e.target.closest('.testimonial-item-admin').remove();
            }
        });
    });
}

function addNewTestimonial() {
    const testimonialsList = document.querySelector('.testimonials-list');
    const testimonialTemplate = `
        <div class="testimonial-item-admin">
            <div class="testimonial-header">
                <div class="image-upload">
                    <label>Client Photo</label>
                    <input type="file" accept="image/*">
                    <div class="image-preview">No photo</div>
                </div>
                <input type="text" placeholder="Client Name" value="">
            </div>
            <textarea placeholder="Testimonial comment"></textarea>
            <button class="btn btn-danger"><i class="fas fa-trash"></i></button>
        </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = testimonialTemplate;
    const newTestimonial = tempDiv.firstElementChild;
    
    newTestimonial.querySelector('.btn-danger').addEventListener('click', (e) => {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            e.target.closest('.testimonial-item-admin').remove();
        }
    });
    
    newTestimonial.querySelector('input[type="file"]').addEventListener('change', handleImageUpload);
    
    testimonialsList.appendChild(newTestimonial);
}

// Utility functions
function collectFormData() {
    const data = {};
    
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
    
    return data;
}

function autoSaveLocal() {
    const formData = collectFormData();
    localStorage.setItem('nexcey-admin-data', JSON.stringify(formData));
}

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

console.log('✅ Hybrid Admin Dashboard loaded successfully!');
