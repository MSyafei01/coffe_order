// Modul untuk menghitung total harga
export function calculateTotal(coffee, quantity) {
const prices = {
    "Espresso": 25000,
    "Latte": 25000,
    "Cappuccino": 23000,
    "Americano": 18000,
    "Water Ice": 5000
    };

  return prices[coffee] * quantity;
}
