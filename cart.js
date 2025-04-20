// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in the UI
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Calculate total price
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart UI
function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.querySelector('#cart .font-bold:last-child');
    
    if (cartItems) {
        cartItems.innerHTML = cart.map(item => `
            <div class="flex items-center justify-between border-b pb-4">
                <div class="flex items-center space-x-4">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                    <div>
                        <h4 class="font-semibold">${item.name}</h4>
                        <p class="text-gray-600">₹${item.price}</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="mx-2">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="text-gray-500 hover:text-gray-700">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700 ml-4">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    if (cartTotal) {
        cartTotal.textContent = `₹${calculateTotal()}`;
    }
    
    updateCartCount();
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add item to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartUI();
    openCart();
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCartUI();
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

// Open cart
function openCart() {
    const cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.style.transform = 'translateX(0)';
        // Close mobile menu if it's open
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('show')) {
            mobileMenu.classList.remove('show');
        }
    }
}

// Close cart
function closeCart() {
    const cartElement = document.getElementById('cart');
    if (cartElement) {
        cartElement.style.transform = 'translateX(100%)';
    }
}

// Initialize cart
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();

    // Handle cart button clicks
    const cartButtons = document.querySelectorAll('#mobile-cart-button, #desktop-cart-button');
    cartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            openCart();
        });
    });

    // Handle cart close button
    const closeButtons = document.querySelectorAll('.cart-close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeCart();
        });
    });

    // Handle clicks outside cart
    document.addEventListener('click', (e) => {
        const cart = document.getElementById('cart');
        if (!cart) return;

        const isCartOpen = cart.style.transform !== 'translateX(100%)';
        if (!isCartOpen) return;

        const isClickInsideCart = cart.contains(e.target);
        const isCartButton = e.target.closest('#mobile-cart-button') || 
                           e.target.closest('#desktop-cart-button');
        
        if (!isClickInsideCart && !isCartButton) {
            closeCart();
        }
    });
}); 