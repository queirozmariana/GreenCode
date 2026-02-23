// Services page functionality
document.addEventListener('DOMContentLoaded', function() {
    initProductModals();
});

// Product data
const productsData = {
    1: {
        title: "Plataforma Educacional",
        description: "Sistema completo de gestão educacional com foco em sustentabilidade",
        features: [
            "Gestão completa de alunos e professores",
            "Módulos de sustentabilidade integrados",
            "Relatórios de impacto ambiental",
            "Gamificação para engajamento",
            "Dashboard intuitivo e responsivo"
        ],
        benefits: [
            "Aumenta o engajamento dos estudantes",
            "Facilita o acompanhamento do progresso",
            "Promove práticas sustentáveis",
            "Reduz o uso de papel"
        ],
        price: "A partir de R$ 299/mês"
    },
    2: {
        title: "Programa de Reciclagem",
        description: "Soluções para gerenciamento de resíduos eletrônicos nas escolas",
        features: [
            "Sistema de coleta inteligente",
            "Rastreamento de materiais reciclados",
            "Parcerias com cooperativas locais",
            "Educação ambiental integrada",
            "Certificação de sustentabilidade"
        ],
        benefits: [
            "Reduz o impacto ambiental",
            "Gera renda para a escola",
            "Educa sobre responsabilidade ambiental",
            "Cria consciência sustentável"
        ],
        price: "Sob consulta"
    },
    3: {
        title: "Horta Digital",
        description: "Sistema de monitoramento inteligente para hortas escolares",
        features: [
            "Sensores de umidade e temperatura",
            "Irrigação automatizada",
            "App mobile para monitoramento",
            "Dados em tempo real",
            "Alertas inteligentes"
        ],
        benefits: [
            "Ensina sobre agricultura sustentável",
            "Conecta tecnologia e natureza",
            "Produz alimentos saudáveis",
            "Desenvolve responsabilidade"
        ],
        price: "A partir de R$ 199/mês"
    },
    4: {
        title: "Energia Sustentável",
        description: "Projetos de energia renovável para escolas",
        features: [
            "Painéis solares educativos",
            "Sistema de monitoramento de energia",
            "Educação sobre energias renováveis",
            "Redução de custos operacionais",
            "Dashboard de consumo"
        ],
        benefits: [
            "Reduz custos com energia",
            "Ensina sobre sustentabilidade",
            "Diminui pegada de carbono",
            "Gera autonomia energética"
        ],
        price: "Projeto personalizado"
    },
    5: {
        title: "Robótica Educacional",
        description: "Kits de robótica sustentável para aprendizado prático",
        features: [
            "Kits sustentáveis e recicláveis",
            "Programação visual intuitiva",
            "Projetos ambientais",
            "Competições e desafios",
            "Material didático completo"
        ],
        benefits: [
            "Desenvolve pensamento lógico",
            "Estimula criatividade",
            "Ensina programação",
            "Promove trabalho em equipe"
        ],
        price: "A partir de R$ 149/kit"
    },
    6: {
        title: "App Mobile",
        description: "Aplicativo mobile para gestão e monitoramento sustentável",
        features: [
            "Interface intuitiva e amigável",
            "Notificações em tempo real",
            "Relatórios de sustentabilidade",
            "Gamificação educativa",
            "Offline e online"
        ],
        benefits: [
            "Acesso em qualquer lugar",
            "Engaja estudantes e professores",
            "Facilita comunicação",
            "Promove práticas sustentáveis"
        ],
        price: "Incluso nos planos"
    },
    7: {
        title: "Nuvem Verde",
        description: "Armazenamento em nuvem com baixo impacto ambiental",
        features: [
            "Servidores com energia renovável",
            "Backup automático seguro",
            "Acesso de qualquer dispositivo",
            "Compartilhamento colaborativo",
            "Criptografia avançada"
        ],
        benefits: [
            "Reduz pegada de carbono",
            "Garante segurança dos dados",
            "Facilita colaboração",
            "Economia de recursos"
        ],
        price: "A partir de R$ 99/mês"
    },
    8: {
        title: "Dashboard Analytics",
        description: "Painel de controle para análise de impacto ambiental",
        features: [
            "Métricas de sustentabilidade",
            "Relatórios visuais interativos",
            "Acompanhamento de metas",
            "Comparativos históricos",
            "Exportação de dados"
        ],
        benefits: [
            "Visualiza progresso sustentável",
            "Facilita tomada de decisões",
            "Motiva práticas verdes",
            "Comprova resultados"
        ],
        price: "Incluso nos planos Avançado e Enterprise"
    },
    9: {
        title: "Capacitação",
        description: "Treinamentos para professores em tecnologia sustentável",
        features: [
            "Cursos online e presenciais",
            "Material didático atualizado",
            "Certificação reconhecida",
            "Suporte contínuo",
            "Metodologias ativas"
        ],
        benefits: [
            "Capacita educadores",
            "Melhora qualidade do ensino",
            "Atualiza conhecimentos",
            "Cria multiplicadores"
        ],
        price: "A partir de R$ 299/curso"
    }
};

