// Menu Mobile
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.querySelector('.header');

    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        header.classList.toggle('menu-open');
    });
});
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.slider-track');
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  const dotsContainer = document.querySelector('.slider-dots');
  let currentIndex = 0;
  const totalSlides = slides.length;

  // Criar os dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  const dots = document.querySelectorAll('.dot');

  function goToSlide(index) {
    currentIndex = index;
    track.style.transform = `translateX(-${index * 100}%)`;
    updateDots();
  }

  function updateDots() {
    dots.forEach(dot => dot.classList.remove('active'));
    dots[currentIndex].classList.add('active');
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalSlides;
    goToSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
    goToSlide(currentIndex);
  }

  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  setInterval(nextSlide, 5000); // Troca a cada 5 segundos
});
// Scroll Suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});
