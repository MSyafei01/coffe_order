
import { coffeePrices, taxRate, discountThreshold } from "./data.mjs";
import { calculateTotal, applyTax, applyDiscount } from "./utils.mjs";

const form = document.getElementById("coffeeForm");
const orderSummary = document.getElementById("orderSummary");
const orderList = document.getElementById("orderList");
const totalPriceEl = document.getElementById("totalPrice");

let total = 0;

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const coffeeType = document.getElementById("coffeeType").value;
  const size = document.getElementById("size").value;
  const quantity = parseInt(document.getElementById("quantity").value);

  // hitung harga dasar
  let price = calculateTotal(coffeeType, size, quantity, coffeePrices);

  // terapkan diskon jika jumlah banyak
  price = applyDiscount(price, quantity, discountThreshold);

  // terapkan pajak
  price = applyTax(price, taxRate);

  const li = document.createElement("li");
  li.textContent = `${name} memesan ${quantity} ${size} ${coffeeType} (Rp ${price.toLocaleString()})`;
  orderList.appendChild(li);

  total += price;
  totalPriceEl.textContent = total.toLocaleString();

  orderSummary.classList.remove("hidden");
});
