/* G.L. Bajaj Online Book Store - script.js (vanilla JavaScript)
   Sections: 1 data, 2 cart helpers, 3 catalogue, 4 cart page, 5 login, 6 registration, 7 start-up */

/* 1. DATA - sample books (covers are local JPG files in assets/book-covers) */
const BOOKS = [
  { id:'cse1', title:'Computer Science: An Interdisciplinary Approach', author:'Robert Sedgewick & Kevin Wayne', publisher:'Addison-Wesley', price:4000, category:'CSE' },
  { id:'cse2', title:'Operating System Concepts', author:'Silberschatz, Galvin & Gagne', publisher:'Wiley', price:3800, category:'CSE' },
  { id:'cse3', title:'Database System Concepts', author:'Silberschatz, Korth & Sudarshan', publisher:'McGraw Hill', price:2500, category:'CSE' },
  { id:'cse4', title:'Artificial Intelligence: A Textbook', author:'Charu C. Aggarwal', publisher:'Springer', price:5000, category:'CSE' },
  { id:'ece1', title:'Electronic Devices and Circuit Theory', author:'Robert L. Boylestad & Louis Nashelsky', publisher:'Pearson', price:3200, category:'ECE' },
  { id:'ece2', title:'Digital Design', author:'M. Morris Mano', publisher:'Prentice Hall', price:2700, category:'ECE' },
  { id:'ece3', title:'Signals & Systems', author:'Oppenheim, Willsky & Nawab', publisher:'Prentice Hall', price:3400, category:'ECE' },
  { id:'ece4', title:'Microelectronic Circuits', author:'Sedra & Smith', publisher:'Oxford University Press', price:4200, category:'ECE' },
  { id:'mech1', title:'Basic Mechanical Engineering', author:'Basant Agrawal & C. M. Agrawal', publisher:'Wiley India', price:3500, category:'Mechanical' },
  { id:'mech2', title:'Engineering Thermodynamics', author:'P. K. Nag', publisher:'McGraw Hill', price:2900, category:'Mechanical' },
  { id:'mech3', title:'Fluid Mechanics and Hydraulic Machines', author:'Dr. R. K. Bansal', publisher:'Laxmi Publications', price:2200, category:'Mechanical' },
  { id:'mech4', title:'Theory of Machines', author:'S. S. Rattan', publisher:'McGraw Hill', price:3100, category:'Mechanical' }
];
const CART_KEY = 'glbBookCart';
const $ = (id) => document.getElementById(id);
const rs = (n) => 'Rs. ' + n.toLocaleString('en-IN');          // 4000 -> "Rs. 4,000"
const cover = (b) => 'assets/book-covers/' + b.id + '.jpg';

/* 2. CART HELPERS - the cart is an array like [{id:'cse1', qty:2}] saved in localStorage */
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch (e) { return []; }                                      // corrupted data -> empty cart
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}
function updateCartCount() {                                    // total quantity shown in header badge
  const count = getCart().reduce((sum, item) => sum + item.qty, 0);
  const badge = $('cart-count');
  if (badge) badge.textContent = count;
}
function addToCart(id) {                                        // add new book or increase its quantity
  const cart = getCart();
  const found = cart.find((item) => item.id === id);
  if (found) found.qty += 1; else cart.push({ id: id, qty: 1 });
  saveCart(cart);
  const book = BOOKS.find((b) => b.id === id);
  showToast('"' + book.title + '" added to cart');
}
function changeQty(id, change) {                                // + / - buttons (minimum quantity 1)
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + change);
  saveCart(cart);
  renderCart();
}
function removeFromCart(id) {
  saveCart(getCart().filter((item) => item.id !== id));
  renderCart();
}
function cartTotal(cart) {                                      // sum of price x quantity
  return cart.reduce((sum, item) => {
    const book = BOOKS.find((b) => b.id === item.id);
    return book ? sum + book.price * item.qty : sum;
  }, 0);
}
function showToast(text) {
  const t = $('toast');
  if (!t) return;
  t.textContent = text;
  t.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => t.classList.remove('show'), 1800);
}

