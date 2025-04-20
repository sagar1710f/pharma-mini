// Product page functionality
const products = [
    {
        "id": 1,
        "name": "DIBOVIM POWDER",
        "description": "Control blood sugar & its complications",
        "price": 299,
        "category": "Powder",
        "image": "images/dibovim-powder.jpg"
    },
    {
        "id": 2,
        "name": "ORTHOVIM OIL",
        "description": "Useful in all type of pain (external use only)",
        "price": 199,
        "category": "Oil",
        "image": "images/orthovim-oil.jpg"
    },
    {
        "id": 3,
        "name": "VIMARTHO TABLET",
        "description": "Useful in joint pain, back pain, Lumber pain",
        "price": 249,
        "category": "Tablet",
        "image": "images/vimartho-tablet.jpg"
    },
    {
        "id": 4,
        "name": "VIMALHIRA GARCINIA CAPSULE",
        "description": "Useful in weight loss",
        "price": 349,
        "category": "Capsule",
        "image": "images/vimalhira-capsule.jpg"
    },
    {
        "id": 5,
        "name": "ACE NEEL TABLET",
        "description": "Useful in acidity",
        "price": 179,
        "category": "Tablet",
        "image": "images/ace-neel-tablet.jpg"
    },
    {
        "id": 6,
        "name": "AVIPATTIKAR TABLET",
        "description": "Useful in acidity",
        "price": 189,
        "category": "Tablet",
        "image": "images/avipattikar-tablet.jpg"
    },
    {
        "id": 7,
        "name": "GANDHARV HARITAKI TABLET",
        "description": "Useful in constipation",
        "price": 199,
        "category": "Tablet",
        "image": "images/gandharv-haritaki-tablet.jpg"
    },
    {
        "id": 8,
        "name": "HEMOVIM TABLET",
        "description": "Useful in piles",
        "price": 259,
        "category": "Tablet",
        "image": "images/hemovim-tablet.jpg"
    },
    {
        "id": 9,
        "name": "DIBOVIM TABLET",
        "description": "Useful in madhumeh for control blood sugar & its complications",
        "price": 289,
        "category": "Tablet",
        "image": "images/dibovim-tablet.jpg"
    },
    {
        "id": 10,
        "name": "SHATAVARI TABLET",
        "description": "Useful as Tonic",
        "price": 219,
        "category": "Tablet",
        "image": "images/shatavari-tablet.jpg"
    },
    {
        "id": 11,
        "name": "ASHWAGANDHA TABLET",
        "description": "Useful as Tonic",
        "price": 229,
        "category": "Tablet",
        "image": "images/ashwagandha-tablet.jpg"
    },
    {
        "id": 12,
        "name": "GUDUCHI GHANVATI",
        "description": "Useful in fever & Tonic",
        "price": 209,
        "category": "Tablet",
        "image": "images/guduchi-ghanvati.jpg"
    }
];
let allProducts = [];
const productsGrid = document.getElementById('productsGrid');
const categoryFilter = document.getElementById('categoryFilter');
const sortBy = document.getElementById('sortSelect');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('productModal');
const modalImage = modal.querySelector('.modal-image');
const modalTitle = modal.querySelector('.modal-title');
const modalDescription = modal.querySelector('.modal-description');
const modalPrice = modal.querySelector('.modal-price');
const modalClose = modal.querySelector('.modal-close');
const addToCartBtn = modal.querySelector('.add-to-cart-btn');

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

        allProducts = data.products || products;
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
    card.className = 'product-card bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full';
    card.innerHTML = `
        <div class="relative product-image-container h-48 overflow-hidden group cursor-pointer">
            <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" loading="lazy">
            <div class="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <button class="view-details-btn transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 bg-white text-green-700 w-12 h-12 rounded-full hover:bg-green-50 flex items-center justify-center shadow-lg">
                        <i class="fas fa-eye text-xl"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="p-4 flex flex-col flex-grow">
            <div class="mb-3">
                <span class="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">${product.category}</span>
            </div>
            <h3 class="text-lg font-bold mb-2 text-gray-800 line-clamp-2 hover:text-green-700 transition-colors cursor-pointer">${product.name}</h3>
            <p class="text-gray-600 text-sm mb-4 flex-grow line-clamp-2">${product.description}</p>
            <div class="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                <div class="flex flex-col">
                    <span class="text-xs text-gray-500">Price</span>
                    <span class="text-xl font-bold text-green-700">₹${product.price}</span>
                </div>
                <button class="add-to-cart-btn bg-green-700 text-white px-6 py-2.5 rounded-lg hover:bg-green-600 transition-all duration-300 text-sm font-medium flex items-center gap-2 hover:shadow-md" onclick="addToCart({
                    id: ${product.id},
                    name: '${product.name}',
                    price: ${product.price},
                    image: '${product.image}'
                })">
                    <i class="fas fa-cart-plus"></i>
                    Add to Cart
                </button>
            </div>
        </div>
    `;

    // Add click event for opening modal
    const viewDetailsBtn = card.querySelector('.view-details-btn');
    const productTitle = card.querySelector('h3');
    const imageContainer = card.querySelector('.product-image-container');
    
    [viewDetailsBtn, productTitle, imageContainer].forEach(element => {
        if (element) {
            element.addEventListener('click', () => openModal(product));
        }
    });
    
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
    addToCartBtn.onclick = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });
        closeModal();
    };
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    isZoomed = false;
    modalImage.style.transform = 'scale(1)';
    
    // Stop event propagation
    modal.querySelector('.modal-content').addEventListener('click', (e) => {
        e.stopPropagation();
    });
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
    
    // Initialize cart state if cart.js is loaded
    if (typeof updateCartCount === 'function') {
        updateCartCount();
    }
    if (typeof updateCartTotal === 'function') {
        updateCartTotal();
    }

    // Add click outside listener to close modal and cart
    document.addEventListener('click', (e) => {
        // Close modal when clicking outside
        if (modal && modal.style.display === 'flex') {
            const isClickInsideModal = e.target.closest('.modal-content');
            const isViewButton = e.target.closest('.view-details-btn') || 
                               e.target.closest('.product-image-container') ||
                               e.target.closest('h3');
            
            if (!isClickInsideModal && !isViewButton && e.target !== modal) {
                closeModal();
            }
        }

        // Close cart when clicking outside
        const cart = document.getElementById('cart');
        if (cart && !cart.classList.contains('translate-x-full')) {
            const isClickInsideCart = e.target.closest('#cart');
            const isCartButton = e.target.closest('[onclick*="openCart"]') || 
                               e.target.closest('.add-to-cart-btn');
            
            if (!isClickInsideCart && !isCartButton) {
                closeCart();
            }
        }
    });
}); 