import { coffeePrices, taxRate, discountThreshold, discountRate } from './data.mjs';

// Hitung harga berdasarkan kopi, ukuran, dan jumlah
export function calculateSubtotal(coffee, size, quantity) {
const price = coffeePrices[coffee]?.[size] || 0;
  return price * quantity;
}

// Hitung total dengan pajak & diskon
export function calculateTotal(orders) {
let subtotal = 0;
let totalItems = 0;

orders.forEach(order => {
    subtotal += calculateSubtotal(order.coffee, order.size, order.quantity);
    totalItems += order.quantity;
});

  // Tambahkan diskon jika memenuhi syarat
if (totalItems >= discountThreshold) {
    subtotal *= (1 - discountRate);
}

  // Tambahkan pajak
  const tax = subtotal * taxRate;
    return subtotal + tax;
}

// Format harga ke Rupiah
export function formatCurrency(amount) {
    return `Rp ${amount.toLocaleString('id-ID')}`;
}
