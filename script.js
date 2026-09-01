
const EMAILJS_PUBLIC_KEY = "DlO4-6C6zvOA3vleJ";
const EMAILJS_SERVICE_ID = "service_9o7tcmp";
const EMAILJS_TEMPLATE_ID = "template_8d3gx5o";


const DEBUG = true;

function debugLog(message, value = "") {
  if (DEBUG) {
    console.log("[FreshFold Debug]", message, value);
  }
}


/*     
   SERVICE DATA
  */

const services = [
  { id: 1, name: "Dry Cleaning", price: 200, icon: "bi-stars", text: "Care for delicate garments." },
  { id: 2, name: "Wash & Fold", price: 100, icon: "bi-box-seam", text: "Clean, dry and neatly folded." },
  { id: 3, name: "Ironing", price: 60, icon: "bi-wind", text: "Crisp finishing for clothes." },
  { id: 4, name: "Stain Removal", price: 150, icon: "bi-droplet-half", text: "Treatment for stubborn stains." },
  { id: 5, name: "Leather & Suede Cleaning", price: 350, icon: "bi-handbag", text: "Special care for premium items." },
  { id: 6, name: "Wedding Dress Cleaning", price: 500, icon: "bi-gem", text: "Gentle cleaning for special wear." },
  { id: 7, name: "Curtain Cleaning", price: 300, icon: "bi-layout-text-window", text: "Fresh curtains without the hassle." },
  { id: 8, name: "Blanket Cleaning", price: 250, icon: "bi-cloud", text: "Deep cleaning for blankets." },
  { id: 9, name: "Shoe Cleaning", price: 180, icon: "bi-person-walking", text: "Freshen your everyday footwear." },
  { id: 10, name: "Carpet Cleaning", price: 450, icon: "bi-grid-3x3-gap", text: "Deep cleaning for rugs and carpets." },
  { id: 11, name: "Express Laundry", price: 250, icon: "bi-lightning-charge", text: "Priority cleaning when needed." },
  { id: 12, name: "Bedsheet Cleaning", price: 140, icon: "bi-house-heart", text: "Fresh and hygienic bedsheets." },
  { id: 13, name: "Pillow Cleaning", price: 120, icon: "bi-cloud-haze2", text: "Gentle cleaning for pillows." },
  { id: 14, name: "Jacket Cleaning", price: 220, icon: "bi-person-badge", text: "Professional jacket cleaning." },
  { id: 15, name: "Premium Package", price: 699, icon: "bi-stars", text: "Complete care for your wardrobe." }
];


/* CART*/

let cart = [];


/* DOM ELEMENTS */

const serviceCards = document.getElementById("serviceCards");
const bookingServiceList = document.getElementById("bookingServiceList");
const cartItems = document.getElementById("cartItems");
const selectedCount = document.getElementById("selectedCount");
const cartCount = document.getElementById("cartCount");
const totalAmount = document.getElementById("totalAmount");

const bookingForm = document.getElementById("bookingForm");
const bookingButton = document.getElementById("bookingButton");
const buttonText = document.getElementById("buttonText");
const buttonSpinner = document.getElementById("buttonSpinner");
const bookingStatus = document.getElementById("bookingStatus");

const selectedServicesInput = document.getElementById("selectedServices");
const emailTotalAmount = document.getElementById("emailTotalAmount");


/* SMALL HELPER FUNCTIONS*/

function formatPrice(price) {
  return "₹" + price.toLocaleString("en-IN");
}

function getCartQuantity() {
  return cart.reduce(function (total, item) {
    return total + item.quantity;
  }, 0);
}

function getCartTotal() {
  return cart.reduce(function (total, item) {
    return total + item.price * item.quantity;
  }, 0);
}


/*     
   DISPLAY SERVICES
  */

