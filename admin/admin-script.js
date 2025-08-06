// Admin Dashboard JavaScript - Complete Version
document.addEventListener(‘DOMContentLoaded’, function() {
initializeAdmin();
});

function initializeAdmin() {
setupNavigation();
setupFormHandlers();
setupImageUploads();
setupDynamicLists();
loadSavedData();
setupColorPicker();
}

// Navigation between sections
function setupNavigation() {
const navItems = document.querySelectorAll(’.nav-item’);
const sections = document.querySelectorAll(’.content-section’);

```
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all nav items and sections
        navItems.forEach(nav => nav.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        // Add active class to clicked nav item
        item.classList.add('active');
        
        // Show corresponding section
        const sectionId = item.getAttribute('data-section');
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    });
});
```

}

// Form handlers
function setupFormHandlers() {
// Save all changes button
const saveAllBtn = document.getElementById(‘save-all’);
if (saveAllBtn) {
saveAllBtn.addEventListener(‘click’, saveAllChanges);
}

```
// Auto-save on input changes
const inputs = document.querySelectorAll('input, textarea, select');
inputs.forEach(input => {
    input.addEventListener('change', autoSave);
    input.addEventListener('blur', autoSave);
});
```

}

// Image upload handling
function setupImageUploads() {
const fileInputs = document.querySelectorAll(‘input[type=“file”]’);

```
fileInputs.forEach(input => {
    input.addEventListener('change', handleImageUpload);
});
```

}

function handleImageUpload(event) {
const file = event.target.files[0];
if (!file) return;

```
const reader = new FileReader();
reader.onload = function(e) {
    const imageData = e.target.result;
    
    // Find associated preview element
    const preview = event.target.parentNode.querySelector('.image-preview');
    if (preview) {
        preview.style.backgroundImage = `url(${imageData})`;
        preview.classList.add('has-image');
        preview.textContent = '';
    }

    // Store image data for saving
    const inputId = event.target.id;
    saveImageData(inputId, imageData);
};

reader.readAsDataURL(file);
```

}

function saveImageData(inputId, imageData) {
const savedImages = JSON.parse(localStorage.getItem(‘nexcey-images’) || ‘{}’);
savedImages[inputId] = imageData;
localStorage.setItem(‘nexcey-images’, JSON.stringify(savedImages));
}

// Dynamic list management
function setupDynamicLists() {
setupServicesManagement();
setupPricingManagement();
setupClientsManagement();
setupTestimonialsManagement();
}

function setupServicesManagement() {
const addServiceBtn = document.getElementById(‘add-service’);
if (addServiceBtn) {
addServiceBtn.addEventListener(‘click’, addNewService);
}

```
// Setup delete buttons for existing services
document.querySelectorAll('.service-item-admin .btn-danger').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.target.closest('.service-item-admin').remove();
    });
});
```

}

function addNewService() {
const servicesList = document.querySelector(’.services-list’);
const serviceTemplate = `<div class="service-item-admin"> <input type="text" placeholder="Service Title" value=""> <textarea placeholder="Service Description"></textarea> <button class="btn btn-danger btn-sm"><i class="fas fa-trash"></i></button> </div>`;

```
const tempDiv = document.createElement('div');
tempDiv.innerHTML = serviceTemplate;
const newService = tempDiv.firstElementChild;

// Setup delete button for new service
newService.querySelector('.btn-danger').addEventListener('click', (e) => {
    e.target.closest('.service-item-admin').remove();
});

servicesList.appendChild(newService);
```

}

function setupPricingManagement() {
const addPlanBtn = document.getElementById(‘add-pricing-plan’);
if (addPlanBtn) {
addPlanBtn.addEventListener(‘click’, addNewPricingPlan);
}

```
// Setup existing plan buttons
setupPricingPlanButtons();
```

}

function setupPricingPlanButtons() {
document.querySelectorAll(’.add-feature’).forEach(btn => {
btn.addEventListener(‘click’, (e) => {
const featuresContainer = e.target.parentNode.querySelector(’.plan-features’);
addFeatureItem(featuresContainer);
});
});

```
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
```

}

