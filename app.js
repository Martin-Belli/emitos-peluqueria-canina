'use strict';

const productGrid=document.getElementById("product-grid");
const categoryFilters=document.getElementById("category-filters");
const searchInput=document.getElementById("search-input");
const cartButton=document.getElementById("cart-button");
const cartDrawer=document.getElementById("cart-drawer");
const closeCartButton=document.getElementById("close-cart");
const backdrop=document.getElementById("backdrop");
const cartItems=document.getElementById("cart-items");
const cartCount=document.getElementById("cart-count");
const cartTotal=document.getElementById("cart-total");
const whatsappButton=document.getElementById("whatsapp-button");
const customerName=document.getElementById("customer-name");
const customerNotes=document.getElementById("customer-notes");
const emptyState=document.getElementById("empty-state");

const MAX_CART_QUANTITY=99;
let activeCategory="Todos";
let cart=loadCart();

const money=new Intl.NumberFormat(CONFIG.locale,{style:"currency",currency:CONFIG.currency,maximumFractionDigits:0});

function normalizeText(value,maxLength){
  return String(value??"").replace(/[\u0000-\u001F\u007F]/g," ").replace(/\s+/g," ").trim().slice(0,maxLength);
}

function escapeHtml(value=""){
  return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}

function isValidProductId(id){
  return PRODUCTS.some(product=>product.id===Number(id));
}

function sanitizeCart(rawCart){
  if(!rawCart||typeof rawCart!=="object"||Array.isArray(rawCart)) return {};
  const clean={};

  for(const [id,quantity] of Object.entries(rawCart)){
    const productId=Number(id);
    const qty=Number(quantity);

    if(Number.isInteger(productId)&&isValidProductId(productId)&&Number.isInteger(qty)&&qty>0){
      clean[productId]=Math.min(qty,MAX_CART_QUANTITY);
    }
  }
  return clean;
}

function loadCart(){
  try{
    return sanitizeCart(JSON.parse(localStorage.getItem("petshop-cart")||"{}"));
  }catch{
    return {};
  }
}

function saveCart(){
  cart=sanitizeCart(cart);
  localStorage.setItem("petshop-cart",JSON.stringify(cart));
}

function setShopInfo(){
  document.getElementById("shop-name").textContent=CONFIG.shopName;
  document.getElementById("footer-shop-name").textContent=CONFIG.shopName;
  document.getElementById("year").textContent=new Date().getFullYear();
  document.title=`${CONFIG.shopName} | Catálogo`;
}

function getCategories(){
  return ["Todos",...new Set(PRODUCTS.map(product=>product.category))];
}

function renderFilters(){
  categoryFilters.textContent="";
  getCategories().forEach(category=>{
    const button=document.createElement("button");
    button.className=`filter-button ${category===activeCategory?"active":""}`;
    button.type="button";
    button.textContent=category;
    button.addEventListener("click",()=>{
      activeCategory=category;
      renderFilters();
      renderProducts();
    });
    categoryFilters.appendChild(button);
  });
}

function renderProducts(){
  const term=normalizeText(searchInput.value,80).toLowerCase();
  const filtered=PRODUCTS.filter(product=>{
    const categoryMatch=activeCategory==="Todos"||product.category===activeCategory;
    const searchMatch=product.name.toLowerCase().includes(term)||product.description.toLowerCase().includes(term);
    return categoryMatch&&searchMatch;
  });

  productGrid.textContent="";
  emptyState.classList.toggle("hidden",filtered.length>0);

  filtered.forEach(product=>{
    const card=document.createElement("article");
    card.className="product-card";
    card.innerHTML=`
      <img class="product-image" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" referrerpolicy="no-referrer" />
      <div class="product-body">
        <span class="product-category">${escapeHtml(product.category)}</span>
        <h2 class="product-name">${escapeHtml(product.name)}</h2>
        <p class="product-description">${escapeHtml(product.description)}</p>
        <div class="product-price">${money.format(product.price)}</div>
        <button class="add-button" type="button">Agregar al carrito</button>
      </div>`;
    card.querySelector(".add-button").addEventListener("click",()=>addToCart(product.id));
    productGrid.appendChild(card);
  });
}

function addToCart(productId){
  if(!isValidProductId(productId)) return;
  cart[productId]=Math.min(Number(cart[productId]||0)+1,MAX_CART_QUANTITY);
  saveCart();
  renderCart();
}

function changeQuantity(productId,delta){
  if(!isValidProductId(productId)||!Number.isInteger(delta)) return;
  const next=Number(cart[productId]||0)+delta;
  if(next<=0) delete cart[productId];
  else cart[productId]=Math.min(next,MAX_CART_QUANTITY);
  saveCart();
  renderCart();
}

