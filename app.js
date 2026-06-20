// ============================================================
//  ShopNow — App Logic
// ============================================================

let cart = [];
let currentPage = 'home';
let previousPage = 'home';

// ── Page routing ────────────────────────────────────────────
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(name + 'Page').classList.add('active');
  previousPage = currentPage;
  currentPage = name;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
  showPage(previousPage === 'detail' ? 'products' : previousPage);
}

// ── Render helpers ──────────────────────────────────────────
function stars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(empty);
}

function productCard(product) {
  const discount = product.originalPrice
    ? Math.round((1 - product.originalPrice / product.originalPrice) * 100)
    : null;
  return `
    <div class="product-card" onclick="showDetail(${product.id})">
      <div class="card-image-wrap">
        <img src="${product.image}" alt="${product.name}"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
        <div class="placeholder-img">
          <span>📦</span>
          <p>${product.image.split('/').pop()}</p>
        </div>
        ${product.badge ? `<span class="badge">${product.badge}</span>` : ''}
      </div>
      <div class="card-body">
        <span class="card-category">${product.category}</span>
        <h3 class="card-name">${product.name}</h3>
        <div class="card-rating">
          <span class="stars">${stars(product.rating)}</span>
          <span class="review-count">(${product.reviews})</span>
        </div>
        <div class="card-price">
          <span class="price">$${product.price.toFixed(2)}</span>
          ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
        </div>
        <button class="btn-add" onclick="event.stopPropagation(); addToCart(${product.id})">Add to Cart</button>
      </div>
    </div>`;
}

// ── Render grids ────────────────────────────────────────────
function renderFeatured() {
  const featured = PRODUCTS.filter(p => p.featured);
  document.getElementById('featuredGrid').innerHTML = featured.map(productCard).join('');
}

function renderAll(list) {
  const grid = document.getElementById('allProductsGrid');
  grid.innerHTML = list.length
    ? list.map(productCard).join('')
    : '<p class="no-results">No products found.</p>';
}

function filterProducts() {
  const query = (document.getElementById('searchInput')?.value || '').toLowerCase();
  const category = document.getElementById('categoryFilter')?.value || 'all';
  const sort = document.getElementById('sortFilter')?.value || 'default';

  let list = PRODUCTS.filter(p => {
    const matchCat = category === 'all' || p.category === category;
    const matchQ = p.name.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
    return matchCat && matchQ;
  });

  if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));

  renderAll(list);
}

// ── Product detail ──────────────────────────────────────────
function showDetail(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  previousPage = currentPage;
  document.getElementById('productDetail').innerHTML = `
    <div class="detail-image-wrap">
      <img src="${p.image}" alt="${p.name}"
           onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />
      <div class="placeholder-img large">
        <span>📦</span><p>${p.image.split('/').pop()}</p>
      </div>
    </div>
    <div class="detail-info">
      <span class="card-category">${p.category}</span>
      ${p.badge ? `<span class="badge">${p.badge}</span>` : ''}
      <h2>${p.name}</h2>
      <div class="card-rating">
        <span class="stars">${stars(p.rating)}</span>
        <span class="review-count">${p.rating} · ${p.reviews} reviews</span>
      </div>
      <div class="detail-price">
        <span class="price large">$${p.price.toFixed(2)}</span>
        ${p.originalPrice ? `<span class="original-price">$${p.originalPrice.toFixed(2)}</span>` : ''}
      </div>
      <p class="detail-desc">${p.description}</p>
      <div class="detail-qty">
        <label>Qty</label>
        <input type="number" id="detailQty" value="1" min="1" max="99" />
      </div>
      <button class="btn-primary large" onclick="addToCart(${p.id}, parseInt(document.getElementById('detailQty').value))">
        Add to Cart
      </button>
    </div>`;
  showPage('detail');
}

// ── Cart ────────────────────────────────────────────────────
function addToCart(id, qty = 1) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += qty;
  else cart.push({ ...product, qty });
  updateCartUI();
  showToast(`"${product.name}" added to cart`);
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById('cartCount').textContent = count;
  document.getElementById('cartTotal').textContent = '$' + total.toFixed(2);
  const footer = document.getElementById('cartFooter');
  const itemsEl = document.getElementById('cartItems');
  if (cart.length === 0) {
    itemsEl.innerHTML = '<p class="empty-cart">Your cart is empty.</p>';
    footer.style.display = 'none';
  } else {
    footer.style.display = 'block';
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img"
             onerror="this.style.display='none'" />
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">$${item.price.toFixed(2)}</p>
          <div class="cart-item-qty">
            <button onclick="changeQty(${item.id}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${item.id})">✕</button>
      </div>`).join('');
  }
}

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

function checkout() {
  if (cart.length === 0) return;
  showToast('Order placed! Thank you 🎉');
  cart = [];
  updateCartUI();
  toggleCart();
}

// ── Toast ───────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── Init ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderFeatured();
  renderAll(PRODUCTS);
});
