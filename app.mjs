import { calculateTotal } from './utils.mjs';

const form = document.getElementById('coffeeForm');
const summary = document.getElementById('orderSummary');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const coffee = document.getElementById('coffee').value;
  const quantity = parseInt(document.getElementById('quantity').value);

  const total = calculateTotal(coffee, quantity);

  summary.innerHTML = `
    Halo <b>${name}</b>,<br>
    Anda memesan <b>${quantity} ${coffee}</b>.<br>
    Total harga: <b>Rp ${total.toLocaleString()}</b>
  `;
});
