/**
 * Carrega um componente HTML de um arquivo e o insere em um placeholder.
 * @param {string} componentPath - Caminho para o arquivo HTML do componente.
 * @param {string} placeholderId - ID do elemento onde o componente será inserido.
 */
const loadComponent = async (componentPath, placeholderId) => {
  const placeholder = document.getElementById(placeholderId);
  if (!placeholder) {
    console.error(`Placeholder com ID "${placeholderId}" não encontrado.`);
    return;
  }
  try {
    const response = await fetch(componentPath);
    if (!response.ok)
      throw new Error(`Componente não encontrado: ${componentPath}`);
    const componentHTML = await response.text();
    placeholder.innerHTML = componentHTML;
  } catch (error) {
    console.error(`Erro ao carregar componente "${placeholderId}":`, error);
  }
};

/**
 * Inicializa a funcionalidade do menu mobile (hambúrguer).
 */
function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("show");
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener("click", (e) => {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("show");
      }
    });
  }
}

/**
 * Marca o link de navegação da página atual como 'ativo'.
 */
function initActiveNavigation() {
  const navLinks = document.querySelectorAll("#nav-menu .nav-link");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach((link) => {
    const linkHref = link.getAttribute("href").split("/").pop();
    if (linkHref === currentPage) {
      link.classList.add("active");
    }
  });
}

/**
 * Atualiza o menu de navegação com base no estado de login do usuário.
 * Mostra 'Perfil' e 'Sair' se logado, ou 'Login' se não estiver.
 */
function updateNavMenuForAuth() {
  const navMenu = document.getElementById("nav-menu");
  if (!navMenu) return;

  const loggedInUserId = localStorage.getItem("loggedInUserId");

  if (loggedInUserId) {
    const userName = localStorage.getItem("loggedInUserName") || "Usuário";
    const loginLink = navMenu.querySelector('a[href="login.html"]');

    if (loginLink) {
      loginLink.parentElement.remove();
    }

    if (!document.getElementById("logout-btn")) {
      navMenu.innerHTML += `
            <li>
                <a href="perfil.html" class="nav-link" title="Meu Perfil">
                    <i class="fas fa-user-circle"></i> Olá, ${
                      userName.split(" ")[0]
                    }
                </a>
            </li>
            <li>
                <a href="#" id="logout-btn" class="nav-link" title="Sair">
                    <i class="fas fa-sign-out-alt"></i> Sair
                </a>
            </li>
        `;
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem("loggedInUserId");
        localStorage.removeItem("loggedInUserName");
        window.location.href = "index.html";
      });
    }
  }
}

/**
 * Ponto de entrada principal.
 * Executa quando o DOM da página inicial está pronto.
 */
document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("./components/_header.html", "header-placeholder");
  await loadComponent("./components/_footer.html", "footer-placeholder");

  initMobileMenu();
  updateNavMenuForAuth();
  initActiveNavigation();
});