function addFeatureItem(container) {
const featureTemplate = `<div class="feature-item"> <input type="text" placeholder="Feature description"> <button class="btn btn-danger btn-sm"><i class="fas fa-times"></i></button> </div>`;

```
const tempDiv = document.createElement('div');
tempDiv.innerHTML = featureTemplate;
const newFeature = tempDiv.firstElementChild;

newFeature.querySelector('.btn-danger').addEventListener('click', (e) => {
    e.target.closest('.feature-item').remove();
});

container.appendChild(newFeature);
```

}

function addNewPricingPlan() {
const pricingPlans = document.querySelector(’.pricing-plans’);
const planTemplate = `<div class="pricing-plan-admin"> <div class="plan-header"> <input type="text" placeholder="Plan Name" value="" class="plan-name"> <input type="text" placeholder="Price" value="" class="plan-price"> <label><input type="checkbox"> Featured Plan</label> </div> <div class="plan-features"> <div class="feature-item"> <input type="text" placeholder="Feature description"> <button class="btn btn-danger btn-sm"><i class="fas fa-times"></i></button> </div> </div> <button class="btn btn-secondary btn-sm add-feature">Add Feature</button> <button class="btn btn-danger delete-plan">Delete Plan</button> </div>`;

```
const tempDiv = document.createElement('div');
tempDiv.innerHTML = planTemplate;
const newPlan = tempDiv.firstElementChild;

// Setup buttons for new plan
setupNewPlanButtons(newPlan);

pricingPlans.appendChild(newPlan);
```

}

function setupNewPlanButtons(planElement) {
const addFeatureBtn = planElement.querySelector(’.add-feature’);
const deletePlanBtn = planElement.querySelector(’.delete-plan’);
const deleteFeatureBtn = planElement.querySelector(’.feature-item .btn-danger’);

```
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
```

}

function setupClientsManagement() {
const addClientBtn = document.getElementById(‘add-client’);
if (addClientBtn) {
addClientBtn.addEventListener(‘click’, addNewClient);
}

```
// Setup delete buttons for existing clients
document.querySelectorAll('.client-item-admin .btn-danger').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (confirm('Are you sure you want to delete this client?')) {
            e.target.closest('.client-item-admin').remove();
        }
    });
});
```

}

function addNewClient() {
const clientsList = document.querySelector(’.clients-list’);
const clientTemplate = `<div class="client-item-admin"> <div class="client-images"> <div class="image-upload"> <label>Client Logo</label> <input type="file" accept="image/*"> <div class="image-preview">No image selected</div> </div> <div class="image-upload"> <label>Website Screenshot</label> <input type="file" accept="image/*"> <div class="image-preview">No image selected</div> </div> </div> <input type="text" placeholder="Client Name" value=""> <button class="btn btn-danger"><i class="fas fa-trash"></i></button> </div>`;

```
const tempDiv = document.createElement('div');
tempDiv.innerHTML = clientTemplate;
const newClient = tempDiv.firstElementChild;

// Setup delete button and file inputs for new client
newClient.querySelector('.btn-danger').addEventListener('click', (e) => {
    if (confirm('Are you sure you want to delete this client?')) {
        e.target.closest('.client-item-admin').remove();
    }
});

newClient.querySelectorAll('input[type="file"]').forEach(input => {
    input.addEventListener('change', handleImageUpload);
});

clientsList.appendChild(newClient);
```

}

function setupTestimonialsManagement() {
const addTestimonialBtn = document.getElementById(‘add-testimonial’);
if (addTestimonialBtn) {
addTestimonialBtn.addEventListener(‘click’, addNewTestimonial);
}

```
// Setup delete buttons for existing testimonials
document.querySelectorAll('.testimonial-item-admin .btn-danger').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (confirm('Are you sure you want to delete this testimonial?')) {
            e.target.closest('.testimonial-item-admin').remove();
        }
    });
});
```

}

