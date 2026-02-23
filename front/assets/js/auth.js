document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "https://greencode.onrender.com/api";

  const loginForm = document.getElementById("loginForm");
  const registerUserForm = document.getElementById("registerUserForm");
  const registerSchoolForm = document.getElementById("registerSchoolForm");

  const loginContainer = document.getElementById("login-form-container");
  const userRegisterContainer = document.getElementById(
    "register-user-form-container"
  );
  const schoolRegisterContainer = document.getElementById(
    "register-school-form-container"
  );

  const showRegisterUserLink = document.getElementById("show-register-user");
  const showRegisterSchoolLink = document.getElementById(
    "show-register-school"
  );
  const showLoginLinks = document.querySelectorAll(".show-login");

  const messageDiv = document.getElementById("authMessage");

  const showMessage = (message, type) => {
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
  };

  // --- Lógica de Login ---
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;

      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
          showMessage("Login bem-sucedido! Redirecionando...", "success");

          localStorage.setItem("loggedInUserId", result.user.id);
          localStorage.setItem("loggedInUserName", result.user.name);

          setTimeout(() => {
            window.location.href = "perfil.html";
          }, 1500);
        } else {
          showMessage(result.error || "Credenciais inválidas.", "error");
        }
      } catch (error) {
        showMessage(
          "Erro de conexão com o servidor. Tente novamente mais tarde.",
          "error"
        );
      }
    });
  }

  // --- Lógica de Cadastro Pessoal ---
  if (registerUserForm) {
    registerUserForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(registerUserForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(`${API_URL}/auth/register/user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.status === 201) {
          showMessage(
            "Conta criada com sucesso! Agora você pode fazer o login.",
            "success"
          );
          setTimeout(() => {
            messageDiv.textContent = "";
            userRegisterContainer.classList.add("hidden");
            loginContainer.classList.remove("hidden");
          }, 2500);
        } else {
          showMessage(
            result.error ||
              "Não foi possível criar a conta. Verifique os dados.",
            "error"
          );
        }
      } catch (error) {
        showMessage(
          "Erro de conexão com o servidor. Tente novamente mais tarde.",
          "error"
        );
      }
    });
  }

  // --- Lógica de Cadastro de Escola ---
  if (registerSchoolForm) {
    registerSchoolForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(registerSchoolForm);

      try {
        const response = await fetch(`${API_URL}/auth/register/school`, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.status === 201) {
          showMessage(
            "Instituição cadastrada com sucesso! Agora você pode fazer o login.",
            "success"
          );
          setTimeout(() => {
            messageDiv.textContent = "";
            schoolRegisterContainer.classList.add("hidden");
            loginContainer.classList.remove("hidden");
          }, 2500);
        } else {
          showMessage(
            result.error || "Não foi possível cadastrar a instituição.",
            "error"
          );
        }
      } catch (error) {
        showMessage(
          "Erro de conexão com o servidor. Tente novamente mais tarde.",
          "error"
        );
      }
    });
  }

  // --- Lógica para Alternar entre os Formulários ---
  const switchTo = (activeContainer) => {
    loginContainer.classList.add("hidden");
    userRegisterContainer.classList.add("hidden");
    schoolRegisterContainer.classList.add("hidden");

    activeContainer.classList.remove("hidden");

    messageDiv.textContent = "";
    messageDiv.className = "message";
  };

  if (showRegisterUserLink) {
    showRegisterUserLink.addEventListener("click", (e) => {
      e.preventDefault();
      switchTo(userRegisterContainer);
    });
  }

  if (showRegisterSchoolLink) {
    showRegisterSchoolLink.addEventListener("click", (e) => {
      e.preventDefault();
      switchTo(schoolRegisterContainer);
    });
  }

  showLoginLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      switchTo(loginContainer);
    });
  });
});
