const productGrid = document.getElementById("product-grid");
const categoryFilters = document.getElementById("category-filters");
const searchInput = document.getElementById("search-input");
const cartButton = document.getElementById("cart-button");
const cartDrawer = document.getElementById("cart-drawer");
const closeCartButton = document.getElementById("close-cart");
const backdrop = document.getElementById("backdrop");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const whatsappButton = document.getElementById("whatsapp-button");
const customerName = document.getElementById("customer-name");
const customerNotes = document.getElementById("customer-notes");
const emptyState = document.getElementById("empty-state");

let activeCategory = "Todos";
let cart = JSON.parse(localStorage.getItem("petshop-cart") || "{}");

const money = new Intl.NumberFormat(CONFIG.locale, {
  style: "currency",
  currency: CONFIG.currency,
  maximumFractionDigits: 0
});

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setShopInfo() {
  document.getElementById("shop-name").textContent = CONFIG.shopName;
  document.getElementById("footer-shop-name").textContent = CONFIG.shopName;
  document.getElementById("year").textContent = new Date().getFullYear();
  document.title = `${CONFIG.shopName} | Catálogo`;
}

function getCategories() {
  return ["Todos", ...new Set(PRODUCTS.map(product => product.category))];
}

function renderFilters() {
  categoryFilters.innerHTML = "";
  getCategories().forEach(category => {
    const button = document.createElement("button");
    button.className = `filter-button ${category === activeCategory ? "active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      activeCategory = category;
      renderFilters();
      renderProducts();
    });
    categoryFilters.appendChild(button);
  });
}

function renderProducts() {
  const term = searchInput.value.trim().toLowerCase();

  const filtered = PRODUCTS.filter(product => {
    const categoryMatch =
      activeCategory === "Todos" || product.category === activeCategory;

    const searchMatch =
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term);

    return categoryMatch && searchMatch;
  });

  productGrid.innerHTML = "";
  emptyState.classList.toggle("hidden", filtered.length > 0);

  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <img
        class="product-image"
        src="${escapeHtml(product.image)}"
        alt="${escapeHtml(product.name)}"
        loading="lazy"
      />
      <div class="product-body">
        <span class="product-category">${escapeHtml(product.category)}</span>
        <h2 class="product-name">${escapeHtml(product.name)}</h2>
        <p class="product-description">${escapeHtml(product.description)}</p>
        <div class="product-price">${money.format(product.price)}</div>
        <button class="add-button" data-product-id="${product.id}">
          Agregar al carrito
        </button>
      </div>
    `;

    card.querySelector(".add-button").addEventListener("click", () => {
      addToCart(product.id);
    });

    productGrid.appendChild(card);
  });
}

function addToCart(productId) {
  cart[productId] = (cart[productId] || 0) + 1;
  saveCart();
  renderCart();
}

function changeQuantity(productId, delta) {
  const next = (cart[productId] || 0) + delta;

  if (next <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = next;
  }

  saveCart();
  renderCart();
}

function removeFromCart(productId) {
  delete cart[productId];
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("petshop-cart", JSON.stringify(cart));
}

function cartEntries() {
  return Object.entries(cart)
    .map(([id, quantity]) => {
      const product = PRODUCTS.find(item => item.id === Number(id));
      return product ? { product, quantity } : null;
    })
    .filter(Boolean);
}

function renderCart() {
  const entries = cartEntries();
  const totalItems = entries.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = entries.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  cartCount.textContent = totalItems;
  cartTotal.textContent = money.format(totalPrice);
  whatsappButton.disabled = entries.length === 0;

  if (entries.length === 0) {
    cartItems.innerHTML = "<p>Tu carrito está vacío.</p>";
    return;
  }

  cartItems.innerHTML = "";

  entries.forEach(({ product, quantity }) => {
    const item = document.createElement("div");
    item.className = "cart-item";

    item.innerHTML = `
      <div>
        <div class="cart-item-name">${escapeHtml(product.name)}</div>
        <div class="cart-item-price">
          ${money.format(product.price)} c/u
        </div>
        <button class="remove-button">Eliminar</button>
      </div>

      <div class="quantity-controls">
        <button class="quantity-button minus" aria-label="Restar">−</button>
        <strong>${quantity}</strong>
        <button class="quantity-button plus" aria-label="Sumar">+</button>
      </div>
    `;

    item.querySelector(".minus").addEventListener("click", () => {
      changeQuantity(product.id, -1);
    });

    item.querySelector(".plus").addEventListener("click", () => {
      changeQuantity(product.id, 1);
    });

    item.querySelector(".remove-button").addEventListener("click", () => {
      removeFromCart(product.id);
    });

    cartItems.appendChild(item);
  });
}

function openCart() {
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden", "false");
  backdrop.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden", "true");
  backdrop.classList.add("hidden");
  document.body.style.overflow = "";
}

function buildWhatsappMessage() {
  const entries = cartEntries();
  const totalPrice = entries.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const lines = [
    `Hola, quiero hacer un pedido en ${CONFIG.shopName}:`,
    ""
  ];

  entries.forEach(({ product, quantity }) => {
    const subtotal = product.price * quantity;
    lines.push(
      `• ${quantity} x ${product.name} — ${money.format(subtotal)}`
    );
  });

  lines.push("");
  lines.push(`Total: ${money.format(totalPrice)}`);

  const name = customerName.value.trim();
  const notes = customerNotes.value.trim();

  if (name) {
    lines.push("");
    lines.push(`Nombre: ${name}`);
  }

  if (notes) {
    lines.push(`Aclaraciones: ${notes}`);
  }

  lines.push("");
  lines.push("Quedo a la espera de la confirmación del pedido y del precio final.");

  return lines.join("\n");
}

function sendWhatsapp() {
  if (cartEntries().length === 0) return;

  const number = CONFIG.whatsappNumber.replace(/\D/g, "");

  if (!number || number === "5491100000000") {
    alert("Antes de publicar, configurá tu número real de WhatsApp en productos.js.");
    return;
  }

  const message = encodeURIComponent(buildWhatsappMessage());
  const url = `https://wa.me/${number}?text=${message}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

searchInput.addEventListener("input", renderProducts);
cartButton.addEventListener("click", openCart);
closeCartButton.addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);
whatsappButton.addEventListener("click", sendWhatsapp);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeCart();
  }
});

setShopInfo();
renderFilters();
renderProducts();
renderCart();
