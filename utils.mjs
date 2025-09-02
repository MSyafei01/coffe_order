// Daftar harga kopi berdasarkan jenis dan ukuran
// Hitung total harga untuk 1 jenis kopi
export function calculateTotal(coffee, size, quantity, coffeePrices) {
  return coffeePrices[coffee][size] * quantity;
}

// Hitung dengan pajak
export function applyTax(amount, taxRate) {
  return amount + amount * taxRate;
}

// Hitung diskon kalau jumlah pesanan banyak
export function applyDiscount(amount, quantity, discountThreshold) {
if (quantity >= discountThreshold) {
    return amount * 0.9; // diskon 10%
}
return amount;
}
