// Cart state management
let cartItems = [];
let cartVisible = false;
let cartTotal = 0;

// DOM Elements
const mobileMenuButton = document.querySelector('nav button');
const mobileMenu = document.querySelector('nav div:nth-child(2)');
const mobileMenuItems = mobileMenu.querySelectorAll('a');
const cartButtons = document.querySelectorAll('button');
const cart = document.getElementById('cart');
const cartItemsContainer = document.getElementById('cart-items');
const totalElement = document.querySelector('#cart .border-t span:last-child');
const checkoutButton = document.querySelector('#cart button:last-child');
const newsletterForm = document.querySelector('footer form');

// Mobile menu functionality
function initializeMobileMenu() {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('mobile-menu-enter');
        setTimeout(() => {
            mobileMenu.classList.toggle('mobile-menu-enter-active');
        }, 10);
    });

    // Close mobile menu when clicking menu items
    mobileMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
}

// Cart functionality
function updateCartTotal() {
    cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    totalElement.textContent = `₹${cartTotal}`;
}

function createCartItemElement(productName, productPrice, quantity) {
    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'flex justify-between items-center p-2 bg-gray-50 rounded';
    cartItemElement.setAttribute('data-product', productName);
    cartItemElement.innerHTML = `
        <div>
            <p class="font-semibold">${productName}</p>
            <p class="text-sm text-gray-600">₹${productPrice}</p>
            <div class="flex items-center mt-1">
                <button class="quantity-btn minus bg-gray-200 px-2 rounded-l">-</button>
                <span class="quantity px-3 bg-white">${quantity}</span>
                <button class="quantity-btn plus bg-gray-200 px-2 rounded-r">+</button>
            </div>
        </div>
        <button class="remove-item text-red-500 hover:text-red-700">Remove</button>
    `;
    return cartItemElement;
}

function addQuantityButtonListeners(cartItemElement, productName) {
    const quantityBtns = cartItemElement.querySelectorAll('.quantity-btn');
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = cartItems.find(item => item.name === productName);
            if (btn.classList.contains('plus')) {
                item.quantity += 1;
            } else if (item.quantity > 1) {
                item.quantity -= 1;
            }
            cartItemElement.querySelector('.quantity').textContent = item.quantity;
            updateCartTotal();
        });
    });
}

function addRemoveButtonListener(cartItemElement, productName) {
    cartItemElement.querySelector('.remove-item').addEventListener('click', () => {
        cartItems = cartItems.filter(item => item.name !== productName);
        cartItemElement.remove();
        updateCartTotal();
        
        if (cartItems.length === 0) {
            cart.classList.add('translate-x-full');
            cartVisible = false;
        }
    });
}

function initializeCartButtons() {
    cartButtons.forEach(button => {
        if (button.textContent === 'Add to Cart') {
            button.addEventListener('click', (e) => {
                const product = e.target.closest('.bg-white');
                const productName = product.querySelector('h3').textContent;
                const productPrice = parseInt(product.querySelector('.text-green-700').textContent.replace('₹', ''));
                
                // Check if item already exists in cart
                const existingItem = cartItems.find(item => item.name === productName);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                    const quantityElement = document.querySelector(`[data-product="${productName}"] .quantity`);
                    quantityElement.textContent = existingItem.quantity;
                } else {
                    const cartItem = {
                        name: productName,
                        price: productPrice,
                        quantity: 1
                    };
                    cartItems.push(cartItem);
                    
                    const cartItemElement = createCartItemElement(productName, productPrice, cartItem.quantity);
                    cartItemsContainer.appendChild(cartItemElement);
                    
                    addQuantityButtonListeners(cartItemElement, productName);
                    addRemoveButtonListener(cartItemElement, productName);
                }
                
                updateCartTotal();
                cart.classList.remove('translate-x-full');
                cartVisible = true;
                
                // Add animation to the button
                button.classList.add('bg-green-500');
                button.textContent = 'Added!';
                setTimeout(() => {
                    button.classList.remove('bg-green-500');
                    button.textContent = 'Add to Cart';
                }, 1000);
            });
        }
    });
}

// Close cart when clicking outside
function initializeCartClosing() {
    document.addEventListener('click', (e) => {
        if (cartVisible && 
            !cart.contains(e.target) && 
            !e.target.closest('button')?.textContent?.includes('Add to Cart')) {
            cart.classList.add('translate-x-full');
            cartVisible = false;
        }
    });
}

// Checkout functionality
function initializeCheckout() {
    checkoutButton.addEventListener('click', () => {
        if (cartItems.length > 0) {
            alert('Thank you for your order! Total amount: ₹' + cartTotal);
            cartItems = [];
            cartItemsContainer.innerHTML = '';
            updateCartTotal();
            cart.classList.add('translate-x-full');
            cartVisible = false;
        }
    });
}

// Newsletter form submission
function initializeNewsletterForm() {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        if (email) {
            alert('Thank you for subscribing to our newsletter!');
            newsletterForm.reset();
        }
    });
}

// Smooth scroll functionality
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize all functionality
function initializeApp() {
    initializeMobileMenu();
    initializeCartButtons();
    initializeCartClosing();
    initializeCheckout();
    initializeNewsletterForm();
    initializeSmoothScroll();
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializeApp); 