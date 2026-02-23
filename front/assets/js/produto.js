document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://greencode.onrender.com/api";
  const productContainer = document.getElementById("product-details-container");
  const extraDetailsContainer = document.getElementById(
    "product-extra-details-container"
  );

  const params = new URLSearchParams(window.location.search);
  const productType = params.get("type");
  const productId = params.get("id");

  let currentProduct = null;

  if (!productType || !productId) {
    productContainer.innerHTML =
      "<h1>Produto não especificado ou link inválido.</h1>";
    return;
  }

  const fetchProductDetails = async () => {
    try {
      const response = await fetch(
        `${API_URL}/products/${productType}/${productId}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Produto não encontrado");
      }

      const product = await response.json();
      currentProduct = product;

      document.title = `${product.title} - GreenCode`;

      renderProduct(product);
      //renderExtraDetails(product);
    } catch (error) {
      productContainer.innerHTML = `<h1 class="error-message">Erro ao carregar o produto: ${error.message}</h1>`;
    }
  };

  // Renderiza a seção principal do produto (imagem, título, preço, botões)
  const renderProduct = (product) => {
    const featuresHTML = product.features
      .map((f) => `<li><i class="fas fa-check"></i> ${f}</li>`)
      .join("");

    productContainer.innerHTML = `
            <div class="product-page-layout">
                <div class="product-gallery">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <span class="badge">${product.level}</span>
                    <h1>${product.title}</h1>
                    <p class="product-description">${
                      product.description || "Descrição detalhada em breve."
                    }</p>
                    <div class="features-list">
                        <h3>O que está incluso:</h3>
                        <ul>${featuresHTML}</ul>
                    </div>
                    <div class="price-box">
                        <span class="price">${product.price}</span>
                    </div>
                    <div class="action-buttons">
                        <button id="buy-now-btn" class="btn btn-primary">Comprar Agora</button>
                        <button id="add-to-cart-btn" class="btn btn-secondary">Adicionar ao Carrinho</button>
                    </div>
                    <div id="feedback-message" style="margin-top: 1rem;"></div>
                </div>
            </div>
        `;

    const addToCartBtn = document.getElementById("add-to-cart-btn");
    const buyNowBtn = document.getElementById("buy-now-btn");

    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () =>
        handleAddToCart(product.id, productType)
      );
    }
    if (buyNowBtn) {
      buyNowBtn.addEventListener("click", handleBuyNow);
    }
  };

  // Renderiza a seção extra com vídeo e descrição longa
  // const renderExtraDetails = (product) => {
  //   if (product.long_description || product.video_url) {
  //     extraDetailsContainer.innerHTML = `
  //               <div class="product-extra-details">
  //                   <div class="video-container">
  //                      ${
  //                        product.video_url
  //                          ? `<iframe src="${product.video_url}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
  //                          : "<p>Vídeo indisponível.</p>"
  //                      }
  //                   </div>
  //                   <div class="video-text">
  //                       <p>${
  //                         product.long_description ||
  //                         "Mais detalhes sobre este produto em breve."
  //                       }</p>
  //                       ${
  //                         product.pdf_url
  //                           ? `<a href="${product.pdf_url}" class="botao-download" download>Baixar Material de Apoio</a>`
  //                           : ""
  //                       }
  //                   </div>
  //               </div>
  //           `;
  //   }
  // };

  // Lida com a requisição para adicionar o item ao carrinho
  const handleAddToCart = async (id, type) => {
    const feedbackEl = document.getElementById("feedback-message");
    try {
      const loggedInUserId = localStorage.getItem("loggedInUserId");
      if (!loggedInUserId) {
        throw new Error(
          "Você precisa fazer login para adicionar itens ao carrinho."
        );
      }

      const addToCartBtn = document.getElementById("add-to-cart-btn");
      addToCartBtn.disabled = true;
      feedbackEl.textContent = "Adicionando...";
      feedbackEl.style.color = "gray";

      const response = await fetch(`${API_URL}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loggedInUserId}`,
        },
        body: JSON.stringify({ productId: id, productType: type }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.error || "Não foi possível adicionar o produto."
        );
      }

      feedbackEl.textContent = result.message;
      feedbackEl.style.color = "green";
    } catch (error) {
      feedbackEl.textContent = `Erro: ${error.message}`;
      feedbackEl.style.color = "red";
      if (error.message.includes("login")) {
        setTimeout(() => (window.location.href = "login.html"), 2000);
      }
    } finally {
      setTimeout(() => {
        const addToCartBtn = document.getElementById("add-to-cart-btn");
        if (addToCartBtn) addToCartBtn.disabled = false;
        if (feedbackEl) feedbackEl.textContent = "";
      }, 2000);
    }
  };

  const handleBuyNow = async () => {
    if (!currentProduct) {
      alert("Dados do produto ainda não carregados. Tente novamente.");
      return;
    }

    const loggedInUserId = localStorage.getItem("loggedInUserId");
    if (!loggedInUserId) {
      alert("Você precisa estar logado para comprar este item.");
      window.location.href = 'login.html';
      return;
    }

    const buyNowBtn = document.getElementById("buy-now-btn");
    buyNowBtn.disabled = true;
    buyNowBtn.textContent = "Processando...";

    const stripe = Stripe("pk_test_51S8oRfKE3sWdcpS5Zb5OIu2nLO6zqIJpmeN9Fvo9UeILlOsRLNc6TYF2QWaIJNWg1rX4wqJU0HAfkABJnf8ez4k800yjWfg5uL");

    try {
      const response = await fetch(
        `${API_URL}/payment/create-single-item-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${loggedInUserId}`,
          },
          body: JSON.stringify({
            product: currentProduct,
            productType: productType,
            cancelUrl: window.location.href,
          }),
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

      if (result.error) throw new Error(result.error.message);
    } catch (error) {
      alert(`Erro: ${error.message}`);
      buyNowBtn.disabled = false;
      buyNowBtn.textContent = "Comprar Agora";
    }
  };

  fetchProductDetails();
});
