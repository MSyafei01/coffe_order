import { calculateSubtotal, calculateTotal, formatCurrency } from './utils.mjs';

let orders = [];

const coffeeSelect = document.getElementById('coffee');
const sizeSelect = document.getElementById('size');
const quantityInput = document.getElementById('quantity');
const addOrderBtn = document.getElementById('addOrder');
const orderList = document.getElementById('orderList');
const totalPriceEl = document.getElementById('totalPrice');

// Tambahkan pesanan ke daftar
addOrderBtn.addEventListener('click', () => {
  const coffee = coffeeSelect.value;
  const size = sizeSelect.value;
  const quantity = parseInt(quantityInput.value);

  if (!coffee || !size || quantity < 1) {
    alert("Mohon lengkapi pesanan dengan benar.");
    return;
  }

  const subtotal = calculateSubtotal(coffee, size, quantity);

  // Tambahkan pesanan ke array
  orders.push({ coffee, size, quantity, subtotal });

  // Update UI ringkasan
  renderOrders();
});

// Render daftar pesanan
function renderOrders() {
  orderList.innerHTML = "";

  orders.forEach((order, index) => {
    const li = document.createElement('li');
    li.textContent = `${order.quantity}x ${capitalize(order.coffee)} (${capitalize(order.size)}) - ${formatCurrency(order.subtotal)}`;

    // Tombol hapus
    const removeBtn = document.createElement('button');
    removeBtn.textContent = "❌";
    removeBtn.onclick = () => {
      orders.splice(index, 1);
      renderOrders();
    };

    li.appendChild(removeBtn);
    orderList.appendChild(li);
  });

  // Hitung total
  const total = calculateTotal(orders);
  totalPriceEl.textContent = `Total: ${formatCurrency(total)}`;
}

// Helper kapitalisasi huruf pertama
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