/* 3. CATALOGUE - filter by category and draw table rows */
function renderCatalogue(category) {
  const list = category === 'All' ? BOOKS : BOOKS.filter((b) => b.category === category);
  $('catalogue-body').innerHTML = list.map((b) => `
    <tr>
      <td data-label="Cover"><img src="${cover(b)}" alt="Cover of ${b.title}"></td>
      <td data-label="Title">${b.title}</td>
      <td data-label="Author">${b.author}</td>
      <td data-label="Publisher">${b.publisher}</td>
      <td data-label="Category"><span class="tag">${b.category}</span></td>
      <td data-label="Price">${rs(b.price)}</td>
      <td data-label=""><button class="btn btn-sm" data-add="${b.id}">Add to Cart</button></td>
    </tr>`).join('');
  $('result-info').textContent = 'Showing ' + list.length + ' book' + (list.length === 1 ? '' : 's') +
    (category === 'All' ? '' : ' in ' + category);
  document.querySelectorAll('.chip').forEach((c) => c.setAttribute('aria-pressed', c.dataset.filter === category));
  document.querySelectorAll('.sidebar a[data-cat]').forEach((a) => a.classList.toggle('active', a.dataset.cat === category));
}
function initCatalogue() {
  const valid = ['All', 'CSE', 'ECE', 'Mechanical'];
  const param = new URLSearchParams(location.search).get('cat');
  renderCatalogue(valid.includes(param) ? param : 'All');
  document.querySelectorAll('.chip').forEach((c) => c.addEventListener('click', () => {
    renderCatalogue(c.dataset.filter);
    history.replaceState(null, '', '?cat=' + c.dataset.filter);
  }));
  document.querySelectorAll('.sidebar a[data-cat]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();                                         // filter without reloading the page
    renderCatalogue(a.dataset.cat);
    history.replaceState(null, '', '?cat=' + a.dataset.cat);
  }));
  $('catalogue-body').addEventListener('click', (e) => {        // one listener handles every Add button
    const btn = e.target.closest('[data-add]');
    if (btn) addToCart(btn.dataset.add);
  });
}

/* 4. CART PAGE */
function renderCart() {
  const cart = getCart().filter((i) => BOOKS.some((b) => b.id === i.id));
  $('cart-empty').hidden = cart.length > 0;
  $('cart-full').hidden = cart.length === 0;
  $('cart-body').innerHTML = cart.map((item) => {
    const b = BOOKS.find((x) => x.id === item.id);
    return `
    <tr>
      <td data-label="Cover"><img src="${cover(b)}" alt="Cover of ${b.title}"></td>
      <td data-label="Title">${b.title}</td>
      <td data-label="Author">${b.author}</td>
      <td data-label="Price">${rs(b.price)}</td>
      <td data-label="Quantity"><span class="qty">
        <button type="button" data-qty="-1" data-id="${b.id}" aria-label="Decrease quantity of ${b.title}">-</button>
        <span aria-live="polite">${item.qty}</span>
        <button type="button" data-qty="1" data-id="${b.id}" aria-label="Increase quantity of ${b.title}">+</button></span></td>
      <td data-label="Subtotal">${rs(b.price * item.qty)}</td>
      <td data-label=""><button type="button" class="btn btn-sm btn-danger" data-remove="${b.id}">Remove</button></td>
    </tr>`;
  }).join('');
  $('cart-total').textContent = rs(cartTotal(cart));
}
function initCart() {
  renderCart();
  $('cart-body').addEventListener('click', (e) => {
    const q = e.target.closest('[data-qty]'), r = e.target.closest('[data-remove]');
    if (q) changeQty(q.dataset.id, Number(q.dataset.qty));
    if (r) removeFromCart(r.dataset.remove);
  });
  $('checkout-btn').addEventListener('click', () => {           // demo only - no payment
    const total = cartTotal(getCart());
    saveCart([]);
    renderCart();
    const m = $('checkout-msg');
    m.className = 'msg ok center';
    m.textContent = 'Demo checkout complete. Order total ' + rs(total) + '. No real payment was taken.';
  });
}

