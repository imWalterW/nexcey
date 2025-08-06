// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
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
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.content-section');

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
}

// Form handlers
function setupFormHandlers() {
    // Save all changes button
    const saveAllBtn = document.getElementById('save-all');
    if (saveAllBtn) {
        saveAllBtn.addEventListener('click', saveAllChanges);
    }

    // Auto-save on input changes
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('change', autoSave);
        input.addEventListener('blur', autoSave);
    });
}

// Image upload handling
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

    // Setup delete buttons for existing services
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
    
    // Setup delete button for new service
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

    // Setup existing plan buttons
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
        btn.addEventListener('click', (