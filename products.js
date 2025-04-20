// Product page functionality
let allProducts = [];
const productsGrid = document.getElementById('productsGrid');
const categoryFilter = document.getElementById('categoryFilter');
const sortBy = document.getElementById('sortBy');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('productModal');
const modalImage = modal.querySelector('.modal-image');
const modalTitle = modal.querySelector('.modal-title');
const modalDescription = modal.querySelector('.modal-description');
const modalPrice = modal.querySelector('.modal-price');
const modalClose = modal.querySelector('.modal-close');
const addToCartBtn = modal.querySelector('.add-to-cart-btn');

let cart = [];
let currentProduct = null;
let isZoomed = false;
let startX = 0;
let startY = 0;
let translateX = 0;
let translateY = 0;

let currentFilters = {
    category: 'all',
    sort: 'name',
    search: ''
};

// Fetch products from JSON file
async function fetchProducts() {
    try {
        // Show loading state
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <div style="display: inline-block; width: 40px; height: 40px; border: 4px solid #15803d; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            </div>
        `;

        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        
        // Check if data has products array
        if (!data.products || !Array.isArray(data.products)) {
            throw new Error('Invalid data format: products array not found');
        }

        allProducts = data.products;
        displayProducts(allProducts);
    } catch (error) {
        console.error('Error loading products:', error);
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <p style="color: #dc2626; margin-bottom: 1rem;">Error loading products. Please try again later.</p>
                <button onclick="fetchProducts()" style="background: #15803d; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; border: none;">
                    Retry
                </button>
            </div>
        `;
    }
}

// Display products in grid
function displayProducts(products) {
    if (!Array.isArray(products)) {
        console.error('Products must be an array');
        return;
    }

    productsGrid.innerHTML = '';

    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <p style="color: #666;">No products found matching your criteria.</p>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        productsGrid.appendChild(createProductCard(product));
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image-container">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-info">
            <div>
                <span class="product-category">${product.category}</span>
                <h3>${product.name}</h3>
            </div>
            <p>${product.description}</p>
            <div class="product-price">${product.price}</div>
            <button class="view-details-btn">
                <i class="fas fa-eye"></i>
                View Details
            </button>
        </div>
    `;

    // Add click event for opening modal
    card.querySelector('.view-details-btn').addEventListener('click', () => openModal(product));
    
    // Add click event for image to open modal
    card.querySelector('.product-image-container').addEventListener('click', () => openModal(product));
    
    return card;
}

// Filter products
function filterProducts() {
    if (!Array.isArray(allProducts)) {
        console.error('allProducts is not properly initialized');
        return;
    }

    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const sortValue = sortBy.value;

    let filtered = [...allProducts];

    // Apply category filter
    if (category !== 'all') {
        filtered = filtered.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
    }

    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }

    // Apply sorting
    filtered.sort((a, b) => {
        switch (sortValue) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            default:
                return 0;
        }
    });

    displayProducts(filtered);
}

// Modal functions
function openModal(product) {
    if (!product) return;

    currentProduct = product;
    modalImage.src = product.image;
    modalImage.alt = product.name;
    modalTitle.textContent = product.name;
    modalDescription.textContent = product.description;
    modalPrice.textContent = `₹${product.price}`;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    isZoomed = false;
    modalImage.style.transform = 'scale(1)';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentProduct = null;
    isZoomed = false;
    modalImage.style.transform = 'scale(1)';
}

// Zoom functionality
function toggleZoom(e) {
    if (!isZoomed) {
        const rect = modalImage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        modalImage.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        modalImage.style.transform = 'scale(2.5)';
    } else {
        modalImage.style.transform = 'scale(1)';
    }
    isZoomed = !isZoomed;
}

// Cart functionality
function addToCart(product) {
    if (!product) return;

    const cartItem = cart.find(item => item.name === product.name);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    // Show notification
    showNotification('Product added to cart!');
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #15803d;
        color: white;
        padding: 1rem 2rem;
        border-radius: 4px;
        animation: slideIn 0.3s ease-out;
        z-index: 1000;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Event listeners
categoryFilter.addEventListener('change', filterProducts);
sortBy.addEventListener('change', filterProducts);
searchInput.addEventListener('input', filterProducts);
modalClose.addEventListener('click', closeModal);
modalImage.addEventListener('click', toggleZoom);
addToCartBtn.addEventListener('click', () => {
    if (currentProduct) {
        addToCart(currentProduct);
    }
});

// Close modal when clicking outside
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Add keydown event for closing modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
    }
});

// Initialize products page
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
}); 