// Data menu kopi
const coffeeMenu = [
    { id: 'kopi-hiram', name: 'Kopi Hiram (Tubruk)', icon: 'fa-mug-hot', prices: { small: 18180, medium: 22725, large: 27270 } },
    { id: 'mocha-latte', name: 'Mocha Coffee Latte', icon: 'fa-mug-hot', prices: { small: 30000, medium: 37500, large: 45000 } },
    { id: 'hazelnut-latte', name: 'Hazelnut Coffee Latte', icon: 'fa-mug-hot', prices: { small: 30000, medium: 37500, large: 45000 } },
    { id: 'kopi-susu', name: 'Kopi Susu', icon: 'fa-mug-hot', prices: { small: 20000, medium: 25000, large: 30000 } },
    { id: 'kopi-jahe', name: 'Kopi Jahe', icon: 'fa-mug-hot', prices: { small: 20000, medium: 25000, large: 30000 } },
    { id: 'kopi-susu-jahe', name: 'Kopi Susu Jahe', icon: 'fa-mug-hot', prices: { small: 21818, medium: 27273, large: 32728 } },
    { id: 'espresso', name: 'Espresso Coffee', icon: 'fa-coffee', prices: { small: 18180, medium: 22725, large: 27270 } },
    { id: 'double-espresso', name: 'Double Espresso Coffee', icon: 'fa-coffee', prices: { small: 21818, medium: 27273, large: 32728 } },
    { id: 'press-coffee', name: 'Press Coffee', icon: 'fa-filter', prices: { small: 24544, medium: 30680, large: 36816 } },
    { id: 'drip-coffee', name: 'Drip Coffee', icon: 'fa-filter', prices: { small: 24544, medium: 30680, large: 36816 } },
    { id: 'v60-coffee', name: 'V-60 Coffee', icon: 'fa-filter', prices: { small: 24544, medium: 30680, large: 36816 } },
    { id: 'honey-coffee', name: 'Honey Coffee', icon: 'fa-mug-hot', prices: { small: 24544, medium: 30680, large: 36816 } }
];

// Konstanta
const TAX_RATE = 0.1;
const DISCOUNT_THRESHOLD = 3;
const DISCOUNT_RATE = 0.15;

// State aplikasi
let currentOrder = {
    coffee: null,
    size: 'medium',
    quantity: 1
};

let orders = [];
let orderHistory = [];

// Elemen DOM
const coffeeOptionsEl = document.getElementById('coffeeOptions');
const sizeOptionsEl = document.getElementById('sizeOptions');
const quantityDisplayEl = document.getElementById('quantityDisplay');
const decreaseQtyBtn = document.getElementById('decreaseQty');
const increaseQtyBtn = document.getElementById('increaseQty');
const addOrderBtn = document.getElementById('addOrderBtn');
const orderListEl = document.getElementById('orderList');
const subtotalEl = document.getElementById('subtotal');
const taxEl = document.getElementById('tax');
const discountRowEl = document.getElementById('discountRow');
const discountEl = document.getElementById('discount');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkoutBtn');
const receiptModal = document.getElementById('receiptModal');
const closeModal = document.getElementById('closeModal');
const receiptContent = document.getElementById('receiptContent');
const printReceiptBtn = document.getElementById('printReceipt');

// Inisialisasi pilihan kopi
function initCoffeeOptions() {
    coffeeMenu.forEach(coffee => {
        const coffeeCard = document.createElement('div');
        coffeeCard.className = 'coffee-card';
        coffeeCard.dataset.id = coffee.id;
        coffeeCard.innerHTML = `
            <div class="size-indicator" id="size-indicator-${coffee.id}">MEDIUM</div>
            <i class="fas ${coffee.icon}"></i>
            <h3>${coffee.name}</h3>
            <div class="price" id="price-${coffee.id}">Rp ${coffee.prices.medium.toLocaleString('id-ID')}</div>
        `;
        
        coffeeCard.addEventListener('click', () => {
            document.querySelectorAll('.coffee-card').forEach(card => {
                card.classList.remove('selected');
            });
            coffeeCard.classList.add('selected');
            currentOrder.coffee = coffee.id;
            updateAddButtonState();
        });
        
        coffeeOptionsEl.appendChild(coffeeCard);
    });
}