function displayServices() {
  debugLog("Displaying services", services.length);

  serviceCards.innerHTML = "";
  bookingServiceList.innerHTML = "";

  services.forEach(function (service) {

    // Main service card
    serviceCards.innerHTML += `
      <div class="col-md-6 col-lg-4">
        <div class="service-card">
          <div class="service-icon">
            <i class="bi ${service.icon}"></i>
          </div>

          <h3>${service.name}</h3>
          <p>${service.text}</p>

          <div class="d-flex justify-content-between align-items-center mt-3">
            <span class="service-price">${formatPrice(service.price)}</span>

            <button
              class="btn btn-sm btn-outline-primary rounded-pill"
              onclick="addToCart(${service.id})"
            >
              Add Item
            </button>
          </div>
        </div>
      </div>
    `;


    // Booking section service row
    bookingServiceList.innerHTML += `
      <div class="booking-service-row">
        <div>
          <strong>${service.name}</strong>
          <small>${service.text}</small>
        </div>

        <span class="service-price">${formatPrice(service.price)}</span>

        <button
          class="btn btn-sm btn-outline-primary rounded-pill"
          onclick="addToCart(${service.id})"
        >
          Add Item
        </button>
      </div>
    `;
  });
}


/*     
   ADD TO CART
  */

function addToCart(serviceId) {
  const service = services.find(function (item) {
    return item.id === serviceId;
  });

  if (!service) {
    console.error("Service was not found:", serviceId);
    return;
  }

  const existingItem = cart.find(function (item) {
    return item.id === serviceId;
  });

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: service.id,
      name: service.name,
      price: service.price,
      quantity: 1
    });
  }

  debugLog("Cart after adding item", cart);
  updateCart();
}


/*     
   REMOVE FROM CART
  */

function removeFromCart(serviceId) {
  const item = cart.find(function (service) {
    return service.id === serviceId;
  });

  if (!item) {
    return;
  }

  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart = cart.filter(function (service) {
      return service.id !== serviceId;
    });
  }

  debugLog("Cart after removing item", cart);
  updateCart();
}


/*     
   UPDATE CART UI
  */

