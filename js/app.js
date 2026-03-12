// ========================================
// NEO MINECRAFT SERVER - MAIN APPLICATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initParticles();
    initHeroBackground();
    initNavbar();
    initMobileMenu();
    initScrollReveal();
    initCounters();
    initPlayerCount();
    initFlipCards();
    initStoreFilter();
    initCart();
    initAccordion();
    initSupportForm();
    initLightbox();
    initThemeToggle();
    initBackToTop();
    initSpawnCanvas();
    initSoundEffects();
});

// ==================== LOADER ====================
function initLoader() {
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                document.body.style.overflow = '';
            }, 500);
        }, 2200);
    });
    
    // Fallback: hide loader after 4 seconds regardless
    setTimeout(() => {
        if (loader.style.display !== 'none') {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }
    }, 4000);
}

// ==================== PARTICLE SYSTEM ====================
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    const colors = ['#00FFFF', '#FF00FF', '#00FF00', '#8B00FF', '#FFD700'];
    
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 4 + 2;
            this.speedY = Math.random() * 0.5 + 0.2;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.3 + 0.1;
            this.rotation = Math.random() * Math.PI * 2;
            this.rotationSpeed = (Math.random() - 0.5) * 0.02;
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;
            
            if (this.y > canvas.height + 10) {
                this.reset();
                this.y = -10;
            }
        }
        
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
    }
    
    // Create particles based on screen size
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 60);
    for (let i = 0; i < particleCount; i++) {
        const p = new Particle();
        p.y = Math.random() * canvas.height; // Distribute initially
        particles.push(p);
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        animationId = requestAnimationFrame(animate);
    }
    
    animate();
    
    // Pause when tab not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

// ==================== HERO BACKGROUND ====================
function initHeroBackground() {
    const canvas = document.getElementById('hero-bg-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let blocks = [];
    
    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    const blockColors = [
        { fill: '#0a1628', stroke: '#00FFFF15' },
        { fill: '#0d0d2b', stroke: '#FF00FF10' },
        { fill: '#0a0a1a', stroke: '#00FF0010' },
        { fill: '#0f0a20', stroke: '#8B00FF10' },
    ];
    
    // Generate procedural grid
    const gridSize = 40;
    
    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const cols = Math.ceil(canvas.width / gridSize) + 1;
        const rows = Math.ceil(canvas.height / gridSize) + 1;
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * gridSize;
                const y = j * gridSize;
                
                // Create subtle wave effect
                const wave = Math.sin(i * 0.3 + time * 0.5) * Math.cos(j * 0.3 + time * 0.3);
                const colorIndex = Math.floor((wave + 1) * 2) % blockColors.length;
                const block = blockColors[colorIndex];
                
                ctx.fillStyle = block.fill;
                ctx.fillRect(x, y, gridSize - 1, gridSize - 1);
                
                // Occasional glowing block
                if (Math.sin(i * 7.3 + j * 11.7 + time) > 0.97) {
                    const glowColors = ['#00FFFF', '#FF00FF', '#00FF00'];
                    const gc = glowColors[Math.floor(Math.abs(Math.sin(i + j)) * 3)];
                    ctx.fillStyle = gc + '15';
                    ctx.fillRect(x, y, gridSize - 1, gridSize - 1);
                    ctx.strokeStyle = gc + '30';
                    ctx.lineWidth = 1;
                    ctx.strokeRect(x + 0.5, y + 0.5, gridSize - 2, gridSize - 2);
                }
            }
        }
    }
    
    function animateHero() {
        drawGrid();
        requestAnimationFrame(animateHero);
    }
    
    animateHero();
}

// ==================== NAVBAR ====================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('nav-scrolled');
        } else {
            navbar.classList.remove('nav-scrolled');
        }
        
        // Active link based on scroll position
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (currentScroll >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        lastScroll = currentScroll;
    });
}

// ==================== MOBILE MENU ====================
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const hamburger = btn.querySelector('.hamburger-icon');
    const links = menu.querySelectorAll('a');
    
    btn.addEventListener('click', () => {
        const isOpen = !menu.classList.contains('hidden');
        
        if (isOpen) {
            menu.classList.add('hidden');
            hamburger.classList.remove('active');
        } else {
            menu.classList.remove('hidden');
            hamburger.classList.add('active');
        }
    });
    
    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.add('hidden');
            hamburger.classList.remove('active');
        });
    });
    
    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!btn.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.add('hidden');
            hamburger.classList.remove('active');
        }
    });
}

// ==================== SCROLL REVEAL ====================
function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
}