function removeFromCart(productId){
  if(!isValidProductId(productId)) return;
  delete cart[productId];
  saveCart();
  renderCart();
}

function cartEntries(){
  return Object.entries(sanitizeCart(cart)).map(([id,quantity])=>{
    const product=PRODUCTS.find(item=>item.id===Number(id));
    return product?{product,quantity}:null;
  }).filter(Boolean);
}

function calculateTotal(entries){
  return entries.reduce((sum,item)=>sum+item.product.price*item.quantity,0);
}

function renderCart(){
  const entries=cartEntries();
  const totalItems=entries.reduce((sum,item)=>sum+item.quantity,0);
  const totalPrice=calculateTotal(entries);

  cartCount.textContent=String(totalItems);
  cartTotal.textContent=money.format(totalPrice);
  whatsappButton.disabled=entries.length===0;
  cartItems.textContent="";

  if(entries.length===0){
    const empty=document.createElement("p");
    empty.textContent="Tu carrito está vacío.";
    cartItems.appendChild(empty);
    return;
  }

  entries.forEach(({product,quantity})=>{
    const item=document.createElement("div");
    item.className="cart-item";

    const info=document.createElement("div");
    const name=document.createElement("div");
    name.className="cart-item-name";
    name.textContent=product.name;

    const price=document.createElement("div");
    price.className="cart-item-price";
    price.textContent=`${money.format(product.price)} c/u`;

    const remove=document.createElement("button");
    remove.className="remove-button";
    remove.type="button";
    remove.textContent="Eliminar";
    remove.addEventListener("click",()=>removeFromCart(product.id));
    info.append(name,price,remove);

    const controls=document.createElement("div");
    controls.className="quantity-controls";

    const minus=document.createElement("button");
    minus.className="quantity-button";
    minus.type="button";
    minus.setAttribute("aria-label","Restar");
    minus.textContent="−";
    minus.addEventListener("click",()=>changeQuantity(product.id,-1));

    const qty=document.createElement("strong");
    qty.textContent=String(quantity);

    const plus=document.createElement("button");
    plus.className="quantity-button";
    plus.type="button";
    plus.setAttribute("aria-label","Sumar");
    plus.textContent="+";
    plus.addEventListener("click",()=>changeQuantity(product.id,1));

    controls.append(minus,qty,plus);
    item.append(info,controls);
    cartItems.appendChild(item);
  });
}

function openCart(){
  cartDrawer.classList.add("open");
  cartDrawer.setAttribute("aria-hidden","false");
  backdrop.classList.remove("hidden");
  document.body.style.overflow="hidden";
}

function closeCart(){
  cartDrawer.classList.remove("open");
  cartDrawer.setAttribute("aria-hidden","true");
  backdrop.classList.add("hidden");
  document.body.style.overflow="";
}

function buildWhatsappMessage(){
  cart=sanitizeCart(cart);
  const entries=cartEntries();
  const totalPrice=calculateTotal(entries);

  const lines=[`Hola, quiero hacer un pedido en ${CONFIG.shopName}:`,""];

  entries.forEach(({product,quantity})=>{
    const subtotal=product.price*quantity;
    lines.push(`• ${quantity} x ${product.name} — ${money.format(subtotal)}`);
  });

  lines.push("",`Total: ${money.format(totalPrice)}`);

  const name=normalizeText(customerName.value,60);
  const notes=normalizeText(customerNotes.value,300);

  if(name) lines.push("",`Nombre: ${name}`);
  if(notes) lines.push(`Aclaraciones: ${notes}`);

  lines.push("","Pedido sujeto a confirmación de disponibilidad y precio final.");
  return lines.join("\n");
}

function sendWhatsapp(){
  if(cartEntries().length===0) return;
  const number=CONFIG.whatsappNumber.replace(/\D/g,"");
  if(!number) return;

  const message=encodeURIComponent(buildWhatsappMessage());
  window.open(`https://wa.me/${number}?text=${message}`,"_blank","noopener,noreferrer");
}

searchInput.addEventListener("input",renderProducts);
cartButton.addEventListener("click",openCart);
closeCartButton.addEventListener("click",closeCart);
backdrop.addEventListener("click",closeCart);
whatsappButton.addEventListener("click",sendWhatsapp);
document.addEventListener("keydown",event=>{if(event.key==="Escape") closeCart();});

setShopInfo();
renderFilters();
renderProducts();
renderCart();
