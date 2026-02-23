document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSlider();
    initScrollAnimations();
    initStatsCounter();
    initSmoothScroll();
    initActiveNavigation();
});

// Menu Mobile
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });

        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show');
            });
        });

        document.addEventListener('click', function(e) {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('show');
            }
        });
    }
}

// Slider functionality
function initSlider() {
    const track = document.getElementById('slider-track');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsContainer = document.getElementById('slider-dots');
    
    if (!track || !slides.length) return;
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    let slideInterval;
    
    // Criar dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
    
    const dots = document.querySelectorAll('.slider-dot');
    
    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        updateDots();
    }
    
    function updateDots() {
        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[currentIndex]) {
            dots[currentIndex].classList.add('active');
        }
    }
    
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        goToSlide(currentIndex);
    }
    
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        goToSlide(currentIndex);
    }
    
    function startAutoSlide() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
        clearInterval(slideInterval);
    }
    
    // Event listeners
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        setTimeout(startAutoSlide, 10000); // Restart auto after 10s
    });
    
    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        setTimeout(startAutoSlide, 10000); // Restart auto after 10s
    });
    
    // Pause auto-slide on hover
    const slider = document.querySelector('.slider');
    if (slider) {
        slider.addEventListener('mouseenter', stopAutoSlide);
        slider.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Start auto-slide
    startAutoSlide();
}

// Scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.card-animate');
    
    function checkScroll() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('card-visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Check on load
}

// Stats counter animation
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    function animateStats() {
        if (hasAnimated) return;
        
        const statsSection = document.querySelector('.stats-section');
        if (!statsSection) return;
        
        const sectionTop = statsSection.getBoundingClientRect().top;
        const sectionVisible = 200;
        
        if (sectionTop < window.innerHeight - sectionVisible) {
            hasAnimated = true;
            
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const increment = target / 100;
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(current);
                }, 20);
            });
        }
    }
    
    window.addEventListener('scroll', animateStats);
    animateStats(); // Check on load
}

// Smooth scroll
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Active navigation
function initActiveNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Get current page from URL
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Remove active class from all links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Add active class to current page link
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Handle different cases
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html') ||
            linkHref.includes(currentPage.replace('.html', ''))) {
            link.classList.add('active');
        }
    });
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Header scroll effect
window.addEventListener('scroll', debounce(() => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--white)';
        header.style.backdropFilter = 'none';
    }
}, 10));

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Form validation utility (for contact form)
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const errorElement = input.parentNode.querySelector('.error-message');
        
        // Remove existing error
        if (errorElement) {
            errorElement.remove();
        }
        
        // Check if empty
        if (!value) {
            showError(input, 'Este campo é obrigatório');
            isValid = false;
            return;
        }
        
        // Email validation
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showError(input, 'Digite um email válido');
                isValid = false;
            }
        }
        
        // Phone validation
        if (input.type === 'tel') {
            const phoneRegex = /^[\d\s\(\)\-\+]{10,}$/;
            if (!phoneRegex.test(value)) {
                showError(input, 'Digite um telefone válido');
                isValid = false;
            }
        }
    });
    
    return isValid;
}

function showError(input, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#f44336';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    input.parentNode.appendChild(errorElement);
    input.style.borderColor = '#f44336';
    
    // Remove error on input
    input.addEventListener('input', () => {
        errorElement.remove();
        input.style.borderColor = '';
    }, { once: true });
}

// Loading indicator
function showLoading(button) {
    const originalText = button.textContent;
    button.textContent = 'Enviando...';
    button.disabled = true;
    
    return () => {
        button.textContent = originalText;
        button.disabled = false;
    };
}

// Success/Error messages
function showMessage(message, type = 'success') {
    const messageEl = document.createElement('div');
    messageEl.className = `message message-${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(messageEl);
    
    setTimeout(() => {
        messageEl.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageEl.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .loaded .card-animate {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);