function initProductModals() {
    const modal = document.getElementById('productModal');
    const closeBtn = modal.querySelector('.close');
    
    // Add click listeners to product cards
    const productCards = document.querySelectorAll('.product-card .btn[data-product]');
    productCards.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product');
            showProductDetails(productId);
        });
    });
    
    // Close modal events
    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

function showProductDetails(productId) {
    const product = productsData[productId];
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    
    modalContent.innerHTML = `
        <h2>${product.title}</h2>
        <p class="product-description">${product.description}</p>
        
        <div class="product-details">
            <div class="product-section">
                <h3><i class="fas fa-star"></i> Funcionalidades</h3>
                <ul class="feature-list">
                    ${product.features.map(feature => `<li><i class="fas fa-check"></i> ${feature}</li>`).join('')}
                </ul>
            </div>
            
            <div class="product-section">
                <h3><i class="fas fa-heart"></i> Benefícios</h3>
                <ul class="benefit-list">
                    ${product.benefits.map(benefit => `<li><i class="fas fa-leaf"></i> ${benefit}</li>`).join('')}
                </ul>
            </div>
            
            <div class="product-section">
                <h3><i class="fas fa-tag"></i> Investimento</h3>
                <p class="price-info">${product.price}</p>
            </div>
        </div>
        
        <div class="modal-actions">
            <a href="contato.html" class="btn btn-primary">
                <i class="fas fa-envelope"></i> Solicitar Orçamento
            </a>
            <button class="btn btn-secondary close-modal-btn">
                <i class="fas fa-times"></i> Fechar
            </button>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add event listener to close button in modal
    const closeModalBtn = modal.querySelector('.close-modal-btn');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
}

function closeModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Add some additional styling for modal content
const modalStyles = `
    .product-description {
        font-size: 1.1rem;
        color: var(--text-light);
        margin-bottom: 2rem;
        text-align: center;
    }
    
    .product-details {
        margin: 2rem 0;
    }
    
    .product-section {
        margin-bottom: 2rem;
    }
    
    .product-section h3 {
        color: var(--primary-color);
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .feature-list,
    .benefit-list {
        list-style: none;
        padding: 0;
    }
    
    .feature-list li,
    .benefit-list li {
        padding: 0.5rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .feature-list i {
        color: var(--accent-color);
    }
    
    .benefit-list i {
        color: var(--primary-color);
    }
    
    .price-info {
        font-size: 1.2rem;
        font-weight: 600;
        color: var(--primary-color);
        text-align: center;
        padding: 1rem;
        background: var(--background-light);
        border-radius: var(--border-radius);
    }
    
    .modal-actions {
        display: flex;
        gap: 1rem;
        justify-content: center;
        margin-top: 2rem;
    }
    
    .btn-secondary {
        background: var(--text-light);
        color: var(--white);
        border: 2px solid var(--text-light);
    }
    
    .btn-secondary:hover {
        background: transparent;
        color: var(--text-light);
    }
    
    @media (max-width: 768px) {
        .modal-actions {
            flex-direction: column;
        }
        
        .modal-content {
            margin: 10% auto;
            width: 95%;
            max-height: 80vh;
            overflow-y: auto;
        }
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);