document.addEventListener("DOMContentLoaded", function () {

    const cart = document.querySelector(".cart");
    const cartButton = cart.querySelector("button");
    const countBadge = document.querySelector("#cart-count");
    const dishCards = document.querySelectorAll(".box1");
    const exploreButton = document.querySelector(".explore");
    const heroButton = document.querySelector(".order");

    let cartItems = {};

    function updateCartCount() {
        let totalItems = 0;

        Object.values(cartItems).forEach(function (item) {
            totalItems += item.quantity;
        });

        if (countBadge) {
            countBadge.textContent = totalItems;
        }
    }

    // Add food to cart
    dishCards.forEach(function (card) {
        const orderButton = card.querySelector("button");

        if (!orderButton) return;

        orderButton.addEventListener("click", function () {
            const name = card.querySelector("h3").textContent.trim();

            const price = parseFloat(
                card.querySelector("span").textContent
                    .replace("₹", "").trim()
            );

            const image = card.querySelector("img").src;

            if (cartItems[name]) {
                cartItems[name].quantity++;
            } else {
                cartItems[name] = {
                    name: name,
                    price: price,
                    image: image,
                    quantity: 1
                };
            }

            updateCartCount();
            alert(name + " added to your cart!");
        });
    });

    // Create cart popup
    const modal = document.createElement("div");
    modal.id = "cart-modal";
    modal.className = "cart-modal";

    modal.innerHTML = `
        <div class="cart-panel">
            <div class="cart-header">
                <h2 id="cart-heading">🛒 Your Cart</h2>
                <button class="close-cart" type="button">×</button>
            </div>
            <div id="cart-content"></div>
        </div>
    `;

    document.body.appendChild(modal);

    const cartContent = modal.querySelector("#cart-content");

    function getTotal() {
        return Object.values(cartItems).reduce(function (sum, item) {
            return sum + item.price * item.quantity;
        }, 0);
    }

    // Display cart items
    function renderCart() {
        const items = Object.values(cartItems);

        modal.querySelector("#cart-heading").textContent =
            "🛒 Your Cart";

        if (items.length === 0) {
            cartContent.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-icon">🛒</div>
                    <h3>Your cart is empty!</h3>
                    <p>Add your favourite food to get started.</p>
                    <button class="continue-shopping" type="button">
                        Explore Menu
                    </button>
                </div>
            `;
            return;
        }

        let html = `<div class="cart-items">`;

        items.forEach(function (item) {
            html += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">

                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>₹${item.price.toFixed(2)} each</p>

                        <div class="quantity-controls">
                            <button type="button"
                                data-action="minus"
                                data-name="${item.name}">−</button>

                            <span>${item.quantity}</span>

                            <button type="button"
                                data-action="plus"
                                data-name="${item.name}">+</button>
                        </div>
                    </div>

                    <div class="item-price">
                        <strong>
                            ₹${(item.price * item.quantity).toFixed(2)}
                        </strong>

                        <button class="remove-item" type="button"
                            data-action="remove"
                            data-name="${item.name}">
                            Remove
                        </button>
                    </div>
                </div>
            `;
        });

        html += `
            </div>

            <div class="cart-total">
                <div class="total-row">
                    <span>Subtotal</span>
                    <span>₹${getTotal().toFixed(2)}</span>
                </div>

                <div class="total-row">
                    <span>Delivery Fee</span>
                    <span>₹30.00</span>
                </div>

                <div class="total-row grand-total">
                    <span>Total</span>
                    <span>₹${(getTotal() + 30).toFixed(2)}</span>
                </div>

                <button class="checkout-button" type="button">
                    Proceed to Checkout →
                </button>

                <button class="continue-shopping" type="button">
                    Continue Shopping
                </button>
            </div>
        `;

        cartContent.innerHTML = html;
    }

    function openCart() {
        renderCart();
        modal.classList.add("show");
        document.body.style.overflow = "hidden";
    }

    function closeCart() {
        modal.classList.remove("show");
        document.body.style.overflow = "";
    }

    cartButton.addEventListener("click", openCart);

    modal.querySelector(".close-cart")
        .addEventListener("click", closeCart);

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeCart();
        }
    });

    // Cart buttons
    cartContent.addEventListener("click", function (event) {
        const button = event.target.closest("button");

        if (!button) return;

        const action = button.dataset.action;
        const name = button.dataset.name;

        if (action && cartItems[name]) {
            if (action === "plus") {
                cartItems[name].quantity++;
            }

            if (action === "minus") {
                cartItems[name].quantity--;

                if (cartItems[name].quantity <= 0) {
                    delete cartItems[name];
                }
            }

            if (action === "remove") {
                delete cartItems[name];
            }

            updateCartCount();
            renderCart();
            return;
        }

        if (button.classList.contains("back-to-cart")) {
            renderCart();
            return;
        }

        if (button.classList.contains("continue-shopping")) {
            closeCart();

            document.querySelector(".boxes").scrollIntoView({
                behavior: "smooth"
            });
            return;
        }

        if (
            button.classList.contains("checkout-button") &&
            !button.closest("#checkout-form")
        ) {
            showCheckout();
        }
    });

    // Checkout
    function showCheckout() {
        cartContent.innerHTML = `
            <h3>Delivery Details</h3>
            <p>Enter your details to place your demo order.</p>

            <form id="checkout-form">
                <label>Full Name</label>
                <input name="customerName" type="text"
                    placeholder="Enter your name" required>

                <label>Phone Number</label>
                <input name="phone" type="tel"
                    placeholder="10-digit mobile number"
                    pattern="[0-9]{10}" required>

                <label>Delivery Address</label>
                <textarea name="address"
                    placeholder="Enter your full address"
                    required></textarea>

                <div class="checkout-total">
                    Total: ₹${(getTotal() + 30).toFixed(2)}
                </div>

                <button class="checkout-button" type="submit">
                    Place Order
                </button>

                <button class="back-to-cart" type="button">
                    Back to Cart
                </button>
            </form>
        `;

        modal.querySelector("#cart-heading").textContent =
            "📍 Checkout";
    }

    cartContent.addEventListener("submit", function (event) {
        if (event.target.id !== "checkout-form") return;

        event.preventDefault();

        const form = event.target;

        if (!form.reportValidity()) return;

        const customerName =
            form.elements.customerName.value.trim();

        const finalTotal = getTotal() + 30;

        cartContent.innerHTML = `
            <div class="order-success">
                <div class="success-icon">✓</div>
                <h2>Order Placed Successfully!</h2>
                <p>Thank you, ${customerName}!</p>
                <p>Your demo order has been confirmed.</p>
                <h3>Order Total: ₹${finalTotal.toFixed(2)}</h3>

                <button class="finish-order" type="button">
                    Continue Shopping
                </button>
            </div>
        `;

        modal.querySelector("#cart-heading").textContent =
            "✅ Order Confirmed";

        cartItems = {};
        updateCartCount();

        cartContent.querySelector(".finish-order")
            .addEventListener("click", function () {
                closeCart();
                renderCart();
            });
    });

    if (exploreButton) {
        exploreButton.addEventListener("click", function () {
            document.querySelector(".boxes").scrollIntoView({
                behavior: "smooth"
            });
        });
    }

    if (heroButton) {
        heroButton.addEventListener("click", openCart);
    }

});