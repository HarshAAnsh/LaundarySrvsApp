const services = [
  { id: 1, name: "Dry Cleaning", description: "Premium care for delicate garments.", price: 200, icon: "bi-stars" },
  { id: 2, name: "Wash & Fold", description: "Clean, dry and neatly folded clothes.", price: 100, icon: "bi-box-seam" },
  { id: 3, name: "Ironing", description: "Crisp finishing for everyday outfits.", price: 60, icon: "bi-wind" },
  { id: 4, name: "Stain Removal", description: "Targeted treatment for stubborn stains.", price: 150, icon: "bi-droplet-half" },
  { id: 5, name: "Leather & Suede Cleaning", description: "Specialized cleaning for premium items.", price: 350, icon: "bi-handbag" },
  { id: 6, name: "Wedding Dress Cleaning", description: "Gentle treatment for special garments.", price: 500, icon: "bi-gem" },
  { id: 7, name: "Curtain Cleaning", description: "Freshen curtains without the hassle.", price: 300, icon: "bi-layout-text-window" },
  { id: 8, name: "Blanket Cleaning", description: "Deep clean for blankets and quilts.", price: 250, icon: "bi-cloud" },
  { id: 9, name: "Shoe Cleaning", description: "Restore freshness to everyday footwear.", price: 180, icon: "bi-person-walking" },
  { id: 10, name: "Carpet Cleaning", description: "Deep cleaning for carpets and rugs.", price: 450, icon: "bi-grid-3x3-gap" },
  { id: 11, name: "Express Laundry", description: "Priority cleaning when time matters.", price: 250, icon: "bi-lightning-charge" },
  { id: 12, name: "Bedsheet Cleaning", description: "Fresh, hygienic and comfortable.", price: 140, icon: "bi-house-heart" },
  { id: 13, name: "Pillow Cleaning", description: "Gentle deep cleaning for pillows.", price: 120, icon: "bi-cloud-haze2" },
  { id: 14, name: "Jacket Cleaning", description: "Professional cleaning for jackets.", price: 220, icon: "bi-person-badge" },
  { id: 15, name: "Premium Package", description: "A complete care package for your wardrobe.", price: 699, icon: "bi-stars" }
];

let cart = [];

const serviceGrid = document.getElementById("serviceGrid");
const serviceList = document.getElementById("serviceList");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const serviceCount = document.getElementById("serviceCount");

function money(value) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function renderServices() {
  serviceGrid.innerHTML = services.map(service => `
    <div class="col-md-6 col-lg-4">
      <article class="service-card">
        <div class="service-icon"><i class="bi ${service.icon}"></i></div>
        <h5>${service.name}</h5>
        <p>${service.description}</p>
        <div class="d-flex justify-content-between align-items-center mt-3">
          <span class="price">${money(service.price)}</span>
          <button class="btn btn-sm btn-outline-primary rounded-pill px-3" onclick="addToCart(${service.id})">
            Add Item
          </button>
        </div>
      </article>
    </div>
  `).join("");

  serviceList.innerHTML = services.map(service => `
    <div class="service-row">
      <div>
        <span class="name">${service.name}</span>
        <span class="meta">${service.description}</span>
      </div>
      <span class="price">${money(service.price)}</span>
      <button class="btn btn-sm btn-outline-primary rounded-pill px-3" onclick="addToCart(${service.id})">
        Add Item
      </button>
    </div>
  `).join("");
}

function addToCart(id) {
  const service = services.find(item => item.id === id);
  if (!service) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
    showToast(`${service.name} quantity increased.`);
  } else {
    cart.push({ ...service, qty: 1 });
    showToast(`${service.name} added to your cart.`);
  }
  renderCart();
}

function removeFromCart(id) {
  const item = cart.find(service => service.id === id);
  if (!item) return;

  if (item.qty > 1) {
    item.qty -= 1;
    showToast(`${item.name} quantity reduced.`);
  } else {
    cart = cart.filter(service => service.id !== id);
    showToast(`${item.name} removed from cart.`);
  }
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  cartCount.textContent = count;
  serviceCount.textContent = `${count} selected`;
  cartTotal.textContent = money(total);

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="bi bi-basket2"></i>
        <h5>No services added yet</h5>
        <p>Click “Add Item” beside a service to start.</p>
      </div>`;
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-line">
      <div>
        <h6>${item.name}</h6>
        <small>${money(item.price)} × ${item.qty}</small>
      </div>
      <strong>${money(item.price * item.qty)}</strong>
      <button class="remove-btn" onclick="removeFromCart(${item.id})" aria-label="Remove ${item.name}">
        <i class="bi bi-trash3"></i>
      </button>
    </div>
  `).join("");
}

document.getElementById("addAllBtn").addEventListener("click", () => {
  if (!cart.length) {
    addToCart(1);
    addToCart(2);
    showToast("Starter services added to your cart.");
  } else {
    showToast("Your selected services are already in the cart.");
  }
});

function showToast(message) {
  document.getElementById("toastMessage").textContent = message;
  const toastEl = document.getElementById("actionToast");
  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2200 });
  toast.show();
}

document.getElementById("bookingForm").addEventListener("submit", function (event) {
  event.preventDefault();
  event.stopPropagation();

  if (!this.checkValidity()) {
    this.classList.add("was-validated");
    return;
  }

  if (!cart.length) {
    showToast("Please add at least one service before booking.");
    document.getElementById("services").scrollIntoView({ behavior: "smooth" });
    return;
  }

  const name = document.getElementById("fullName").value.trim();
  const success = document.getElementById("bookingSuccess");
  success.textContent = `Thank you, ${name}! Your booking request for ${cart.reduce((s, i) => s + i.qty, 0)} item(s) has been received.`;
  success.classList.remove("d-none");

  showToast("Booking submitted successfully.");
  this.reset();
  this.classList.remove("was-validated");
});

document.getElementById("newsletterForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("newsletterName").value.trim();
  const email = document.getElementById("newsletterEmail").value.trim();
  const message = document.getElementById("newsletterMessage");

  if (!name || !email || !email.includes("@")) {
    message.textContent = "Please enter your name and a valid email address.";
    message.classList.remove("d-none");
    return;
  }

  message.textContent = `Thanks ${name}! ${email} has been subscribed successfully.`;
  message.classList.remove("d-none");
  this.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();

document.querySelectorAll(".navbar .nav-link").forEach(link => {
  link.addEventListener("click", () => {
    const nav = document.getElementById("mainNav");
    const collapse = bootstrap.Collapse.getInstance(nav);
    if (collapse) collapse.hide();
  });
});

renderServices();
renderCart();
