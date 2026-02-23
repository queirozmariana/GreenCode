document.addEventListener("DOMContentLoaded", function () {
  const mainImage = document.getElementById("produtoMain");
  const thumbs = Array.from(document.querySelectorAll(".produto-hero-thumb-btn"));
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");

  if (!mainImage || thumbs.length === 0) {
    console.warn("Carrossel: elemento principal ou miniaturas não encontrados.");
    return;
  }

  // retorna src confiável da miniatura (prioriza data-src, senão <img>.src)
  function getSrcFromThumb(btn) {
    return btn.getAttribute("data-src") || (btn.querySelector("img") && btn.querySelector("img").src) || "";
  }

  // índice inicial (procura .active)
  let currentIndex = thumbs.findIndex(t => t.classList.contains("active"));
  if (currentIndex < 0) currentIndex = 0;

  function updateMainImage(index) {
    // normaliza índice
    index = (index + thumbs.length) % thumbs.length;
    const newSrc = getSrcFromThumb(thumbs[index]);
    if (newSrc) mainImage.src = newSrc;

    thumbs.forEach(t => t.classList.remove("active"));
    thumbs[index].classList.add("active");
    currentIndex = index;
  }

  // clique nas miniaturas
  thumbs.forEach((btn, i) => {
    btn.addEventListener("click", () => updateMainImage(i));
  });

  // setas
  if (prevBtn) prevBtn.addEventListener("click", () => updateMainImage(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => updateMainImage(currentIndex + 1));

  // inicializa com a miniatura marcada (ou 0)
  updateMainImage(currentIndex);
});
