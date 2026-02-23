
document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://greencode.onrender.com/api";

  const coursesContainer = document.getElementById("courses-container");
  const kitsContainer = document.getElementById("kits-container");
  const ebooksContainer = document.getElementById("ebooks-container");

  /**
   * Função reutilizável para buscar produtos de um tipo específico e renderizá-los.
   * @param {string} productType - O tipo de produto a ser buscado ('courses', 'kits', 'ebooks').
   * @param {HTMLElement} container - O elemento do DOM onde os cards serão inseridos.
   */
  const fetchAndRenderProducts = async (productType, container) => {
    container.innerHTML = "<p>Carregando produtos...</p>";

    try {
      const response = await fetch(`${API_URL}/products/${productType}`);

      if (!response.ok) {
        throw new Error(
          `Não foi possível carregar os ${productType}. Código: ${response.status}`
        );
      }

      const products = await response.json();

      if (products.length === 0) {
        container.innerHTML = `<p>Nenhum produto encontrado nesta categoria.</p>`;
        return;
      }

      container.innerHTML = "";

      products.forEach((product) => {
        const featuresList = product.features
          .map((feature) => `<li>${feature}</li>`)
          .join("");

        const cardLink = document.createElement("a");
        cardLink.href = `produto.html?type=${productType}&id=${product.id}`;
        cardLink.className = "card-link";

        cardLink.innerHTML = `
                    <div class="card">
                      <img src="${product.image}" alt="${product.title}">
                      <span class="badge">${product.level}</span>
                      <h3>${product.title}</h3>
                      <ul>
                        ${featuresList}
                      </ul>
                      <div class="price">${product.price}</div>
                      <div class="card-action-bar">
                        Ver Detalhes
                      </div>
                    </div>
                `;

        // 3. Adiciona o card gerado ao container no DOM
        container.appendChild(cardLink);
      });
    } catch (error) {
      // Em caso de erro na rede ou na API, exibe uma mensagem de erro
      console.error(`Erro ao buscar ${productType}:`, error);
      container.innerHTML = `<p class="error-message">Houve um problema ao carregar os produtos. Tente novamente mais tarde.</p>`;
    }
  };

  // --- INICIALIZAÇÃO ---
  // Chama a função para cada seção da página
  fetchAndRenderProducts("courses", coursesContainer);
  fetchAndRenderProducts("kits", kitsContainer);
  fetchAndRenderProducts("ebooks", ebooksContainer);
});