// Inisialisasi pilihan ukuran
function initSizeOptions() {
    const sizeButtons = sizeOptionsEl.querySelectorAll('.size-btn');
    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            sizeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            
            const newSize = button.dataset.size;
            currentOrder.size = newSize;
            
            // Update harga berdasarkan ukuran yang dipilih
            updatePricesForSize(newSize);
        });
    });
    
    // Set default selection
    sizeButtons[1].classList.add('selected'); // Medium
}

// Update harga berdasarkan ukuran yang dipilih
function updatePricesForSize(size) {
    const sizeName = size.toUpperCase();
    
    coffeeMenu.forEach(coffee => {
        const priceElement = document.getElementById(`price-${coffee.id}`);
        const sizeIndicator = document.getElementById(`size-indicator-${coffee.id}`);
        
        if (priceElement && sizeIndicator) {
            const price = coffee.prices[size];
            priceElement.textContent = `Rp ${price.toLocaleString('id-ID')}`;
            sizeIndicator.textContent = sizeName;
            
            // Animasi perubahan harga
            priceElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                priceElement.style.transform = 'scale(1)';
            }, 300);
        }
    });
}

// Update state tombol tambah pesanan
function updateAddButtonState() {
    addOrderBtn.disabled = !currentOrder.coffee;
}

// Format currency
function formatCurrency(amount) {
    return `Rp ${amount.toLocaleString('id-ID')}`;
}

// Hitung harga berdasarkan kopi dan ukuran
function calculatePrice(coffeeId, size) {
    const coffee = coffeeMenu.find(item => item.id === coffeeId);
    return coffee ? coffee.prices[size] : 0;
}

// Tambah pesanan
function addOrder() {
    if (!currentOrder.coffee) return;
    
    const price = calculatePrice(currentOrder.coffee, currentOrder.size);
    const coffee = coffeeMenu.find(item => item.id === currentOrder.coffee);
    
    orders.push({
        id: Date.now(), // ID unik
        name: coffee.name,
        size: currentOrder.size,
        quantity: currentOrder.quantity,
        price: price,
        total: price * currentOrder.quantity
    });
    
    renderOrders();
    updateAddButtonState();
    
    // Reset selection
    document.querySelectorAll('.coffee-card').forEach(card => {
        card.classList.remove('selected');
    });
    currentOrder.coffee = null;
}

// Hapus pesanan
function removeOrder(orderId) {
    orders = orders.filter(order => order.id !== orderId);
    renderOrders();
}

// Render daftar pesanan
function renderOrders() {
    if (orders.length === 0) {
        orderListEl.innerHTML = `
            <li class="empty-cart">
                <i class="fas fa-coffee"></i>
                <p>Belum ada pesanan</p>
            </li>
        `;
        checkoutBtn.disabled = true;
        return;
    }
    
    orderListEl.innerHTML = '';
    checkoutBtn.disabled = false;
    
    orders.forEach(order => {
        const orderItem = document.createElement('li');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <div class="order-details">
                <div class="order-name">${order.name}</div>
                <div class="order-meta">${order.quantity}x • ${order.size.toUpperCase()}</div>
            </div>
            <div class="order-price">${formatCurrency(order.total)}</div>
            <div class="order-actions">
                <button class="action-btn delete-btn" data-id="${order.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        orderListEl.appendChild(orderItem);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => {
            removeOrder(parseInt(button.dataset.id));
        });
    });
    
    updateSummary();
}

// Update ringkasan pesanan
function updateSummary() {
    const subtotal = orders.reduce((sum, order) => sum + order.total, 0);
    const tax = subtotal * TAX_RATE;
    
    // Cek apakah eligible untuk diskon
    const totalItems = orders.reduce((sum, order) => sum + order.quantity, 0);
    const hasDiscount = totalItems >= DISCOUNT_THRESHOLD;
    const discount = hasDiscount ? subtotal * DISCOUNT_RATE : 0;
    
    const total = subtotal + tax - discount;
    
    subtotalEl.textContent = formatCurrency(subtotal);
    taxEl.textContent = formatCurrency(tax);
    
    if (hasDiscount) {
        discountRowEl.style.display = 'flex';
        discountEl.textContent = `-${formatCurrency(discount)}`;
    } else {
        discountRowEl.style.display = 'none';
    }
    
    totalEl.textContent = formatCurrency(total);
}

