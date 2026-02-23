document.addEventListener("DOMContentLoaded", () => {
  const loggedInUserId = localStorage.getItem("loggedInUserId");
  if (!loggedInUserId) {
    window.location.href = "login.html";
    return;
  }

  const tabLinks = document.querySelectorAll(".tab-link");
  const tabContents = document.querySelectorAll(".tab-content");

  tabLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const tabId = link.getAttribute("data-tab");

      tabLinks.forEach((item) => item.classList.remove("active"));
      tabContents.forEach((item) => item.classList.remove("active"));

      link.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });

  const API_URL = "https://greencode.onrender.com/api";
  const ordersContainer = document.getElementById("orders-container");
  const cartContainer = document.getElementById("cart-container");

  const renderCart = async () => {
    cartContainer.innerHTML = "<p>Carregando carrinho...</p>";
    const response = await fetch(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${loggedInUserId}` },
    });
    if (response.ok) {
      const items = await response.json();
      if (items.length > 0) {
        cartContainer.innerHTML = `<p>Você tem ${items.length} item(s) no carrinho. <a href="carrinho.html">Ver carrinho detalhado</a></p>`;
      } else {
        cartContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
      }
    } else {
      cartContainer.innerHTML = "<p>Não foi possível carregar o carrinho.</p>";
    }
  };

  const renderOrders = async () => {
    ordersContainer.innerHTML =
      "<p>Você ainda não realizou nenhuma compra.</p>";
  };

  renderOrders();
  renderCart();
});
