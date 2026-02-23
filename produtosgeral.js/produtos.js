document.addEventListener("DOMContentLoaded", function() {
  const mainImage = document.getElementById("produtoMain");
  const thumbs = document.querySelectorAll(".produto-hero-thumb-btn");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");

  let currentIndex = 0; // índice atual

  function updateMainImage(index) {
    const selectedBtn = thumbs[index];
    const newSrc = selectedBtn.getAttribute("data-src");
    mainImage.src = newSrc;

    thumbs.forEach(btn => btn.classList.remove("active"));
    selectedBtn.classList.add("active");

    currentIndex = index;
  }

  thumbs.forEach((btn, index) => {
    btn.addEventListener("click", () => updateMainImage(index));
  });

  prevBtn.addEventListener("click", () => {
    let newIndex = currentIndex - 1;
    if (newIndex < 0) newIndex = thumbs.length - 1;
    updateMainImage(newIndex);
  });

  nextBtn.addEventListener("click", () => {
    let newIndex = currentIndex + 1;
    if (newIndex >= thumbs.length) newIndex = 0;
    updateMainImage(newIndex);
  });
});