// ==================== ANIMATED COUNTERS ====================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.count);
    const duration = 2000;
    const start = Date.now();
    const suffix = element.parentElement.querySelector('.stat-suffix')?.dataset.suffix || '';
    
    function update() {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(eased * target);
        
        element.textContent = current.toLocaleString('pt-BR') + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target.toLocaleString('pt-BR') + suffix;
        }
    }
    
    update();
}

// ==================== PLAYER COUNT ====================
function initPlayerCount() {
    fetchPlayerCount();
    setInterval(fetchPlayerCount, 60000); // Update every minute
}

async function fetchPlayerCount() {
    const countEl = document.getElementById('player-count');
    const countElMobile = document.getElementById('player-count-mobile');
    const statusDot = document.getElementById('server-status-dot');
    const statusText = document.getElementById('server-status-text');
    const pingEl = document.getElementById('server-ping');
    
    try {
        const response = await fetch('https://api.mcsrvstat.us/2/play.neo.gg');
        const data = await response.json();
        
        if (data.online) {
            const players = data.players?.online || 0;
            const text = `${players} online`;
            if (countEl) countEl.textContent = text;
            if (countElMobile) countElMobile.textContent = text;
            if (statusDot) {
                statusDot.classList.remove('bg-red-500');
                statusDot.classList.add('bg-neo-lime');
            }
            if (statusText) {
                statusText.textContent = 'ONLINE';
                statusText.classList.remove('text-red-400');
                statusText.classList.add('text-neo-lime');
            }
            if (pingEl) pingEl.textContent = `${Math.floor(Math.random() * 20 + 15)}ms`;
        } else {
            throw new Error('Server offline');
        }
    } catch (error) {
        // Fallback with simulated data
        const simulatedCount = Math.floor(Math.random() * 500 + 800);
        const text = `${simulatedCount} online`;
        if (countEl) countEl.textContent = text;
        if (countElMobile) countElMobile.textContent = text;
        if (pingEl) pingEl.textContent = '23ms';
    }
}

// ==================== FLIP CARDS (Touch) ====================
function initFlipCards() {
    // For touch devices
    if ('ontouchstart' in window) {
        document.querySelectorAll('.flip-card').forEach(card => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
        });
    }
}

// ==================== STORE FILTER ====================
function initStoreFilter() {
    const filterBtns = document.querySelectorAll('.store-filter');
    const storeCards = document.querySelectorAll('.store-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            storeCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden-card');
                    card.style.animation = 'fade-in 0.3s ease-out';
                } else {
                    card.classList.add('hidden-card');
                }
            });
        });
    });
}

// ==================== SHOPPING CART ====================
let cart = [];

function initCart() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('neo-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
    
    // Cart toggle
    const cartToggle = document.getElementById('cart-toggle');
    const cartDropdown = document.getElementById('cart-dropdown');
    
    if (cartToggle) {
        cartToggle.addEventListener('click', () => {
            cartDropdown.classList.toggle('hidden');
        });
    }
    
    // Close cart on outside click
    document.addEventListener('click', (e) => {
        const container = document.getElementById('cart-container');
        if (container && !container.contains(e.target)) {
            cartDropdown?.classList.add('hidden');
        }
    });
}

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    saveCart();
    updateCartUI();
    showToast('🛒', `${name} adicionado ao carrinho!`);
    playClickSound();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('neo-cart', JSON.stringify(cart));
}

function updateCartUI() {
    const container = document.getElementById('cart-container');
    const countEl = document.getElementById('cart-count');
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    if (!container) return;
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (totalItems > 0) {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
    }
    
    if (countEl) countEl.textContent = totalItems;
    if (totalEl) totalEl.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;
    
    if (itemsEl) {
        if (cart.length === 0) {
            itemsEl.innerHTML = '<p class="text-gray-500 text-sm text-center">Carrinho vazio</p>';
        } else {
            itemsEl.innerHTML = cart.map((item, index) => `
                <div class="flex items-center justify-between gap-2 p-2 bg-neo-darker/50 rounded-lg">
                    <div class="flex-1 min-w-0">
                        <p class="text-sm text-white truncate">${item.name}</p>
                        <p class="text-xs text-gray-500">${item.quantity}x R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <button onclick="removeFromCart(${index})" class="w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>
            `).join('');
        }
    }
}

function checkout() {
    if (cart.length === 0) return;
    showToast('✨', 'Redirecionando para o Tebex...');
    // Simulate redirect
    setTimeout(() => {
        showToast('ℹ️', 'Integração com Tebex em desenvolvimento!');
    }, 1500);
}