// Generate receipt content
function generateReceipt() {
    const subtotal = orders.reduce((sum, order) => sum + order.total, 0);
    const tax = subtotal * TAX_RATE;
    const totalItems = orders.reduce((sum, order) => sum + order.quantity, 0);
    const hasDiscount = totalItems >= DISCOUNT_THRESHOLD;
    const discount = hasDiscount ? subtotal * DISCOUNT_RATE : 0;
    const total = subtotal + tax - discount;
    
    // Generate order number (YYYYMMDD-HHMMSS)
    const now = new Date();
    const orderNumber = `ORD-${now.getFullYear()}${(now.getMonth()+1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}-${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
    
    return `
        <div class="receipt-header">
            <h2>KOPI BAQI</h2>
            <p>Jl. Jotawang Kost Putra No. 72, Yogyakarta</p>
            <p>Telp: 08181818182</p>
        </div>
        
        <div class="receipt-details">
            <div class="receipt-item">
                <span>No. Pesanan:</span>
                <span>${orderNumber}</span>
            </div>
            <div class="receipt-item">
                <span>Tanggal:</span>
                <span>${now.toLocaleString('id-ID')}</span>
            </div>
        </div>
        
        <div class="receipt-items">
            ${orders.map(order => `
                <div class="receipt-item">
                    <span>${order.quantity}x ${order.name} (${order.size.toUpperCase()})</span>
                    <span>${formatCurrency(order.total)}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="receipt-totals">
            <div class="receipt-item">
                <span>Subtotal:</span>
                <span>${formatCurrency(subtotal)}</span>
            </div>
            <div class="receipt-item">
                <span>Pajak (10%):</span>
                <span>${formatCurrency(tax)}</span>
            </div>
            ${hasDiscount ? `
            <div class="receipt-item">
                <span>Diskon (15%):</span>
                <span>-${formatCurrency(discount)}</span>
            </div>
            ` : ''}
            <div class="receipt-item" style="font-weight: bold;">
                <span>TOTAL:</span>
                <span>${formatCurrency(total)}</span>
            </div>
        </div>
        
        <div class="receipt-footer">
            <p>Terima kasih atas kunjungan Anda!</p>
            <p>*** Silahkan tunjukkan struk ini ***</p>
        </div>
    `;
}

// Show receipt modal
function showReceipt() {
    receiptContent.innerHTML = generateReceipt();
    receiptModal.style.display = 'flex';
}

// Checkout
function checkout() {
    if (orders.length === 0) return;
    
    // Simpan ke riwayat pesanan
    orderHistory.push({
        date: new Date(),
        items: [...orders],
        total: parseFloat(totalEl.textContent.replace('Rp ', '').replace(/\./g, ''))
    });
    
    // Tampilkan struk
    showReceipt();
    
    // Reset pesanan
    orders = [];
    renderOrders();
}

// Event listeners
decreaseQtyBtn.addEventListener('click', () => {
    if (currentOrder.quantity > 1) {
        currentOrder.quantity--;
        quantityDisplayEl.textContent = currentOrder.quantity;
    }
});

increaseQtyBtn.addEventListener('click', () => {
    currentOrder.quantity++;
    quantityDisplayEl.textContent = currentOrder.quantity;
});

addOrderBtn.addEventListener('click', addOrder);
checkoutBtn.addEventListener('click', checkout);

// Modal event listeners
closeModal.addEventListener('click', () => {
    receiptModal.style.display = 'none';
});

printReceiptBtn.addEventListener('click', () => {
    window.print();
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === receiptModal) {
        receiptModal.style.display = 'none';
    }
});

// Inisialisasi aplikasi
function initApp() {
    initCoffeeOptions();
    initSizeOptions();
    updateAddButtonState();
}

// Jalankan aplikasi
initApp();