function addNewTestimonial() {
const testimonialsList = document.querySelector(’.testimonials-list’);
const testimonialTemplate = `<div class="testimonial-item-admin"> <div class="testimonial-header"> <div class="image-upload"> <label>Client Photo</label> <input type="file" accept="image/*"> <div class="image-preview">No photo</div> </div> <input type="text" placeholder="Client Name" value=""> </div> <textarea placeholder="Testimonial comment"></textarea> <button class="btn btn-danger"><i class="fas fa-trash"></i></button> </div>`;

```
const tempDiv = document.createElement('div');
tempDiv.innerHTML = testimonialTemplate;
const newTestimonial = tempDiv.firstElementChild;

// Setup delete button and file input for new testimonial
newTestimonial.querySelector('.btn-danger').addEventListener('click', (e) => {
    if (confirm('Are you sure you want to delete this testimonial?')) {
        e.target.closest('.testimonial-item-admin').remove();
    }
});

newTestimonial.querySelector('input[type="file"]').addEventListener('change', handleImageUpload);

testimonialsList.appendChild(newTestimonial);
```

}

// Color picker setup
function setupColorPicker() {
const colorPicker = document.getElementById(‘primary-color’);
if (colorPicker) {
colorPicker.addEventListener(‘change’, (e) => {
const newColor = e.target.value;
updatePreviewColor(newColor);
});
}
}

function updatePreviewColor(color) {
// Update CSS variables for live preview
document.documentElement.style.setProperty(’–primary-color’, color);

```
// Calculate lighter and darker variants
const primaryLight = adjustBrightness(color, 40);
const primaryDark = adjustBrightness(color, -40);

document.documentElement.style.setProperty('--primary-light', primaryLight);
document.documentElement.style.setProperty('--primary-dark', primaryDark);
```

}