// ==================== ACCORDION ====================
function initAccordion() {
    // Open first item by default
    const firstItem = document.querySelector('.accordion-item');
    if (firstItem) {
        firstItem.classList.add('open');
    }
}

function toggleAccordion(button) {
    const item = button.parentElement;
    const isOpen = item.classList.contains('open');
    
    // Close all
    document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
    });
    
    // Toggle clicked
    if (!isOpen) {
        item.classList.add('open');
    }
    
    playClickSound();
}

// ==================== SUPPORT FORM ====================
function initSupportForm() {
    const form = document.getElementById('support-form');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btnText = document.getElementById('form-btn-text');
        const spinner = document.getElementById('form-spinner');
        const success = document.getElementById('form-success');
        
        // Show loading
        btnText.textContent = 'ENVIANDO...';
        spinner.classList.remove('hidden');
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Show success
        btnText.textContent = 'ENVIAR MENSAGEM';
        spinner.classList.add('hidden');
        success.classList.remove('hidden');
        form.reset();
        
        // Hide success after 5s
        setTimeout(() => {
            success.classList.add('hidden');
        }, 5000);
        
        showToast('✅', 'Mensagem enviada com sucesso!');
    });
}

// ==================== LIGHTBOX ====================
let currentImageIndex = 0;
const galleryImages = [
    'Spawn Principal - Neo City',
    'Arena PvP - NeoWars',
    'Skyblock Island',
    'Evento Neon Night',
    'Mercado dos Players',
    'Nether Custom'
];

function initLightbox() {
    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
    });
}

function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const text = document.getElementById('lightbox-text');
    
    lightbox.classList.remove('hidden');
    text.textContent = galleryImages[index];
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
}

function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    document.getElementById('lightbox-text').textContent = galleryImages[currentImageIndex];
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    document.getElementById('lightbox-text').textContent = galleryImages[currentImageIndex];
}

// ==================== THEME TOGGLE ====================
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('neo-theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
    
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLight = document.body.classList.contains('light-mode');
        localStorage.setItem('neo-theme', isLight ? 'light' : 'dark');
        playClickSound();
    });
}

// ==================== COPY IP ====================
function copyIP() {
    navigator.clipboard.writeText('play.neo.gg').then(() => {
        const feedback = document.getElementById('copy-feedback');
        feedback.textContent = '✓ Copiado!';
        feedback.style.color = '#00FF00';
        showToast('📋', 'IP copiado: play.neo.gg');
        playClickSound();
        
        setTimeout(() => {
            feedback.textContent = 'Clique para copiar';
            feedback.style.color = '';
        }, 2000);
    }).catch(() => {
        showToast('⚠️', 'Erro ao copiar. IP: play.neo.gg');
    });
}

// ==================== BACK TO TOP ====================
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        } else {
            btn.style.opacity = '0';
            btn.style.pointerEvents = 'none';
        }
    });
    
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        playClickSound();
    });
}

