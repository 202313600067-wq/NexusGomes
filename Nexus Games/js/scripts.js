const products = [
    { id: 1, name: " EA FC 26 (PS5)", price: "R$ 349,90", image: "img/produtos/ea-fc-26.jpg"},
    { id: 2, name: "GTA VI (PS5)", price: "R$  449,90", image: "img/produtos/gta vi (PS5).jpg" },
    { id: 3, name: "Minecraft (PC)", price: "R$ 99,90", image: "img/produtos/minecraft.jpg" },
    { id: 4, name: "Fortnite - 2.800 V-Bucks", price: "R$ 79,90", image: "img/produtos/fortinet.jpg" },
    { id: 5, name: "Console PlayStation 5", price: "R$ 3.799,00", image: "img/produtos/console.jpg" },
    { id: 6, name: "Console Xbox Series X", price: "R$ 3.599,00", image: "img/produtos/console Xbox Series X.jpg" },
    { id: 7, name: "Nintendo Switch OLED", price: "R$ 2.299,00", image: "img/produtos/nintendo.jpg" },
    { id: 8, name: "Controle DualSense (PS5)", price: "R$ 449,90", image: "img/produtos/Controle Dual.jpg" },
    { id: 9, name: "Headset Gamer HyperX", price: "R$ 349,90", image: "img/produtos/headset.jpg" },
    { id: 10, name: "Teclado Mecânico RGB", price: "R$ 279,90", image: "img/produtos/teclado.jpg" },
    { id: 11, name: "Mouse Gamer Logitech", price: "R$ 199,90", image: "img/produtos/mouse.jpg" },
    { id: 12, name: "Gift Card PSN", price: "R$ 100,00", image: "img/produtos/Gift.jpg" },
    { id: 13, name: "Gift Card Xbox", price: "R$ 100,00", image: "img/produtos/Gift xbox.jpg" },
    { id: 14, name: "The Legend of Zelda (Switch)", price: "R$ 349,90", image: "img/produtos/The Legend.jpg" },
    { id: 15, name: "God of War Ragnarok (PS5)", price: "R$ 299,90", image: "img/produtos/God of War.jpg" },
    { id: 16, name: "Red Dead Redemption 2 (PC)", price: "R$ 199,90", image: "img/produtos/Red Dead.jpg" },
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let discountApplied = false;
let paymentMethod = "";

function renderProducts(filteredProducts = products) {
    const grid = document.getElementById("product-grid");
    if (!grid) return;

    grid.innerHTML = "";
    filteredProducts.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-name">${product.name}</div>
            <div class="product-price">${product.price}</div>
            <button onclick="addToCart(${product.id})">Adicionar ao Carrinho</button>
        `;
        grid.appendChild(productElement);
    });
}

function searchProducts() {
    const searchTerm = document.getElementById("search-bar").value.toLowerCase();
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm)
    );
    renderProducts(filteredProducts);
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(`Produto "${product.name}" adicionado ao carrinho!`);
    window.location.href = "checkout.html";
}

function updateCartCount() {
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function displayCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalContainer = document.getElementById("cart-total");
    if (!cartItemsContainer || !cartTotalContainer) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = "<p>Seu carrinho está vazio!</p>";
        cartTotalContainer.textContent = "0,00";
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = parseFloat(item.price.replace("R$ ", "").replace(",", ".")) * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p>Preço: ${item.price}</p>
                <p>Quantidade:
                    <input type="number" value="${item.quantity}" min="1"
                           onchange="updateQuantity(${index}, this.value)">
                </p>
            </div>
            <button onclick="removeItem(${index})">Remover</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    if (discountApplied) total *= 0.9;
    if (paymentMethod === "pix") total *= 0.95;

    cartTotalContainer.textContent = total.toFixed(2).replace(".", ",");
}

function updateQuantity(index, quantity) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (quantity < 1) return;
    cart[index].quantity = parseInt(quantity);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

function clearCart() {
    cart = [];
    localStorage.setItem("cart", JSON.stringify(cart));
    discountApplied = false;
    displayCart();
}

function applyDiscount() {
    const discountCode = document.getElementById("discount-code").value.toUpperCase();
    if (discountCode === "NEXUS10" && !discountApplied) {
        discountApplied = true;
        alert("Cupom aplicado com sucesso! 10% de desconto.");
        displayCart();
    } else if (discountApplied) {
        alert("Cupom já foi aplicado.");
    } else {
        alert("Cupom inválido. Tente NEXUS10.");
    }
}

function updatePaymentMethod(method) {
    paymentMethod = method;
    document.getElementById("pix-info").classList.add("hidden");
    document.getElementById("credit-info").classList.add("hidden");

    if (method === "pix") {
        document.getElementById("pix-info").classList.remove("hidden");
    } else if (method === "credit") {
        document.getElementById("credit-info").classList.remove("hidden");
    }
    displayCart();
}

function processPayment() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    if (paymentMethod === "pix") {
        const pixKey = document.getElementById("pix-key").value;
        if (!pixKey) { alert("Digite sua chave Pix."); return; }
        simulatePayment("Pix");

    } else if (paymentMethod === "credit") {
        const cardNumber = document.getElementById("card-number").value;
        const cardExpiry = document.getElementById("card-expiry").value;
        const cardCvv    = document.getElementById("card-cvv").value;

        if (!cardNumber || !cardExpiry || !cardCvv) {
            alert("Preencha todos os campos do cartão.");
            return;
        }
        simulatePayment("Cartão de Crédito");

    } else {
        alert("Selecione um método de pagamento.");
    }
}

function simulatePayment(method) {
    const isApproved = Math.random() > 0.2;

    const statusMessage = document.getElementById("status-message");
    const paymentStatus = document.getElementById("payment-status");
    paymentStatus.classList.remove("hidden");

    if (isApproved) {
        statusMessage.textContent = `Pagamento via ${method} aprovado! Obrigado por comprar na Nexus Games. 🎮`;
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        discountApplied = false;
    } else {
        statusMessage.textContent = `Pagamento via ${method} recusado. Por favor, tente novamente.`;
    }

    displayCart();
}

function aplicarMascaraPix(input) {
    if (!input) return;
    input.addEventListener("input", () => {
        input.value = input.value.replace(/[^\w@.-]/g, "");
        input.value = input.value.slice(0, 32);
    });
}

function aplicarMascaraCartao(input) {
    if (!input) return;
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "");
        input.value = input.value.replace(/(\d{4})(?=\d)/g, "$1 ");
        input.value = input.value.slice(0, 19);
    });
}

function aplicarMascaraValidade(input) {
    if (!input) return;
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "");
        input.value = input.value.replace(/^(\d{2})(\d{1,4})?$/, "$1/$2");
        input.value = input.value.slice(0, 7);
    });
}

function aplicarMascaraCVV(input) {
    if (!input) return;
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "");
        input.value = input.value.slice(0, 3);
    });
}

function aplicarMascaraCPF(input) {
    if (!input) return;
    input.addEventListener("input", () => {
        let v = input.value.replace(/\D/g, "").slice(0, 11);
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d)/, "$1.$2");
        v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        input.value = v;
    });
}

function initializePage() {
    renderProducts();
    updateCartCount();
}

function initializeCheckout() {
    displayCart();
    updateCartCount();
}

window.addEventListener("load", () => {

    if (document.getElementById("product-grid")) {
        initializePage();
    }

    if (window.location.pathname.includes("checkout")) {
        initializeCheckout();
        aplicarMascaraPix(document.getElementById("pix-key"));
        aplicarMascaraCartao(document.getElementById("card-number"));
        aplicarMascaraValidade(document.getElementById("card-expiry"));
        aplicarMascaraCVV(document.getElementById("card-cvv"));
    }

    aplicarMascaraCPF(document.getElementById("cpf"));
});