function updateCart() {
  const quantity = getCartQuantity();
  const total = getCartTotal();

  selectedCount.textContent = quantity + " selected";
  cartCount.textContent = quantity;
  totalAmount.textContent = formatPrice(total);

  // These hidden fields are what EmailJS will receive.
  selectedServicesInput.value = cart
    .map(function (item) {
      return item.name + " x " + item.quantity;
    })
    .join(", ");

  emailTotalAmount.value = formatPrice(total);

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <i class="bi bi-basket2"></i>
        <h4>No items added</h4>
        <p>Click Add Item beside a service.</p>
      </div>
    `;
    return;
  }

  cartItems.innerHTML = "";

  cart.forEach(function (item) {
    cartItems.innerHTML += `
      <div class="cart-line">
        <div>
          <strong>${item.name}</strong>
          <small class="d-block text-muted">
            ${formatPrice(item.price)} × ${item.quantity}
          </small>
        </div>

        <strong>${formatPrice(item.price * item.quantity)}</strong>

        <button
          class="remove-item"
          onclick="removeFromCart(${item.id})"
          aria-label="Remove ${item.name}"
        >
          <i class="bi bi-trash3"></i>
        </button>
      </div>
    `;
  });
}


/*     
   SIMPLE FORM VALIDATION
  */

function clearErrors() {
  document.getElementById("nameError").textContent = "";
  document.getElementById("emailError").textContent = "";
  document.getElementById("phoneError").textContent = "";
  document.getElementById("messageError").textContent = "";
}

function validateBookingForm() {
  clearErrors();

  const name = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const message = document.getElementById("message").value.trim();

  let valid = true;

  if (name.length < 2) {
    document.getElementById("nameError").textContent =
      "Please enter your full name.";
    valid = false;
  }

  // This checks the basic email format before EmailJS is called.
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    document.getElementById("emailError").textContent =
      "Please enter a valid email.";
    valid = false;
  }

  const phoneDigits = phone.replace(/\D/g, "");

  if (phoneDigits.length < 10) {
    document.getElementById("phoneError").textContent =
      "Please enter a valid phone number.";
    valid = false;
  }

  if (message.length < 5) {
    document.getElementById("messageError").textContent =
      "Please enter a pickup address or message.";
    valid = false;
  }

  if (cart.length === 0) {
    showBookingStatus("Please add at least one service before booking.", "error");
    valid = false;
  }

  debugLog("Form validation result", valid);

  return valid;
}



function setupEmailJS() {
  if (
  EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY" ||
    EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID" ||
    EMAILJS_TEMPLATE_ID === "YOUR_TEMPLATE_ID"
  ) {
    debugLog(
      "EmailJS is not configured yet. Replace the three placeholder values in script.js."
    );
    return false;
  }

  emailjs.init({
    publicKey: EMAILJS_PUBLIC_KEY
  });

  debugLog("EmailJS initialized successfully.");
  return true;
}


/*     
   BOOKING FORM SUBMIT
  */

bookingForm.addEventListener("submit", function (event) {
  event.preventDefault();

  debugLog("Booking form submitted.");

  if (!validateBookingForm()) {
    debugLog("Booking stopped because validation failed.");
    return;
  }

  const emailConfigured = setupEmailJS();

  if (!emailConfigured) {
    showBookingStatus(
      "Form is valid, but EmailJS is not configured. Add your Public Key, Service ID and Template ID in js/script.js.",
      "error"
    );
    console.warn(
      "EmailJS setup required before an email can actually be sent."
    );
    return;
  }

  bookingButton.disabled = true;
  buttonText.textContent = "Sending...";
  buttonSpinner.classList.remove("d-none");
  bookingStatus.className = "booking-status";
  bookingStatus.textContent = "";

  debugLog("Sending booking through EmailJS...");

  emailjs
    .sendForm(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      bookingForm
    )
    .then(
      function (response) {
        /*
          This is the successful EmailJS response.
          Only after this promise succeeds do we tell the user
          that the email was sent.
        */
        debugLog("EmailJS success response", response);

        showBookingStatus(
          "Booking submitted successfully. Confirmation email has been sent.",
          "success"
        );

        bookingForm.reset();
        cart = [];
        updateCart();
      },
      function (error) {
        // Keeping this log helps debug EmailJS configuration problems.
        console.error("EmailJS failed:", error);

        showBookingStatus(
          "The booking could not be sent. Please check your EmailJS configuration and try again.",
          "error"
        );
      }
    )
    .finally(function () {
      bookingButton.disabled = false;
      buttonText.textContent = "Book Now & Send Email";
      buttonSpinner.classList.add("d-none");
    });
});


function showBookingStatus(message, type) {
  bookingStatus.textContent = message;
  bookingStatus.className = "booking-status " + type;
}


/*     
   QUICK ADD BUTTON
  */

document.getElementById("addFirstServices").addEventListener("click", function () {
  // This button is intentionally simple: it adds two common services.
  addToCart(1);
  addToCart(2);
});


/*     
   NEWSLETTER
  */

document.getElementById("newsletterForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const name = document.getElementById("subscriberName").value.trim();
  const email = document.getElementById("subscriberEmail").value.trim();
  const status = document.getElementById("newsletterStatus");

  if (name.length < 2 || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
    status.textContent = "Please enter a valid name and email.";
    status.style.color = "#ffd5d8";
    return;
  }

  /*
    The assignment specifically requires EmailJS for booking.
    The newsletter is kept as a simple front-end interaction.
  */
  status.textContent = "Thanks! You have been subscribed.";
  status.style.color = "#ffffff";

  this.reset();
});


/*     
   START APPLICATION
  */

document.getElementById("year").textContent = new Date().getFullYear();

displayServices();
updateCart();

debugLog("Application loaded.");
