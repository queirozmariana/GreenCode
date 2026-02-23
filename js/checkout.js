// Checkout functionality
document.addEventListener('DOMContentLoaded', function() {
    initCheckout();
    initPaymentMethods();
    initCardFormatting();
    loadPlanFromURL();
});

function initCheckout() {
    const completeOrderBtn = document.getElementById('completeOrder');
    completeOrderBtn.addEventListener('click', processOrder);
}

function initPaymentMethods() {
    const paymentMethods = document.querySelectorAll('.payment-method');
    const pixForm = document.getElementById('pixForm');
    const cardForm = document.getElementById('cardForm');
    
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            // Remove active class from all methods
            paymentMethods.forEach(m => m.classList.remove('active'));
            
            // Add active class to clicked method
            this.classList.add('active');
            
            // Show appropriate form
            const methodType = this.getAttribute('data-method');
            if (methodType === 'pix') {
                pixForm.classList.remove('hidden');
                cardForm.classList.add('hidden');
            } else {
                pixForm.classList.add('hidden');
                cardForm.classList.remove('hidden');
            }
        });
    });
}

function initCardFormatting() {
    const cardNumber = document.getElementById('cardNumber');
    const expiryDate = document.getElementById('expiryDate');
    const cpf = document.getElementById('cpf');
    
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value;
        });
    }
    
    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    if (cpf) {
        cpf.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            e.target.value = value;
        });
    }
}

function loadPlanFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    const product = urlParams.get('product');
    const price = urlParams.get('price');
    
    // Handle individual products
    if (product && price) {
        const productData = {
            'energia-sustentavel': 'Energia Sustentável',
            'robotica-educacional': 'Robótica Educacional',
            'app-mobile': 'App Mobile',
            'nuvem-verde': 'Nuvem Verde',
            'dashboard-analytics': 'Dashboard Analytics',
            'capacitacao': 'Capacitação'
        };
        
        const productName = productData[product] || 'Produto';
        const numericPrice = parseInt(price);
        
        // Update product display
        const planNameEl = document.getElementById('planName');
        const planPriceEl = document.getElementById('planPrice');
        const periodEl = document.querySelector('.period');
        const subtotalEl = document.getElementById('subtotal');
        const discountEl = document.querySelector('.discount');
        const totalEl = document.getElementById('total');
        
        if (planNameEl) planNameEl.textContent = productName;
        if (planPriceEl) planPriceEl.textContent = `R$ ${numericPrice.toLocaleString('pt-BR')}`;
        if (periodEl) periodEl.textContent = '';
        
        // Format price with manual formatting to avoid locale issues
        const formattedPrice = `R$ ${numericPrice.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')},00`;
        
        // Update pricing (no discount for individual products)
        if (subtotalEl) subtotalEl.textContent = formattedPrice;
        if (discountEl) discountEl.style.display = 'none';
        if (totalEl) totalEl.textContent = formattedPrice;
        
        // Update header text
        document.querySelector('.hero h1').textContent = 'Finalizar Compra';
        document.querySelector('.hero p').textContent = 'Complete sua compra do produto GreenCode';
        
        return;
    }
    
    // Handle subscription plans
    const planData = {
        'basico': {
            name: 'Plano Básico',
            price: 'R$ 299',
            numericPrice: 299
        },
        'avancado': {
            name: 'Plano Avançado',
            price: 'R$ 599',
            numericPrice: 599
        },
        'enterprise': {
            name: 'Plano Enterprise',
            price: 'Personalizado',
            numericPrice: 0
        }
    };
    
    if (plan && planData[plan]) {
        const selectedPlan = planData[plan];
        document.getElementById('planName').textContent = selectedPlan.name;
        document.getElementById('planPrice').textContent = selectedPlan.price;
        
        if (selectedPlan.numericPrice > 0) {
            const subtotal = selectedPlan.numericPrice;
            const discount = subtotal * 0.2; // 20% discount
            const total = subtotal - discount;
            
            document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
            document.querySelector('.discount').textContent = `-R$ ${discount.toFixed(2).replace('.', ',')}`;
            document.getElementById('total').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        } else {
            document.getElementById('subtotal').textContent = 'Sob consulta';
            document.querySelector('.discount').style.display = 'none';
            document.getElementById('total').textContent = 'Sob consulta';
        }
    }
}