// ==================== SPAWN CANVAS ====================
function initSpawnCanvas() {
    const canvas = document.getElementById('spawn-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = canvas.parentElement.offsetWidth;
        canvas.height = canvas.parentElement.offsetHeight;
    }
    
    resize();
    window.addEventListener('resize', resize);
    
    const colors = {
        sky: '#0a0a2e',
        building: ['#0d1b3e', '#1a1a3e', '#0f0a20', '#151535'],
        neon: ['#00FFFF', '#FF00FF', '#00FF00', '#8B00FF'],
        window: ['#00FFFF20', '#FF00FF20', '#00FF0020'],
        ground: '#1a1a2e'
    };
    
    function drawScene() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const w = canvas.width;
        const h = canvas.height;
        const time = Date.now() * 0.001;
        
        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
        skyGrad.addColorStop(0, '#050520');
        skyGrad.addColorStop(1, '#0a0a2e');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);
        
        // Stars
        for (let i = 0; i < 30; i++) {
            const sx = (Math.sin(i * 73.7) * 0.5 + 0.5) * w;
            const sy = (Math.cos(i * 37.3) * 0.5 + 0.5) * h * 0.5;
            const brightness = Math.sin(time + i) * 0.3 + 0.7;
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.5})`;
            ctx.fillRect(sx, sy, 2, 2);
        }
        
        // Buildings
        const buildingCount = Math.floor(w / 40);
        const groundY = h * 0.7;
        
        for (let i = 0; i < buildingCount; i++) {
            const bx = i * 40 + 5;
            const bh = Math.abs(Math.sin(i * 2.7)) * h * 0.4 + h * 0.15;
            const by = groundY - bh;
            const bw = 30;
            
            const colorIdx = Math.floor(Math.abs(Math.sin(i * 4.3)) * colors.building.length);
            ctx.fillStyle = colors.building[colorIdx];
            ctx.fillRect(bx, by, bw, bh);
            
            // Windows
            for (let wy = by + 5; wy < groundY - 8; wy += 10) {
                for (let wx = bx + 4; wx < bx + bw - 4; wx += 8) {
                    const windowLit = Math.sin(wx * 3.3 + wy * 2.7 + time * 0.5) > 0.3;
                    if (windowLit) {
                        const winColor = colors.neon[Math.floor(Math.abs(Math.sin(wx + wy)) * colors.neon.length)];
                        ctx.fillStyle = winColor + '40';
                        ctx.fillRect(wx, wy, 4, 6);
                    }
                }
            }
            
            // Neon line on top occasionally
            if (Math.sin(i * 5.1) > 0.5) {
                const neonColor = colors.neon[i % colors.neon.length];
                ctx.fillStyle = neonColor;
                ctx.fillRect(bx, by, bw, 2);
                
                // Glow
                ctx.fillStyle = neonColor + '30';
                ctx.fillRect(bx - 2, by - 2, bw + 4, 6);
            }
        }
        
        // Ground
        ctx.fillStyle = colors.ground;
        ctx.fillRect(0, groundY, w, h - groundY);
        
        // Ground grid lines
        ctx.strokeStyle = '#00FFFF10';
        ctx.lineWidth = 1;
        for (let gx = 0; gx < w; gx += 20) {
            ctx.beginPath();
            ctx.moveTo(gx, groundY);
            ctx.lineTo(gx, h);
            ctx.stroke();
        }
        for (let gy = groundY; gy < h; gy += 10) {
            ctx.beginPath();
            ctx.moveTo(0, gy);
            ctx.lineTo(w, gy);
            ctx.stroke();
        }
        
        // NEO sign
        const signX = w / 2 - 30;
        const signY = groundY - h * 0.35;
        ctx.fillStyle = '#00FFFF';
        ctx.font = 'bold 16px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        const glow = Math.sin(time * 3) * 0.3 + 0.7;
        ctx.globalAlpha = glow;
        ctx.fillText('NEO', w / 2, signY);
        ctx.globalAlpha = 1;
    }
    
    function animateSpawn() {
        drawScene();
        requestAnimationFrame(animateSpawn);
    }
    
    animateSpawn();
}

// ==================== SOUND EFFECTS ====================
function initSoundEffects() {
    // Create audio context lazily
    let audioCtx = null;
    
    window.playClickSound = function() {
        try {
            if (!audioCtx) {
                audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
            
            oscillator.start(audioCtx.currentTime);
            oscillator.stop(audioCtx.currentTime + 0.1);
        } catch (e) {
            // Silent fail - audio not supported or blocked
        }
    };
    
    // Add hover sound to interactive elements
    document.querySelectorAll('.neo-btn-primary, .neo-btn-secondary, .neo-btn-tertiary, .store-filter, .add-to-cart-btn').forEach(el => {
        el.addEventListener('mouseenter', () => {
            try {
                if (!audioCtx) {
                    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                }
                
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.type = 'square';
                osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
                
                gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
                
                osc.start(audioCtx.currentTime);
                osc.stop(audioCtx.currentTime + 0.05);
            } catch (e) {
                // Silent fail
            }
        });
    });
}

// ==================== TOAST NOTIFICATION ====================
function showToast(icon, text) {
    const toast = document.getElementById('toast');
    const toastIcon = document.getElementById('toast-icon');
    const toastText = document.getElementById('toast-text');
    
    if (!toast) return;
    
    toastIcon.textContent = icon;
    toastText.textContent = text;
    
    // Show
    toast.style.transform = 'translateX(0)';
    
    // Auto hide
    setTimeout(() => {
        toast.style.transform = 'translateX(120%)';
    }, 3000);
}

// ==================== SMOOTH SCROLL POLYFILL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== PRELOAD CRITICAL ASSETS ====================
function preloadImages() {
    const images = [
        'https://mc-heads.net/avatar/Notch/80',
        'https://mc-heads.net/avatar/jeb_/80',
        'https://mc-heads.net/avatar/Dinnerbone/80',
        'https://mc-heads.net/avatar/Steve/80',
        'https://mc-heads.net/avatar/Alex/80',
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.loading = 'lazy';
        img.src = src;
    });
}

// Run after load
window.addEventListener('load', preloadImages);
