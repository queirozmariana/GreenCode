// Contact page functionality
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFAQ();
});

function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', handleFormSubmit);
    
    // Add input formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhone);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validate form
    if (!validateForm(form)) {
        return;
    }
    
    // Show loading state
    const stopLoading = showLoading(submitBtn);
    
    // Simulate form submission (replace with actual backend call)
    setTimeout(() => {
        stopLoading();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Log form data (replace with actual submission)
        console.log('Form data:', data);
        
        // Show success message
        showMessage('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
        
        // Reset form
        form.reset();
        
        // Optional: redirect or show confirmation
        setTimeout(() => {
            // window.location.href = 'index.html';
        }, 2000);
        
    }, 2000); // Simulate network delay
}

function formatPhone(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        if (value.length <= 2) {
            value = value.replace(/(\d{2})/, '($1)');
        } else if (value.length <= 7) {
            value = value.replace(/(\d{2})(\d{5})/, '($1) $2');
        } else {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
    }
    
    e.target.value = value;
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => toggleFAQ(item));
    });
}

function toggleFAQ(item) {
    const isActive = item.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item').forEach(faqItem => {
        faqItem.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
        item.classList.add('active');
    }
}

// Enhanced form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    // Clear previous errors
    form.querySelectorAll('.error-message').forEach(error => error.remove());
    form.querySelectorAll('input, select, textarea').forEach(input => {
        input.style.borderColor = '';
    });
    
    inputs.forEach(input => {
        const value = input.value.trim();
        
        // Check if empty
        if (!value) {
            showFieldError(input, 'Este campo é obrigatório');
            isValid = false;
            return;
        }
        
        // Email validation
        if (input.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                showFieldError(input, 'Digite um email válido');
                isValid = false;
            }
        }
        
        // Phone validation
        if (input.type === 'tel' && value) {
            const phoneRegex = /^\(\d{2}\)\s\d{5}-?\d{4}$/;
            if (!phoneRegex.test(value)) {
                showFieldError(input, 'Digite um telefone válido no formato (11) 99999-9999');
                isValid = false;
            }
        }
        
        // Message length validation
        if (input.tagName === 'TEXTAREA' && value.length < 10) {
            showFieldError(input, 'A mensagem deve ter pelo menos 10 caracteres');
            isValid = false;
        }
    });
    
    return isValid;
}

function showFieldError(input, message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #f44336;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    `;
    
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    input.parentNode.appendChild(errorElement);
    input.style.borderColor = '#f44336';
    
    // Focus on first error
    if (!input.parentNode.querySelector('.error-message:first-of-type')) {
        input.focus();
    }
    
    // Remove error on input
    input.addEventListener('input', () => {
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
            input.style.borderColor = '';
        }
    }, { once: true });
}

// Add some enhanced styling for contact page
const contactStyles = `
    .contact-form {
        position: relative;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(46, 125, 50, 0.2);
    }
    
    .checkbox-label input[type="checkbox"] {
        width: 18px;
        height: 18px;
        accent-color: var(--primary-color);
    }
    
    .error-message {
        animation: errorSlide 0.3s ease;
    }
    
    @keyframes errorSlide {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .faq-item {
        transition: all 0.3s ease;
    }
    
    .faq-item:hover {
        transform: translateY(-2px);
    }
    
    .contact-item:hover .contact-icon {
        transform: scale(1.1);
    }
    
    .social-section .social-link:hover {
        transform: translateX(5px);
    }
    
    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        pointer-events: none;
    }
    
    .form-success {
        background: #e8f5e8;
        border: 1px solid var(--accent-color);
        color: var(--primary-color);
        padding: 1rem;
        border-radius: var(--border-radius);
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = contactStyles;
document.head.appendChild(styleSheet);