function processOrder() {
    const selectedMethod = document.querySelector('.payment-method.active').getAttribute('data-method');
    const customerForm = document.getElementById('customerForm');
    const cardForm = document.getElementById('cardPaymentForm');
    
    // Validate customer information
    if (!validateCustomerForm(customerForm)) {
        alert('Por favor, preencha todas as informações da instituição.');
        return;
    }
    
    // Validate payment method
    if (selectedMethod !== 'pix' && !validateCardForm(cardForm)) {
        alert('Por favor, preencha corretamente os dados do cartão.');
        return;
    }
    
    // Show loading state
    const btn = document.getElementById('completeOrder');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
    btn.disabled = true;
    
    // Simulate payment processing
    setTimeout(() => {
        if (selectedMethod === 'pix') {
            showPixPayment();
        } else {
            showPaymentSuccess();
        }
        
        // Reset button
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 2000);
}

function validateCustomerForm(form) {
    const requiredFields = form.querySelectorAll('input[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#f44336';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    return isValid;
}

function validateCardForm(form) {
    const requiredFields = form.querySelectorAll('input[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#f44336';
            isValid = false;
        } else {
            field.style.borderColor = '';
        }
    });
    
    return isValid;
}

function showPixPayment() {
    const pixCode = generatePixCode();
    const modal = createPixModal(pixCode);
    document.body.appendChild(modal);
    modal.style.display = 'block';
}

function showPaymentSuccess() {
    alert('Pagamento processado com sucesso! Você receberá um email com os detalhes da sua assinatura.');
    window.location.href = 'index.html';
}

function generatePixCode() {
    // Generate a fake PIX code for demonstration
    return '00020126580014BR.GOV.BCB.PIX01362af9ce2b-55fb-4b18-bb1e-1c0c7d2a4a525204000053039865802BR5913GREENCODE LTDA6009SAO PAULO61080540900062070503***63041D3D';
}

function createPixModal(pixCode) {
    const modal = document.createElement('div');
    modal.className = 'modal pix-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div class="pix-payment-content">
                <h2><i class="fas fa-qrcode"></i> Pagamento via PIX</h2>
                <div class="qr-code-container">
                    <div class="qr-code-placeholder">
                        <i class="fas fa-qrcode"></i>
                        <p>QR Code PIX</p>
                    </div>
                </div>
                <div class="pix-instructions">
                    <h3>Como pagar:</h3>
                    <ol>
                        <li>Abra o app do seu banco</li>
                        <li>Escaneie o QR Code acima</li>
                        <li>Confirme o pagamento</li>
                        <li>Pronto! Sua assinatura será ativada automaticamente</li>
                    </ol>
                </div>
                <div class="pix-code">
                    <label>Ou copie o código PIX:</label>
                    <div class="code-container">
                        <input type="text" value="${pixCode}" readonly>
                        <button class="copy-btn" onclick="copyPixCode(this)">
                            <i class="fas fa-copy"></i> Copiar
                        </button>
                    </div>
                </div>
                <div class="pix-timer">
                    <p><i class="fas fa-clock"></i> Este código expira em <span id="timer">15:00</span></p>
                </div>
            </div>
        </div>
    `;
    
    // Add close event
    modal.querySelector('.close').addEventListener('click', function() {
        modal.remove();
    });
    
    // Add timer
    startPixTimer(modal);
    
    return modal;
}

function copyPixCode(button) {
    const input = button.parentNode.querySelector('input');
    input.select();
    document.execCommand('copy');
    
    button.innerHTML = '<i class="fas fa-check"></i> Copiado!';
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-copy"></i> Copiar';
    }, 2000);
}

function startPixTimer(modal) {
    let timeLeft = 15 * 60; // 15 minutes in seconds
    const timerElement = modal.querySelector('#timer');
    
    const timer = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            modal.remove();
            alert('O tempo para pagamento via PIX expirou. Por favor, tente novamente.');
        }
        
        timeLeft--;
    }, 1000);
}