/* 5. LOGIN - demo validation only */
function setError(id, text) {                                   // show/clear a field error message
  const err = $(id + '-error'), field = $(id);
  if (err) err.textContent = text;
  if (field && field.classList) field.classList.toggle('invalid', text !== '');
  return text === '';
}
function validateLogin(username, password) {
  const okU = setError('username', username.trim().length >= 3 ? '' : 'Enter a username of at least 3 characters.');
  const okP = setError('password', password.length >= 6 ? '' : 'Enter a password of at least 6 characters.');
  return okU && okP;
}
function initLogin() {
  $('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = $('login-msg');
    if (validateLogin($('username').value, $('password').value)) {
      msg.className = 'msg ok';
      msg.textContent = 'Demo login successful. Welcome, ' + $('username').value.trim() + '! (No real authentication was used.)';
    } else {
      msg.className = 'msg bad';
      msg.textContent = 'Please fix the errors above.';
    }
  });
  $('login-form').addEventListener('reset', () => {
    ['username', 'password'].forEach((id) => setError(id, ''));
    $('login-msg').textContent = '';
  });
}

/* 6. REGISTRATION */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;               // text@domain.tld
const MOBILE_RE = /^[0-9]{10}$/;                                 // exactly ten digits
function validateRegistration(d) {                               // d = form values; returns list of errors
  const errors = {};
  if (d.name.trim().length < 2) errors.name = 'Enter your full name.';
  else if (!/^[A-Za-z][A-Za-z .'-]*$/.test(d.name.trim())) errors.name = 'Name can contain only letters and spaces.';
  if (!EMAIL_RE.test(d.email.trim())) errors.email = 'Enter a valid email, e.g. name@example.com.';
  if (!MOBILE_RE.test(d.mobile.trim())) errors.mobile = 'Mobile number must be exactly 10 digits.';
  if (d.password.length < 6) errors['reg-password'] = 'Password must be at least 6 characters.';
  if (d.confirm !== d.password || d.confirm === '') errors.confirm = 'Passwords do not match.';
  return errors;
}
function fillDob() {                                             // build day / month / year dropdowns
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const opt = (v, t) => `<option value="${v}">${t}</option>`;
  let d = opt('', 'Day'), m = opt('', 'Month'), y = opt('', 'Year');
  for (let i = 1; i <= 31; i++) d += opt(i, i);
  months.forEach((n, i) => m += opt(i + 1, n));
  for (let yr = new Date().getFullYear(); yr >= 1960; yr--) y += opt(yr, yr);
  $('dob-day').innerHTML = d; $('dob-month').innerHTML = m; $('dob-year').innerHTML = y;
}
function initRegistration() {
  fillDob();
  $('reg-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      name: $('name').value, email: $('email').value, mobile: $('mobile').value,
      password: $('reg-password').value, confirm: $('confirm').value
    };
    const errors = validateRegistration(data);
    ['name', 'email', 'mobile', 'reg-password', 'confirm'].forEach((id) => setError(id, errors[id] || ''));
    const msg = $('reg-msg');
    if (Object.keys(errors).length) {
      msg.className = 'msg bad';
      msg.textContent = 'Registration failed: please correct ' + Object.keys(errors).length + ' field(s) above.';
      return;
    }
    msg.className = 'msg ok';
    msg.textContent = 'Registration successful! Welcome, ' + data.name.trim() + '. (Demo only: nothing was sent or stored.)';
    $('reg-form').reset();
  });
}

/* 7. START-UP - run the right setup for the current page */
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  if ($('catalogue-body')) initCatalogue();
  if ($('cart-body')) initCart();
  if ($('login-form')) initLogin();
  if ($('reg-form')) initRegistration();
});