function adjustBrightness(hex, percent) {
hex = hex.replace(’#’, ‘’);
const num = parseInt(hex, 16);
const amt = Math.round(2.55 * percent);
const R = (num >> 16) + amt;
const G = (num >> 8 & 0x00FF) + amt;
const B = (num & 0x0000FF) + amt;

```
return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
```

}

// Auto-save functionality
function autoSave() {
// Save current form state to localStorage
const formData = collectFormData();
localStorage.setItem(‘nexcey-admin-data’, JSON.stringify(formData));
}

function collectFormData() {
const data = {};

```
// Collect all form inputs
const inputs = document.querySelectorAll('input, textarea, select');
inputs.forEach(input => {
    if (input.type === 'file') return; // Skip file inputs
    
    const id = input.id || input.name;
    if (id) {
        if (input.type === 'checkbox') {
            data[id] = input.checked;
        } else {
            data[id] = input.value;
        }
    }
});

// Collect services
data.services = [];
document.querySelectorAll('.service-item-admin').forEach(item => {
    const title = item.querySelector('input').value;
    const description = item.querySelector('textarea').value;
    if (title || description) {
        data.services.push({ title, description });
    }
});

// Collect pricing plans
data.pricingPlans = [];
document.querySelectorAll('.pricing-plan-admin').forEach(plan => {
    const name = plan.querySelector('.plan-name').value;
    const price = plan.querySelector('.plan-price').value;
    const featured = plan.querySelector('input[type="checkbox"]')?.checked || false;
    const features = [];
    
    plan.querySelectorAll('.feature-item input').forEach(featureInput => {
        if (featureInput.value) {
            features.push(featureInput.value);
        }
    });
    
    if (name || price) {
        data.pricingPlans.push({ name, price, featured, features });
    }
});

// Collect clients
data.clients = [];
document.querySelectorAll('.client-item-admin').forEach(client => {
    const name = client.querySelector('input[type="text"]').value;
    if (name) {
        data.clients.push({ name });
    }
});

// Collect testimonials
data.testimonials = [];
document.querySelectorAll('.testimonial-item-admin').forEach(testimonial => {
    const name = testimonial.querySelector('input[type="text"]').value;
    const comment = testimonial.querySelector('textarea').value;
    if (name || comment) {
        data.testimonials.push({ name, comment });
    }
});

return data;
```

}

function loadSavedData() {
const savedData = localStorage.getItem(‘nexcey-admin-data’);
const savedImages = localStorage.getItem(‘nexcey-images’);

```
if (savedData) {
    try {
        const data = JSON.parse(savedData);
        populateFormData(data);
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

if (savedImages) {
    try {
        const images = JSON.parse(savedImages);
        populateImagePreviews(images);
    } catch (error) {
        console.error('Error loading saved images:', error);
    }
}
```

}

function populateFormData(data) {
// Populate basic form fields
Object.keys(data).forEach(key => {
const element = document.getElementById(key);
if (element) {
if (element.type === ‘checkbox’) {
element.checked = data[key];
} else {
element.value = data[key];
}
}
});

```
// Update color preview if primary color is set
if (data['primary-color']) {
    updatePreviewColor(data['primary-color']);
}
```

}

function populateImagePreviews(images) {
Object.keys(images).forEach(inputId => {
const input = document.getElementById(inputId);
if (input) {
const preview = input.parentNode.querySelector(’.image-preview’);
if (preview) {
preview.style.backgroundImage = `url(${images[inputId]})`;
preview.classList.add(‘has-image’);
preview.textContent = ‘’;
}
}
});
}

// Save all changes
function saveAllChanges() {
const saveBtn = document.getElementById(‘save-all’);
const originalText = saveBtn.innerHTML;

```
// Show loading state
saveBtn.innerHTML = '<div class="spinner"></div> Saving...';
saveBtn.disabled = true;

// Collect all data
const formData = collectFormData();
const contentData = prepareContentForWebsite(formData);

// Save to localStorage
localStorage.setItem('nexcey-admin-data', JSON.stringify(formData));
localStorage.setItem('nexcey-content', JSON.stringify(contentData));

// Save primary color separately for main website
if (formData['primary-color']) {
    localStorage.setItem('nexcey-primary-color', formData['primary-color']);
}

// Simulate save process
setTimeout(() => {
    saveBtn.innerHTML = originalText;
    saveBtn.disabled = false;
    showToast('Changes saved successfully!', 'success');
}, 1500);
```

}

function prepareContentForWebsite(data) {
return {
hero: {
title: data[‘hero-title’] || ‘Web Design that Drives Results’,
subtitle: data[‘hero-subtitle’] || ‘Modern, responsive websites tailored to your brand.’,
cta: data[‘hero-cta’] || ‘Get Started’
},
about: {
title: data[‘about-title’] || ‘About Nexcey’,
text: data[‘about-text’] || ‘Nexcey is a modern web design studio…’
},
contact: {
email: data[‘contact-email’] || ‘info@nexcey.com’,
phone: data[‘contact-phone’] || ‘+94 72 445 2222’,
address: data[‘contact-address’] || ‘203, Somananda MW, Udahamulla, Panadura, Sri Lanka’
},
social: {
facebook: data[‘facebook-url’] || ‘’,
x: data[‘twitter-url’] || ‘’,
linkedin: data[‘linkedin-url’] || ‘’,
instagram: data[‘instagram-url’] || ‘’,
whatsapp: data[‘whatsapp-url’] || ‘’
},
services: data.services || [],
pricingPlans: data.pricingPlans || [],
clients: data.clients || [],
testimonials: data.testimonials || []
};
}

// Toast notification system
function showToast(message, type = ‘success’) {
const toast = document.getElementById(‘toast’);
const toastContent = toast.querySelector(’.toast-content span’);
const toastIcon = toast.querySelector(’.toast-content i’);

```
// Update toast content
toastContent.textContent = message;

// Update toast type and icon
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

// Show toast
toast.classList.add('show');

// Hide toast after 3 seconds
setTimeout(() => {
    toast.classList.remove('show');
}, 3000);
```

}

// Mobile menu toggle for admin panel
function toggleMobileMenu() {
const sidebar = document.querySelector(’.sidebar’);
sidebar.classList.toggle(‘open’);
}

// Add mobile menu button functionality (if needed)
document.addEventListener(‘click’, (e) => {
const sidebar = document.querySelector(’.sidebar’);
const mainContent = document.querySelector(’.main-content’);

```
// Close sidebar when clicking outside on mobile
if (window.innerWidth <= 1024 && sidebar.classList.contains('open')) {
    if (!sidebar.contains(e.target)) {
        sidebar.classList.remove('open');
    }
}
```

});

// Handle window resize
window.addEventListener(‘resize’, () => {
const sidebar = document.querySelector(’.sidebar’);

```
// Close mobile menu on desktop
if (window.innerWidth > 1024) {
    sidebar.classList.remove('open');
}
```

});

// Export functionality (bonus feature)
function exportWebsiteData() {
const data = collectFormData();
const blob = new Blob([JSON.stringify(data, null, 2)], { type: ‘application/json’ });
const url = URL.createObjectURL(blob);

```
const a = document.createElement('a');
a.href = url;
a.download = 'nexcey-website-data.json';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);

showToast('Website data exported successfully!', 'success');
```

}

// Import functionality (bonus feature)
function importWebsiteData(event) {
const file = event.target.files[0];
if (!file) return;

```
const reader = new FileReader();
reader.onload = function(e) {
    try {
        const data = JSON.parse(e.target.result);
        populateFormData(data);
        showToast('Data imported successfully!', 'success');
    } catch (error) {
        showToast('Error importing data. Please check the file format.', 'error');
        console.error('Import error:', error);
    }
};
reader.readAsText(file);
```

}

// Clear all data function (with confirmation)
function clearAllData() {
if (confirm(‘Are you sure you want to clear all data? This action cannot be undone.’)) {
localStorage.removeItem(‘nexcey-admin-data’);
localStorage.removeItem(‘nexcey-content’);
localStorage.removeItem(‘nexcey-images’);
localStorage.removeItem(‘nexcey-primary-color’);

```
    // Reload the page to reset everything
    location.reload();
}
```

}

// Initialize tooltips or help text
function initializeHelpSystem() {
// Add help tooltips to form elements
const helpTexts = {
‘site-title’: ‘This appears in the browser tab and search results’,
‘primary-color’: ‘This color will be used throughout your website’,
‘hero-title’: ‘The main headline visitors see first’,
‘hero-subtitle’: ‘Supporting text under your main headline’,
‘contact-email’: ‘Where contact form submissions will be sent’
};

```
Object.keys(helpTexts).forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field) {
        field.title = helpTexts[fieldId];
    }
});
```

}

// Initialize help system
document.addEventListener(‘DOMContentLoaded’, () => {
initializeHelpSystem();
});

// Add keyboard shortcuts
document.addEventListener(‘keydown’, (e) => {
// Ctrl+S to save
if ((e.ctrlKey || e.metaKey) && e.key === ‘s’) {
e.preventDefault();
saveAllChanges();
}

```
// Ctrl+E to export
if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
    e.preventDefault();
    exportWebsiteData();
}
```

});

// Validate form inputs
function validateFormInputs() {
const requiredFields = [‘site-title’, ‘hero-title’, ‘contact-email’];
let isValid = true;

```
requiredFields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    if (field && !field.value.trim()) {
        field.style.borderColor = 'var(--danger-color)';
        isValid = false;
    } else if (field) {
        field.style.borderColor = '';
    }
});

return isValid;
```

}

// Enhanced save with validation
function saveAllChangesWithValidation() {
if (validateFormInputs()) {
saveAllChanges();
} else {
showToast(‘Please fill in all required fields’, ‘error’);
}
}

console.log(‘Nexcey Admin Dashboard loaded successfully!’);
