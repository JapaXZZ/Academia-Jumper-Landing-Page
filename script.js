/* ==========================================================================
   JUMPER FITNESS - MOTOR DE INTERATIVIDADE E COMPORTAMENTOS (MULTI-PÁGINAS)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. Inicialização dos Ícones Lucide com garantia de carregamento
    const initLucideIcons = () => {
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        } else {
            // Tenta novamente se lucide ainda não está totalmente carregado
            setTimeout(initLucideIcons, 100);
        }
    };
    initLucideIcons();

    // 2. Fallback Inteligente para Imagens Faltantes
    // Cria um SVG elegante informando ao usuário onde colocar a imagem localmente
    const setupImageFallbacks = () => {
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', function handleImgError() {
                const altText = this.alt || 'Imagem Jumper Fitness';
                const srcPath = this.getAttribute('src');

                // Determina dimensões aproximadas baseado no elemento pai
                const rect = this.getBoundingClientRect();
                const width = Math.max(Math.round(rect.width) || 400, 300);
                const height = Math.max(Math.round(rect.height) || 400, 300);

                // Monta o SVG limpo em Preto e Branco
                const svgString = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
                        <rect width="100%" height="100%" fill="#141414"/>
                        <rect x="15" y="15" width="${width - 30}" height="${height - 30}" fill="none" stroke="#2c2c2c" stroke-width="1.5" stroke-dasharray="6 6"/>
                        <circle cx="${width / 2}" cy="${height / 2 - 25}" r="30" fill="none" stroke="#ffffff" stroke-width="1.5" opacity="0.15"/>
                        <path d="M${width / 2 - 10} ${height / 2 - 25} L${width / 2 + 10} ${height / 2 - 25} M${width / 2} ${height / 2 - 35} L${width / 2} ${height / 2 - 15}" stroke="#ffffff" stroke-width="1.5" opacity="0.3"/>
                        <text x="50%" y="${height / 2 + 25}" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="'Syne', sans-serif" font-size="14" font-weight="700" letter-spacing="0.05em">${altText.toUpperCase()}</text>
                        <text x="50%" y="${height / 2 + 48}" dominant-baseline="middle" text-anchor="middle" fill="#555555" font-family="'Inter', sans-serif" font-size="10">SUBSTITUA POR: ${srcPath}</text>
                    </svg>
                `;

                this.src = 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
                this.removeEventListener('error', handleImgError); // evita loops infinitos
            });

            // Força disparo do evento de erro se a imagem já falhou antes do script anexar o listener
            if (img.complete && img.naturalWidth === 0) {
                img.dispatchEvent(new Event('error'));
            }
        });
    };
    setupImageFallbacks();

    // 3. Efeito Rolagem no Header
    const header = document.querySelector('.main-header');
    const adjustHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', adjustHeader);
    adjustHeader();

    // 4. Menu Mobile (Hamburger Drawer)
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            // Reinicializa ícones Lucide após abrir/fechar menu
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburgerBtn.classList.remove('active');
                navMenu.classList.remove('active');
                // Reinicializa ícones Lucide após fechar menu
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        });
    }

    // 5. Status de Abertura Dinâmico da Academia (Home - index.html)
    const checkGymStatus = () => {
        const statusWidget = document.getElementById('statusWidget');
        const statusText = document.getElementById('statusText');
        const statusDetails = document.getElementById('statusDetails');

        if (!statusWidget || !statusText || !statusDetails) return;

        const now = new Date();
        const day = now.getDay(); // 0: Dom, 1: Seg, ..., 6: Sáb
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = hours + minutes / 60;

        let isOpen = false;
        let nextInfo = "";

        if (day >= 1 && day <= 5) {
            // Seg a Sex: 06:00 às 21:30
            if (currentTime >= 6.0 && currentTime < 21.5) {
                isOpen = true;
                nextInfo = "Hoje aberto até às 21:30.";
            } else {
                isOpen = false;
                if (currentTime < 6.0) {
                    nextInfo = "Abre hoje às 06:00.";
                } else {
                    nextInfo = "Abre amanhã às 06:00.";
                }
            }
        } else if (day === 6) {
            // Sábado: 08:30 às 11:00 / 13:30 às 16:00
            if ((currentTime >= 8.5 && currentTime < 11.0) || (currentTime >= 13.5 && currentTime < 16.0)) {
                isOpen = true;
                if (currentTime < 11.0) {
                    nextInfo = "Hoje aberto até às 11:00. Retorna às 13:30.";
                } else {
                    nextInfo = "Hoje aberto até às 16:00.";
                }
            } else {
                isOpen = false;
                if (currentTime < 8.5) {
                    nextInfo = "Abre hoje às 08:30.";
                } else if (currentTime >= 11.0 && currentTime < 13.5) {
                    nextInfo = "Abre hoje à tarde às 13:30.";
                } else {
                    nextInfo = "Abre amanhã (Domingo) às 08:00.";
                }
            }
        } else if (day === 0) {
            // Domingo: 08:00 às 16:00
            if (currentTime >= 8.0 && currentTime < 16.0) {
                isOpen = true;
                nextInfo = "Hoje aberto até às 16:00.";
            } else {
                isOpen = false;
                if (currentTime < 8.0) {
                    nextInfo = "Abre hoje às 08:00.";
                } else {
                    nextInfo = "Abre amanhã (Segunda) às 06:00.";
                }
            }
        }

        if (isOpen) {
            statusWidget.classList.add('open');
            statusWidget.classList.remove('closed');
            statusText.textContent = "Aberto Agora";
            statusDetails.textContent = nextInfo;
        } else {
            statusWidget.classList.add('closed');
            statusWidget.classList.remove('open');
            statusText.textContent = "Fechado Agora";
            statusDetails.textContent = nextInfo;
        }
    };
    checkGymStatus();
    setInterval(checkGymStatus, 60000);

    // 6. Grade de Horários Interativa (Serviços - servicos.html)
    const dayTabs = document.querySelectorAll('.day-tab');
    const dayScheduleContents = document.querySelectorAll('.day-schedule-content');

    if (dayTabs.length > 0) {
        dayTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const selectedDay = tab.getAttribute('data-day');

                // Desativa abas e conteúdos
                dayTabs.forEach(t => t.classList.remove('active'));
                dayScheduleContents.forEach(c => {
                    c.classList.remove('active');
                });

                // Ativa a aba clicada
                tab.classList.add('active');

                // Ativa e anima a lista correspondente
                const activeContent = document.getElementById(`sched-${selectedDay}`);
                if (activeContent) {
                    activeContent.classList.add('active');
                }
            });
        });

        // Sincroniza o dia atual da semana no carregamento da página
        const syncCurrentDayTab = () => {
            const currentDayNum = new Date().getDay(); // 0: Dom, 1: Seg, ...
            const dayMap = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
            const currentDayTag = dayMap[currentDayNum];

            const activeTab = document.querySelector(`.day-tab[data-day="${currentDayTag}"]`);
            if (activeTab) {
                activeTab.click();
            }
        };
        syncCurrentDayTab();
    }

    // 7. Galeria com Lightbox Navegável (Galeria - galeria.html)
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');

    if (galleryItems.length > 0 && lightbox) {
        const lightboxClose = document.getElementById('lightboxClose');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');

        let currentImgIndex = 0;
        const galleryImages = [];

        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            galleryImages.push({
                src: img.src,
                alt: img.alt
            });

            item.addEventListener('click', () => {
                currentImgIndex = index;
                openLightbox();
            });
        });

        const openLightbox = () => {
            updateLightboxContent();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        const updateLightboxContent = () => {
            const item = galleryImages[currentImgIndex];
            lightboxImg.src = item.src;
            lightboxCaption.textContent = item.alt;
        };

        const prevImage = () => {
            currentImgIndex = (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
            updateLightboxContent();
        };

        const nextImage = () => {
            currentImgIndex = (currentImgIndex + 1) % galleryImages.length;
            updateLightboxContent();
        };

        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
        if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'ArrowRight') nextImage();
        });
    }

    // 8. Envio de Pedido de Roupas via WhatsApp (Roupas - roupas.html)
    const clothingCards = document.querySelectorAll('.clothing-card');

    if (clothingCards.length > 0) {
        clothingCards.forEach(card => {
            const orderBtn = card.querySelector('.order-btn');
            const itemName = card.getAttribute('data-item-name');
            const price = card.querySelector('.clothing-price').textContent;

            if (orderBtn) {
                orderBtn.addEventListener('click', () => {
                    const phone = "5518981701087";
                    const message = `Olá! Vi no catálogo da Jumper Fitness e gostaria de mais informações sobre: *${itemName}* (${price}).`;
                    const encodedMessage = encodeURIComponent(message);
                    const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
                    window.open(whatsappUrl, '_blank');
                });
            }
        });
    }

    // 9. Animações de Scroll (Intersection Observer)
    const revealElements = document.querySelectorAll('.scroll-reveal');
    if (revealElements.length > 0) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null,
            threshold: 0.05,
            rootMargin: "0px 0px -30px 0px"
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }
});

// Garantir que os ícones Lucide sejam renderizados (chamada final)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }, 100);
    });
} else {
    setTimeout(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, 100);
}
