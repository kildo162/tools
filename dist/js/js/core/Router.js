/**
 * Simple Router for Single Page Application
 */
class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.init();
    }

    /**
     * Register a route
     * @param {string} path - Route path
     * @param {Object} config - Route configuration
     */
    addRoute(path, config) {
        this.routes.set(path, {
            component: config.component,
            title: config.title,
            description: config.description,
            loader: config.loader || null
        });
    }

    /**
     * Navigate to a route
     * @param {string} path - Target path
     * @param {boolean} addToHistory - Add to browser history
     */
    async navigate(path, addToHistory = true) {
        const route = this.routes.get(path);
        if (!route) {
            console.warn(`Route not found: ${path}`);
            return;
        }

        // Show loading state
        this.showLoadingState();

        try {
            // Load component if needed
            if (route.loader) {
                await route.loader();
            }

            // Update URL and history
            if (addToHistory && this.currentRoute !== path) {
                history.pushState({ route: path }, route.title, `#${path}`);
            }

            // Update page
            this.updatePage(path, route);
            this.currentRoute = path;

        } catch (error) {
            console.error('Navigation error:', error);
            this.hideLoadingState();
        }
    }

    /**
     * Update page content and metadata
     * @private
     */
    updatePage(path, route) {
        // Update document title
        document.title = `${route.title} - DevTools`;
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && route.description) {
            metaDesc.content = route.description;
        }

        // Show component
        this.showComponent(route.component);
        
        // Update active navigation
        this.updateNavigation(path);
        
        // Hide loading state
        this.hideLoadingState();
    }

    /**
     * Show specific component
     * @private
     */
    showComponent(componentId) {
        // Hide all tools
        document.querySelectorAll('.tool').forEach(tool => {
            tool.classList.remove('active');
        });

        // Show target component
        const targetComponent = document.getElementById(componentId);
        if (targetComponent) {
            targetComponent.classList.add('active');
        }
    }

    /**
     * Update navigation active state
     * @private
     */
    updateNavigation(path) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to current nav item
        const currentNavItem = document.querySelector(`a[href="#${path}"]`);
        if (currentNavItem) {
            currentNavItem.classList.add('active');
        }
    }

    /**
     * Show loading state
     * @private
     */
    showLoadingState() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.style.display = 'flex';
        }
    }

    /**
     * Hide loading state
     * @private
     */
    hideLoadingState() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    /**
     * Initialize router
     * @private
     */
    init() {
        // Handle browser back/forward
        window.addEventListener('popstate', (event) => {
            const route = event.state?.route || this.getDefaultRoute();
            this.navigate(route, false);
        });

        // Handle initial load
        window.addEventListener('DOMContentLoaded', () => {
            const initialRoute = window.location.hash.slice(1) || this.getDefaultRoute();
            this.navigate(initialRoute, false);
        });
    }

    /**
     * Get default route
     * @private
     */
    getDefaultRoute() {
        return 'jwt-validation'; // Default to first tool
    }
}

// Global router instance
window.router = new Router();
