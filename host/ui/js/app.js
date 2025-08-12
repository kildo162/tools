/**
 * Main Application Class
 */
class DevToolsApp {
    constructor() {
        this.isInitialized = false;
        this.componentMap = new Map();
        this.setupComponentMap();
        this.setupRoutes();
        this.init();
    }

    /**
     * Setup component mapping
     * @private
     */
    setupComponentMap() {
        this.componentMap.set('jwt-validation', 'JwtTools');
        this.componentMap.set('jwt-generator', 'JwtTools');
        this.componentMap.set('jwt-fuzzer', 'JwtTools');
        this.componentMap.set('json-tool', 'JSONFormatter');
        this.componentMap.set('url-tool', 'URLEncoderDecoder');
        this.componentMap.set('hash-tool', 'HashGenerator');
        this.componentMap.set('password-generator', 'PasswordGenerator');
        this.componentMap.set('uuid-generator', 'UUIDGenerator');
        this.componentMap.set('unix-time-tool', 'UnixTimeConverter');
        this.componentMap.set('symmetric-encryption', 'SymmetricEncryption');
        this.componentMap.set('encryption-key-generator', 'EncryptionKeyGenerator');
        this.componentMap.set('api-key-generator', 'APIKeyGenerator');
        this.componentMap.set('rsa-key-generator', 'RSAKeyGenerator');
        this.componentMap.set('rsa-encrypt-decrypt', 'RSAEncryptDecrypt');
        this.componentMap.set('json-diff-tool', 'JSONDiffTool');
        this.componentMap.set('yaml-diff-tool', 'YAMLDiffTool');
        this.componentMap.set('curl-builder-tool', 'CurlBuilder');
    }

    /**
     * Setup all routes with lazy loading
     * @private
     */
    setupRoutes() {
        const routes = [
            {
                path: 'jwt-validation',
                title: 'JWT Validation Tool',
                description: 'Validate and decode JWT tokens online for free',
                component: 'jwt-validation'
            },
            {
                path: 'jwt-generator',
                title: 'JWT Generator Tool',
                description: 'Generate JWT tokens with custom payload and headers',
                component: 'jwt-generator'
            },
            {
                path: 'jwt-fuzzer',
                title: 'JWT Fuzzer Tool',
                description: 'Test JWT token security with fuzzing techniques',
                component: 'jwt-fuzzer'
            },
            {
                path: 'json-tool',
                title: 'JSON Formatter & Validator',
                description: 'Format, validate and minify JSON online',
                component: 'json-tool'
            },
            {
                path: 'url-tool',
                title: 'URL Encoder/Decoder',
                description: 'Encode and decode URLs online',
                component: 'url-tool'
            },
            {
                path: 'hash-tool',
                title: 'Hash Generator',
                description: 'Generate MD5, SHA-1, SHA-256 and other hashes',
                component: 'hash-tool'
            },
            {
                path: 'password-generator',
                title: 'Password Generator',
                description: 'Generate secure passwords with custom options',
                component: 'password-generator'
            },
            {
                path: 'uuid-generator',
                title: 'UUID Generator',
                description: 'Generate UUID/GUID v4 and v1 online',
                component: 'uuid-generator'
            },
            {
                path: 'unix-time-tool',
                title: 'Unix Timestamp Converter',
                description: 'Convert between Unix timestamp and human readable date',
                component: 'unix-time-tool'
            },
            {
                path: 'symmetric-encryption',
                title: 'Symmetric Encryption Tool',
                description: 'Encrypt and decrypt text using AES encryption',
                component: 'symmetric-encryption'
            },
            {
                path: 'encryption-key-generator',
                title: 'Encryption Key Generator',
                description: 'Generate encryption keys for various algorithms',
                component: 'encryption-key-generator'
            },
            {
                path: 'api-key-generator',
                title: 'API Key Generator',
                description: 'Generate secure API keys for your applications',
                component: 'api-key-generator'
            },
            {
                path: 'rsa-key-generator',
                title: 'RSA Key Generator',
                description: 'Generate RSA public/private key pairs',
                component: 'rsa-key-generator'
            },
            {
                path: 'rsa-encrypt-decrypt',
                title: 'RSA Encrypt/Decrypt',
                description: 'Encrypt and decrypt text using RSA keys',
                component: 'rsa-encrypt-decrypt'
            },
            {
                path: 'json-diff-tool',
                title: 'JSON Diff Tool',
                description: 'Compare and find differences between JSON files',
                component: 'json-diff-tool'
            },
            {
                path: 'yaml-diff-tool',
                title: 'YAML Diff Tool',
                description: 'Compare and find differences between YAML files',
                component: 'yaml-diff-tool'
            },
            {
                path: 'curl-builder-tool',
                title: 'Curl Request Builder',
                description: 'Build and generate curl commands for HTTP requests',
                component: 'curl-builder-tool'
            }
        ];

        routes.forEach(route => {
            window.router.addRoute(route.path, {
                ...route,
                loader: () => this.loadComponent(route.path)
            });
        });
    }

    /**
     * Load component dynamically
     * @param {string} routePath - Route path
     */
    async loadComponent(routePath) {
        const componentName = this.componentMap.get(routePath);
        if (!componentName) {
            console.warn(`Component not found for route: ${routePath}`);
            return;
        }

        try {
            await window.moduleLoader.loadComponent(componentName);
            
            // Initialize component if needed
            this.initializeComponent(componentName, routePath);
        } catch (error) {
            console.error(`Failed to load component ${componentName}:`, error);
            this.showErrorState(routePath);
        }
    }

    /**
     * Initialize specific component
     * @private
     */
    initializeComponent(componentName, routePath) {
        // Component-specific initialization logic
        switch (componentName) {
            case 'JwtTools':
                if (window.initJwtTools && typeof window.initJwtTools === 'function') {
                    window.initJwtTools();
                }
                break;
            case 'JSONFormatter':
                if (window.initJsonFormatter && typeof window.initJsonFormatter === 'function') {
                    window.initJsonFormatter();
                }
                break;
            // Add other components as needed
        }
    }

    /**
     * Show error state for failed component load
     * @private
     */
    showErrorState(routePath) {
        const component = document.getElementById(routePath);
        if (component) {
            component.innerHTML = `
                <div class="error-state">
                    <h3>⚠️ Failed to load component</h3>
                    <p>Please refresh the page and try again.</p>
                    <button onclick="location.reload()" class="btn-primary">
                        🔄 Refresh Page
                    </button>
                </div>
            `;
        }
    }

    /**
     * Setup navigation event listeners
     * @private
     */
    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = link.getAttribute('href').substring(1);
                window.router.navigate(route);
            });
        });
    }

    /**
     * Initialize application
     * @private
     */
    async init() {
        if (this.isInitialized) return;

        try {
            // Setup navigation
            this.setupNavigation();
            
            // Load critical CSS and scripts
            await this.loadCriticalResources();
            
            this.isInitialized = true;
            console.log('DevTools App initialized successfully');
        } catch (error) {
            console.error('Failed to initialize DevTools App:', error);
        }
    }

    /**
     * Load critical resources
     * @private
     */
    async loadCriticalResources() {
        // Load Sidebar component (always needed)
        await window.moduleLoader.loadComponent('Sidebar');
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.devToolsApp = new DevToolsApp();
});
