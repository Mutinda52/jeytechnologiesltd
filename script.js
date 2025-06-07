const products = [
    { id: 1, name: 'Modern Laptop', price: 1200.00, image: 'laptop.png' },
    { id: 2, name: 'Sleek Smartphone', price: 799.99, image: 'phone.png' },
    { id: 3, name: 'Pro Tablet', price: 650.00, image: 'tablet.png' },
    { id: 4, name: 'Wireless Headphones', price: 149.50, image: 'headphones.png' },
    { id: 5, name: 'Fitness Smartwatch', price: 249.99, image: 'smartwatch.png' },
    { id: 6, name: 'Next-Gen Console', price: 499.99, image: 'gaming-console.png' },
    { id: 7, name: '4K Camera Drone', price: 899.00, image: 'drone.png' },
    { id: 8, name: 'AI Smart Speaker', price: 99.00, image: 'smart-speaker.png' },
    { id: 9, name: 'E-Ink Reader', price: 129.50, image: 'e-reader.png' },
    { id: 10, name: 'DSLR Camera Kit', price: 1500.00, image: 'digital-camera.png' },
    { id: 11, name: 'Portable BT Speaker', price: 79.99, image: 'bluetooth-speaker.png' },
    { id: 12, name: 'Curved Ultrawide Monitor', price: 599.00, image: 'monitor.png' }
];

const productGrid = document.getElementById('product-grid');
const cartCountSpan = document.getElementById('cart-count');

let cart = [];
let audioContext;
let audioBuffer;

async function setupAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const response = await fetch('add-to-cart.mp3');
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    } catch (e) {
        console.error("Failed to load or decode audio file. Please allow autoplay in your browser settings.", e);
    }
}

function playAddToCartSound() {
    if (!audioContext || !audioBuffer) return;
    
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(0);
}

function renderProducts() {
    productGrid.innerHTML = '';
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.animationDelay = `${index * 75}ms`;
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">$${product.price.toFixed(2)}</p>
            <div class="product-card-actions">
                <button class="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                <button class="shop-now-btn" data-id="${product.id}">Shop Now</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

function addToCart(productId, button) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        updateCartCount();
        playAddToCartSound();
        
        button.textContent = 'Added!';
        button.style.backgroundColor = '#28a745';
        button.style.borderColor = '#28a745';
        button.style.color = 'white';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = 'Add to Cart';
            button.style.backgroundColor = '';
            button.style.borderColor = '';
            button.style.color = '';
            button.disabled = false;
        }, 1500);
    }
}

function updateCartCount() {
    cartCountSpan.textContent = cart.length;
    const cartButton = document.getElementById('cart-button');
    cartButton.classList.add('shake');
    setTimeout(() => cartButton.classList.remove('shake'), 500);
}

productGrid.addEventListener('click', (event) => {
    if (event.target.classList.contains('add-to-cart-btn')) {
        if (!audioContext) {
            setupAudio();
        }
        const productId = parseInt(event.target.dataset.id, 10);
        addToCart(productId, event.target);
    } else if (event.target.classList.contains('shop-now-btn')) {
        const productId = parseInt(event.target.dataset.id, 10);
        const product = products.find(p => p.id === productId);
        if (product) {
            const message = `Hello, I'm interested in the ${product.name} (Price: $${product.price.toFixed(2)}).`;
            const whatsappUrl = `https://wa.me/254792346787?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        }
    }
});

renderProducts();

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Don't scroll for cart button
        if (this.id === 'cart-button') {
            e.preventDefault();
            
            if (cart.length === 0) {
                alert('Your cart is empty. Add some products first!');
                return;
            }

            let message = "Hello, I'm interested in purchasing the following items:\n\n";
            let totalPrice = 0;
            cart.forEach(product => {
                message += `- ${product.name} - $${product.price.toFixed(2)}\n`;
                totalPrice += product.price;
            });
            message += `\nTotal: $${totalPrice.toFixed(2)}`;
            
            const whatsappUrl = `https://wa.me/254792346787?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            return;
        }

        const href = this.getAttribute('href');

        if (href && href.length > 1) {
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        } else if (href === '#') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
});