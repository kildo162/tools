/**
 * Optimized Sidebar Navigation Component
 */
class OptimizedSidebar {
    constructor() {
        this.navigationData = this.getNavigationData();
        this.init();
    }

    getNavigationData() {
        return [
            {
                title: 'Authentication & Tokens',
                icon: '🔐',
                items: [
                    { id: 'jwt-validation', title: 'JWT Validation', icon: './images/icons/web-programming.svg' },
                    { id: 'jwt-generator', title: 'JWT Generator', icon: './images/icons/web-programming.svg' },
                    { id: 'jwt-fuzzer', title: 'JWT Fuzzer', icon: './images/icons/web-programming.svg' }
                ]
            },
            {
                title: 'Text & Data Processing',
                icon: '📝',
                items: [
                    { id: 'json-tool', title: 'JSON Formatter', icon: './images/icons/json.svg' },
                    { id: 'url-tool', title: 'URL Encoder/Decoder', icon: './images/icons/web-programming.svg' },
                    { id: 'hash-tool', title: 'Hash Generator', icon: './images/icons/web-programming.svg' },
                    { id: 'json-diff-tool', title: 'JSON Diff Tool', icon: './images/icons/json.svg' },
                    { id: 'yaml-diff-tool', title: 'YAML Diff Tool', icon: './images/icons/web-programming.svg' }
                ]
            },
            {
                title: 'Generators & Utilities',
                icon: '🛠️',
                items: [
                    { id: 'password-generator', title: 'Password Generator', icon: './images/icons/web-programming.svg' },
                    { id: 'uuid-generator', title: 'UUID Generator', icon: './images/icons/web-programming.svg' },
                    { id: 'api-key-generator', title: 'API Key Generator', icon: './images/icons/web-programming.svg' }
                ]
            },
            {
                title: 'Time & Conversion',
                icon: '⏰',
                items: [
                    { id: 'unix-time-tool', title: 'Unix Time Converter', icon: './images/icons/back-in-time.svg' }
                ]
            },
            {
                title: 'Encryption & Security',
                icon: '🔒',
                items: [
                    { id: 'symmetric-encryption', title: 'Symmetric Encryption', icon: './images/icons/web-programming.svg' },
                    { id: 'rsa-key-generator', title: 'RSA Key Generator', icon: './images/icons/web-programming.svg' },
                    { id: 'rsa-encrypt-decrypt', title: 'RSA Encrypt/Decrypt', icon: './images/icons/web-programming.svg' },
                    { id: 'encryption-key-generator', title: 'Encryption Key Generator', icon: './images/icons/web-programming.svg' }
                ]
            },
            {
                title: 'Network & Integration',
                icon: '🌐',
                items: [
                    { id: 'curl-builder-tool', title: 'Curl Request Builder', icon: './images/icons/web-programming.svg' },
                    { id: 'ip-tool', title: 'IP Address Checker', icon: './images/icons/ip.svg' },
                    { id: 'telegram-tool', title: 'Telegram Bot', icon: './images/icons/paper.svg' }
                ]
            }
        ];
    }

    init() {
        this.render();
        this.attachEventListeners();
        this.setupMobileMenu();
    }

    render() {
        const navigation = document.getElementById('navigation');
        if (!navigation) return;

        const homeHtml = `
            <div class="home-link">
                <a href="#home" class="nav-item home-nav active" data-route="home">
                    <img src="./images/icons/web-programming.svg" alt="Home" width="22" height="22" loading="lazy">
                    <span>🏠 Home</span>
                </a>
            </div>
        `;

        const groupsHtml = this.navigationData.map(group => `
            <div class="tool-group">
                <div class="group-header">
                    <span class="group-icon">${group.icon}</span>
                    <span class="group-title">${group.title}</span>
                </div>
                <ul class="feature-list">
                    ${group.items.map(item => `
                        <li>
                            <a href="#${item.id}" class="nav-item" data-route="${item.id}">
                                <img src="${item.icon}" alt="${item.title}" width="22" height="22" loading="lazy">
                                <span>${item.title}</span>
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `).join('');

        navigation.innerHTML = homeHtml + groupsHtml;
    }

    attachEventListeners() {
        const navigation = document.getElementById('navigation');
        if (!navigation) return;

        navigation.addEventListener('click', (e) => {
            const navItem = e.target.closest('.nav-item');
            if (!navItem) return;

            e.preventDefault();
            const route = navItem.getAttribute('data-route');
            if (route && window.router) {
                window.router.navigate(route);
            }
        });
    }

    setupMobileMenu() {
        // Mobile menu toggle logic here
        const createMobileToggle = () => {
            if (document.getElementById('mobile-toggle')) return;
            
            const toggle = document.createElement('button');
            toggle.id = 'mobile-toggle';
            toggle.className = 'mobile-toggle';
            toggle.innerHTML = '☰';
            toggle.style.cssText = `
                position: fixed;
                top: 1rem;
                left: 1rem;
                z-index: 1001;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 0.5rem;
                padding: 0.5rem;
                font-size: 1.2rem;
                cursor: pointer;
                display: none;
            `;
            
            toggle.addEventListener('click', () => {
                const sidebar = document.querySelector('.sidebar');
                sidebar?.classList.toggle('open');
                toggle.innerHTML = sidebar?.classList.contains('open') ? '✕' : '☰';
            });
            
            document.body.appendChild(toggle);
            
            // Show toggle on mobile
            const showHideToggle = () => {
                toggle.style.display = window.innerWidth <= 768 ? 'block' : 'none';
            };
            
            showHideToggle();
            window.addEventListener('resize', showHideToggle);
        };
        
        createMobileToggle();
    }

    updateActiveItem(activeRoute) {
        document.querySelectorAll('.nav-item').forEach(item => {
            const route = item.getAttribute('data-route');
            item.classList.toggle('active', route === activeRoute);
        });
    }
}

// Initialize
if (typeof window !== 'undefined') {
    window.OptimizedSidebar = OptimizedSidebar;
}
