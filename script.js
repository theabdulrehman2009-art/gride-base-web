

const productGrid = document.getElementById("productGrid");
const products = [...document.querySelectorAll(".product-card")];
const searchInput = document.getElementById("searchInput");
const filterButtons = [...document.querySelectorAll(".filter")];
const categoryButtons = [...document.querySelectorAll(".category-card")];
const productTotal = document.getElementById("productTotal");
const emptyMessage = document.getElementById("emptyMessage");
const cartCount = document.getElementById("cartCount");
const cartButton = document.getElementById("cartButton");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutButton = document.getElementById("checkoutButton");
const toast = document.getElementById("toast");
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

let activeCategory = "All";
let cart = [];
let toastTimeout;

function formatPrice(price) {
  return "Rs. " + price.toLocaleString("en-PK");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function filterProducts() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  products.forEach(product => {
    const name = product.dataset.name.toLowerCase();
    const category = product.dataset.category;
    const matchesSearch = name.includes(query);
    const matchesCategory = activeCategory === "All" || category === activeCategory;
    const visible = matchesSearch && matchesCategory;

    product.hidden = !visible;

    if (visible) {
      visibleCount++;
    }
  });

  productTotal.textContent = `${visibleCount} product${visibleCount === 1 ? "" : "s"}`;
  emptyMessage.hidden = visibleCount !== 0;
}

function setCategory(category) {
  activeCategory = category;

  filterButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.filter === category);
  });

  filterProducts();
  document.getElementById("products").scrollIntoView({ behavior: "smooth" });
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    setCategory(button.dataset.filter);
  });
});

categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    searchInput.value = "";
    setCategory(button.dataset.category);
  });
});

searchInput.addEventListener("input", filterProducts);

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");

  if (!button) return;

  const product = button.closest(".product-card");
  const existingItem = cart.find(item => item.name === product.dataset.name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      name: product.dataset.name,
      price: Number(product.dataset.price),
      image: product.querySelector("img").src,
      quantity: 1
    });
  }

  updateCart();
  showToast(`${product.dataset.name} added to your bag`);
});

function updateCart() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartCount.textContent = totalItems;
  cartTotal.textContent = formatPrice(totalPrice);

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your bag is empty. Explore the collection to find something you love.</p>";
    return;
  }

  cartItems.replaceChildren();

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.name;

    const details = document.createElement("div");
    const name = document.createElement("h3");
    name.textContent = item.name;

    const price = document.createElement("p");
    price.textContent = `${formatPrice(item.price)} × ${item.quantity}`;

    const remove = document.createElement("button");
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      cart = cart.filter(cartItem => cartItem.name !== item.name);
      updateCart();
    });

    details.append(name, price, remove);

    const subtotal = document.createElement("strong");
    subtotal.textContent = formatPrice(item.price * item.quantity);

    row.append(image, details, subtotal);
    cartItems.append(row);
  });
}

function openCart() {
  cartOverlay.classList.add("open");
  document.body.style.overflow = "hidden";
  closeCart.focus();
}

function hideCart() {
  cartOverlay.classList.remove("open");
  document.body.style.overflow = "";
  cartButton.focus();
}

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", hideCart);

cartOverlay.addEventListener("click", event => {
  if (event.target === cartOverlay) {
    hideCart();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && cartOverlay.classList.contains("open")) {
    hideCart();
  }
});

checkoutButton.addEventListener("click", () => {
  hideCart();

  if (cart.length > 0) {
    showToast("Demo complete! No payment was taken.");
  } else {
    showToast("Your shopping bag is empty.");
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

updateCart();
filterProducts();
