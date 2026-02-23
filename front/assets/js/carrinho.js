document.addEventListener("DOMContentLoaded", () => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (!loggedInUserId) {
    window.location.href = "login.html";
    return;
  }

  const API_URL = "https://greencode.onrender.com/api";
  const itemsContainer = document.getElementById("cart-items-container");
  const summaryContainer = document.getElementById("cart-summary-container");
  const subtotalEl = document.getElementById("subtotal-price");
  const totalEl = document.getElementById("total-price");
  const checkoutButton = document.querySelector(".cart-summary .btn-primary");

  // --- Renderiza o Carrinho ---
  const fetchAndRenderCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${loggedInUserId}`,
        },
      });

      if (!response.ok)
        throw new Error("Não foi possível carregar o carrinho.");

      const items = await response.json();

      if (items.length === 0) {
        itemsContainer.innerHTML = `<div class="cart-empty"><h2>Seu carrinho está vazio!</h2><a href="servicos.html" class="btn btn-primary">Ver Produtos</a></div>`;
        summaryContainer.style.display = "none";
        return;
      }

      renderCartItems(items);
    } catch (error) {
      itemsContainer.innerHTML = `<p class="error-message">${error.message}</p>`;
    }
  };

  // --- Renderização ---
  const renderCartItems = (items) => {
    itemsContainer.innerHTML = "";
    let subtotal = 0;

    items.forEach((item) => {
      const priceNumber = parseFloat(
        item.price.replace("R$", "").replace(",", ".")
      );
      const itemTotal = priceNumber * item.quantity;
      subtotal += itemTotal;

      const itemHTML = `
                <div class="cart-item" data-item-id="${item.cart_item_id}">
                    <img src="${item.image}" alt="${
        item.title
      }" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.title}</h3>
                        <p class="cart-item-price">${item.price}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <input type="number" value="${
                          item.quantity
                        }" min="1" class="quantity-input">
                    </div>
                    <div class="cart-item-total">
                        <span>${itemTotal.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}</span>
                    </div>
                    <button class="cart-item-remove" title="Remover item">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `;
      itemsContainer.innerHTML += itemHTML;
    });

    subtotalEl.textContent = subtotal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    totalEl.textContent = subtotal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    summaryContainer.style.display = "block";
  };

  // Função para remover um item
  const handleRemoveItem = async (itemId) => {
    try {
      const response = await fetch(`${API_URL}/cart/remove/${itemId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${loggedInUserId}`,
        },
      });

      if (!response.ok) throw new Error("Falha ao remover item.");

      fetchAndRenderCart();
    } catch (error) {
      alert(error.message);
    }
  };

  // Função para atualizar a quantidade
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      const response = await fetch(`${API_URL}/cart/update/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUserId}`,
        },
        body: JSON.stringify({ newQuantity }),
      });

      if (!response.ok) throw new Error("Falha ao atualizar quantidade.");

      fetchAndRenderCart();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCheckout = async () => {
    const stripe = Stripe("pk_test_51S8oRfKE3sWdcpS5Zb5OIu2nLO6zqIJpmeN9Fvo9UeILlOsRLNc6TYF2QWaIJNWg1rX4wqJU0HAfkABJnf8ez4k800yjWfg5uL");

    checkoutButton.disabled = true;
    checkoutButton.textContent = "Processando...";

    try {
      const response = await fetch(
        `${API_URL}/payment/create-checkout-session`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${loggedInUserId}`,
          },
        }
      );

      const session = await response.json();
      if (!response.ok)
        throw new Error(
          session.error || "Não foi possível iniciar o pagamento."
        );

      const result = await stripe.redirectToCheckout({
        sessionId: session.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error) {
      alert(`Erro ao finalizar a compra: ${error.message}`);
      checkoutButton.disabled = false;
      checkoutButton.textContent = "Finalizar Compra";
    }
  };

  if (checkoutButton) {
    checkoutButton.addEventListener("click", handleCheckout);
  }

  itemsContainer.addEventListener("click", (e) => {
    const removeButton = e.target.closest(".cart-item-remove");
    if (removeButton) {
      const cartItem = removeButton.closest(".cart-item");
      const itemId = cartItem.dataset.itemId;
      handleRemoveItem(itemId);
    }
  });

  itemsContainer.addEventListener("change", (e) => {
    if (e.target.matches(".quantity-input")) {
      const cartItem = e.target.closest(".cart-item");
      const itemId = cartItem.dataset.itemId;
      const newQuantity = parseInt(e.target.value, 10);

      if (newQuantity >= 1) {
        handleUpdateQuantity(itemId, newQuantity);
      } else {
        e.target.value = 1;
      }
    }
  });

  fetchAndRenderCart();
});
